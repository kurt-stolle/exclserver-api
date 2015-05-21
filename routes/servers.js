'use strict';

var express = require('express'),
    db = require('../lib/db.js');

var router = express.Router();

// only make a call to the database once per hour, unnessecary overhead
var cache = {
  time : 0,
  results: {}
};

/* GET get all servers */
router.get('/all', function(req, res, next) {
  var time = Math.floor(new Date() / 1000); 
  if(cache.time + 3600 < time) {
    db.query({
      sql: 'SELECT `id`, `dns`, `name` FROM `es_servers` WHERE `dns` IS NOT NULL AND `name` IS NOT NULL',
    }, 
    function(error, results, fields) {
      if(error) res.json(error);
     
      cache.time = time;
      cache.results = results;
    });
  }
  
  res.json(cache.results);
});

module.exports = router;
