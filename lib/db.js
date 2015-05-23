'use strict';

module.exports = (require('mysql')).createConnection((require(__dirname + './config')).mysql);
