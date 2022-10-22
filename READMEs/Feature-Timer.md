# Code Challenge Timer

## [Back to Table of Contents](./Table-of-Contents.md)

## User Story

> As a user I want Alexa to set timer to mimic the limited time available to complete w hiteboard interview.

## Resources

[TimerTutorial.md](./TimerTutorial.md)

[Dabble Labs GitHub](https://github.com/dabblelab/19-alexa-timers-example-skill/blob/master/lambda/custom/index.js)

[Dabble Labs Youtube](https://www.youtube.com/watch?v=2QpS2UtG2yQ&t=627s)

[Alexa Cookbook Github](https://github.com/alexa/alexa-cookbook/blob/master/feature-demos/skill-demo-timers/lambda/index.js)

___

## Intents & Utterances

> AMAZON.YesIntent
> - yes
> - yeah
> - sure
> - yes please

> AMAZON.NoIntent
> - no
> - nah
> - no way
> - no thanks

___

## Dependencies

> Axios

___

## Permissions

[Voice Permissions for Timers Resouce](https://developer.amazon.com/de-DE/docs/alexa/smapi/voice-permissions-for-timers.html)

> There are two sets of permissions for the use of timers; Skill-level Permission to create the timer, and Session-level Sermission to enable the timer to extend the session for the length of time for which the timer has been set.

> On skill launch, users are prompted to approve or deny permission to set timers at the app level. To do this, a Connections.SendRequest Directive is initiated by the skill, and processed by Alexa. Amazon requires this approval, and it is automatically prompted by Amazon. It cannot be changed by the developer.

```javascript
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
```

> After processing the Connections.SendRequest Directive, a Connections.Response is sent by Alexa containing the ACCEPTED, DENIED, or NOT_ANSWERED status. After the ConnectionResponseHandler interprets the response, the app can then be launched.

> The following code is excerpted from the ConnectionResponseHandler.js

```javascript
switch (status) {
            case 'ACCEPTED':
                handlerInput.responseBuilder
                    .speak('Hello, welcome to Tech Prep! You can ask for a code challenge, practice interview questions, or get a list of recent job postings. Which will it be?')
                    .reprompt('Hello, welcome to Tech Prep! You can ask for a code challenge, practice interview questions, or get a list of recent job postings. Which will it be?')
                break;
            case 'DENIED':
                handlerInput.responseBuilder
                    .speak('I\'m sorry but without your permission, I can\'t launch the app for the first time.')
                break;
            case 'NOT_ANSWERED':
                break;
            default:
                handlerInput.responseBuilder
                    .speak('Now that I\'ve got your permission, let\'s get started.')
                    .reprompt('Would you like to get started?');
        }
```

___

## Setting a timer

[Timer API Resource](https://developer.amazon.com/en-US/docs/alexa/smapi/alexa-timers-api-reference.html)

> As soon as the app opens, the API Access Token is is collected from the handlerInput.requestEnvelope, which will be used later in the Timer API call.

```javascript
let accessToken;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
        )
    },
```

> After a user prompts Alexa for a code challenge, she responds with the code challenge as well a request to set a timer. At this point, any timers that have already been created by the skill will be deleted.
  
    Delete from https://api.amazonalexa.com/v1/alerts/timers
    Authorization: Bearer <<apiAccessToken>>
    Content-Type: application/json

```javascript
async handle(handlerInput) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }
```

```javascript
const apiEndpoint = 'https://api.amazonalexa.com/v1/alerts/timers'
await axios.delete(apiEndpoint, options)
```

> The user has the option to approve or deny the timer, which is the session-level permission.

```javascript
 return handlerInput.responseBuilder
            .speak(
                `${speakOutput} <break time="1s"/> Would you like me to set a 30 minute timer for this challenge?`
            )
            .reprompt()
            .getResponse()
        }
    }
```

> If the user approves, a timer payload is sent to the Alexa Timers API and the timer is set. The user is then given two options; they may either ask for a hint or request an alternate code challenge.

>Excepted from the timerPayload.js
```javascript
const timerPayload = {
  "duration": "PT30S",
  "timerLabel": "challenge",
  "creationBehavior": {
     "displayExperience": {
         "visibility": "VISIBLE" | "HIDDEN"
    }
 },
  "triggeringBehavior": {
    "operation": {
      "type": "ANNOUNCE",
      "textToAnnounce": [{
         "locale": "en-US",
         "text": "Ding Ding Ding! Time's up. How did it go?"
    }]
    },
    "notificationConfig": {
      "playAudible": false
    }
  }
}

module.exports = timerPayload;
```

> Excerpted from index.js

```javascript
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
```

> If the users declines the timer, Alexa suggests to the user that they limit the time they spend on the code challenge to 30 minutes. The user is then given two options; they may either ask for a hint or request an alternate code challenge.

```javascript
 if (
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent'
        ) {
            handlerInput.responseBuilder
                .speak(`Okay, try to spend 30 minutes max on this challenge. ${speechResponse}`)
                .reprompt(
                    'Ask for a hint if you need it, or say next challenge to get a new challenge.'
                )
        }

```
> Export all intent handlers

```javascript
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
```
