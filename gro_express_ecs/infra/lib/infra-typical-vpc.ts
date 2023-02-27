import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";


import { CDKContext } from "../types";
import { AWSResourceType as RT, makeId } from "./aws-resource-helper";

export default interface TypicalVPCProps extends cdk.StackProps { }

export class TypicalVPCStack extends cdk.Stack {

    private _id;
    private _name;
    private context: CDKContext;

    constructor(
        scope: Construct,
        id: string,
        context: CDKContext,
        props?: TypicalVPCProps
    ) {
        super(scope, id, props);
        this.context = context;
        this._id = (resourceType: RT, suffix?: string): string => {
            return makeId(resourceType, context.environment, context.appName, suffix);
        };
        this._name = (name: string): string => {
            return `${context.environment}-${context.appName}-${name}`;
        };
        const vpc = this.createVPC();
    }

    private createVPC(): ec2.Vpc {
        const vpc = new ec2.Vpc(this, this._id(RT.VPC), {
            ipAddresses: ec2.IpAddresses.cidr(this.context.cidr),
            natGateways: this.context.natGateways,
            maxAzs: this.context.maxAzs,
            vpcName: this._name(this.context.vpcNameSuffix),

            subnetConfiguration: [
                {
                    name: "Public",
                    cidrMask: 24,
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    name: "Private",
                    cidrMask: 28,
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                },
                {
                    name: "Database",
                    cidrMask: 28,
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                },
            ],
        });
        new cdk.CfnOutput(this, this._id(RT.CFN_OUTPUT, this._name("vpcArn")), {
            value: vpc.vpcArn,
            exportName: this._name("vpcArn"),
        });
        new cdk.CfnOutput(this, this._id(RT.CFN_OUTPUT, this._name("VpcId")), {
            value: vpc.vpcId,
            exportName: this._name("VpcId"),
        });
        let counter = 0;
        vpc.privateSubnets.forEach(ps => {
            const name = this._name("PrivateSubnet" + ++counter);
            new cdk.CfnOutput(this, this._id(RT.CFN_OUTPUT, name), {
                value: ps.subnetId,
                exportName: name,
            });
        });
        counter = 0;
        vpc.publicSubnets.forEach(ps => {
            const name = this._name("PublicSubnet" + ++counter);
            new cdk.CfnOutput(this, this._id(RT.CFN_OUTPUT, name), {
                value: ps.subnetId,
                exportName: name,
            });
        });
        counter = 0;
        vpc.isolatedSubnets.forEach(ps => {
            const name = this._name("IsolatedSubnet" + ++counter);
            new cdk.CfnOutput(this, this._id(RT.CFN_OUTPUT, name), {
                value: ps.subnetId,
                exportName: name,
            });
        });
        return vpc;
    }

}