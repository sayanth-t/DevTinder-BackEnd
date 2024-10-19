const express = require('express') ;
const app = express() ;

app.all("/users",(req,res)=>{
  res.send("work for all http requests on /users endpoint ") ;
})

app.get("/users",(req,res)=>{
  res.send("hello ....") ;
})

app.post("/users",(req,res)=>{
  res.send("Data is successfully stored..") ;
})

app.delete("/users",(req,res)=>{
  res.send("Data is deleted successfully") ;
})



app.listen(3000,()=>{
  console.log('Server is start to listen..');
})