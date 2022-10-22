# Email Code Challenge Solution

## [Back to Table of Contents](./Table-of-Contents.md)

### User Story - Purpose of Component

As a user I would like Alexa to give me the solution to the code challenge I completed.

### Resources used in building this

Main Resources

[MAKE SURE YOU CONFIGURE YOUR ALEXA FIRST](./Configure-Alexa-to-Email-User.md)

- [Linking other AWS resources](https://developer.amazon.com/en-US/docs/alexa/hosted-skills/alexa-hosted-skills-personal-aws.html)
- [Setting up the email params](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-send-email-ses/)
- [API reference for sending the email](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-send-email-ses/)

Additional Resources:

### Dependencies

- No dependencies required.

### Intents Utterances

- See: [Get a code challenge](./Feature-Get-Code-Challange.md)

### Notable Code Block w/Code Description

Most of this is the same as the [Email Job report](./Feature-Email-Jobs-Report.md). Modify it to your needs. The source code may look confusing because it is built around the functionality of the timer feature.

```js
//* making the request to send an email with Alexa credentials
        // 1. Assume the AWS resource role using STS AssumeRole Action

        const sts = new aws.STS({ apiVersion: '2011-06-15' })

        const credentials = await sts
            .assumeRole(
                {
                    RoleArn: 'ALEXA ROLE ARN',
                    RoleSessionName: 'SendEmailRoleSession'
                },
                (err, res) => {
                    if (err) {
                        console.log('AssumeRole FAILED: ', err)
                        throw new Error('Error while assuming role')
                    }
                    return res
                }
            )
            .promise()

        //* 2. Make a new SES object with the assumed role credentials

        //* create a new SES instance
        const ses = new aws.SES({
            apiVersion: '2010-12-01',
            region: 'us-east-1',
            accessKeyId: credentials.Credentials.AccessKeyId,
            secretAccessKey: credentials.Credentials.SecretAccessKey,
            sessionToken: credentials.Credentials.SessionToken
        })

        //* async function to send the email and wait for a promise to be returned
        /**
         *
         * @param {string} reciever The email address you want to recieve the data at
         * @param {string} body The email body, the actual text inside the email. NOT HTML. //! Will be an object once feature is implemented.
         * @param {string} subject The subject line of the email.
         * @returns
         */
        const sendEmail = async (reciever, body, subject) => {
            let params = {
                Destination: {
                    ToAddresses: [reciever]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: `<h1>Tech Prep!</h1>
                                <h3>Thank you for using our Alexa Skill!</h3>
                                <h4> Here is the code challenge that you attempted: </h4>
                                
                                <div>
                                    <p>${body.chosenChallenge.description}</p>
                                    <a href=${body.chosenChallenge.solution}>You can view the solution here</a>
                                </div>`
                        }
                    },

                    Subject: { Data: subject }
                },
                Source: 'YOUR SES VERIFIED EMAIL HERE'
            }


            return await ses.sendEmail(params).promise()
        }

        //* send the email with the specified parameters
        sendEmail(sessionAttributes.profileEmail, sessionAttributes, 'TechPrep Solution Code')

        return handlerInput.responseBuilder
            .getResponse();

        //! if there are improper permissions. Sometimes they can be switched off if the skill is rebuilt/redeployed.
```

### Notable Bugs and Issues that occurred

- Problem: Emails being recieved as undefined
- Solution: Make sure your data is passed into the sendEmail function correctly.

- Problem: Permissions issues
- Solution:
  - 1. Make sure your ARN's are correct
  - 2. Make sure your role is configured properly
  - 3. Make sure your SES verified email is EXACTLY the same as it is in AWS. Even a capital letter will break it.

### Known bugs/issues

No known bugs at the time of writing this. Sometimes emails are sent to spam or junk.
