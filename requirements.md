Group Project: Begin Wireframes & Software Requirements
=======================================================

![Tech Prep UML](./Project%20Prep%204%20UML%20Draft.png)

User Stories
------------

User Story One:

1.  Title: Receive a code challenge from Alexa

2.  User Story sentence: 

As a user, I want to be able to ask Alexa for a code challenge and have her respond with a random code challenge.

1.  Feature Tasks

-   User makes an utterance to Alexa Device to start the skill

-   Alexa Device sends the utterance to Alexa Service

-   Alexa sends JSON request to Lambda Function

-   Lambda function sends JSON response to Alexa Service

-   Alexa Processes text and sends to the Alexa device

-   Device speaks a random code challenge from the array of code challenges

1.  Acceptance Tests

1.  User makes an utterance to Alexa Device to start the skill

2.  Alexa Device sends the utterance to Alexa Service

3.  Alexa sends JSON request to Lambda Function

4.  Lambda function sends JSON response to Alexa Service

5.  Alexa Processes text and sends to the Alexa device

6.  Device speaks a random code challenge from the array of code challenges

User Story Two:

1.  Title: Emailed algorithm solution

2.  User Story sentence

As a user, I want an email sent to me with the solution to the previous code challenge.

1.  Feature Tasks

Alexa sends the user an email with an algorithm for the code challenge it just gave to the user.

1.  Acceptance Tests

An email with an algorithm for the chosen challenge arrives in the user's email account within 5 minutes of the start of the code challenge.

User Story Three:

1.  Title: Gives hints to the code challenge

2.  User Story sentence

As a user, I want Alexa to give me a hint to when asked

1.  Feature Tasks

1.  An s3 bucket will hold the current challenge's information so that Alexa will "remember" what the challenge is.

2.  When asked by the user, Alexa will access a "Hints" array within each challenge object. 

3.  Alexa will give hints in the order in which they are in the array

4.  Once Alexa has exhausted the hints in the array, the last statement will be 'There are no more hints, Would you like me to tell you the hints again?'

5.  Alexa will start from index [0] when prompted to give a hint for that code challenge

3.  Acceptance Tests

1.  A user can ask alexa for a hint and alexa will give a hint that is relevant to the current code challenge. 

User Story Four:

1.  Timeboxing code challenges

2.  User Story sentence

As a user, I want Alexa to timebox the code challenge to 30 minutes and let me know when 10 minutes are left.

1.  Feature Tasks

-   Once a user accepts a code challenge, Alexa sets a 30 minute timer

-   When there are 10 minutes remaining, Alexa tells the user they have 10 minutes left

-   Alexa will let the user know how much time they have left when prompted.

-   Alexa will tell the user when time has run out.

1.  Acceptance Tests

1.  Alexa will set a 30 minute timer when a user accepts a code challenge

2.  Alexa will tell the user how much time they have when asked.

3.  Alexa will prompt the user when they have ten minutes left

4.  Alexa will tell the user when time has run out.

User Story Five:

1.  Title:Skip code challenge and get an alternate question 

2.  As a user I would like to be able to ask alexa to skip the challenge she is giving me and get an alternate code challenge.

3.  Feature Tasks:

-   Alexa waits one minute before emailing the code challenge algorithm

-   If alexa is asked to ex: "skip this one", "give me another" then it moves to another random code challenge. 

1.  Acceptance Tests

1.  Alexa will cancel the current code challenge choice(s), and not send an email with the canceled code challenge choice(s)' algorithm(s). 

2.  Alexa will give an alternate code challenge, and one minute after acceptance will send an email with the chosen challenge's algorithm.

User Story Six:

1.  Title: Alexa will remember which code challenge the user has selected

2.  User Story sentence

As a user, I want Alexa to remember which code challenge I have selected

1.  Feature Tasks

1.  An s3 bucket will hold the current challenge's information so that Alexa will "remember" what the challenge is

4\.  Acceptance Tests

A user can ask alexa for a hint and alexa will give a hint that is relevant to the current code challenge. 

Stretch TBD:

User Story Five:

1.  Alexa as a mock interviewer

2.  User Story sentence

As a user, I want to be able to ask Alexa for an interview question and have her respond with a behavioral question.

1.  Feature Tasks

2.  Acceptance Tests

User Story Six:

1.  Get an email with recent job postings

2.  User Story sentence

As a user, I want to be able to ask Alexa for recent job postings and have an email sent to me with recent job postings.

1.  Feature Tasks

2.  Acceptance Tests

TO DO: Upload the user stories to the Github Projects and provide a link in the Readme.

Software Requirements
---------------------

Vision
------

Minimum Length: 3-5 sentences

What is the vision of this product?

-   Our product is designed to help software developers practice their coding skills, interview skills, and provide a resource for finding available jobs. MVP allows a user to ask Alexa for a code challenge, and for Alexa to give them a random code challenge from a list of code challenges. Additional features after MVP, include having an email with an algorithm for the challenge sent to the user, having Alexa set a timer for the user, and having Alexa give hints for the code challenge when prompted. 

