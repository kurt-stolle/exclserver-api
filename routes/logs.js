'use strict';

var express = require('express'),
  db = require('../lib/db.js');

var router = express.Router();

/* GET all chat logs per serverid */
router.get('/:serverid/chat', function(req, res, next) {
  var query = {
    sql: 'SELECT DISTINCT `text` FROM `es_logs` WHERE `type` = 4 AND `serverid` = ? ORDER BY `id` ASC LIMIT ?;',
    values: [req.params.serverid, (req.query && req.query.limit) ? parseInt(req.query.limit) : 10]
  };

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

module.exports = router;
