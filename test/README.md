to run the unit tests:
1. The necessary packages
    "datamuse": "^1.0.5"
    "dotenv": "^17.2.1"
    "express": "^5.1.0"
    "express-rate-limit": "^8.0.1"

2. npm install supertest --save-dev to install supertest which is used to run the unit test cases using Jest

3. /api/wordOfTheDay and /api/defineWord may fail due to requiring an API key for Wordnik that is stored within .env file which is not uploaded. 

4. To run the tests simple do npm test