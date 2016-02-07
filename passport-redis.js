var express = require('express');

var app = express();
var router = express.Router();

app.set('views', 'views');
app.set('view engine', 'jade');

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