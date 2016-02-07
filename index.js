var redis = require('redis');

// connect to redis (default config 127.0.0.1:6379)
var client = redis.createClient();

client.on('ready', function () {
  console.log('Ready to go!');
});

client.on('connect', function () {
  runExample();
});

client.on('end', function () {
  console.log('Goodbye redis');
  client.end();
});

client.on('error', function (err) {
  console.log(err);
});

function runExample () {
  client.set('name', 'Chaz');
  client.get('secret', function (err, secret) {
    console.log('the secret is...', secret);
  });
}