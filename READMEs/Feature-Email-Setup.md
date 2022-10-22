# Email Setup

### User Story - Purpose of Component

- As a user I would like to recieve emails from Alexa with solutions to the code challenge I am working on.
- As a user I would like to recieve emails from Alexa with a list of daily job postings.

### Resources used in building this

When you are creating your Alexa skill you can choose to self host or to have it "Alexa Hosted". In this application we selected "Alexa Hosted", which means she provisions certain resources that are managed by default. These services are:
    - S3
    - DynamoDB
    - Lambda
    - Cloudwatch
  
![Console](../img/alexa-hosted-resources.png)

When you go to the "Code" section in your Alexa developer console these skills will be listed at the top. All of these are available to you without any setup, with the caviat that you are granted a static role that has limited permissions. That is why to setup SES (or any other service), we need to do some setup. Check out the resource links below for the steps to allow Alexa to connect with your AWS account.

- [Linking other AWS resources](https://developer.amazon.com/en-US/docs/alexa/hosted-skills/alexa-hosted-skills-personal-aws.html)

You will also need to configure your SES to verify an email for sending.

- [Setting up SES](https://docs.aws.amazon.com/ses/latest/dg/Welcome.html)

[A basic walkthrough for sending emails](https://pamphl3t.medium.com/send-a-email-from-your-alexa-with-aws-ses-176a81515680)

Additional Resources

### Dependencies

All you need is the AWS-SDK (which Alexa should have installed by default)

## Intents

All of the emails are sent within [The code challenge skill](./Configure-API-for-Jobs.md)

## Utterances

### Notable Code Block w/Code Description

- Link to .js file with comments for each section
- screenshot of the code:

### Notable Bugs and Issues that occurred

- Problem
- Solution

### Testing

### Known bugs/issues
