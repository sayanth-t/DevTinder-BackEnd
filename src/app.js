const express = require('express') ;
const app = express() ;

// using express.json on every request
app.use(express.json()) ;

const connectDB = require('./config/database') ;

// require user model
const User = require('../models/user') ;

// GET user by email
app.get("/user",async (req,res)=> {
  const userEmail = req.body.emailID ;
  try {
    const users = await User.find({ "emailID" : userEmail }) ;
    if(user.length!==0){
      res.send(users) ;
    }
    else{
      res.send("user is not found with entered emailID!!") ;
    }
  } catch (error) {
    res.status(400).send('something went wrong!!') ;
  }
  
})

// signup API - POST/signup
app.post("/signup",async (req,res)=>{

  console.log(req.body) ;

  
  // creating a instance of User model and passing userObj
  const user = new User(req.body) ;

  try{
    // saving into database
    await user.save() ;
    res.send("data is stored inside database") ;
  }catch(err){
    res.status(400).send("Error while saving the user..") ;
  }
}
)

// feed API = GET/feed  for getting all the users from databse
app.get("/feed",async (req,res)=>{
  
  try {
    const users = await User.find()
    res.send(users) ;
    
  } catch (error) {
    res.status(400).send("Something went Wrong..") ;
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

