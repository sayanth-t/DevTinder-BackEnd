const express = require('express') ;
const app = express() ;

// import cookie-parser
const cookieParser = require('cookie-parser') ;

require('dotenv').config() ;

// using express.json on every request
app.use(express.json()) ;

const connectDB = require('./config/database') ;

// put cookie-parser on every request
app.use(cookieParser())

const authRouter = require('./routes/auth') ;
const profileRouter = require('./routes/profile') ;
const feedRouter = require('./routes/feed') ;
const requestRouter = require('./routes/request') ;
const userRouter = require('./routes/user')


app.use('/',authRouter) ;
app.use('/',profileRouter) ;
app.use('/',feedRouter) ;
app.use('/',requestRouter) ;
app.use('/', userRouter) ;

connectDB()
  .then(()=>{
    console.log("Database is successfully connected..") ;
    app.listen(3000,()=>{
      console.log('Server is start to listen..');
    })
  }).catch((err)=>{
    console.log("database canot connected") ;
  })

