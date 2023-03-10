import * as awsServerlessExpress from 'aws-serverless-express';

import app from './app';

// NOTE(from repo): If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)

// NOTE: types listed below will be encoded when match between req.header.accept and res.header.contentType
const binaryMimeTypes = [
  // 'application/javascript',
  // 'application/json',
  // 'application/octet-stream',
  // 'application/xml',
  // 'font/eot',
  // 'font/opentype',
  // 'font/otf',
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  // 'text/comma-separated-values',
  // 'text/css',
  // 'text/html',
  // 'text/javascript',
  // 'text/plain',
  // 'text/text',
  // 'text/xml'
];

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);

export const handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
