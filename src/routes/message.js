const express = require('express') ;
const messageRouter = express.Router() ;

const messageController = require('../controller/message') ;
const { userAuth } = require('../middlewares/auth');

// get message
messageRouter.get('/message/:id',userAuth,messageController.getMessage) ;

// for sending messages
messageRouter.post('/message/send/:recieverId',userAuth,messageController.sendmessage) ;

module.exports = messageRouter