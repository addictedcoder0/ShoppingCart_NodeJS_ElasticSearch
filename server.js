var express = require('express');
var morgan =  require('morgan');
var app = express();
var mongoose = require('mongoose');
var User = require('./models/user.js');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejs-mate = require('ejs-mate');


// having special symbols like @ , / or : in password could cause problem at the time of connection http://docs.mlab.com/connecting/#users
// solution : http://stackoverflow.com/questions/7486623/mongodb-password-with-in-it

mongoose.connect('mongodb://<user>:<password>@ds149491.mlab.com:49491/shoppingcart_294',{
  uri_decode_auth: true
    }, function(err, db) {
      if(err){
          console.log(err);
        }else{
          console.log('connected to DB');
        }
    });

// invoking middleware on app
app.use(morgan('dev'));
app.use(bodyParser.json());  // enables us to parse the json body
app.use(bodyParser.urlencoded({ extended : true }));

app.get('/',function(req,res){
  var name = 'rudra';
  res.json('my name is  '+name);
});

app.post('/createUser',function(req,res,next){
  var user = new User();
  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;

  user.save(function(err){
    if(err) {
      return next(err);
    }else{
      res.json("successfully inserted a new user");
    }
  });
});

app.listen(3000,function(err){
  if(err) throw err;
  console.log('server is running');
});
