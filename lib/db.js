"use strict";

/*

Config file layout.

{
  "mysql" : {
    "host"     : "localhost",
    "port"     : 3306,
    "user"     : "me",
    "password" : "secret",
    "database" : "testing"
  }
}

*/

module.exports=(require('mysql')).createConnection((JSON.parse((require("fs")).readFileSync(__dirname + '/../config.json'))).mysql);
