enum AWSResourceType {
  S3_BUCKET = "S3bucket",
  LAMBDA = "Lambda",
  HOSTED_ZONE = "HostedZone",
  SSM_PARAMETER = "SsmParameter",
  CERIFICATE = "Certificate",
  LAMBDA_REST_API = "LambdaRestApi",
  A_RECORD = "ARecord",
  CFN_OUTPUT = "CfnOutput",
  ORIGIN_ACCESS_IDENTIFY = "OriginAccessIdentity",
  DISTRIBUTION = "Distribution",
  BUCKET_DEPLOYMENT = "BucketDeployment",
  VPC = "Vpc",
  SUBNET = "Subnet",
  ECS_CLUSTER = "EcsCluster",
  ECS_CLUSTER_CAPACITY = "EcsClusterCapacity",
  ROLE = "Role",
  CONTAINER = "Container",
  EC2_TASKDEF = "Ec2TaskDef",
  EC2_SERVICE = "Ec2Service",
  ALB = "Alb",
  ALB_LISTENER = "AlbListener",
  ALB_LISTENER_TARGET = "AlbListenerTarget",

}

export const capitalize = (word: string): string => {
  return word[0].toUpperCase() + word.slice(1);
};

const c = capitalize;

const makeId = (
  resourceType: AWSResourceType,
  envName: string,
  appName: string,
  suffix?: string
): string => {
  return `Id${c(envName)}${c(appName)}${resourceType}${suffix ? c(suffix) : ""}`;
};

export { AWSResourceType, makeId }
