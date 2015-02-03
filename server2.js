var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("auth_exercises.db");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
//note: any time you use app.use, you're adding middleware to your app;

app.use(session({
  secret: "penguin",
  resave: false,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/user', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm_password;
  if (password !== confirm) {
    res.sendFile(__dirname + '/public/error2.html');
  }
  else {
    db.get("SELECT * FROM users WHERE username = ?", username, function(err, row) {
      if (err) { throw err; }
      if (row) {
        console.log("do we get here?");
        res.sendFile(__dirname + '/public/exists.html');
      }
      else {
        db.run("INSERT INTO users (username, password) VALUES (?,?)", username, password, function(err) {
          if (err) { throw err; }
          else {
            req.session.validuser = true;
            res.redirect('/secret_page');
          };
        });
      };
    });
  };
});

app.post('/session', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", username, password, function (err,row) {
    if (err) { throw err; }
    if (row) {
      req.session.validuser = true;
      res.redirect('/secret_page');
    }
    else {
      res.sendFile(__dirname + '/public/error2.html');
    }
  });
});

app.get('/secret_page', function (req, res) {
  if (req.session.validuser) {
    res.sendFile(__dirname + '/public/secret.html');
  }
  else {
    res.redirect('/');
  }
});

app.listen(3000);
console.log("listening on port 3000");
