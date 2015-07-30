'use strict';

var config = require("./config.js");

module.exports = exports = function(req,res,next){
  if ( (req.body.apikey || req.query.apikey || req.headers['x-api-key']) == config.apikey ){
    next()
    return;
  }

  res.json({
    error: 'Invalid API key'
  }).status(403);
}
