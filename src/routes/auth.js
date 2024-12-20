const express = require('express') ;

// creating authRouter
const authRouter = express.Router() ;

const authController = require('../controller/auth') ;

// import auth middleware
const {userAuth} = require('../middlewares/auth') ;

// signup API - POST/signup
authRouter.post("/signup", authController.postSignupData )

// login API - POST/login
authRouter.post("/login", authController.userLogin )

// logout
authRouter.post('/logout', userAuth , authController.userLogout )

// export authRouter
module.exports = authRouter ;