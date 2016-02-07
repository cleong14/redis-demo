var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session');
var config = require('./config');
var morgan = require('morgan');

var app = express();
var router = express.Router();

app.set('views', 'views');
app.set('view engine', 'jade');

// 1. body parser
app.use(bodyParser.urlencoded({ extended: false }));

// 2. sessions
app.use(session({ secret: 'secret cat' }));

app.use(session(config.session));

// 3. passport
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));

passport.use(new LocalStrategy(
  {
    passReqToCallback: true
  },

  function (req, username, password, done) {
    var body = req.body;
    return done(null, {name: req.body.name});
  }
));

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

app.get('/', function (req, res) {
  var user = req.user;
  if (!user) {
    return res.redirect('/info');
  }
  return res.send('Welcome back, ' + user.name + '!');
});

router.route('/info')
  .get(function (req, res) {
    res.render('get-info');
  })

  .post(
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/info'
    })
  );

app.use('/', router);

var server = app.listen(3000, function () {
  console.log('Listening on port ', server.address().port);
});