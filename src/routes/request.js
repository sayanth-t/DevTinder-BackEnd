const express = require('express') ;
const requestRouter = express.Router() ;

// import auth middleware
const {userAuth} = require('../middlewares/auth');

const request = require('../controller/request') ;

// post data when send connection request
requestRouter.post('/request/send/:status/:toUserId', userAuth , request.requestSend ) ;

// post data when review connection request
requestRouter.post('/request/review/:status/:requestId' , userAuth , request.requestReview )

module.exports = requestRouter ;

