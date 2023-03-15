#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';

import { CDKContext } from "../types";
import { awsAccountRegion, getContext, addCommonTagsToApp } from "./support";
import { TypicalVPCStack } from '../lib/infra-typical-vpc';
import { AWSResourceType as RT, makeId } from "../lib/aws-resource-helper";

export const createVPCStack = async (
  app: cdk.App,
  context: CDKContext,
  tags: any
) => {
  try {
    const makeName = (name: string): string => {
      return `${context.environment}-${context.appName}-${name}`;
    };
    const _id = (resourceType: RT, suffix?: string): string => {
      return makeId(resourceType, context.environment, context.appName, suffix);
    };
    const ssmRootParamName = `/${makeName('infra')}`;
    const stack = new TypicalVPCStack(app, makeId(RT.CDK_STACK, context.environment, context.appName), context, {
      env: awsAccountRegion,
      tags: tags,
      ssmRootParam: ssmRootParamName
    });

    new cdk.CfnOutput(stack, _id(RT.CFN_OUTPUT, 'stack'), {
      exportName: _id(RT.CFN_OUTPUT, 'stack'),
      value: `stack-id->${stack.stackId}#stack-->${stack.stackName}`,
    });

    const ssmStackParam = new ssm.StringParameter(stack, makeId(RT.SSM_PARAMETER, context.environment, context.appName, "stack"), {
      parameterName: `${ssmRootParamName}/stack`,
      stringValue: `stack-id->${stack.stackId}#stack-->${stack.stackName}`
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createStack = async () => {
  try {
    const app = new cdk.App();
    const context: CDKContext = await getContext(app);
    console.info(`FINAL CONTEXT: \n ${JSON.stringify(context, null, 2)}`);
    const tags = addCommonTagsToApp(app, context);
    await createVPCStack(app, context, tags);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

createStack();

