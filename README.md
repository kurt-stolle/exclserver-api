# ExclServer API
The Node.JS app for ExclServer.

Configuration
-----

Config file layout.
Make a file called config.json, in project's base directory.


```json
{
  "mysql" : {
    "host"     : "localhost",
    "port"     : 3306,
    "user"     : "me",
    "password" : "secret",
    "database" : "testing"
  },

  "paypal" : {
    "mode"          : "live",
    "client_id"     : "xxx",
    "client_secret" : "xxx"
  }  
}
```
