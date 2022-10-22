const { Response } = require('node-fetch');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const config = { region: 'us-east-1' };
const bucket = '3aced56e-411c-4b1c-9cfd-14db4ee31cd0-us-east-1';
const keyPrefix = 'Media';


async function addS3Object(key, value) {
  const input = {
    Body: JSON.stringify(value), 
    Key: `${keyPrefix}/${key}`, 
    Bucket: bucket, 
  };

  const client = new S3Client(config);
  const command = new PutObjectCommand(input);
  const response = await client.send(command);

}

async function getS3Object(key){
  const input = {
    Key: `${keyPrefix}/${key}`,
    Bucket: bucket,
  };

  const client = new S3Client(config);
  const command = new GetObjectCommand(input);
  const rawResponse = await client.send(command);
  const response = new Response(rawResponse.Body);
  const jsonResponse = await response.json();

  return jsonResponse;
}

async function deleteS3Object(key, value) {
  const input = {
    Key: `${keyPrefix}/${key}`,
    Bucket: bucket,
  };

  const client = new S3Client(config);
  const command = new DeleteObjectCommand(input);
  const response = await client.send(command);
}

module.exports = {
  addS3Object,
  getS3Object,
  deleteS3Object,
};