// import validator package
const validator = require('validator') ;

const signupDataValidate = (req) =>{
  const {firstName,lastName,emailID,age} = req.body ;

  // checking the firstName is empty or not
  if(validator.isEmpty(firstName)){
    throw new Error("name is empty ! ") ;
  }

  // checking the name contain any numeric values
  if(!validator.isAlpha(firstName)) {
    throw new Error("name Can't contain any number !") ;
  }

  // checking email is valid or not
  if(!validator.isEmail(emailID)){
    throw new Error("Email is not valid ! ") ;
  }

}

const validateProfileEditData = (req) => {

  // for prevent update of certain fields
  const allowed_updates = ["firstName","lastName","age","gender","skills","about","avatarURL"] ;
  const isupdateAllowed = Object.keys(req.body).every((key)=> allowed_updates.includes(key) ) ;

  if(!isupdateAllowed) {
    throw new Error("the field cant update!") ;
  }

}

const passwordValidate = (req) => {
  const {password} = req.body ;
  if(!validator.isStrongPassword(password)){
    throw new Error("Enter a Strong Password!") ;
  }
}

module.exports = { signupDataValidate ,validateProfileEditData , passwordValidate } ;