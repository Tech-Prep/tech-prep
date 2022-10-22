# Get a Code Challenge

The following details the steps that we took to reach our MVP of an Alexa skill that would speak a single code challenge to a user.

## Resources used in building this:

> Our team began by building a basic Alexa skill using the following tutorial:
[Create Your Own Alexa Skill from Scratch](https://www.youtube.com/watch?v=lc9A_6Uz_t4)

## User Story - Purpose of Component

> As a user, I want to be able to ask Alexa for a code challenge and have her respond with a random code challenge.

**Feature Tasks**

> - User makes an utterance to Alexa Device to start the skill
> - Alexa Device sends the utterance to Alexa Service
> - Alexa sends JSON request to Lambda Function
> - Lambda function sends JSON response to Alexa Service
> - Alexa Processes text and sends to the Alexa device
> - Device speaks a random code challenge from the array of code challenges

**Acceptance Tests**

> - User makes an utterance to Alexa Device to start the skill
> - Alexa Device sends the utterance to Alexa Service
> - Alexa sends JSON request to Lambda Function
> - Lambda function sends JSON response to Alexa Service
> - Alexa Processes text and sends to the Alexa device
> - Device speaks a random code challenge from the array of code challenges


## Intents

> getCodeChallengeIntent

## Utterances

> - code
> - codechallenge
> - get code challenge

## Code with Code Description

> We created a challenges.js file to hold the array of questions to which we would point the getChallengesIntentHandler. Eventually we added more dtata to this file, and eventually this information was stored within the S3 bucket. The original file's contents looked like this:

```javscript
module.exports = [
    "Write a function to find the sum of all the odd numbers in a binary search tree.",
    "Write a max stack function that returns the largest element in a stack.",
    "Write a function that reverses a linked list.",
    "Write a function to validate whether or not a linked list is a palindrome. Your return value should be a boolean.",
    "Write a function that takes in a binary tree and log the value of each node within the tree.",
    "Write a function to add up the sum of each row in a matrix of arbitrary size, and return an array with the appropriate values.",
    "Write a function that accepts an integer, and returns the nth number in the Fibonacci sequence."
];
```

> We modified the HelloWorldIntentHandler to become the GetChallengeIntentHandler

```javascript
const GetChallengeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetChallengeIntent';
    },
    handle(handlerInput) {
        const speakOutput = challenges[Math.floor(Math.random() * challenges.length)];
        // const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Would you like to try another?')
            .getResponse();
    }
};
```
