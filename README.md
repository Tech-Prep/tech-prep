# Click the link below to go to the Table of Contents for the project README Folder.

[Developer README Folder Table of Contents](./READMEs/Table-of-Contents.md)

# tech-prep 401 Midterm Project

**Authors:**
Stephen Clemmer
Xavier Hillman
KC Hofstetter
Brandon Pitts
Jack Subblefield

## Project Overview

Build an Alexa Skill that allows a user to receive helpful interview training:

**MVP:**

1. User asks: 'Hey Alexa Give me a code challenge'
2. Alexa talks back and give a challenge i.e.,  “Write a function that traverses a binary tree and console logs each value”

**Potential Technologies Used:**

- Lambda
- S3 storage bucket with JSON file with questions
- Use an SNS to send an answer/email/text message (twilio) with clarifying questions
- SNS send to a socket to …
- Maybe need to hit an API

**Stretch Goals:**

- Send an email with answers to the code challenge
- Record you while doing it
- Answer clarifying questions for the challenge
- Give behavioral interview questions (mock interview questions)
- Give job postings
- Awards, levels, ranking system
- Publish the app

**required package.json dependencies:**

        "dependencies": {
            "ask-sdk-core": "^2.7.0",
            "ask-sdk-model": "^1.19.0",
            "aws-sdk": "^2.326.0",
            "@aws-sdk/client-s3": "3.190.0",
            "node-fetch": "2.6.7"
          }

### UML

![Tech Prep UML](./Project%20Prep%204%20UML%20Draft.png)

### Code Walk Through

[Repeat code challenge & hint for code challenge](./codeWalkThrough.md)
