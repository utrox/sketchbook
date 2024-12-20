# sketchbook

This project was made for the University of Helsinki course [Full Stack Web Development Project (10cr)](https://studies.helsinki.fi/courses/course-implementation/otm-0b8aaeb0-d19b-43ab-9fc7-496f027776c4) and is currently a WIP.

### [Live website](https://core-ow1t.onrender.com/) 
### [Timekeeping](time.md)

#### (Please note, that because the application is running on render.com's free-tier, the spinup time for the application is slow. Might take over a minute to load the page.

## User instructions
Visitors have the ability to register then log in to start using the application. Non-authenticated users cannot access any pages/info other than the login/logout pages and the static & media files.

Logged in users have the ability to:
-  access the content of the application
-  access the feed:
  - includes posts, comments and likes of all users
-  also, create content:
  - ability to create posts and comments and like other people's posts and comments.

In the feed, and in their profile history (more of that later) users have the ability to modify and delete their posts and their comments. 

Users can visit other users' profiles, and take a look at their post history, avatar, and profile background image. Users also have the ability here to modify their usernames and passwords, avatars, and profile background images. (Filepicker + drag&drop too)

TLDR: It's a simple social media application.

## Other cool stuff
- Automatic content generation for this demo application.
- CI/CD:
  - Tests (93% coverage and extensive testing for every possible edgecase)
  - Linting
  - Deployment
  - Populating database with cool dummy data
- It looks like a notebook kinda (I'm not a good designer, but it's alright)
