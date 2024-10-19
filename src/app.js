const express = require('express') ;
const app = express() ;

app.get("/",(req,res)=>{
  res.send("Home Page") ;
})

app.get("/contact",(req,res)=>{
  res.send("Contact for more details..") ;
})

app.listen(3000,()=>{
  console.log('Server is start to listen..');
})