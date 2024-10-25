const mongoose = require('mongoose') ;

const userSchema = mongoose.Schema({
  firstName : {
    type : String ,
    required : true ,
    minLength: 4
  },
  lastName : {
    type : String,
    required : true 
  },
  emailID : {
    type : String,
    required : true,
    lowercase: true ,
    trim : true ,
    unique: true
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
  createdAt:{
    type : Date ,
    default : Date.now 
  }
},{ timestamps: true })

// creating a user model
const User = mongoose.model("User",userSchema) ;

// for creating indexes
User.init();

module.exports = User;
