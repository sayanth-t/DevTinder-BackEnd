const mongoose = require('mongoose') ;

const userSchema = mongoose.Schema({
  firstName : {
    type : String 
  },
  lastName : {
    type : String
  },
  emailID : {
    type : String
  },
  age : {
    type : Number
  }
})

// creating a user model
const User = mongoose.model("User",userSchema) ;



module.exports = User;
