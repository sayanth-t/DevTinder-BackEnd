const express = require('express') ;
const userRouter = express.Router() ;

const {userAuth} = require('../middlewares/auth')

const userController = require('../controller/user') ;

// get pending connection request for loggedInUser
userRouter.get('/user/request/recieved' , userAuth , userController.getRequests ) ;

// get all connections
userRouter.get('/user/request/connections',userAuth, userController.getConnections ) ;

module.exports = userRouter ; 