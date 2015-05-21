'use strict';

var express = require('express'),
    db = require('../lib/db.js');

var router = express.Router();

//GET all bans, allow for sorting via ?active<> and ?steamid=<>
router.get('/', function(req, res, next) {
  var query = {
    sql: 'SELECT * FROM `es_bans`',
    values: []
  };
  
  if(req.query.active) {
    query.sql += ' WHERE `unbanned` = ?';
    query.values.push(req.query.active); 
  }
  
  if(req.query.steamid && req.query.active) {
    query.sql += ' AND `steamid` = ?';
    query.values.push(req.query.steamid); 
  } else if(req.query.steamid) {
    query.sql += ' WHERE `steamid` = ?';
    query.values.push(req.query.steamid);     
  }
  
  db.query(query, 
  function(error, results, fields) {
    if(error) res.json(error);
    res.json(results);    
  });
});

module.exports = router;
