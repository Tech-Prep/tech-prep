# Alexa Skill Programming Tips

1. Name each skill invocation in a unique manner

Our team was made up of five software developers, each wokring on diffferent features of the Alexa skill at any given time. We chose to all work under a single developer's account, and created one Alexa skill per developer to act as "branches"; a Dev Skill into which our code would be merged, and a Main Skill into which final code would be merged. The Dev Skill would only be merged into the Main Skill after all tests pass.

**Problem:**
After we begain merging our code into the Dev branch, the skill began to exhibit the following strange behaviors:

- We were unable to view full logs within the CloudWatch Logs, which made troubleshooting almost impossible.
- As we tested the Dev skill, each developer was experiencing different behaviors from Alexa, despite using the exact same skill (Dev).


**Solution**
The multiple skills shared the same invocation, "Tech Prep". This was confusing to the system. Once we changed each Alexa skill to have a unique invoation phrase, all of the problems were fixed. We chose to use each developer's name as the invocation phrase.



