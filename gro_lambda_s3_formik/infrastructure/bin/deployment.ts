#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { execSync } from "child_process";
import { readFileSync, writeFileSync, renameSync } from "fs";
import { join } from "path";

import { CDKContext } from "../types";
import { BackendDeploymentStack } from "../lib/backend-deployment-stack";
import { FrontendDeploymentStack } from "../lib/frontend-deployment-stack";

const awsAccReg = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const frontEndConfigJsonfile = "app-config";

const getEnvironment = () => {
  const ERR_MSG = "Environment variable 'useEnvironment' missing or not set";
  let envName = process.env.useEnvironment;
  if (!envName) {
    console.error(ERR_MSG);
    throw new Error(ERR_MSG);
  }
  return envName;
};

const getContext = async (app: cdk.App): Promise<CDKContext> => {
  const configFilePath = `../../frontend/src/${frontEndConfigJsonfile}.json`;
  return new Promise(async (resolve, reject) => {
    try {
      let envName = getEnvironment();
      console.info(`To be BUILD | DEPLOY for environment: ${envName}`);
      // extract information from app-config.json
      const config = JSON.parse(
        readFileSync(join(__dirname, configFilePath), "utf-8")
      );
      const common = config.common;
      const envConfig = config.environments.find(
        (e: any) => e.environment === envName
      );
      // extract information from cdk.json
      const globals = app.node.tryGetContext("globals");
      const secureEnvConfigs = app.node.tryGetContext("environments");
      const secureEnvConfig = secureEnvConfigs.find(
        (e: any) => e.environment === envName
      );

      resolve({
        ...awsAccReg,
        ...globals,
        ...common,
        ...envConfig,
        ...secureEnvConfig,
      });
    } catch (error) {
      console.error(error);
      return reject();
    }
  });
};

const customizeFrontendConfig = async (context: CDKContext) => {
  const template = JSON.parse(
    readFileSync(
      join(__dirname, `../${frontEndConfigJsonfile}.tmplt.json`),
      "utf-8"
    )
  );

  template.useEnvironment = context.environment;
  template.common.author = context.owner;
  template.environments[0].environment = context.environment;
  template.environments[0].apiUrl = context.apiUrl;

  console.log(template);

  renameSync(
    join(__dirname, `../../frontend/src/${frontEndConfigJsonfile}.json`),
    join(__dirname, `../../frontend/src/${frontEndConfigJsonfile}-orig.json`)
  );

  writeFileSync(
    join(__dirname, `../../frontend/src/${frontEndConfigJsonfile}.json`),
    JSON.stringify(template, null, 2)
  );

  // building front end
  execSync("npm run build", { cwd: join(__dirname, "../../frontend") });

  // reverting so as to get the previous content in original file
  renameSync(
    join(__dirname, `../../frontend/src/${frontEndConfigJsonfile}-orig.json`),
    join(__dirname, `../../frontend/src/${frontEndConfigJsonfile}.json`)
  );

  console.log("Frontend configuration customized successfully");
};

const createBackendStack = async (
  app: cdk.App,
  context: CDKContext,
  tags: any
) => {
  try {
    execSync("npm run package", { cwd: join(__dirname, "../../backend") });
    new BackendDeploymentStack(
      app,
      `${context.environment}-${context.appName}-BackendDeploymentStack`,
      context,
      {
        env: awsAccReg,
        tags,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const createFrontendStack = async (
  app: cdk.App,
  context: CDKContext,
  tags: any
) => {
  try {
    await customizeFrontendConfig(context);
    new FrontendDeploymentStack(
      app,
      `${context.environment}-${context.appName}-FrontendDeploymentStack`,
      context,
      {
        env: awsAccReg,
        tags,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const createStack = async () => {
  try {
    const app = new cdk.App();
    const context: CDKContext = await getContext(app);
    console.info(`FINAL CONTEXT: \n ${JSON.stringify(context, null, 2)}`);

    const tags: any = {
      Environment: context.environment,
      Project: context.appName,
      Owner: context.owner,
      Serverless: context.serverless,
    };

    cdk.Tags.of(app).add("Environment", context.environment);
    cdk.Tags.of(app).add("Project", context.appName);
    cdk.Tags.of(app).add("Owner", context.owner);
    cdk.Tags.of(app).add("Serverless", context.serverless);

    await createBackendStack(app, context, tags);
    await createFrontendStack(app, context, tags);
  } catch (error) {
    console.error(error);
  }
};

createStack();
