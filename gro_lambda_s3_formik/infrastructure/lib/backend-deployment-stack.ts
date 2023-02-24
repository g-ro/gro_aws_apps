import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import {
  LambdaRestApi,
  SecurityPolicy,
  EndpointType,
} from "aws-cdk-lib/aws-apigateway";
import { Bucket, BucketAccessControl, HttpMethods } from "aws-cdk-lib/aws-s3";

import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone, ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";

import { join } from "path";
import { CDKContext } from "../types";
import { AWSResourceType as RT, makeId } from "./aws-resource-helper";

export default interface BackendDeploymentProps extends cdk.StackProps { }

export class BackendDeploymentStack extends cdk.Stack {

  constructor(
    scope: Construct,
    id: string,
    context: CDKContext,
    props?: BackendDeploymentProps
  ) {
    super(scope, id, props);

    const _id = (resourceType: RT, suffix?: string): string => {
      return makeId(resourceType, context.environment, context.appName, suffix);
    };
    const _name = (name: string): string => {
      return `${context.environment}-${context.appName}-${name}`;
    };

    const bucket = new Bucket(this, _id(RT.S3_BUCKET), {
      bucketName: _name(context.infoStoreBucketName),
      accessControl: BucketAccessControl.PRIVATE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    const expressHandlerLambda = new Function(this, _id(RT.LAMBDA, "Main"), {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(join(__dirname, "../../backend/build")),
      handler: "main.handler",
      memorySize: 128,
      functionName: _name("main-function"),
      timeout: cdk.Duration.seconds(30),
      environment: {
        BUCKET: bucket.bucketName,
      },
    });

    bucket.grantReadWrite(expressHandlerLambda);

    const hostedZone = HostedZone.fromLookup(
      this,
      _id(RT.HOSTED_ZONE, "Backend"),
      { domainName: context.domainName }
    );

    const certificateArn = StringParameter.fromStringParameterAttributes(
      this,
      _id(RT.SSM_PARAMETER, "SslCertBackend"),
      {
        parameterName: context.ssmParamKey4SSLCertArn,
      }
    );
    console.log(`CertificateARN: lookup ${certificateArn.stringValue}`)
    console.log(`CertificateARN: hardcd arn:aws:acm:us-east-1:740358308248:certificate/193533cd-35ce-4341-97da-7ae709e7e12d`)


    const certificate = Certificate.fromCertificateArn(
      this,
      _id(RT.CERIFICATE, "Backend"),
      certificateArn.stringValue
    );


    const restApi = new LambdaRestApi(this, _id(RT.LAMBDA_REST_API, "Main"), {
      handler: expressHandlerLambda,
      restApiName: _name("main-api"),
      // enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
      domainName: {
        domainName: context.apiDomain,
        certificate: certificate,
        securityPolicy: SecurityPolicy.TLS_1_2,
        endpointType: EndpointType.EDGE,
      },
    });

    // Route53 alias record for the CloudFront distribution
    const arecord = new ARecord(this, _id(RT.A_RECORD, "Backend"), {
      recordName: context.apiDomain,
      zone: hostedZone,
      target: RecordTarget.fromAlias(new ApiGateway(restApi)),
      deleteExisting: true
    });
    arecord.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);


    new cdk.CfnOutput(this, _id(RT.CFN_OUTPUT, "InfoStoreBucketName"), {
      value: bucket.bucketName,
    });
    new cdk.CfnOutput(this, _id(RT.CFN_OUTPUT, "AwsGivenApiUrl"), {
      value: restApi.url,
    });
    new cdk.CfnOutput(this, _id(RT.CFN_OUTPUT, "ARecordDomainNameApi"), {
      value: arecord.domainName,
    });
    new cdk.CfnOutput(this, _id(RT.CFN_OUTPUT, "SubdomainApiUrl"), {
      value: context.apiUrl,
    });
  }
}
