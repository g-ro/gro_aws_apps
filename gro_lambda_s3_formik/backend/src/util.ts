import { S3 } from 'aws-sdk'


const s3Client = new S3({ signatureVersion: 'v4' });
const toDebug = true;


const debug = (message) => {
    if (!toDebug) return;
    console.log(message);
}

const isExisted = async (params) => {
    try {
        debug(`headObject: ${JSON.stringify(params)}`)
        await s3Client.headObject(params).promise();
        return true;
    } catch (e) {
        console.error(e)
        return false;
    }
};

const fetchUploadUrl = async (fileName, folderName) => {
    const bucket = process.env.BUCKET;
    const params = {
        Bucket: bucket,
        Key: `${folderName}/${fileName}`,
        ContentType: 'application/octet-stream',
    };
    try {
        const url = await s3Client.getSignedUrlPromise('putObject', params);
        debug(`Upload URL: ${url}`);
        return url;
    } catch (error) {
        debug(
            `Error creating singed url to upload file ${fileName} in folder ${folderName}`
        );
        throw error;
    }
};

const fetchViewUrl = async (file) => {
    const bucket = process.env.BUCKET;
    debug(`bucket: ${bucket}`);
    debug(`file: ${file}`);
    const params = { Bucket: bucket, Key: file };
    try {
        // check for existing file first
        debug('checking if file exists')
        const existed = await isExisted(params);
        debug(`existed=${existed}`);
        if (existed) {
            const url = await s3Client.getSignedUrlPromise('getObject', params);
            debug(`View URL: ${url}`);
            return url;
        } else {
            throw new Error(`File ${file} not found`);
        }
    } catch (error) {
        debug(`Error creating singed url to read file ${file}`);
        throw error;
    }
};

export { debug, fetchUploadUrl, fetchViewUrl }