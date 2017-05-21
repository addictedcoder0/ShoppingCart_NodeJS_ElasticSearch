var mongoose =  require('mongoose');
var bcrypt =  require('bcrypt-nodejs');

/*
this file contains schema/field_level_info/characteristics for users
*/

var userSchema = new mongoose.Schema({
  email : {type : String ,unique:true ,lowercase:true},
  password : String,

  profile :{
    name : {type:String,default:''},
    picture:{type:String,default:''}
  },

  address : String,

  history:[{
      date:Date,
      paid:{type:Number,default:0},
  }]
});

// var user = new User();
// user.email = " ";
// user.'profile.name = "Batman";

/* Hashing the password before saving it to DB */
// pre is a inbuilt method present in mongoose .

userSchema.pre('save',function(next){
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10,function(err,salt){
    if(err) return next(err);
    bcrypt.hash(user.password,salt,null,function(err,hash){
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/*creating custom method to match the userTyped password with the db-stored password */

userSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password,this.password);
}


module.exports = mongoose.model('user',userSchema);
