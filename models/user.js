const mongoose = require('mongoose') ;

// importing validator
var validator = require('validator');

const userSchema = mongoose.Schema({
  firstName : {
    type : String ,
    required : true ,
    minLength: 4 ,
    trim : true
  },
  lastName : {
    type : String,
    required : true ,
    minLength : 1
  },
  emailID : {
    type : String,
    required : true,
    lowercase: true ,
    trim : true ,
    unique: true ,
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
    validate(value){
      if(!["male","female","others"].includes(value)){
        throw new error('Gender is not valid') ;
      }
    }
  },
  skills : {
    type : [String] 
  },
  password : {
    type : String
  }
  ,confirmPassword : {
    type : String
  }
},{ timestamps: true })

// creating a user model
const User = mongoose.model("User",userSchema) ;

// for creating indexes
User.init();

module.exports = User;