What pain point does this project solve?

-   Our app will help developers by practicing a whiteboard style interview so that they become more comfortable with the stressful aspect of interviews. Not every developer knows of commonly asked code challenges, and with the way we designed this product, the user will be given a random question from a list of some of the most commonly asked questions. We provide a timed challenge that also lets you know when you have 20 & 10 minutes left, so that you can better allocate your time. 

Why should we care about your product?

-   Developers would benefit from a product that easily provides interview practice whenever they need it. We provide realistic time-boxed code challenges that developers can expect to experience in real interviews. One of the most stressful parts of a whiteboard interview is feeling the time pressure. By using our product on a routine basis, software developers will become more comfortable with an uncomfortable situation. This may help eliminate the bias that can creep in when choosing one's own challenge, taking the decision out of the user's control.

Scope (In/Out)
--------------

-   IN - What will your product do

-   Describe the individual features that your product will do.

-   High overview of each. Only need to list 4-5

-   Alexa will provide code challenges upon command

-   Alexa will provide interview questions upon command

-   Alexa will be able to provide recent job postings upon command

-   Alexa will provide an Email for job postings and code challenge answers

-   OUT - What will your product not do.

-   These should be features that you will make very clear from the beginning that you will not do during development. These should be limited and very few. Pick your battles wisely. This should only be 1 or 2 things. Example: My website will never turn into an IOS or Android app.

-   Our product will not be gamified - no taking or keeping score

-   Our product will not save any user data/submitted code challenges

### Minimum Viable Product vs

What will your MVP functionality be?

-   Hey Alexa Give me a code challenge

-   Alexa talks back and says: "Write a function that traverses a binary tree and console logs each value"

What are your stretch goals?

-   Send an email with answers to the code challenge

-   Record you while doing it

-   Answer clarifying questions for the challenge

-   Give behavioral interview questions (mock interview questions)

-   Give job postings 

-   Awards, levels, ranking system

-   Publish the app

-   Use a database in some way?

-   Incorporate an indeed.com API?

-   Use an s3 bucket with an array of challenges.

### Stretch

What stretch goals are you going to aim for?

Functional Requirements
-----------------------

List the functionality of your product. This will consist of tasks such as the following:

1.  A user can receive a code challenge from Alexa

2.  A user receives the solution to the code challenge via email

3.  A user can have recent job postings sent to their email

4.  A user can use Alexa as a mock interviewer

### Data Flow

Describe the flow of data in your application. Write out what happens from the time the user begins using the app to the time the user is done with the app. Think about the "Happy Path" of the application. Describe through visuals and text what requests are made, and what data is processed, in addition to any other details about how the user moves through the site.

User - "Alexa, open Tech Prep"

Alexa - "Welcome to Tech Prep. I can give a code challenge, ask you an interview question or send you some job listings. Which will it be?"

User - "Let's do a code challenge"

Alexa - "Okay, write a function that traverses a binary search tree and console logs each value. Timer set for 30 minutes. Ask for a hint if you need it."

User - "Alexa, give me a hint"

Alexa - "Have you considered using recursion?"

User - "Send me some job listings"

Alexa - "Okay, check your email for some recent job postings"

User - "Interview me"

Alexa - "Okay, tell me about a time you had to deal with adversity in the workplace."

Non-Functional Requirements (301 & 401 only)
--------------------------------------------

Non-functional requirements are requirements that are not directly related to the functionality of the application but still important to the app.

Examples include:

1.  Security

2.  Usability

3.  Testability

4.  etc....

Pick 2 non-functional requirements and describe their functionality in your application.

If you are stuck on what non-functional requirements are, do a quick online search and do some research. Write a minimum of 3-5 sentences to describe how the non-functional requirements fits into your app.

You MUST describe what the non-functional requirement is and how it will be implemented. Simply saying "Our project will be testable for testibility" is NOT acceptable. Tell us how, why, and what.

-   Our product will be testable so that we can ask Alexa all the different requests and get the appropriate answers for each of them. Each aspect of our product will perform as expected (delivering a code challenge, setting a timer, giving a time warning, delivering interview questions...) and be delivered at the expected time. We will be sure to include all the different ways one command can be asked so that there aren't strict guidelines for the user to follow when asking.

-   Our product will be usable so that any software developer of any level of experience can utilize the features easily.  We will utilize simple commands/requests so that any user will understand what is expected from each one. We based our code challenge feature off of real world interviews where you're expected to complete the challenge in a certain amount of time. This product will be designed to prepare you for actual expectations in an interview or to just help you strengthen your current coding abilities.

Domain Modeling
---------------
![Tech Prep UML]()

Using a Database? Make an Database Schema Diagram
-------------------------------------------------

This project does not currently require a database.

Submitting Your Work
--------------------

This is a group submission. Only one person must submit for group credit

Submit your project repo with your readme outlined.

Upon completion of your tasks listed above, notify your instructor for approval of the content. After approval, you may begin coding. All 4 project steps must be completed before you may start coding your project.
