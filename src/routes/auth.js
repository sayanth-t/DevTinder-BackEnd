const express = require('express') ;

// creating authRouter
const authRouter = express.Router() ;

const authController = require('../controller/auth') ;

// import auth middleware
const {userAuth} = require('../middlewares/auth') ;

// signup API - POST/signup
authRouter.post("/signup", authController.postSignupData ) ;

// verify email
authRouter.post("/signup/verifyEmail/:userId",authController.verifyEmail ) ;

// verify password
authRouter.post("/signup/verifyPassword/:userId",authController.verifyPassword ) ;

// login API - POST/login
authRouter.post("/login", authController.userLogin ) ;

// google authentication
authRouter.post('/auth/google',authController.googleAuthentication )

// logout
authRouter.post('/logout', userAuth , authController.userLogout )

// export authRouter
module.exports = authRouter ;