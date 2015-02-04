var express = require('express');
var app = express();

var secret = require('./secret.json');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', function (req, res) {
  if ( req.query.password === secret.password ) {
    res.redirect('/secret_page');
  }
  else {
    res.redirect('/');
  }
});

app.get('/secret_page', function (req, res) {
  res.sendFile(__dirname + '/public/secret.html');
});

app.get('/secret_page2', function (req, res) {
  res.sendFile(__dirname + '/public/secret2.html');
})

app.listen(3000);
console.log("listening on port 3000");
