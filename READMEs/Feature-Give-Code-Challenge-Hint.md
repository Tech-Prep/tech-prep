# Get a hint for the Code Challenge

## User Story - Purpose of Component
As a user I would like to be able to ask Alexa for a hint to solving my code challenge.
___
## Resources used in building this:
https://developer.amazon.com/en-US/docs/alexa/custom-skills/standard-built-in-intents.html
___
## Intents
> AMAZON.RepeatIntent
___
## Utterances
>- repeat code problem
>- tell me the code problem
>- what was that code problem
>- give me the code problem again
>- repeat the code problem
>- repeat problem
>- code challenge again
>- tell me the code challenge
>- what was that code challenge
>- give me the code challenge again
>- repeat code challenge
>- repeat that
>- tell me again
>- what
>- repeat challenge
>- I didn't hear that
>- I did not get that
>- I did not hear that
>- I didn't get that
>- what was that
>- say that again
>- repeat
___
## Files from which this code is excerpted:
[index.js]()
___
## Get a hint for the Code Challenge from the GetHintIntent:

1. Navigate to: Build tab → Intents → Add Intent
    - Add custom intent: GetHintIntent
2. Click the edit button next to the newly added intent, and input the utterances for what the user may say to invoke the intent
3. Create a GetHintIntentHandler in the index.js
4. Destructure the hints attribute from the session attributes
5. Since each coding problem may contain multiple hints, they must be randomly selected within each problem's hint array. We chose to use
```[Math.floor(Math.random() * hints.length)]``` to generate that random number, and then assigned the randomly chosen hint to a variable which was passed as an argument into the .speak method.

```javascript
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
```

5. Inside the index.js exports.handler section, under .addRequestHandlers, add the GetHintIntentHandler function. (after the GetChallangeIntentHandler)

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

___

> Note: After the session has closed, if the user wants the last challenge's hint to be repeated again, they can open the app and immediately call for the hint.
___
## Known bugs or issues:

> Note: We recognize that because the hints are assigned randomly, we have not yet implemented a way to ensure that the same hint is not called twice.

