const express = require('express') ;
const cors = require('cors') ;
const bodyParser = require('body-parser') ;
require('dotenv').config() ;
const {app,server} = require('./config/socket') ;
const connectDB = require('./config/database') ;

// import cookie-parser
const cookieParser = require('cookie-parser') ;

const authRouter = require('./routes/auth') ;
const profileRouter = require('./routes/profile') ;
const feedRouter = require('./routes/feed') ;
const requestRouter = require('./routes/request') ;
const userRouter = require('./routes/user')
const messageRouter = require('./routes/message')

// using cors middlware
app.use(cors(
  {
    origin : 'http://localhost:5173' ,
    credentials : true
  }
)) ;

// using express.json on every request
app.use(express.json({ limit: '50mb' })) ;

app.use(bodyParser.urlencoded({limit : "50mb" , extended : true }));

// put cookie-parser on every request
app.use(cookieParser())

app.use('/',authRouter ) ;
app.use('/',profileRouter ) ;
app.use('/',feedRouter ) ;
app.use('/',requestRouter ) ;
app.use('/', userRouter ) ;
app.use('/', messageRouter ) ;

connectDB()
  .then(()=>{
    console.log("MongoDB Connected!");
    server.listen(3000,()=>{
      console.log('Server is start to listen..');
    })
  }).catch((err)=>{
    console.log("database canot connected") ;
    console.log(err.message)
  })


