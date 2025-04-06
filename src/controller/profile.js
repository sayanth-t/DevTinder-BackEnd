const User = require('../models/user');

// import validateProfileData
const { validateProfileEditData } = require('../utils/validation') ;

const cloudinary = require('../config/cloudinary')

const getProfile = async (req,res)=>{

  try {
    const {user} = req ;

    const userDetailes = await User.findOne({_id:user._id}).select("-password -emailID")

    res.json({
      message : userDetailes
    })
  } catch (err) {
    console.log(err.message)
    res.status(400).send("Error! "+err.message) ;
  }
  
}

const deleteProfile = async (req,res)=>{
  
  const user = req.user ;
  const userId = user._id ;

  try {
    await User.findByIdAndDelete(userId) ;
    res.status(200).send("user is deleted succeessfully") ;
  } catch (error) {
    res.status(500).send("Something went wrong...!") ;
  }
}

const editProfile = async (req,res)=>{

  try {

    // validating profile edit data
    validateProfileEditData(req) ;

    const loggedInUser = req.user ; 

    const { firstName , lastName , emailId , age ,about  } = req.body ;

    // updating loggedInUser object
    Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key] ) ;

    // updating user on database
    await User.findByIdAndUpdate( loggedInUser._id , { $set : { firstName , lastName , emailId , age , about }} )       

  
    res.status(200).json({
      userData : loggedInUser
    }) ;
  } catch (err) {
    res.status(500).send( `updating the documnet is fail !!`+ err.message ) ;
  }
    
}

const editProfileAvatar = async (req,res) => {
  try {

    const {avatarURL} = req.body  ;
    const user = req.user ;

    if(!avatarURL) {
      throw new Error("Please Select a Profile Pic!") ;
    }

    // uploading to cloudinary
    const cloudRes = await cloudinary.uploader.upload(avatarURL)

    const updatedUser = await User.findByIdAndUpdate( user._id , { $set : { avatarURL : cloudRes.secure_url  }} , { new : true} )       ;
    res.status(200).json(updatedUser)

  } catch (err) {
    console.log(err.message)
  }
}

module.exports = { getProfile ,
                  deleteProfile ,
                  editProfile ,
                  editProfileAvatar
}