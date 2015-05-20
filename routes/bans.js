var express = require('express'),
    db = require('../lib/db.js');
    
var router = express.Router();

//GET all active bans
router.get('/get/active', function(req, res, next) {
  var query = 'SELECT * FROM es_bans WHERE unbanned = 0';
  
  if(req.query.name)
    query += ' AND name = \'' + req.query.name + '\'';
    
  if(req.query.admin)
    query += ' AND nameAdmin = \'' + req.query.admin + '\'';
  
  if(req.query.steamid)
    query += ' AND steamid = \'' + req.query.steamid + '\'';
  
  if(req.query.limit)
    query += ' LIMIT ' + req.query.limit;
    
   query += ';';
  
  db.query(query, function(err, rows) {
   if(err) res.json(err);
   res.json(rows);
  });
});

module.exports = router;
