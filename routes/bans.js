'use strict';

var express = require('express'),
  db = require('../lib/db.js'),
  authenticate = require('../lib/authenticate.js');

var router = express.Router();

/* GET all bans, allow for sorting via ?active<> and ?steamid=<> */
router.get('/', function(req, res, next) {
  var query = {
    sql: 'SELECT * FROM `es_bans`',
    values: []
  };

  if (req.query.active) {
    query.sql += ' WHERE `unbanned` = ?';
    query.values.push(req.query.active);
  }

  if (req.query.steamid && req.query.active) {
    query.sql += ' AND `steamid` = ?';
    query.values.push(req.query.steamid);
  } else if (req.query.steamid) {
    query.sql += ' WHERE `steamid` = ?';
    query.values.push(req.query.steamid);
  }

  db.query(query,
    function(error, results, fields) {
      if (error) {
        res.json({
          error: 'Internal server error'
        }).status(500);
        return;
      }

      res.json(results);
    });
});

/* POST add a ban */
router.post('/add', authenticate, function(req, res, next) {
  if (!req.body.steamid) {
    res.json({
      err: 'steamid required'
    }).status(500);
    return;
  }

  // get all bans to see if we have to update
  db.query({
      sql: 'SELECT * FROM `es_bans` WHERE `steamid` = ? AND `serverid` = ?',
      values: [req.body.steamid, req.body.serverid || 0]
    },
    function(error, results, fields) {
      if (error) {
        res.json({
          error: 'Internal server error'
        }).status(500);
        return;
      }

      // if there is a result then update the existing row
      if (results.length != 0) {
        db.query({
            sql: 'UPDATE `es_bans` SET ? WHERE `steamid` = ' + db.escape(req.body.steamid) + ' AND `serverid` = ' + db.escape(req.body.serverid || 0),
            values: {
              steamidAdmin: req.body.steamidAdmin || 'ExclServer',
              name: req.body.name || results.name || '',
              nameAdmin: req.body.nameAdmin || 'ExclServer',
              unbanned: 0,
              time: req.body.time || 0,
              timeStart: Math.floor(new Date() / 1000),
              reason: req.body.reason || 'Banned.'
            }
          },
          function(error, results, fields) {
            if (error) {
              res.json({
                error: 'Internal server error'
              }).status(500);
              return;
            }
            res.json(results);
          });

        // if there is no result than we insert a new row
      } else {
        db.query({
            sql: 'INSERT INTO `es_bans` SET ?',
            values: {
              steamid: req.body.steamid,
              steamidAdmin: req.body.steamidAdmin || 'ExclServer',
              name: req.body.name || '',
              nameAdmin: req.body.nameAdmin || 'ExclServer',
              serverid: req.body.serverid || 0,
              unbanned: 0,
              time: req.body.time || 0,
              timeStart: Math.floor(new Date() / 1000),
              reason: req.body.reason || 'Banned.'
            }
          },
          function(error, results, fields) {
            if (error) {
              res.json({
                error: 'Internal server error'
              }).status(500);
              return;
            }
            res.json(results);
          });
      }
    });
});

module.exports = router;
