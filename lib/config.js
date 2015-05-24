'use strict';

var fs = require('fs');

if (fs.existsSync(__dirname + '/../config.json')) {
  module.exports = JSON.parse(fs.readFileSync(__dirname + '/../config.json'))
} else {
  var config = {
    "url": "http://localhost:3000",
    "mysql": {
      "host": "localhost",
      "port": 3306,
      "user": "root",
      "password": "",
      "database": ""
    },
    "paypal": {
      "mode": "live",
      "client_id": "",
      "client_secret": ""
    }
  };

  fs.writeFileSync(__dirname + '/../config.json', JSON.stringify(config))

  module.exports = config;
}
