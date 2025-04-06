const mongoose = require('mongoose') ;

// importing validator
var validator = require('validator');
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  firstName : {
    type : String ,
    required : true ,
    minLength: 4 ,
    trim : true
  },
  lastName : {
    type : String,
    minLength : 1
  },
  emailID : {
    type : String,
    required : true ,
    unique: true ,
    index : true ,
    validate : {
      validator : function(value) {
        if(!validator.isEmail(value)){
          throw new Error("Email is not valid") ;
        }
      }
    }
    
  },
  age : {
    type : Number ,
    required : false,
    min:[18,"waite a few more years!"],
    max: [60,"Time is over!"] 
  },
  gender:{
    type : String , 
    // use enum for specify accepted values for gender
    enum : {
      values : ["male","female","other"] ,
      message : `{VALUE} is incorrect status type`
    }
  },
  skills : {
    type : [String] 
  },
  password : {
    type : String
  } ,
  about : {
    type : String , 
    required : false
  },
  connections : {
    type : Number , 
    default : 0
  } ,
  avatarURL : {
    type : String ,
    default : "https://res.cloudinary.com/dl8q6vzmq/image/upload/v1742800503/j8iajgjrnyzzqcjt2wwd.jpg"
  },
  otp:{
    type : String,
    
  },
  optExpires : {
    type : Date
  }
},{ timestamps: true })

userSchema.methods.generateOtp = function() {
  const otp = crypto.randomInt(100000, 999999).toString() ;
  this.otp = crypto.createHash("sha256").update(otp).digest("hex");
  this.optExpires = Date.now() + 5 * 60 *  1000 ;
  return otp
}

// creating a user model
const User = mongoose.model("User",userSchema) ;

// for creating indexes
User.init();


module.exports =  User  ;
