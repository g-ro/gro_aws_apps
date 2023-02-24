import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { HostedZone, ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

import { resolve } from "path";
import { CDKContext } from "../types";
import { AWSResourceType as RT, makeId } from "./aws-resource-helper";

export default interface FrontendDeploymentProps extends StackProps { }

export class FrontendDeploymentStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        context: CDKContext,
        props?: FrontendDeploymentProps
    ) {
        super(scope, id, props);

        const _id = (resourceType: RT, suffix?: string): string => {
            return makeId(resourceType, context.environment, context.appName, suffix);
        };
        const _name = (name: string): string => {
            return `${context.environment}-${context.appName}-${name}`;
        };

        const codeBucket = new Bucket(this, _id(RT.S3_BUCKET, "CodeFrontend"), {
            bucketName: _name("frontend-code-bucket"),
            accessControl: BucketAccessControl.PRIVATE,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const originAccessIdentity = new OriginAccessIdentity(
            this,
            _id(RT.ORIGIN_ACCESS_IDENTIFY)
        );
        codeBucket.grantRead(originAccessIdentity);

        const hostedZone = HostedZone.fromLookup(
            this,
            _id(RT.HOSTED_ZONE, "Frontend"),
            { domainName: context.domainName }
        );

        const certificateArn = StringParameter.fromStringParameterAttributes(
            this,
            "SslCertFrontend",
            {
                parameterName: context.ssmParamKey4SSLCertArn,
            }
        );

        const certificate = Certificate.fromCertificateArn(
            this,
            _id(RT.CERIFICATE, "Frontend"),
            certificateArn.stringValue
        );

        const distribution = new Distribution(
            this,
            _id(RT.DISTRIBUTION, "Frontend"),
            {
                defaultRootObject: "index.html",
                domainNames: [context.uiDomain],
                certificate: certificate,
                defaultBehavior: {
                    origin: new S3Origin(codeBucket, { originAccessIdentity }),
                },
            }
        );

        // Route53 alias record for the CloudFront distribution
        const arecord = new ARecord(this, _id(RT.A_RECORD, "Frontend"), {
            recordName: context.uiDomain,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
            zone: hostedZone,
            deleteExisting: true
        });
        arecord.applyRemovalPolicy(RemovalPolicy.DESTROY);

        new BucketDeployment(this, _id(RT.BUCKET_DEPLOYMENT), {
            destinationBucket: codeBucket,
            sources: [Source.asset(resolve(__dirname, "../../frontend/build"))],
            distribution,
            distributionPaths: ["/*"],
        });

        new CfnOutput(this, _id(RT.CFN_OUTPUT, "CodeBucketName"), {
            value: codeBucket.bucketName,
        });
        new CfnOutput(this, _id(RT.CFN_OUTPUT, "AwsGivenUiUrl"), {
            value: distribution.domainName,
        });
        new CfnOutput(this, _id(RT.CFN_OUTPUT, "ARecordDomainNameUi"), {
            value: arecord.domainName,
        });
        new CfnOutput(this, _id(RT.CFN_OUTPUT, "SubdomainUiUrl"), {
            value: context.uiUrl,
        });
    }
}
