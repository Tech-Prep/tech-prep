const { Response } = require('node-fetch');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

// Configuration from API docs: https://github.com/aws/aws-sdk-js-v3#configuration
// Region is default from Alexa in S3 bucket
const config = { region: 'us-east-1' };
// Bucket and key prefix from Alexa S3 default
const bucket = '3aced56e-411c-4b1c-9cfd-14db4ee31cd0-us-east-1';
const keyPrefix = 'Media';

async function addS3Object(key, value) {
  // `s3://${Bucket}/${Key}`
  // API input documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectrequest.html#body
  const input = {
    Body: JSON.stringify(value), // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectrequest.html#body
    Key: `${keyPrefix}/${key}`, // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectrequest.html#key
    Bucket: bucket, // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectrequest.html#bucket
  };

  // client, command and send principles extracted from info in README
  // of API Github repo/documentation: https://github.com/aws/aws-sdk-js-v3
  const client = new S3Client(config);
  // PutObjectCommand docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
  const command = new PutObjectCommand(input);
  const response = await client.send(command);

}

async function getS3Object(key){
  const input = {
    Key: `${keyPrefix}/${key}`,
    Bucket: bucket,
  };

  const client = new S3Client(config);
  // GetObjectCommand: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
  const command = new GetObjectCommand(input);
  const rawResponse = await client.send(command);
  // Approach here found in StackOverflow post: https://stackoverflow.com/a/70042186
  const response = new Response(rawResponse.Body);
  const jsonResponse = await response.json();

  return jsonResponse;
}

module.exports = {
  addS3Object,
  getS3Object,
};
