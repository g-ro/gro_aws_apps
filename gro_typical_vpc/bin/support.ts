import * as cdk from 'aws-cdk-lib';
import { readFileSync } from "fs";
import { join } from "path";

import { CDKContext } from "../types";


const awsAccountRegion = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

const infraConfigJsonfile = "infra-config";

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
    const infraConfigFilePath = `../${infraConfigJsonfile}.json`;
    return new Promise(async (resolve, reject) => {
        try {
            let envName = getEnvironment();
            console.info(`To be BUILD | DEPLOY for environment: ${envName}`);

            // extract information from cdk.json
            const globals = app.node.tryGetContext("globals");

            // extract information from infra-config
            const config = JSON.parse(
                readFileSync(join(__dirname, infraConfigFilePath), "utf-8")
            );
            const common = config.common;

            // this env specific
            const envConfig = config.environments.find(
                (e: any) => e.environment === envName
            );
            resolve({
                ...awsAccountRegion,
                ...globals,
                ...common,
                ...envConfig
            });
        } catch (error) {
            console.error(error);
            return reject();
        }
    });
};

const addCommonTagsToApp = (app: cdk.App, context: CDKContext): object => {
    cdk.Tags.of(app).add("Environment", context.environment);
    cdk.Tags.of(app).add("Project", context.appName);
    cdk.Tags.of(app).add("Owner", context.owner);
    const tags: object = {
        Environment: context.environment,
        Project: context.appName,
        Owner: context.owner
    };
    return tags;
}

export { awsAccountRegion, getContext, addCommonTagsToApp }