'use strict';

var express = require('express'),
    db = require('../lib/db.js');

var router = express.Router();

//GET rank for :steamid
router.get('/:steamid/rank', function(req, res, next) {
  var query = 'SELECT rank FROM es_ranks WHERE steamid = \'' + req.params.steamid + '\';';

  db.query(query, function(err, rows) {
   if(err) res.json(err);
   res.json(rows);
  });
});

//GET inventory for :steamid
router.get('/:steamid/inventory', function(req, res, next) {
  var query = 'SELECT itemtype, name FROM es_player_inventory WHERE steamid = \'' + req.params.steamid + '\'';

  if(req.query.itemtype)
    query += ' AND itemtype = \'' + req.query.itemtype + '\'';

  if(req.query.limit)
    query += ' LIMIT ' + req.query.limit;

   query += ';';

  db.query(query, function(err, rows) {
   if(err) res.json(err);
   res.json(rows);
  });
});

module.exports = router;
