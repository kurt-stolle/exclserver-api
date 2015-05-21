'use strict';

module.exports=(require('mysql')).createConnection((JSON.parse((require("fs")).readFileSync(__dirname + '/../config.json'))).mysql);
