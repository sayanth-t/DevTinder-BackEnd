const express = require('express') ;
const app = express() ;

// using express.json on every request
app.use(express.json()) ;

const connectDB = require('./config/database') ;

// require user model
const User = require('../models/user') ;

// handling route for signUp
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

connectDB()
  .then(()=>{
    console.log("Database is successfully connected..") ;
    app.listen(3000,()=>{
      console.log('Server is start to listen..');
    })
  }).catch((err)=>{
    console.log("database canot connected") ;
  })

