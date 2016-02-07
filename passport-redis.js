var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var session = require('express-session');
var config = require('./config');

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

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

// passport.use(new LocalStrategy(
//   function (name, done) {
//     User.find({
//       where: {
//         name: name
//       }
//     })
//     .then(function (user) {
//       if (!name) {
//         return done(null, false);
//       }
//       if (user.name === name) {
//         return done(null, user);
//       }
//     });
//   }  
// ));

router.route('/info')
  .get(function (req, res) {
    res.render('get-info');
  })

  .post(function (req, res) {
    res.send('Thank you!');
  });

app.use('/', router);

var server = app.listen(3000, function () {
  console.log('Listening on port ', server.address().port);
});