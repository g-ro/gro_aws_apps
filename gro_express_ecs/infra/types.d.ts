export type CDKContext = {
    account: string;
    region: string;
    appName: string;
    environment: string;
    owner: string;
    serverless: string;
    domainName: string;
    apiDomain: string;
    apiUrl: string;
    // 
    maxAzs: number;
    natGateways: number;
    cidr: string;
    vpcNameSuffix: string;
    //
    containerImage: string;
    //
    containerNameSuffix: string;
    //
    ssmParamKey4SSLCertArn: string;
    keyPairName: string;
}