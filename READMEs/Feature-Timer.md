# Code Challenge Timer

## Resources

[TimerTutorial.md](./TimerTutorial.md)

[Dabble Labs GitHub](https://github.com/dabblelab/19-alexa-timers-example-skill/blob/master/lambda/custom/index.js)

[Dabble Labs Youtube](https://www.youtube.com/watch?v=2QpS2UtG2yQ&t=627s)

[Alexa Cookbook Github](https://github.com/alexa/alexa-cookbook/blob/master/feature-demos/skill-demo-timers/lambda/index.js)

___

## Intents

___

## Utterances

___

## Permissions

[Voice Permissions for Timers Resouce](https://developer.amazon.com/de-DE/docs/alexa/smapi/voice-permissions-for-timers.html)

Two sets of permissions for the use of timers. Big picture, skill-level permission to create create the timer and session-level permission to "extend" the session.

On skill launch, users are prompted to approve or deny permission to set timers at the app level.

To do this: A Connections.SendRequest Directive is initiated by the skill and processed by Alexa. (This approval is prompted by amazon and cannot be changed by the developer) After processing, a Connections.Response is sent by Alexa containing the ACCEPTED, DENIED, or NOT_ANSWERED status.

ConnectionResponseHandler interprets the response and continues app functionality accordingly.

___ 
## Setting a timer
[Timer API Resource](https://developer.amazon.com/en-US/docs/alexa/smapi/alexa-timers-api-reference.html)

After a user prompts alexa for a code challenge, she responds with the code challenge as well a request to set a timer.

The user has the option to approve or deny the timer (session-level permissions)

If they approve, a timer payload is sent to the Alexa Timers API and the timer is set. User is then prompted to ask for a hint or the next code challenge.


If they deny the timer, user is prompted to ask for a hint or the next code challenge.

XAVIER, ADD DELETE CALL INFORMATION

```javascript
POST to https://api.amazonalexa.com/v1/alerts/timers
Authorization: Bearer <<apiAccessToken>>
Content-Type: application/json
```



<!-- _____________________________________ -->

/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const challenges = require('./challenges');
// need to import axios to make timer API call
const axios = require('axios');
 // import checkAppPermissions
const checkAppPermissions = require('./checkAppPermissions');

// needed to access timer API
let accessToken = '';

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        // reassigning accessToken value on an in-session basis
        accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        // checking app level permissions
        // read permissions from the users account
        const {permissions} = handlerInput.requestEnvelope.context.System.user;
        if (!permissions) { // if user has not yet given permission to access timers
          handlerInput.responseBuilder
            .speak('This skill needs permission to set timers.')
            // Alexa-driven permission consent directive (developers have no control over this)
            .addDirective({
            type: "Connections.SendRequest",
            name: "AskFor",
            payload: {
                "@type": "AskForPermissionsConsentRequest",
                "@version": "2",
                "permissionScope": "alexa::alerts:timers:skill:readwrite"
            },
            token: "verifier"
        });

            // checkAppPermissions(handlerInput); // voice request for permissions
        } else { // continue using app
            const speakOutput = 'Welcome to tech prep, say code to get a code challenge.';
            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
        }
        return handlerInput.responseBuilder
            .getResponse();
    }
};


// interpreting connection response to permission request - export at bottom of file
const ConnectionsResponseHandler = require('./ConnectionsResponseHandler');
// const ConnectionsResponseHandler = {
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Connections.Response';
//     },
//     handle(handlerInput) {
//         const {permissions} = handlerInput.requestEnvelope.context.System.user;
//         const status = handlerInput.requestEnvelope.request.payload.status;
//         if (!permissions) { // if user has not yet given permission to access timers
//           handlerInput.responseBuilder
//             .speak('This skill needs permission to set timers.')
//             .addDirective({
//                 type: "Connections.SendRequest",
//                 name: "AskFor",
//                 payload: {
//                     "@type": "AskForPermissionsConsentRequest",
//                     "@version": "2",
//                     "permissionScope": "alexa::alerts:timers:skill:readwrite"
//                 },
//                 token: "verifier"
//             }).getResponse();
//         }
//         switch (status) {
//             case 'ACCEPTED':
//                 handlerInput.responseBuilder
//                     .speak('Great, now what would you like to do?')
//                     .reprompt('Great, now what would you like to do?')
//                 break;
//             case 'DENIED':
//                 handlerInput.responseBuilder
//                     .speak('Without your permission, I can\'t set timers. Try to spend 30 minutes max on each code challenge.')
//                 break;
//             case 'NOT_ANSWERED':
//                 break;
//             default:
//                 handlerInput.responseBuilder
//                     .speak('Now that I\'ve got your permission, let\'s get started.')
//                     .reprompt('Would you like to get started?');
//         }
//         return handlerInput.responseBuilder
//             .getResponse();
//     }
// };

// payload to be sent to the timer API
let timerPayload = {
  "duration": "PT20S",
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
         "text": "Time's up. How did it go?"
    }]
    },
    "notificationConfig": {
      "playAudible": false
    }
  }
}

const GetChallengeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetChallengeIntent';
    },
    async handle(handlerInput) {
        const speakOutput = challenges[Math.floor(Math.random() * challenges.length)];
        handlerInput.responseBuilder
            .speak(speakOutput);
        const {permissions} = handlerInput.requestEnvelope.context.System.user;
        if (permissions) {
            return handlerInput.responseBuilder
                // prompt code challenge and asks for timer permission to extend session
                .speak(speakOutput + ' ' + 'Would you like me to set a 30 minute timer for this challenge?')
                .reprompt()
                .getResponse();
        }
    }
}

// handles yes/no response to session-level timer permissions request - export at bottom of this file
const YesNoIntentHandler = {
    canHandle(handlerInput) {
        // grabbing the appropriate intent
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
    },
    async handle(handlerInput) {
        // if user says yes to permissions
        if (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent') {
            const speakOutput = "I've set a 30 minute timer for you.";
            // headers needed to make timer API call
            const options = {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            };
            const apiEndpoint = "https://api.amazonalexa.com/v1/alerts/timers";
            // making call to timer API
            await axios.post(apiEndpoint, timerPayload, options)
                .then(response => {
                    handlerInput.responseBuilder
                        .speak(speakOutput)
                        .reprompt('Ask for a hint if you need it or say next to get the next challenge.');
                })
                .catch(error => {
                    console.log(error);
                });
        }
        // if user says no to permission - skill is still functional
        if (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent') {
            handlerInput.responseBuilder
                .speak('Okay, try to spend 30 minutes max on this challenge.')
                .reprompt('Ask for a hint if you need it or say next to get the next challenge.')
        }
        return handlerInput.responseBuilder
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConnectionsResponseHandler,
        GetChallengeIntentHandler,
        YesNoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    // required to access timer API
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();

    