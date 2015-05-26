'use strict';

var express = require('express')
  , query = require('game-server-query')
  , db = require('../lib/db.js');

var router = express.Router();

// only make a call to the database once per hour, unnessecary overhead
var cache = {
  time: 0,
  results: {}
};

function pullServers() {
  var time = Math.floor(new Date() / 1000);
  if (cache.time + 3600 < time) {
    db.query({
        sql: 'SELECT `id`, `ip`, `dns`, `name`, `port` FROM `es_servers` WHERE `ip` IS NOT NULL',
      },
      function(error, results, fields) {
        // how to handle this?
        // if(error) {}
        
        cache.time = time;
        cache.results = results;
      });
  }
}

function getHostforId(id) {
  pullServers();
 
  for(var i = 0; i < cache.results.length; i++) {    
    if(cache.results[i].id == id)
      return cache.results[i];
  }
  
  return null;
}

/* GET get all servers */
router.get('/all', function(req, res, next) {
  res.json(cache.results);
});

/* GET get server status */
router.get('/status/:id', function(req, res, next) {
  var serverData = getHostforId(parseInt(req.params.id) || 0);
   
  if(!serverData) {
      res.json({
        error: 'Status for requested id unavailable (no connnection info for server id)'
      }).status(500);
      return;
  }
  
  query({
    type: 'garrysmod',
    host: serverData.ip,
    port: serverData.port
  },
  function(state) {
    if(state.error) {
       res.json({
        error: 'Status for requested id unavailable (unable to connect to server)'
      }).status(500);
      return;
    } else {
      res.json({ip: serverData.ip, host: serverData.dns, port: serverData.port, name: serverData.name, map: state.map, password: state.password, maxplayers: state.maxplayers, players: state.players});
    }   
  });
});

pullServers();

module.exports = router;