# Get Recent Software Developer Jobs

## [Back to Table of Contents](./Table-of-Contents.md)

## Developer Story - Purpose of Component

> As a developer, I want to incorporate an API into the app to increase its functionality.
___

## Resources

**Main Resources**

[Guide #1: Incorporating an API for Alexa by using Axios](https://dev.to/awedis/alexa-api-calls-using-axios-4ej1)

[API for job listings](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)

**Aditional Resources**

[Guide #2: Incorporating an API for Alexa by using Axios](https://whatdidilearn.info/2018/09/23/how-to-call-external-apis-from-alexa-skill.html)

[SMAPI - skill management API (requires permissions)](https://developer.amazon.com/en-US/docs/alexa/smapi/smapi-overview.html)

[Accessing external APIs](https://www.youtube.com/watch?v=S4Mz_8f8nzg)

[Zero to Hero Github](https://github.com/alexa-samples/skill-sample-nodejs-zero-to-hero/tree/master/07)

[Request response (uses https:)](https://developer.amazon.com/blogs/alexa/post/4a46da08-d1b8-4d8e-9277-055307a9bf4a/alexa-skill-recipe-update-call-and-get-data-from-external-apis)

[Github resource API](https://github.com/ck3g/alexa-skill-how-tos/tree/master/how-to-call-external-apis)

___

### Dependencies

> Axios
___

### Intents

> fetchJobsIntent
___

### Utterances

> - positions
> - jobs
> - search job postings
> - search job listings
> - job
> - find me a job
> - find job listings
>
___

## Code with Line-by-Line Descriptions

### FetchJobsIntentHandler

> Note: At the top if the index.js file, be sure to require in the logic.js file like this:

```javascript
const logic = require('./logic');
```

> The FetchJobsIntentHandler lives in the index.js. It is used to interact with the API calling function (logic.js) and AlexaIt is activated when a user activates the fetchJobsIntent with one of the utterances that were programmed in. The full code is below, followed by a line-by-line breakdown of the code:

```javascript
const FetchJobsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FetchJobsIntent';
    },
    async handle(handlerInput) {

        let response = await logic.fetchJobsApi();

        addS3Object('dailyJobsReports', response.data);
        
        let strings = '';
        response.data.map((job, index) => {
            if (index < 3){
                
            return strings += `${job.employer_name} as a ${job.job_title}, <break time="1s"/> `;
            }
        });

        let speakOutput = ` I found a list of jobs for you, here are the first three, <break time="1s"/> ${strings} I emailed you the full list of jobs. ` ;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();    
    }
};
```

> This where we call the FetchJobsIntentHandler. The rest is boilerplate intent handler code.

```javascript
const FetchJobsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FetchJobsIntent';
    },
    async handle(handlerInput) {
```

> We are calling the fetchJobsApi function located in logic.js. The response is the result of the API call from logic.js. Its code is featured further down in this readme file

```javascript
        let response = await logic.fetchJobsApi();
```

> Here, we are adding the response object to an S3 bucket so that we can use its data in other ways across the application.

```javascript
        addS3Object('dailyJobsReports', response.data);
```

 > The object that came back from the API contained ten different results. We wanted Alexa to do two things:

  1. Speak information from the ten individual results contained within the response object, i.e. from multiple indexes.
  1. Limit the amount of things Alexa spoke from ten to three.

> To accomplish this, we declared an empty string, mapped through the response object, and limited the mapping so that is stopped after the third index, i.e. [2]. Then we returned an template literal to format Alexa's response. Note: the <break time="1s"/> is a way to add space in between each statement, which makes Alexa's speech sound more natural.

```javascript  
        let strings = '';
        response.data.map((job, index) => {
            if (index < 3){
                
            return strings += `${job.employer_name} as a ${job.job_title}, <break time="1s"/> `;
            }       
            
        });
```

> We inserted the variable called 'strings' inside of a template literal which was then fed into Alexa's .speak method.

```javascript
        let speakOutput = ` I found a list of jobs for you, here are the first three, <break time="1s"/> ${strings} I emailed you the full list of jobs. ` ;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse(); 
    }
};
```

___

### logic.js for making an API call

> The logic.js file's purpose is to call the API. The full code is below, followed by a line-by-line breakdown of the code.

```javascript
const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://jsearch.p.rapidapi.com/search',
  params: {
    query: 'software developer',
    page: '1',
    date_posted: 'today',
    remote_jobs_only: 'true',
    num_pages: '1'
  },
  headers: {
    'X-RapidAPI-Key': '<your API key>',
    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
  }
};

module.exports.fetchJobsApi = async function fetchJobsApi() {
    let config = {
        timeout: 6500
    }

    try{
    const response = await axios.request(options, config);

    return response.data;
    } catch (error) {
        console.log('^^^^^^^^^^ERROR', error);
        return null;
    }
}
```

> Require in Axios

```javascript
const axios = require("axios");
```

> Create an options object to send into the API. These parameters are API specific, so be prepared to find a way to accomplish this for the API that you are using.

```javascript
const options = {
  method: 'GET',
  url: 'https://jsearch.p.rapidapi.com/search',
  params: {
    query: 'software developer',
    page: '1',
    date_posted: 'today',
    remote_jobs_only: 'true',
    num_pages: '1'
  },
  headers: {
    'X-RapidAPI-Key': '<your API key>',
    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
  }
};
```

> This is the async function that sends the options object to query the API

```javascript
module.exports.fetchJobsApi = async function fetchJobsApi() {
```

> Alexa will timeout after 8 seconds, at which time Alexa would crash. This timeout allows Alexa to fail gracefully in 6.5 seconds instead of crashing

```javascript
    let config = {
        timeout: 6500
    }
```

> Passing the options object into the APIU, and waiting for a response which will contain the results of the API call

```javascript
   try{
    const response = await axios.request(options, config);
```

> Finally, we return the API's response back inside the fetchJobsIntentHandler. Please note, that the .data is specific to this API's object that was returned. Your API may be formatted differently.

```javascript
    return response.data;
    } catch (error) {
        console.log('^^^^^^^^^^ERROR', error);
        return null;
    }
}
```

___

## Notable Problems we had to overcome

**Problem:**

> The API response comes in as a JSON document with an array featuring the ten most recent jobs. We wanted Alexa to loop through the array, and speak the title and company of each job ten times.

**Solution:**

[Resource used to understand an approach for fix of looping through the array of jobs](https://stackoverflow.com/questions/54843002/alexa-ask-sdk-v2-nodejs-how-to-speak-out-array-of-strings-in-response)
