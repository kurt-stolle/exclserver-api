'use strict';

var express = require('express'),
    db = require('../lib/db.js');

var router = express.Router();

//GET all chat logs for :serverid
router.get('/:serverid/chat', function(req, res, next) {
  var query = 'SELECT text FROM es_logs WHERE type = 4 AND serverid = ' + req.params.serverid;

  if(req.query.limit)
    query += ' LIMIT ' + req.query.limit;

   query += ';';

  db.query(query, function(err, rows) {
   if(err) res.json(err);
   res.json(rows);
  });
});

module.exports = router;
