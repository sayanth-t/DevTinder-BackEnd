const Message = require('../models/message');

const cloudinary = require('../config/cloudinary');
const { getRecieverSocketId, io } = require('../config/socket');

// get message with a user
const getMessage = async (req, res) => {
  try {
  
    const loggedInUser = req.user;
    const { id } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: id, recieverId: loggedInUser._id },
        { senderId: loggedInUser._id, recieverId: id },
      ],
    });

    res.status(200).json({
      data: messages,
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({
        messsage : err.message
    })
  }
};

// for sending message
const sendmessage = async (req,res) => {
    try {
        const {recieverId} = req.params ;
        const loggedInUser = req.user ;

        const {text,imagePreview} = req.body ;
        
        let image ;
        if(imagePreview) {
          const response = await cloudinary.uploader.upload(imagePreview) ;
          image = response.secure_url
        }

        const newMessage = new Message({
            senderId : loggedInUser._id ,
            recieverId : recieverId ,
            text ,
            image 
        })

        await newMessage.save() ;

        // getting reciever socketId 
        const recieverSocketId = getRecieverSocketId(recieverId) ;
        if(recieverSocketId){
          io.to(recieverSocketId).emit("newMessage",newMessage) ;
        }

        res.status(200).json({
            message : newMessage
        })
    } catch (err) {
        console.log(err.message) ;
        res.status(500).json({
            message : err.message
        })
     }
}

module.exports = {
  getMessage,
  sendmessage
};
