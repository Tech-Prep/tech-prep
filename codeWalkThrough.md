# Code Walk Through

## Repeat the Code Challenge from the GetChallengeIntentHandler:

1. Navigate to: Build tab → Intents → Add Intent

    - Add: AMAZON.RepeatIntent
    - Click the edit button next to the newly added intent, and input options for what the user may say to invoke the intent

2. Within the intentHandler (i.e., GetChallengeIntentHandler) where the RepeatIntent function is to be used,

    - Add object deconstruct the attributesManager from the handlerInput

    - Declare a variable for sessionAttributes and use the method getSessionAttributes on the attributesManager

    - Create a key/value pair on the sessionAttributes with the key being lastSpeech and the value being speakOutput

    - Use the method setSessionAttributes on the attributesManager, and pass in sessionAttributes as the argument.

CODE START:

        let {attributesManager} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();

        sessionAttributes.lastSpeech = speakOutput;

        attributesManager.setSessionAttributes(sessionAttributes);

CODE END:

SOURCE: <https://medium.com/alexa-skills-dev/how-to-store-data-in-your-alexa-skills-6dc17f2db9b4>

1. Bring the RepeatIntentHandler function into the index.js

2. Destructure the 'lastSpeech' attribute from the session attributes

CODE START:

        const RepeatIntentHandler = {
          canHandle(handlerInput) {
          return Alexa.getRequestType(handlerInput.requestEnvelope) ===   'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
        },
        handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        const { lastSpeech } = sessionAttributes;
        const speakOutput = lastSpeech;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
          }
        };

CODE END:

1. Inside the index.js exports.handler section, under .addRequestHandlers, add the RepeatIntentHandler function. (after the GetChallangeIntentHandler)

SOURCE:

<https://medium.com/@udaydhadve/how-to-tell-alexa-to-remember-and-repeat-a-response-in-your-alexa-custom-skill-part-1-of-2-db69bbd3df41#:~:text=RepeatIntent%20which%20is%20already%20provided,to%20add%20a%20new%20intent>.

## Get a hint for the Code Challenge from the GetHintIntent:

1. Navigate to: Build tab → Intents → Add Intent

    - Add custom intent: GetHintIntent

2. Click the edit button next to the newly added intent, and input options for what the user may say to invoke the intent

3. Create a GetHintIntentHandler function in the index.js

4. Destructure the hints attribute from the session attributes

CODE START:

        const GetHintIntentHandler = {
          canHandle(handlerInput) {

        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetHintIntent';
        },
        handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        const { hints } = sessionAttributes;
        const speakOutput = hints[Math.floor(Math.random() * hints.length)];
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
          }
        };

CODE END:

1. Inside the index.js exports.handler section, under .addRequestHandlers, add the GetHintIntentHandler function. (after the GetChallangeIntentHandler)
