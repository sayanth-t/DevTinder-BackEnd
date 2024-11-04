const express = require('express') ;
const app = express() ;

// import auth middleware
const {userAuth} = require('./middlewares/auth')

// import jsonwebtoken
const jwt = require('jsonwebtoken') ;

// import cookie-parser
const cookieParser = require('cookie-parser')

// import bcrypt
const bcrypt = require('bcrypt') ;

// import validation function 
const validateSignupData = require('./utils/validation') ;

// using express.json on every request
app.use(express.json()) ;

const connectDB = require('./config/database') ;

// require user model
const User = require('./models/user') ;

// put cookie-parser on every request
app.use(cookieParser())


// signup API - POST/signup
app.post("/signup",async (req,res)=>{

  const {firstName,lastName,emailID,age,password,confirmPassword} = req.body ;

  try{

    // passing req to validation function
    validateSignupData(req) ;

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
)

// login API - POST/login
app.post("/login",async (req,res)=>{
  try {
    const {firstName,lastName,emailID,password} = req.body;

    // check the user with entered emailID
    const user = await User.findOne({firstName,lastName,emailID}) ;

    console.log(user) ;

    if(!user){
      throw new Error("invalid credentilas") ;
    }

    // To check a password
    const isPasswordValid = await bcrypt.compare(password,user.password) ;
    if(isPasswordValid) {

      // Creating and signing a JWT
      const token = jwt.sign({ _id : user._id },'DeV@ti8*9rR',{expiresIn:60})
      
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
})

// feed API = GET/feed  for getting all the users from databse
app.get("/feed",async (req,res)=>{
  
  try {
    const users = await User.find()
    res.send(users) ;
    
  } catch (error) {
    res.status(400).send("Something went Wrong..") ;
  }
})

// profile API - GET/profile for getting user profile
app.get("/profile",userAuth,async (req,res)=>{

  try {
    const {user} = req ;
    res.send(user) ;
  } catch (err) {
    res.status(400).send("Error! "+err.message) ;
  }
  
})

// delete API - DELETE/user
app.delete("/user",async (req,res)=>{
  const userId = req.body.userId ;
  console.log(userId) ;

  try {
    await User.findByIdAndDelete(userId) ;
    res.status(200).send("user is deleted succeessfully") ;
  } catch (error) {
    res.status(500).send("Something went wrong...!") ;
  }
}
)

// update the user
app.patch("/user",async (req,res)=>{
  const data = req.body ;
  const dataUpdates = req.body.dataUpdates ;

  try {

    console.log(dataUpdates) ;

    // for prevent update of certain fields
    const allowed_updates = ["firstName","lastName","age","gender","skills","password"] ;
    const isupdateAllowed = Object.keys(dataUpdates).every((key)=> allowed_updates.includes(key) ) 

    
    if(!isupdateAllowed) {
      throw new Error("the field cant update!") ;
    }

    // checking the number of skills
    if(dataUpdates.skills && dataUpdates.skills.length > 4){
      throw new Error("only 4 skills are allowed ") ;
    }

    // updating user by ID 
    const userAfter = await User.findByIdAndUpdate(data.userId,data.dataUpdates, {returnDocument:'after',runValidators:true}) ;

    console.log(userAfter) ;
    res.status(200).send("user is updated successfully.") ;
  } catch (err) {
    res.status(500).send(`updating the documnet is fail !!`+ err.message ) ;
  }
    
})


connectDB()
  .then(()=>{
    console.log("Database is successfully connected..") ;
    app.listen(3000,()=>{
      console.log('Server is start to listen..');
    })
  }).catch((err)=>{
    console.log("database canot connected") ;
  })

