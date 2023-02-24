export type CDKContext = {
    account: string;
    region: string;
    appName: string;
    environment: string;
    owner: string;
    serverless: string;
    domainName: string;
    uiDomain: string;
    uiUrl: string;
    apiDomain: string;
    apiUrl: string;
    ssmParamKey4SSLCertArn: string;
    cognitoUserPoolId: string;
    cognitoIdentityPoolId: string;
    cognitoWebClientId: string;
    infoStoreBucketName: string;
    securityGroupName: string;
}