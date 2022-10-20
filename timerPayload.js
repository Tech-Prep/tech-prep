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