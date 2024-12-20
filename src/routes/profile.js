const express = require('express') ;
const profileRouter = express.Router() ;

const profileController = require('../controller/profile') ;



// import auth middleware
const {userAuth} = require('../middlewares/auth');


// profile API - GET/profile for getting user profile
profileRouter.get("/profile/view",userAuth, profileController.getProfile ) ;

// delete API - DELETE/user
profileRouter.delete("/profile/delete", userAuth , profileController.deleteProfile ) ;

// update the user
profileRouter.patch("/profile/edit",userAuth, profileController.editProfile ) ;

module.exports = profileRouter ;