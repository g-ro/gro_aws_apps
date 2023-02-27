import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as autoscaling from "aws-cdk-lib/aws-autoscaling";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import * as iam from "aws-cdk-lib/aws-iam";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as lg from "aws-cdk-lib/aws-logs";

import { CDKContext } from "../types";
import { AWSResourceType as RT, makeId } from "./aws-resource-helper";
import { HostedZone, ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { LoadBalancerTarget } from "aws-cdk-lib/aws-route53-targets";

export default interface EcsClusterTaskDefServiceProps extends cdk.StackProps { }

export class EcsClusterTaskDefServiceStack extends cdk.Stack {
    private _id;
    private _name;
    private context: CDKContext;

    constructor(
        scope: Construct,
        id: string,
        context: CDKContext,
        props?: EcsClusterTaskDefServiceProps
    ) {
        super(scope, id, props);
        this.context = context;
        this._id = (resourceType: RT, suffix?: string): string => {
            return makeId(resourceType, context.environment, context.appName, suffix);
        };
        this._name = (name: string): string => {
            return `${context.environment}-${context.appName}-${name}`;
        };
        const vpc: ec2.IVpc = ec2.Vpc.fromLookup(this, this._id(RT.VPC), {
            tags: { "Name": this._name(this.context.vpcNameSuffix) }
        });
        const cluster = this.createCluster(vpc);
        const taskDef = this.createTaskDefinition();
        const service = this.createService(vpc, cluster, taskDef);

    }

    private createCluster(vpc: ec2.IVpc): ecs.Cluster {
        const cluster = new ecs.Cluster(this, this._id(RT.ECS_CLUSTER), {
            vpc: vpc,
            clusterName: this._name("ecs-cluster"),
        });
        cluster.addCapacity(this._id(RT.ECS_CLUSTER_CAPACITY), {
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO
            ),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
            keyName: this.context.keyPairName,
            minCapacity: 1,
            maxCapacity: 2,
        });

        cluster.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        new cdk.CfnOutput(this, this._id(RT.CFN_OUTPUT, this._name("clusterArn")), {
            value: cluster.clusterArn,
            exportName: this._name("clusterArn"),
        });
        return cluster;
    }

    private createTaskDefinition(): ecs.Ec2TaskDefinition {

        const taskAssumedRole = new iam.Role(this, this._id(RT.ROLE), {
            assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonAPIGatewayInvokeFullAccess"),
                iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaExecute"),
                iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"),
                iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSQSFullAccess"),
            ],
        });

        const logDriver = new ecs.AwsLogDriver({
            logGroup: new lg.LogGroup(this, "todo", {
                logGroupName: this._name("ecs-log-group"),
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retention: cdk.aws_logs.RetentionDays.ONE_DAY
            }),
            streamPrefix: "express-web",
            // logRetention: cdk.aws_logs.RetentionDays.ONE_DAY
        });

        const taskDefinition = new ecs.Ec2TaskDefinition(this, this._id(RT.EC2_TASKDEF), {
            taskRole: taskAssumedRole
        });

        const container = taskDefinition.addContainer(this._id(RT.CONTAINER), {
            containerName: this._name(this.context.containerNameSuffix),
            image: ecs.ContainerImage.fromRegistry(this.context.containerImage),
            memoryLimitMiB: 256,
            // cpu: 1,
            logging: logDriver,
            environment: {
                NAME: "GROHIT",
            },
        });

        container.addPortMappings(
            {
                hostPort: 80,
                containerPort: 3000,
                protocol: ecs.Protocol.TCP,
            }
        );

        taskDefinition.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        new cdk.CfnOutput(
            this,
            this._id(RT.CFN_OUTPUT, this._name("taskDefinitionArn")),
            {
                value: taskDefinition.taskDefinitionArn,
                exportName: this._name("taskDefinitionArn"),
            }
        );
        return taskDefinition;
    }


    private createService(
        vpc: ec2.IVpc,
        cluster: ecs.Cluster,
        taskDefinition: ecs.Ec2TaskDefinition
    ): ecs.Ec2Service {


        const hostedZone = HostedZone.fromLookup(this, this._id(RT.HOSTED_ZONE, "Alb"), {
            domainName: this.context.domainName
        });
        const certificateArn = StringParameter.fromStringParameterAttributes(this, "SslCert4Alb", {
            parameterName: this.context.ssmParamKey4SSLCertArn,
        }
        );
        const certificate = Certificate.fromCertificateArn(this,
            this._id(RT.CERIFICATE, "Alb"),
            certificateArn.stringValue
        );

        // Create Service
        const service = new ecs.Ec2Service(this, this._id(RT.EC2_SERVICE), {
            cluster: cluster,
            taskDefinition: taskDefinition,
        });

        // Create ALB
        const lb = new elbv2.ApplicationLoadBalancer(this, this._id(RT.ALB), {
            vpc,
            internetFacing: true,
            loadBalancerName: this._name("alb")
        });
        const listener = lb.addListener(this._id(RT.ALB_LISTENER), {
            protocol: elbv2.ApplicationProtocol.HTTPS,
            port: 443,
            certificates: [certificate],
        });
        lb.addRedirect();

        // Route53 alias record for the CloudFront distribution
        const arecord = new ARecord(this, this._id(RT.A_RECORD, "Alb"), {
            recordName: this.context.apiDomain,
            target: RecordTarget.fromAlias(new LoadBalancerTarget(lb)),
            zone: hostedZone,
            deleteExisting: true
        });
        arecord.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        // Attach ALB to ECS Service
        listener.addTargets(this._id(RT.ALB_LISTENER_TARGET, "80"), {
            port: 80,
            protocol: elbv2.ApplicationProtocol.HTTP,
            targets: [
                service.loadBalancerTarget({
                    containerName: this._name(this.context.containerNameSuffix),
                    containerPort: 3000,
                }),
            ],
            // include health check (default is none)
            healthCheck: {
                path: "/",
                timeout: cdk.Duration.seconds(5),
                interval: cdk.Duration.seconds(60),
            },
        });

        // lb.addSecurityGroup
        new cdk.CfnOutput(
            this,
            this._id(RT.CFN_OUTPUT, this._name("AlbDns")),
            {
                value: lb.loadBalancerDnsName,
                exportName: this._name("AlbDns"),
            }
        );

        new cdk.CfnOutput(
            this,
            this._id(RT.CFN_OUTPUT, this._name("ApiUrl")),
            {
                value: `https://${this.context.apiDomain}`,
                exportName: this._name("ApiUrl"),
            }
        );

        new cdk.CfnOutput(
            this,
            this._id(RT.CFN_OUTPUT, this._name("serviceArn")),
            {
                value: service.serviceArn,
                exportName: this._name("serviceArn"),
            }
        );

        return service;
    }

    private createClusterWithAsgCapacityProvider(vpc: ec2.Vpc): ecs.Cluster {
        const cluster = new ecs.Cluster(this, this._id(RT.ECS_CLUSTER), {
            vpc: vpc,
            clusterName: "TODO",
        });

        const launchTemplate = new ec2.LaunchTemplate(this, "ASG-LaunchTemplate", {
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T2,
                ec2.InstanceSize.MICRO
            ),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
            userData: ec2.UserData.forLinux(),
        });

        const autoScalingGroup = new autoscaling.AutoScalingGroup(this, "ASG", {
            vpc,
            mixedInstancesPolicy: {
                instancesDistribution: {
                    onDemandPercentageAboveBaseCapacity: 50,
                },
                launchTemplate: launchTemplate,
            },
        });

        const capacityProvider = new ecs.AsgCapacityProvider(
            this,
            "AsgCapacityProvider",
            {
                autoScalingGroup,
                machineImageType: ecs.MachineImageType.AMAZON_LINUX_2,
            }
        );

        cluster.addAsgCapacityProvider(capacityProvider);

        return cluster;
    }

}
