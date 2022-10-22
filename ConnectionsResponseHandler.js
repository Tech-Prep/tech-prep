const Alexa = require('ask-sdk-core');

const ConnectionsResponseHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Connections.Response';
    },
    handle(handlerInput) {
        const {permissions} = handlerInput.requestEnvelope.context.System.user;
        const status = handlerInput.requestEnvelope.request.payload.status;
        if (!permissions) { // if user has not yet given permission to access timers
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
            }).getResponse();
        }
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
        return handlerInput.responseBuilder
            .getResponse();
    }
};

module.exports = ConnectionsResponseHandler;