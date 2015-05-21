/// <reference path="typings/node/node.d.ts"/>
'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    mustacheExpress = require('mustache-express');

var app = express();

// setup view templating
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.set('x-powered-by', false);

// serve static content for views
app.use(express.static(__dirname + '/public'));

// setup POST data parsing
app.use(bodyParser.urlencoded({ extended: true }));

// setup app routes
var donate = require(__dirname + '/routes/donate.js'),
    servers = require(__dirname + '/routes/servers.js'),
    logs = require(__dirname + '/routes/logs.js'),
    player = require(__dirname + '/routes/player.js'),
    bans = require(__dirname + '/routes/bans.js');
    
app.use('/api/servers', servers);
app.use('/api/donate', donate);
app.use('/api/logs', logs);
app.use('/api/player', player);
app.use('/api/bans', bans);

// render the loading view
app.get('/loading', function(req, res, next){ res.render('loading', {}); });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(String(err.status || 500) + ": " + err.message);
});

module.exports = app;
