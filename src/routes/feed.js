const express = require('express') ;
const feedRouter = express.Router() ;

// require user model
const User = require('../models/user') ;

// feed API = GET/feed  for getting all the users from databse
feedRouter.get("/feed",async (req,res)=>{
  
  try {
    const users = await User.find()
    res.send(users) ;
    
  } catch (error) {
    res.status(400).send("Something went Wrong..") ;
  }
})

module.exports = feedRouter ;