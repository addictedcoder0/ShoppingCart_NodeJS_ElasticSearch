var passport = require('passport'); // used for logging via fb , google , twitter etc
var localStrategy = require('passport-local').Strategy; // this is just for local login
var User =  require('../models/user');

// serialize and deserialize user object
// callbacks can be named next/done/anything whichever makes more sense

// serialized data will be stored in the connect-mongo
passport.serializeUser(function(user,done){
  done(null,user._id); // by default in mongodb _id is created
});

// id here is the user._id  , used to retrieve the whole serialized user object
passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
      done(err,user);
  });
});

//middleware to persist the login
passport.use('local-login',new localStrategy({
  usernameField : 'email',   // make sure you don't make change in name of these keys , if changed will result in failure
  passwordField : 'password',
  passReqToCallback : true
},function(req,email,password,done){
  User.findOne({ email : email},function(err,user){
    if(err) return done(err);
    if(!user) {
      return done(null,false,req.flash('loginMessage','No such user exist'));
    }
    if(!user.comparePassword(password)){
      return done(null,false,req.flash('loginMessage','sorry wrong password'));
    }
    return done(null,user);
  });
}));

//custom function to validate the user
exports.isAuthenticated = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}
