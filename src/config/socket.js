const {Server} = require('socket.io') 
const http = require('http')
const express = require('express') ;

const app = express() ;
// creating server 
const server = http.createServer(app) ;

// then create Socket.IO
const io = new Server(server,{
    cors : {
        origin : "http://localhost:5173"
    }
})

// for sending messages => we want reciever socketId
const getRecieverSocketId = (userId) => {
    return onlineUsers[userId]
}

// for storing online users
const onlineUsers = {} //{ userId : socketId }


io.on("connection",(socket)=>{

    console.log('---user is connected---')

    // when a user is online , get userId of that user
    const userId = socket.handshake.query.userId ;
    if(userId){
        onlineUsers[userId] = socket.id
    }

    // send events to all the connected clients
    io.emit( "onlineUsers" , Object.keys(onlineUsers) ) ;

    socket.on("disconnect",()=> {
        console.log('***user is diconnected***') ;
        if(Object.keys(onlineUsers).includes(userId)){
            delete onlineUsers[userId] ;
        }
        
        io.emit("onlineUsers", Object.keys(onlineUsers));
    })
})

module.exports = {
    io,
    app,
    server,
    getRecieverSocketId
}