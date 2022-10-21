# Code Walk Through

## Repeat the Code Challenge from the GetChallengeIntentHandler:
SOURCE: <https://medium.com/alexa-skills-dev/how-to-store-data-in-your-alexa-skills-6dc17f2db9b4>
            
SOURCE: <https://medium.com/@udaydhadve/how-to-tell-alexa-to-remember-and-repeat-a-response-in-your-alexa-custom-skill-part-1-of-2-db69bbd3df41#:~:text=RepeatIntent%20which%20is%20already%20provided,to%20add%20a%20new%20intent>.

>1. Navigate to: Build tab → Intents → Add Intent
>  - Add: AMAZON.RepeatIntent
>  - Click the edit button next to the newly added intent, and add the utterances for what the user may say to invoke the intent

>2. Within the intentHandler that produces the phrase that will be reated by Alexa, i.e. the GetChallengeIntentHandler: 
>- Use object deconstruction for the attributesManager from the handlerInput
>- Declare a variable for sessionAttributes and use the method getSessionAttributes on the attributesManager
>- Create a key/value pair on the sessionAttributes with the key being lastSpeech and the value being speakOutput
>- Use the method setSessionAttributes on the attributesManager, and pass in sessionAttributes as the argument.

```javascript

        let {attributesManager} = handlerInput;
        let sessionAttributes = attributesManager.getSessionAttributes();

        sessionAttributes.lastSpeech = speakOutput;

        attributesManager.setSessionAttributes(sessionAttributes);

```


>3. Bring the RepeatIntentHandler into the index.js
>4. Destructure the 'lastSpeech' attribute from the session attributes

```javascript

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

```

> 5. At the bottom of the index.js, inside the index.js exports.handler section called .addRequestHandlers, add the RepeatIntentHandler. Make sure that it is added in the order in which the document is read. 

```javascript
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
```
