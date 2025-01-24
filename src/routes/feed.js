const express = require('express') ;
const feedRouter = express.Router() ;

const feedController = require('../controller/feed')


const { userAuth } = require('../middlewares/auth');

// feed API = GET/feed  for getting all the users from databse
feedRouter.get("/feed",userAuth, feedController.getFeed )

module.exports = feedRouter ;