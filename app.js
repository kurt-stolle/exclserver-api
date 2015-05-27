/// <reference path="typings/node/node.d.ts"/>
'use strict';

var express = require('express'),
  bodyParser = require('body-parser');

var app = express();

// setup view templating
app.set('view engine', 'hjs');
app.set('views', __dirname + '/views');
app.set('x-powered-by', 'ExclServer');

// serve static content for views
app.use(express.static(__dirname + '/public'));

// setup POST data parsing
app.use(bodyParser.urlencoded({
  extended: true
}));

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
app.get('/loading', function(req, res, next) {
  res.render('loading', {
    serverid: (req.query && req.query.id) ? parseInt(req.query.id) : 0
  });
});

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

// setup port
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// setup http server
var server = require('http').createServer(app);
server.listen(port);

// hooking
server.on('error', onError);
server.on('listening', onListening);

// utility functions
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// error handling
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// listening
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
