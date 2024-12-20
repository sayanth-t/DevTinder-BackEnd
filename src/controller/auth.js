// import jsonwebtoken
const jwt = require('jsonwebtoken') ;
// require user model
const User = require('../models/user') ;
// import bcrypt
const bcrypt = require('bcrypt') ;
// import validation function 
const { signupDataValidate } = require('../utils/validation') ;



const postSignupData = async (req,res)=>{

  const {firstName,lastName,emailID,age,password,confirmPassword} = req.body ;

  try{

    // passing req to validation function
    signupDataValidate(req) ;

    console.log(password)

    const passwordHash = await bcrypt.hash(password,10);

    console.log(passwordHash) ;

    // creating a instance of User model and passing reqBody
    const user = new User({
      firstName,
      lastName,
      emailID,
      age,
      password : passwordHash
    }) ;

    // saving into database
    await user.save() ;

    res.send("data is stored inside database") ;
  }catch(err){
    res.status(400).send(err.message) ;
  }
}

const userLogin = async (req,res)=>{
  try {
    const {emailID,password} = req.body;

    // check the user with entered emailID
    const user = await User.findOne({emailID}) ;

    console.log(user) ;

    if(!user){
      throw new Error("invalid credentilas") ;
    }

    // To check a password
    const isPasswordValid = await bcrypt.compare(password,user.password) ;
    if(isPasswordValid) {

      // Creating and signing a JWT
      const token = await jwt.sign({ _id : user._id },'DeV@ti8*9rR') ;
      
      console.log(token) ;

      // sending token to the user as cookie
      res.cookie("token",token) ;

      res.send("Login Successfully") ;
    
    }
    else{
      throw new Error ("invalid credentilas") ;
    }

  } catch (err) {
    res.status(500).send("something went wrong!"+err.message) ;
  }
}

const userLogout = async (req,res) => {
  res.cookie("token",null,{
    expires: new Date(Date.now() )
  })
  res.send('logout successfully') ;
}

module.exports = { postSignupData , 
                  userLogin ,
                  userLogout } 