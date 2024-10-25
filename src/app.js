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

  console.log(userEmail) ;

  try {
    const user = await User.find({ emailID : userEmail }) ;
    if(user.lenght!==0){
      res.status(200).send(user) ;
    }
    else{
      res.status(404).send("user is not found with entered emailID!!") ;
    }
  } catch (error) {
    res.status(500).send('something went wrong!!') ;
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
    res.status(400).send(err.message) ;
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

  try {
    const userAfter = await User.findByIdAndUpdate(data.userId,data.dataUpdates, {returnDocument:'after',runValidators:true}) ;

    console.log(userAfter) ;
    res.status(200).send("user is updated successfully.") ;
  } catch (err) {
    res.status(500).send(`updating the documnet is fail !!` ) ;
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

