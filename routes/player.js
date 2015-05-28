'use strict';

var express = require('express'),
  db = require('../lib/db.js');

var router = express.Router();

/* GET get rank for player provided with Steam and Server ID */
router.get('/:steamid/rank', function(req, res, next) {
  db.query({
      sql: 'SELECT `rank` FROM `es_ranks` WHERE `steamid` = ? AND `serverid` = ?',
      values: [req.params.steamid, req.query.serverid || 0]
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
});

/* POST set rank for player provided with Steam and Server ID */
router.post('/:steamid/rank', function(req, res, next) {
  if (!req.body.rank) {
    res.json({
      err: 'rank required'
    }).status(500);
    return;
  }

  // get all ranks for SteamID and ServerID
  db.query({
      sql: 'SELECT `rank` FROM `es_ranks` WHERE `steamid` = ? AND `serverid` = ?',
      values: [req.params.steamid, req.body.serverid || 0]
    },
    function(error, results, fields) {
      if (error) res.json(error);

      // if there is a result then update the existing row
      if (results.length != 0) {
        db.query({
            sql: 'UPDATE `es_ranks` SET ? WHERE `steamid` = ' + db.escape(req.params.steamid) + ' AND `serverid` = ' + db.escape(req.body.serverid || 0),
            values: {
              rank: req.body.rank
            }
          },
          function(error, results, fields) {
            if (error) res.json(error);
            res.json(results);
          });

        // if there is no result than we insert a new row
      } else {
        db.query({
            sql: 'INSERT INTO `es_ranks` SET ?',
            values: {
              steamid: req.params.steamid,
              serverid: req.body.serverid || 0,
              rank: req.body.rank
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

/* GET get all fields for a player provided with SteamID */
router.get('/:steamid/fields', function(req, res, next) {
  db.query({
      sql: 'SELECT * FROM `es_player_fields` WHERE `steamid` = ?',
      values: [req.params.steamid]
    },
    function(error, results, fields) {
      if (error || !results[0]) {
        res.json({
          error: 'Internal server error'
        }).status(500);
        return;
      }
      
      res.json(results[0]);
    });
});

/* GET get specific field for player provided with SteamID */
router.get('/:steamid/fields/:field', function(req, res, next) {
  db.query({
      sql: 'SELECT ?? FROM `es_player_fields` WHERE `steamid` = ?',
      values: [req.params.field, req.params.steamid]
    },
    function(error, results, fields) {
      if (error || !results[0][req.params.field]) {
        res.json({
          error: 'Internal server error'
        }).status(500);
        return;
      }
      res.json({value: results[0][req.params.field]});
    });
});

/* POST set specific field for player provided with SteamID */
router.post('/:steamid/fields/set', function(req, res, next) {
  //cannot overwrite this stuff in the DB by chance
  if (req.body.steamid)
    delete req.body.steamid;

  if (req.body.id)
    delete req.body.id;

  // get all player fields for SteamID
  db.query({
      sql: 'SELECT * FROM `es_player_fields` WHERE `steamid` = ?',
      values: [req.params.steamid]
    },
    function(error, results, fields) {
      if (error) {
        res.json({
          error: 'Internal server error'
        }).status(500);
        return;
      }

      // check for POST fields that don't correspond to existing columns
      var bodyKeys = Object.keys(req.body);
      var columnExists = true;
      var nonExistantColumns = [];
      for (var i = 0; i < bodyKeys.length; i++) {
        if (!results[0][bodyKeys[i]]) {
          columnExists = false;
          nonExistantColumns.push(bodyKeys[i]);
        }
      }

      // add a VARCHAR(255) for all columns that do not exist
      if (!columnExists) {
        db.query({
          sql: 'ALTER TABLE `es_player_fields` ADD ?? VARCHAR(255)',
          values: nonExistantColumns
        }, function(error, results, fields) {
          if (error) {
            res.json({
              error: 'Internal server error'
            }).status(500);
            return;
          }
        });
      }

      // if there is a result then update the existing row
      if (results.length != 0) {
        db.query({
            sql: 'UPDATE `es_player_fields` SET ? WHERE `steamid` = ' + db.escape(req.params.steamid),
            values: req.body
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
        req.body.steamid = req.params.steamid;

        db.query({
            sql: 'INSERT INTO `es_player_fields` SET ?',
            values: req.body
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

/* GET get player inventory and filter by itemtype */
router.get('/:steamid/inventory', function(req, res, next) {
  var query = {
    sql: 'SELECT `itemtype`, `name` FROM `es_player_inventory` WHERE `steamid` = ?',
    values: [req.params.steamid]
  };

  if (req.query.itemtype) {
    query.sql += ' AND `itemtype` = ?';
    query.values.push(req.query.itemtype);
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

/* POST add item to player's inventory */
router.post('/:steamid/inventory/add', function(req, res, next) {
  if (!req.body.itemtype) res.json({
    err: 'itemtype required'
  });
  if (!req.body.name) res.json({
    err: 'name required'
  });

  db.query({
      sql: 'INSERT INTO `es_player_inventory` SET ?',
      values: {
        steamid: req.body.steamid,
        itemtype: req.body.itemtype,
        name: req.body.name
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
});

module.exports = router;
