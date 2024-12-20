// import validator package
const validator = require('validator') ;

const signupDataValidate = (req) =>{
  const {firstName,lastName,emailID,age,password,confirmPassword} = req.body ;

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

  // checking the password is strong or not
  if(!validator.isStrongPassword(password)){
    throw new Error("Create a strong Password !") ;
  }

  // checking the password and confirm password are equal
  if(!password===confirmPassword){
    throw new Error("password are different")
  }
}

const validateProfileEditData = (req) => {

  // for prevent update of certain fields
  const allowed_updates = ["firstName","lastName","age","gender","skills","password"] ;
  const isupdateAllowed = Object.keys(req.body).every((key)=> allowed_updates.includes(key) ) ;

  if(!isupdateAllowed) {
    throw new Error("the field cant update!") ;
  }

}

module.exports = { signupDataValidate ,validateProfileEditData } ;