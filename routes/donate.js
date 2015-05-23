'use strict';

var express = require('express'),
  paypal = require('paypal-rest-sdk'),
  fs = require('fs'),
  db = require('../lib/db.js'),
  config = require('../lib/config.js');

var router = express.Router();

// read PayPal configuration from the config.json
paypal.configure(config.paypal);

/* GET paypal donation start */
router.get('/', function(req, res, next) {
  if (!req.query.amt || isNaN(req.query.amt) || req.query.amt <= 0) {
    res.json({
      error: 'Valid amount not specified'
    }).status(500);
    return;
  }

  if (!req.query.steamid) {
    res.json({
      error: 'Steamid required'
    }).status(500);
    return;
  }

  req.query.amt = Math.ceil(req.query.amt);

  paypal.payment.create({
      'intent': 'sale',
      'payer': {
        'payment_method': 'paypal'
      },
      'redirect_urls': {
        'return_url': config.url + '/api/donate/return',
        'cancel_url': config.url + '/api/donate/cancel'
      },
      'transactions': [{
        'item_list': {
          'items': [{
            'name': '1000 Bananas (digital goods)',
            'sku': 'bananas',
            'price': '1.00',
            'currency': 'USD',
            'quantity': req.query.amt
          }]
        },
        'amount': {
          'currency': 'USD',
          'total': req.query.amt + '.00'
        },
        'description': req.query.amt * 1000 + ' Bananas (digital goods) for SteamID ' + req.body.steamid + ' on all CasualBananas game servers.'
      }]
    },
    function(error, payment) {
      if (error) {
        res.json({
          error: 'Internal server error'
        }).status(500);
        return;
      }

      db.query({
          sql: 'INSERT INTO `es_donations` SET ?',
          values: {
            steamid: req.query.steamid,
            amount: req.query.amt,
            ip: req.connection.remoteAddress,
            payment_id: payment.id
          }
        },
        function(error, results, fields) {
          if (error) {
            res.json({
              error: 'Internal server error'
            }).status(500);
            return;
          }

          // Find the URL to the store page and 301 (redirect).
          for (var i = 0; i < payment.links.length; i++) {
            var link = payment.links[i];
            if (link.rel == 'approval_url') {
              res.redirect(link.href);
              break;
            }
          }
        });
    });
});

/* GET paypal donation cancelled */
router.get('/cancel', function(req, res, next) {
  //TODO: fancy rendered view for when donation gets cancelled
  res.send('order cancelled.');
});

/* GET paypal donation return */
router.get('/return', function(req, res, next) {
  if (!req.query.PayerID || req.query.paymentId) {
    res.json({
      error: 'Paypal did not send valid info back'
    }).status(500);
    return;
  }

  paypal.payment.execute(req.query.paymentId, {
    'payer_id': req.query.PayerID
  }, function(error, payment) {
    if (error) {
      res.json({
        error: 'Internal server error'
      }).status(500);
      return;
    }

    var payer_info = payment.payer.payer_info;

    db.query({
        sql: 'UPDATE `es_donations` SET ? WHERE payment_id ? ' + db.escape(req.query.paymentId),
        values: {
          paid: 1,
          claimed: 0,
          email: payment.payer.payer_info.email,
          payer_id: payment.payer.payer_info.payer_id,
          name: payer_info.first_name + ' ' + payer_info.last_name,
        }
      },
      function(error, results, fields) {
        if (error) {
          res.json({
            error: 'Internal server error'
          }).status(500);
          return;
        }
        
        //TODO: fancy rendered view for when donation is successful
        res.send('Donation successful! You may now close this window.');
      });
  });
});

module.exports = router;
