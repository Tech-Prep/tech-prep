# Configure Alexa to Use an S3 Bucket

## Developer Story - Purpose of Component

> As a developer I want to connect my Alexa skill to an S3 bucket as a way to add to, delete, and retrieve from storage.
___

## Resources used in building this

[Configuration from API docs](https://github.com/aws/aws-sdk-js-v3#configuration)

[Interface PutObjectRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectrequest.html#body)

[Interface GetObjectRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html)

[DeleteObjectCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/deleteobjectcommand.html)

[Approach for using Node-fetch](https://stackoverflow.com/a/70042186)

___

## Dependencies

> - @aws-sdk/client-s3
> - node-fetch (We used version 2.6.7)

___

## Code with Line-by-Line Descriptions:

> The full code is below, followed by a line-by-line breakdown of the code:

```javascript
const { Response } = require('node-fetch');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const config = { region: 'us-east-1' };
const bucket = '3aced56e-411c-4b1c-9cfd-14db4ee31cd0-us-east-1';
const keyPrefix = 'Media';

// Put an object in the Bucket

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

// Get an object from the bucket

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

// Delete an object from the bucket

async function deleteS3Object(key, value) {
  const input = {
    Key: `${keyPrefix}/${key}`,
    Bucket: bucket,
  };

  const client = new S3Client(config);
  const command = new DeleteObjectCommand(input);
  const response = await client.send(command);

module.exports = {
  addS3Object,
  getS3Object,
  deleteS3Object,
};
```

<!-- ________________________________________________ -->

> Require in node-fetch and @aws-sdk/client-s3. When accessing an object from the S3 bucket, the Response Class required in from Node-fetch helps to reconstruct the raw response into a more readable version.
>The @aws-sdk/client-s3 is how you interact with the bucket.

```javascript
const { Response } = require('node-fetch');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
```

> These three variables are [requirements](https://github.com/aws/aws-sdk-js-v3#configuration) for functions that will be detailed in the code below. They are relevant for connecting to your specific S3 bucket. You will need to:
> - Provide your specific region (the region defaults to the region of the account holder)

```javascript
const config = { region: 'us-east-1' };
```

> - The name of your bucket

```javascript
const bucket = '3aced56e-411c-4b1c-9cfd-14db4ee31cd0-us-east-1';
```

> - The Prefix that your folder will go into.

```javascript
const keyPrefix = 'Media';
```

### Put an object in the Bucket

> Create an async function to add an object to your bucket. It's parameters will be a key and a value. For instance, when a user requests a code challenge from our application, the key is the name of that challenge, and the value is the challenge itself.

> Create an object within this function that contains three key-value pairs, for which the keys are 'Body', 'Key, and 'Bucket'.  In our code, this object was called 'input'. 

>The Body's value is the value passed in, which is stringified before being stored in the bucket. This is the file stored within the folder. 

>The Key's value represents two things, the key, which is the file name, and the keyPrefix which is the folder where the file is stored. 

>The Bucket's value is the variable that was already declared above.

```javascript
async function addS3Object(key, value) {
  const input = {
    Body: JSON.stringify(value), 
    Key: `${keyPrefix}/${key}`, 
    Bucket: bucket, 
  };
  ```

>Create an S3 client using the region that has been specifed in the 'config' variable. The client functions as a courier who takes information to and from the bucket.

```javascript
const client = new S3Client(config);
```

> Create a new instance of the PutObjectCommand, using the input that was already declared above.

```javascript
  const command = new PutObjectCommand(input);
```

> Use the client to send off the command and return with a response to confirm that the command was successful. 

```javascript
  const response = await client.send(command);
}
```

### Get an object from the bucket

> In the previous code, we put an object into the bucket. The next bit of code we will be getting an object out of the bucket. This is slightly different, but similar to putting an object into the bucket.

> The code below specifies the bucket that is being accessed, and the object that is being retrieved.

```javascript
async function getS3Object(key){
  const input = {
    Key: `${keyPrefix}/${key}`,
    Bucket: bucket,
  };
  ```

>Create an S3 client using the region that has been specifed in the 'config' variable. The client functions as a courier who takes information to and from the bucket.

```javascript
  const client = new S3Client(config);
```

> Create a new instance of the GetObjectCommand, using the input that was already declared above.

```javascript
  const command = new GetObjectCommand(input);
```

> Use the client to send off the command and return with a response to confirm that the command was successful.

```javascript
  const rawResponse = await client.send(command);
```

> Node-fetch has a class called Response which we use to parse the rawResponse.

```javascript
  const response = new Response(rawResponse.Body);
  const jsonResponse = await response.json();

  return jsonResponse;
}
```

### Delete an object from the bucket

>The next bit of code we will target an object inside of the bucket, and delete it. This is similar to getting an object from the bucket.

>The code below specifies the bucket that is being accessed, and the object that is being deleted.

```javascript
async function deleteS3Object(key, value) {
  const input = {
    Key: `${keyPrefix}/${key}`,
    Bucket: bucket,
  };
```

>Create an S3 client using the region that has been specifed in the 'config' variable. The client functions as a courier who takes information to and from the bucket.

```javascript
  const client = new S3Client(config);
```

> Create a new instance of the DeleteObjectCommand, using the input that was already declared above.

```javascript
  const command = new DeleteObjectCommand(input);
```

> Use the client to send off the command and return with a response to confirm that the command was successful.

```javascript
  const response = await client.send(command);
}
```

> Export the functions to be used throughout the application.

```javascript
module.exports = {
  addS3Object,
  getS3Object,
  deleteS3Object,
};
```

___
### Known bugs/issues

> At the time of this writing, Amazon's logs have alerted us that Node 12.x is due to be depricated as of 11/1/22.
