#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { parse } from 'ts-command-line-args';

import { awsAccountRegion, getContext, addCommonTagsToApp } from "./support";
import { CDKContext } from "../types";
// import { createEcsClusterTaskDefService } from './ecs-cluster-taskdef-service-create-stack'
// import { createTypicalVpcStack } from './vpc-create-stack';
import { TypicalVPCStack } from '../lib/infra-typical-vpc';
import { EcsClusterTaskDefServiceStack } from '../lib/infra-ecs-cluster-taskdef-service';


interface CmdLineArgs {
  stackName: string;
}

// const createStack = async () => {
//   try {

//     // const args = parse<CmdLineArgs>({
//     //   stackName: { type: String, alias: "s" } //, optional: true
//     // });
//     // console.log(`CMD Line Value for stackName: ${args.stackName}`)

//     const app = new cdk.App();
//     // const stackName = new cdk.CfnParameter(app, "stackName", {
//     //   type: "String",
//     //   description: "Stack Name"
//     // });
//     const sn = ""//args.stackName //|| stackName.valueAsString;
//     const context: CDKContext = await getContext(app);
//     console.info(`FINAL CONTEXT: \n ${JSON.stringify(context, null, 2)}`);
//     const tags = addCommonTagsToApp(app, context);
//     if (sn && sn === "vpc") {
//       console.log('Processing VPC stack');
//       createTypicalVpcStack(app, context, tags);
//     } else {
//       console.log('Processing ECS-Cluster stack');
//       await createEcsClusterTaskDefService(app, context, tags);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export const createTypicalVpcStack = async (
  app: cdk.App,
  context: CDKContext,
  tags: any
) => {
  try {
    new TypicalVPCStack(app, `${context.environment}-${context.appName}-TypicalVPCStack`, context, {
      env: awsAccountRegion,
      tags,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createEcsClusterTaskDefService = async (
  app: cdk.App,
  context: CDKContext,
  tags: any
) => {
  try {
    new EcsClusterTaskDefServiceStack(app,
      `${context.environment}-${context.appName}-EcsClusterTaskDefServiceStack`,
      context, {
      env: awsAccountRegion,
      tags,
    });
  } catch (error) {
    console.error(error);
  }
};

const createStack = async () => {
  try {
    const app = new cdk.App();
    const context: CDKContext = await getContext(app);
    console.info(`FINAL CONTEXT: \n ${JSON.stringify(context, null, 2)}`);
    const tags = addCommonTagsToApp(app, context);
    await createTypicalVpcStack(app, context, tags);
    await createEcsClusterTaskDefService(app, context, tags);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

createStack();