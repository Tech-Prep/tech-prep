# Email Jobs Report

## [Back to Table of Contents](./Table-of-Contents.md)

### User Story - Purpose of Component

As a user I would like Alexa to give me a list of current jobs and email them to me.

### Resources used in building this

Main Resources

[MAKE SURE YOU CONFIGURE YOUR ALEXA FIRST](./Configure-Alexa-to-Email-User.md)

- [Linking other AWS resources](https://developer.amazon.com/en-US/docs/alexa/hosted-skills/alexa-hosted-skills-personal-aws.html)
- [Setting up the email params](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-send-email-ses/)
- [API reference for sending the email](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-send-email-ses/)

Additional Resources

### Dependencies

- No dependencies required.

### Intents Utterances

- See: [Configuring the API for jobs](./Configure-API-for-Jobs.md)

### Notable Code Block w/Code Description

```js
// 1. Assume the role with STS
const sts = new aws.STS({ apiVersion: '2011-06-15' })
        const credentials = await sts
            .assumeRole(
                {
                    RoleArn: 'YOUR ALEXA ROLE ARN',
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
        // 2. Jobs are fetched
        let response = await logic.fetchJobsApi()
        addS3Object('dailyJobsReports', response.data)
        let strings = ''
        response.data.map((job, index) => {
            if (index < 3) {
                return (strings += `${job.employer_name} as a ${job.job_title}, `)
            }
        })
        // 3. Grabbing session storage to remember what jobs were fetched
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

        // 4. Grabbing email from Alexa users account
        const { serviceClientFactory, responseBuilder } = handlerInput


        try {
            //* fetching the user's email from the account
            const upsServiceClient = serviceClientFactory.getUpsServiceClient()
            const profileEmail = await upsServiceClient.getProfileEmail()
            //* if there is no profile with the associated account.
            if (!profileEmail) {
                const noEmailResponse = `It looks like you do not have an email set. You can set your email from the alexa companion app.`
                return responseBuilder.speak(noEmailResponse).getResponse()
            }

            //* 5. Make a new SES object with the assumed role credentials

            //* create a new SES instance
            const ses = new aws.SES({
                apiVersion: '2010-12-01',
                region: 'us-east-2',
                accessKeyId: credentials.Credentials.AccessKeyId,
                secretAccessKey: credentials.Credentials.SecretAccessKey,
                sessionToken: credentials.Credentials.SessionToken
            })

            //* async function to send the email and wait for a promise to be returned
            /**
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
                                <h4> Here are the job postings that you requested: </h4>
                                ${body.map(job => {
                                    return `<ul>
                                        <h3>${job.job_title}</h3>
                                        <img src=${job.employer_logo} width='75px' style='display: inline;'/> <h4>${job.employer_name}</h4>
                                        <p>${job.job_description}</p>
                                        <a href=${job.job_apply_link}>Apply Here!</a>
                                    </ul>`
                                })}
                           `
                            }
                        },

                        Subject: { Data: subject }
                    },
                    Source: 'YOUR SES VERIFIED EMAIL'
                }

                return await ses.sendEmail(params).promise()
            }

            //* send the email with the specified parameters
            sendEmail(profileEmail, response.data, 'Job Listings from TechPrep')

            //! if there are improper permissions. Sometimes they can be switched off if the skill is rebuilt/redeployed.
        } catch (error) {
            console.log(
                JSON.stringify('403 *******************************************', error)
            )
            if (error.statusCode === 403) {
                return responseBuilder
                    .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                    .withAskForPermissionsConsentCard(PERMISSIONS)
                    .getResponse()
            }
            console.log(JSON.stringify(error))
            const response = responseBuilder.speak(messages.ERROR).getResponse()
            return response
        }

        let speakOutput = ` I found a list of jobs for you, here are the first three,  ${strings} I emailed you the full list of jobs. `

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse()
```

### Notable Bugs and Issues that occurred

- Problem: Emails being recieved as undefined
- Solution: Make sure your job data is passed into the sendEmail function correctly.

- Problem: Permissions issues
- Solution:
  - 1. Make sure your ARN's are correct
  - 2. Make sure your role is configured properly
  - 3. Make sure your SES verified email is EXACTLY the same as it is in AWS. Even a capital letter will break it.

### Known bugs/issues

No known bugs at the time of writing this. Sometimes emails are sent to spam or junk.