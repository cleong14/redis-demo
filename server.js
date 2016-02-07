var express = require('express'); // 1-
var redis = require('redis');

var app = express();

// redis 
var client = redis.createClient();

app.use(function (req, res, next) {
  // TODO: get counter from redis
  client.incr('counter', function (err, counter) {
    if (err) {
      next(err);
    }
    res.locals.counter = counter;
    next();
  });
});

app.get('/', function (req, res) {
  res.send('Hello Visitor #' + res.locals.counter + '!');
});

app.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send('Something bad happened...');
    console.log(err);
  }
  res.send('How did you get here?');
});

// redis
client.on('connect', function  () {
  console.log('connected to redis');
  initializeCounter(connectToServer);
});

// redis
client.on('end', function () {
  console.log('disconnect from redis');
  //client.end();
});

function connectToServer () {
  var server = app.listen(3000, function () {
    console.log('Server is listening on port ', server.address().port);
  });
}

function initializeCounter (callback) {
  client.get('counter', function (err, counter) {
    if (err) { throw err; }
    if (!counter) {
      client.set('counter', 0);
    }
  });
  return callback (); // connect to server
}