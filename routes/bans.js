var express = require('express'),
    db = require('../lib/db.js');
    
var router = express.Router();

//GET all active bans
router.get('/get/active', function(req, res, next) {
  var query = 'SELECT * FROM es_bans WHERE unbanned = 0';
  
  getBans(req, res, query);
});

//GET all active bans
router.get('/get/inactive', function(req, res, next) {
  var query = 'SELECT * FROM es_bans WHERE unbanned = 1';
  
  getBans(req, res, query);
});

//POST add a ban
/*router.post('/add', function(req, res, next) {
  if(!req.query.steamid || !req.query.name || !req.query.time || !req.query.reason)
    return res.json({err:'parameters not met'});
  
  var query = 'INSERT INTO es_bans (steamid, steamidAdmin, name, nameAdmin, serverid, unbanned, time, timeStart, reason)' +
  'VALUES(\'' + req.query.steamid + '\', \'EXCLSERVER\', \'' + req.query.name + '\', \'EXCLSERVER\', 0, 0, ' + req.query.time + ', ' + Math.floor(new Date() / 1000) + ', \'' + req.query.reason + '\');';

  db.query(query, function(err, rows) {
   if(err) res.json(err);
   res.json(rows);
  });
});*/ 

function getBans(req, res, query) {
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
}

module.exports = router;
