var express = require('express');
var morgan =  require('morgan');
var app = express();
var mongoose = require('mongoose');
var User = require('./models/user.js');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var mainRoute = require('./router/main');
var userRoute = require('./router/user');
var session = require('express-session');
var cookieParser = require('cookie-parser'); // will parse the cookie header and handle the cookie seperation
var flash = require('express-flash'); // for validation and displaying error msg
var secret = require('./config/secret');
var mongoStore =  require('connect-mongo')(session); // mongoStore requires session object
var passport = require('passport'); // lib for authentication



// having special symbols like @ , / or : in password could cause problem at the time of connection http://docs.mlab.com/connecting/#users
// solution : http://stackoverflow.com/questions/7486623/mongodb-password-with-in-it

mongoose.connect(secret.database,{
  uri_decode_auth: true
    }, function(err, db) {
      if(err){
          console.log(err);
        }else{
          console.log('connected to DB');
        }
    });

// invoking middleware on app
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());  // enables us to parse the json body
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser());
app.use(session({
  resave:true, // forces session to be saved
  saveUninitialized:true,     //forces the session which is uninitialized to be saved , mostly it is the case of new session
  secret: secret.secretKey,
  store : new mongoStore({url:secret.database , autoReconnect:true})
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.engine('ejs',engine);
app.set('view engine','ejs');

app.use(mainRoute);
app.use(userRoute);



app.listen(secret.port,function(err){
  if(err) throw err;
  console.log('server is running');
});
