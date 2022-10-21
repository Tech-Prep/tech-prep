# TechPrep Skill Testing

Suite #1 - Code Challenge Yes to Timer w/ Hint
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "Yes"
 - Alexa: "I've set a 30 min timer"
 - Wait 8 Seconds
 - Alexa: "Ask for a hint"
 - User: "Hint"
 - Alexa: "<Hint Statement>"
 - Wait ~30 seconds ----Timer Goes Off----
***Expect 1 email and 1 timer***

___

Suite #2 - Code Challenge No to Timer w/ Hint
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "No"
 - Alexa: "Okay, try to spend 30 mins max"
 - Wait 8 Seconds
 - Alexa: "Ask for a hint"
 - User: "Hint"
 - Alexa: "<Hint Statement>"
***Expect 1 email and 0 timers***

___

Suite #3 - Code Challenge Repeat After Timer is Set
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "Yes"
 - Alexa: "I've set a 30 min timer"
 - User: "Repeat"
 - Alexa: "Write a function..."
***Expect 1 email and 1 timer***
- Wait ~30 seconds ----Timer Goes Off----

___

Suite #4 - Code Challenge Repeat After Timer is Declined
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "No"
 - Alexa: "Spend 30 mins max"
 - User: "Repeat"
 - Alexa: "Write a function..."
 ***EMAIL SENT***
***Expect 1 email and 1 timer***

___

Suite #5 - Code Challenge Next After Timer is Set
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "Yes"
 - Alexa: "I've set a 30 min timer"
 - User: "Next"
 - Alexa: "Given an array..." + "Would you like me to set a 30 min timer?"
 - User: "Yes"
***EMAIL SENT***
***Expect 2 emails and 1 timer***

___

Suite #6 - Code Challenge Next After Timer is Declined
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "No"
 - Alexa: "Spend 30 mins max"
 - User: "Next"
 - Alexa: "Given an array..."
***Expect 2 emails and 0 timers***

___

Suite #7 - Interview Question "Happy Path"
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Interview"
 - Alexa: "Tell me about a time..."

___

Suite #8 - Interview Question w/ Repeat
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Interview"
 - Alexa: "Tell me about a time..."
 - User: "Repeat"
 - Alexa: "Tell me about a time..."

___

Suite #9 - Interview Question w/ Next
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Interview"
 - Alexa: "Tell me about a time..."
 - User: "Next"
 - Alexa: "How would you handle..."

___

Suite #10 - Interview Question w/ Graceful Hint Failure
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Interview"
 - Alexa: "Tell me about a time..."
 - User: "Hint"
 - Alexa: "Ask for a code challenge first"

___

Suite #11 - Code Challenge to Interview w/o Timer
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "No"
 - Alexa: "Okay, try to spend 30 mins max"
 - User: "Interview"
 - Alexa: "Tell me about a time..."
***Expect 1 email and 0 timers***

___

Suite #12 - Code Challenge to Interview w/ Timer
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "Yes"
 - Alexa: "I’ve set a timer for 30 minutes"
 - User: "Interview"
 - Alexa: "Tell me about a time..."
***Expect 1 email and 0 timers***

___

Suite #13 - Code Challenge -> Interview -> Code Challenge "Happy Path"
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "No"
 - Alexa: "Okay, try to spend 30 mins max"
 - User: "Interview"
 - Alexa: "Tell me about a time..."
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "Yes"
 - Alexa: "I've set a 30 min timer"
 - User: "Hint"
 - Alexa: "<Hint Statement>"
***Expect 2 emails and 1 timer***

___

Suite #14 - Code Challenge -> Interview -> Code Challenge - Checking for multiple timers
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "Yes"
 - Alexa: "I’ve set a 30 min timer for you"
 - User: "Interview"
 - Alexa: "Tell me about a time..."
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 ***EMAIL SENT***
 - User: "Yes"
 - Alexa: "I've set a 30 min timer"
 - User: "Hint"
 - Alexa: "<Hint Statement>"
***Expect 2 emails and 1 timer***

___

Suite #15 - Job Listings "Happy Path"
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Job listings"
 - Alexa: "I've found 3 Developer jobs for you..."
 ***EMAIL SENT***
***Expect 1 email***

___

Suite #16 - Job Listings w/ Repeat
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Job listings"
 - Alexa: "I've found 3 Developer jobs for you..."
 - User: "Repeat"
 - Alexa: "I've found 3 Developer jobs for you..."
***Expect 1 email***

___

Suite #17 - Job Listing w/ Next
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Job listings"
 - Alexa: "I've found 3 Developer jobs for you..."
 ***EMAIL SENT***
 - User: "Next"
 - Alexa: ******** TBD *********
***Expect 1 email***

___

Suite #18 - Job Listings w/ Graceful Hint Failure
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Job listings"
 - Alexa: "I've found 3 Developer jobs for you..."
 ***EMAIL SENT***
 - User: "Hint"
 - Alexa: "Ask for a code challenge first"
***Expect 1 email***

___

Suite #19 - Job Listings -> Interview Question -> Code Challenge "Happy Path"
 - User: "Open Tech Prep"
 - Alexa: "<Welcome to Tech Prep Statement>"
 - User: "Job listings"
 - Alexa: "I've found 3 Developer jobs for you..."
 ***EMAIL SENT***
 - User: "Interview"
 - Alexa: "Tell me about a time when..."
 - User: "Code Challenge"
 - Alexa: "Write a function..." + "Would you like me to set a 30 min timer?"
 - User: "Yes"
 - Alexa: "I’ve set a timer for 30 minutes"
 ***EMAIL SENT***
***Expect 2 emails 1 timer***

___

Suite #20 - Gibberish Statement
- Speak random words into the app to see how it responds.
