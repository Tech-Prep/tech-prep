/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const { addS3Object, getS3Object, deleteS3Object } = require('./s3');
const axios = require('axios');

let accessToken;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {permissions} = handlerInput.requestEnvelope.context.System.user;
        if (!permissions) { 
          handlerInput.responseBuilder
            .speak('To launch the app for the first time, I need permission to set timers.')
            .addDirective({
                "type": "Connections.SendRequest",
                "name": "AskFor",
                "payload": {
                    "@type": "AskForPermissionsConsentRequest",
                    "@version": "2",
                    "permissionScopes": [
                        {
                        "permissionScope": "alexa::alerts:timers:skill:readwrite",
                        "consentLevel": "ACCOUNT"
                        }
                        ]
                    },
                    "token": ""
            })
        } else {
            const speakOutput = 'Hello, welcome to Tech Prep! You can ask for a code challenge, practice interview questions, or get a list of recent job postings. Which will it be?';
            handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        return handlerInput.responseBuilder
            .getResponse();
    }
}

const ConnectionsResponseHandler = require('./ConnectionsResponseHandler');

const GetChallengeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetChallengeIntent';
    },
    async handle(handlerInput) {
        const options = {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            };
        const apiEndpoint = "https://api.amazonalexa.com/v1/alerts/timers";
        await axios.delete(apiEndpoint, options)
        let challengesArray = await getS3Object('challenges.json');
        const chosenChallenge = challengesArray[Math.floor(Math.random() * challengesArray.length)];
        const speakOutput = chosenChallenge.description;
        const challengeSolution = chosenChallenge.solution;
        
        addS3Object('chosenChallenge.json', chosenChallenge);
        
        let {attributesManager} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        
        sessionAttributes.chosenChallenge = chosenChallenge;
        sessionAttributes.lastSpeech = speakOutput;
        
        return handlerInput.responseBuilder
            .speak(`${speakOutput} <break time="1s"/> Would you like me to set a 30 minute timer for this challenge?`)
            .reprompt()
            .getResponse();
    }
};

const timerPayload = require('./timerPayload');

const YesNoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
    },
    async handle(handlerInput) {
        if (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent') {
            const speakOutput = "I've set a 30 minute timer for you.";
            const options = {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            };
            const apiEndpoint = "https://api.amazonalexa.com/v1/alerts/timers";
            await axios.post(apiEndpoint, timerPayload, options)
                .then(response => {
                    handlerInput.responseBuilder
                        .speak(speakOutput)
                        .reprompt('Ask for a hint if you need it, or say next challenge to get a new challenge.');
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent') {
            handlerInput.responseBuilder
                .speak('Okay, try to spend 30 minutes max on this challenge.')
                .reprompt('Ask for a hint if you need it, or say next challenge to get a new challenge.')
        }
        return handlerInput.responseBuilder
            .getResponse();
    }
}

const GetQuestionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetQuestionIntent';
    },
    async handle(handlerInput) { 
        const options = {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            };
        const apiEndpoint = "https://api.amazonalexa.com/v1/alerts/timers";
        await axios.delete(apiEndpoint, options)

        await deleteS3Object('chosenChallenge.json');
        
        let questionsArray = await getS3Object('questions.json');
        const speakOutput = questionsArray[Math.floor(Math.random() * questionsArray.length)];
        
        let {attributesManager} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();
        
        sessionAttributes.lastSpeech = speakOutput;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Say next question to get a new question.')
            .getResponse();
        
    }
};

const GetHintIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetHintIntent';
    },
    async handle(handlerInput) {
        
        let speakOutput = '';
        
        try {
            let chosenChallenge = await getS3Object('chosenChallenge.json');
            speakOutput = chosenChallenge.hints[Math.floor(Math.random() * chosenChallenge.hints.length)];
            
        } catch (error) {
            speakOutput = 'Please ask for a code challenge first';
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
  }
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) ===   'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
   },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        const { lastSpeech } = sessionAttributes;
        const speakOutput = lastSpeech;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
  }
};

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
        GetQuestionIntentHandler,
        GetChallengeIntentHandler,
        YesNoIntentHandler,
        GetHintIntentHandler,
        RepeatIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();