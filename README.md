# ExclServer API
The Node.JS app for ExclServer.

Installation
-----
First install Node.JS from https://nodejs.org/en/download/
Then run the ExclServer API using `npm start` from the base directory.

ExclServer-API is also available using `npm install exclserver-api`: https://www.npmjs.com/package/exclserver-api

Configuration
-----

Config file layout.
Make a file called config.json, in project's base directory.


```json
{
  "url": "http://localhost:3000",
  "mysql" : {
    "host"     : "localhost",
    "port"     : 3306,
    "user"     : "me",
    "password" : "secret",
    "database" : "testing"
  },
  "secret": "mySecretString",
  "paypal" : {
    "mode"          : "live",
    "client_id"     : "xxx",
    "client_secret" : "xxx"
  }  
}
```
