var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var config = require('./config');
var morgan = require('morgan');

var app = express();
var router = express.Router();

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(morgan('dev'));

// 1. body parser
app.use(bodyParser.urlencoded({ extended: false }));

// 2. sessions
app.use(session({
  store: new RedisStore({
    host: '127.0.0.1',
    port: '6379'
  }),
  secret: config.session.secret,
  resave: config.session.save,
  saveUninitialized: config.session.saveUninitialized
}));

// 3. passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    passReqToCallback: true
  },

  function (req, username, password, done) {
    var body = req.body;
    // var info = {};
    // for (var prop in body) {
    //   if (prop !== 'username' && prop !== 'password') {
    //     info[prop] = body[prop];
    //   }
    // }
    // another way as the code above
    // take the keys out of body object
    var info = Object.keys(body)
      // filtering our name and password and sending everything else through
      .filter(function (prop) {
        return ['username', 'password'].indexOf(prop) < 0;
      })
      // reducing 
      .reduce(function (info, prop) {
        // set empty info obj name to body name
        info[prop] = body[prop];
        return info;
      }, {});
    return done(null, info);
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
  return res.json(user);
});

router.route('/info')
  .get(function (req, res) {
    res.render('get-info');
  })

  .post(
    passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/info'
    })
  );

  router.route('/profile')
    .get(function (req, res) {
      res.render('profile', { user: req.user });
    });

app.use('/', router);

var server = app.listen(3000, function () {
  console.log('Listening on port ', server.address().port);
});