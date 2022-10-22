/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core')
const { addS3Object, getS3Object, deleteS3Object } = require('./s3')
const axios = require('axios')
const logic = require('./logic')
const aws = require('aws-sdk')

const messages = {
    WHAT_DO_YOU_WANT: 'What do you want to ask?',
    NOTIFY_MISSING_PERMISSIONS:
        'Please enable Customer Profile permissions in the Amazon Alexa app.',
    NAME_MISSING:
        'You can set your name either in the Alexa app under calling and messaging, or you can set it at Amazon.com, under log-in and security.',
    EMAIL_MISSING:
        'You can set your email at Amazon.com, under log-in and security.',
    NUMBER_MISSING:
        'You can set your phone number at Amazon.com, under log-in and security.',
    NAME_AVAILABLE: 'Here is your full name: ',
    EMAIL_AVAILABLE: 'Here is your email address: ',
    NUMBER_AVAILABLE: 'Here is your phone number: ',
    ERROR: 'Uh Oh. Looks like something went wrong.',
    API_FAILURE:
        'There was an error with the Alexa Customer Profile API. Please try again.',
    GOODBYE: 'Bye! Thanks for using the Sample Alexa Customer Profile API Skill!',
    UNHANDLED: "This skill doesn't support that. Please ask something else.",
    HELP: 'You can use this skill by asking something like: whats my name?'
}

const PERMISSIONS = ['alexa::profile:email:read']

let accessToken;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
        )
    },
    handle(handlerInput) {
        const { permissions } = handlerInput.requestEnvelope.context.System.user
        if (!permissions) {
            handlerInput.responseBuilder
                .speak(
                    'To launch the app for the first time, I need permission to set timers.'
                )
                .addDirective({
                    type: 'Connections.SendRequest',
                    name: 'AskFor',
                    payload: {
                        '@type': 'AskForPermissionsConsentRequest',
                        '@version': '2',
                        permissionScopes: [
                            {
                                permissionScope: 'alexa::alerts:timers:skill:readwrite',
                                consentLevel: 'ACCOUNT'
                            }
                        ]
                    },
                    token: ''
                })
        } else {
            const speakOutput =
                'Hello, welcome to Tech Prep! You can ask for a code challenge, practice interview questions, or get a list of recent job postings. Which will it be?'
            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse()
        }
        return handlerInput.responseBuilder.getResponse()
    }
}

const ConnectionsResponseHandler = require('./ConnectionsResponseHandler')

const FetchJobsIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'FetchJobsIntent'
        )
    },
    async handle(handlerInput) {
        const sts = new aws.STS({ apiVersion: '2011-06-15' })
        // console.log('LOGGING STS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', sts);
        const credentials = await sts
            .assumeRole(
                {
                    RoleArn: 'YOUR ARN',
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

        let response = await logic.fetchJobsApi()
        addS3Object('dailyJobsReports', response.data)
        let strings = ''
        response.data.map((job, index) => {
            if (index < 3) {
                return (strings += `${job.employer_name} as a ${job.job_title}, `)
            }
        })
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

        // console.log('EMAIL INTENT HANDLER INSIDE HANDLE #########################################');
        const { serviceClientFactory, responseBuilder } = handlerInput

        //* making the request to send an email with Alexa credentials
        // 1. Assume the AWS resource role using STS AssumeRole Action

        // console.log('LOGGING CREDENTIALS-----------', credentials);

        try {
            //* fetching the user's email from the account
            const upsServiceClient = serviceClientFactory.getUpsServiceClient()
            const profileEmail = await upsServiceClient.getProfileEmail()
            //* if there is no profile with the associated account.
            if (!profileEmail) {
                const noEmailResponse = `It looks like you do not have an email set. You can set your email from the alexa companion app.`
                return responseBuilder.speak(noEmailResponse).getResponse()
            }

            //* 2. Make a new SES object with the assumed role credentials

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
                    Source: 'TechPrepDevs@gmail.com'
                }

                console.log(
                    'SESSION ATTRIBUTES ++++++++++++++++++++++++++++++++++++++++++++++:',
                    response.data
                )
                console.log(
                    'JACKS SENDEMAIL CONSOLE LOG ---------------------------',
                    params
                )
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
    }
}

const EmailIntentHandler = {
    canHandle(handlerInput) {
        console.log(
            'EMAIL INTENT HANDLER INSIDE CAN HANDLE--------------------------------'
        )
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'EmailIntent'
        )
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

        console.log(
            'EMAIL INTENT HANDLER INSIDE HANDLE #########################################'
        )
        const { serviceClientFactory, responseBuilder } = handlerInput

        //* making the request to send an email with Alexa credentials
        // 1. Assume the AWS resource role using STS AssumeRole Action

        const sts = new aws.STS({ apiVersion: '2011-06-15' })
        console.log(
            'LOGGING STS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            sts
        )
        const credentials = await sts
            .assumeRole(
                {
                    RoleArn: 'YOUR ARN',
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

        console.log('LOGGING CREDENTIALS-----------', credentials)
        console.log(
            'SESSION ATTRIBUTES ++++++++++++++++++++++++++++++++++++++++++++++:',
            sessionAttributes
        )

        try {
            //* fetching the user's email from the account
            const upsServiceClient = serviceClientFactory.getUpsServiceClient()
            const profileEmail = await upsServiceClient.getProfileEmail()
            //* if there is no profile with the associated account.
            if (!profileEmail) {
                const noEmailResponse = `It looks like you do not have an email set. You can set your email from the alexa companion app.`
                return responseBuilder.speak(noEmailResponse).getResponse()
            }

            //* 2. Make a new SES object with the assumed role credentials

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
                    Source: 'TechPrepDevs@gmail.com'
                }

                // console.log('SESSION ATTRIBUTES ++++++++++++++++++++++++++++++++++++++++++++++:', sessionAttributes);
                console.log(
                    'JACKS SENDEMAIL CONSOLE LOG ---------------------------',
                    params
                )
                return await ses.sendEmail(params).promise()
            }

            //* send the email with the specified parameters
            sendEmail(profileEmail, sessionAttributes, 'Solution Code TEST')

            const speechResponse = `Email sent to:, ${profileEmail}`
            return responseBuilder.speak(speechResponse).getResponse()

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
    }
}

const GetChallengeIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetChallengeIntent'
        )
    },
    async handle(handlerInput) {
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }

        let profileEmail;

        try {
            const { serviceClientFactory, responseBuilder } = handlerInput
            //* fetching the user's email from the account
            const upsServiceClient = serviceClientFactory.getUpsServiceClient();
            profileEmail = await upsServiceClient.getProfileEmail();
            //* if there is no profile with the associated account.
            if (!profileEmail) {
                const noEmailResponse = `It looks like you do not have an email set. You can set your email from the alexa companion app.`
                return responseBuilder.speak(noEmailResponse).getResponse()
            }
        } catch (error) {
            console.log(
                JSON.stringify('403 *******************************************', error)
            )
            if (error.statusCode === 403) {
                return handlerInput.responseBuilder
                    .speak(messages.NOTIFY_MISSING_PERMISSIONS)
                    .withAskForPermissionsConsentCard(PERMISSIONS)
                    .getResponse()
            }
            console.log(JSON.stringify(error))
            const response = handlerInput.responseBuilder.speak(messages.ERROR).getResponse()
            return response
        }

        const apiEndpoint = 'https://api.amazonalexa.com/v1/alerts/timers'
        await axios.delete(apiEndpoint, options)
        let challengesArray = await getS3Object('challenges.json')
        const chosenChallenge =
            challengesArray[Math.floor(Math.random() * challengesArray.length)]
        const speakOutput = chosenChallenge.description
        const challengeSolution = chosenChallenge.solution
        

        addS3Object('chosenChallenge.json', chosenChallenge)

        let { attributesManager } = handlerInput
        let sessionAttributes = attributesManager.getSessionAttributes()

        sessionAttributes.chosenChallenge = chosenChallenge
        sessionAttributes.lastSpeech = speakOutput
        sessionAttributes.profileEmail = profileEmail;

        return handlerInput.responseBuilder
            .speak(
                `${speakOutput} <break time="1s"/> Would you like me to set a 30 minute timer for this challenge?`
            )
            .reprompt()
            .getResponse()
        }
    }
    
    const timerPayload = require('./timerPayload')
    
    const YesNoIntentHandler = {
        canHandle(handlerInput) {
            return (
                Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
                (Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'AMAZON.YesIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent')
                )
            },
            async handle(handlerInput) {
                
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
        const speechResponse = `Solution sent to: ${sessionAttributes.profileEmail}`

        let profileEmail;

        if (
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
        ) {
            const speakOutput = "I've set a 30 minute timer for you."
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
            const apiEndpoint = 'https://api.amazonalexa.com/v1/alerts/timers'
            await axios
                .post(apiEndpoint, timerPayload, options)
                .then(response => {
                    handlerInput.responseBuilder
                        .speak(speakOutput + ' ' + speechResponse)
                        .reprompt(
                            'Ask for a hint if you need it, or say next challenge to get a new challenge.'
                        )
                })
                .catch(error => {
                    console.log(error)
                })
        }
        if (
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent'
        ) {
            handlerInput.responseBuilder
                .speak(`Okay, try to spend 30 minutes max on this challenge. ${speechResponse}`)
                .reprompt(
                    'Ask for a hint if you need it, or say next challenge to get a new challenge.'
                )
        }


        console.log(
            'EMAIL INTENT HANDLER INSIDE HANDLE #########################################'
        )
        

        //* making the request to send an email with Alexa credentials
        // 1. Assume the AWS resource role using STS AssumeRole Action

        const sts = new aws.STS({ apiVersion: '2011-06-15' })
        console.log(
            'LOGGING STS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            sts
        )
        const credentials = await sts
            .assumeRole(
                {
                    RoleArn: 'YOUR ARN',
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

        console.log('LOGGING CREDENTIALS-----------', credentials)
        console.log(
            'SESSION ATTRIBUTES ++++++++++++++++++++++++++++++++++++++++++++++:',
            sessionAttributes
        )

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
                Source: 'TechPrepDevs@gmail.com'
            }

            // console.log('SESSION ATTRIBUTES ++++++++++++++++++++++++++++++++++++++++++++++:', sessionAttributes);
            console.log(
                'JACKS SENDEMAIL CONSOLE LOG ---------------------------',
                params
            )
            return await ses.sendEmail(params).promise()
        }

        //* send the email with the specified parameters
        sendEmail(sessionAttributes.profileEmail, sessionAttributes, 'TechPrep Solution Code')

        //   const speechResponse = `Solution sent to:, ${profileEmail}`
        //   return handlerInput.responseBuilder.speak(speechResponse).getResponse()

        return handlerInput.responseBuilder
            .getResponse();

        //! if there are improper permissions. Sometimes they can be switched off if the skill is rebuilt/redeployed.
    }
};

const GetQuestionIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetQuestionIntent'
        )
    },
    async handle(handlerInput) {
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const apiEndpoint = 'https://api.amazonalexa.com/v1/alerts/timers'
        await axios.delete(apiEndpoint, options)

        await deleteS3Object('chosenChallenge.json')

        let questionsArray = await getS3Object('questions.json')
        const speakOutput =
            questionsArray[Math.floor(Math.random() * questionsArray.length)]

        let { attributesManager } = handlerInput
        let sessionAttributes = attributesManager.getSessionAttributes()

        sessionAttributes.lastSpeech = speakOutput

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Say next question to get a new question.')
            .getResponse()
    }
}

const GetHintIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetHintIntent'
        )
    },
    async handle(handlerInput) {
        let speakOutput = ''

        try {
            let chosenChallenge = await getS3Object('chosenChallenge.json')
            speakOutput =
                chosenChallenge.hints[
                Math.floor(Math.random() * chosenChallenge.hints.length)
                ]
        } catch (error) {
            speakOutput = 'Please ask for a code challenge first'
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse()
    }
}

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
            'AMAZON.RepeatIntent'
        )
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
        const { lastSpeech } = sessionAttributes
        const speakOutput = lastSpeech
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse()
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
        )
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?'

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse()
    }
}

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            (Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'AMAZON.CancelIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) ===
                'AMAZON.StopIntent')
        )
    },
    handle(handlerInput) {
        const speakOutput = 'Good luck dev! You got this!'

        return handlerInput.responseBuilder.speak(speakOutput).getResponse()
    }
}
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) ===
            'AMAZON.FallbackIntent'
        )
    },
    handle(handlerInput) {
        const speakOutput = "Sorry, I don't know about that. Please try again."

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse()
    }
}
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
            'SessionEndedRequest'
        )
    },
    handle(handlerInput) {
        console.log(
            `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
        )
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse() // notice we send an empty response
    }
}
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        )
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope)
        const speakOutput = `You just triggered ${intentName}`

        return (
            handlerInput.responseBuilder
                .speak(speakOutput)
                //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse()
        )
    }
}

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput, error) {
        const speakOutput =
            'Sorry, I had trouble doing what you asked. Please try again.'
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`)

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse()
    }
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConnectionsResponseHandler,
        GetQuestionIntentHandler,
        EmailIntentHandler,
        FetchJobsIntentHandler,
        GetChallengeIntentHandler,
        YesNoIntentHandler,
        GetHintIntentHandler,
        RepeatIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda()
