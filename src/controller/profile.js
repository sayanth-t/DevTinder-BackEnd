const User = require('../models/user');

const getProfile = async (req,res)=>{

  try {
    const {user} = req ;
    res.send(user) ;
  } catch (err) {
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

// import validateProfileData
const { validateProfileEditData } = require('../utils/validation') ;


const editProfile = async (req,res)=>{

  try {

    // validating profile edit data
    validateProfileEditData(req) ;

    const loggedInUser = req.user ; /* attached to req object in 'userAuth' middleware */

    // updating loggedInUser object
    Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key] ) ;

    // updating user on database
    

    console.log(loggedInUser) ;
    res.status(200).send("user is updated successfully.") ;
  } catch (err) {
    res.status(500).send(`updating the documnet is fail !!`+ err.message ) ;
  }
    
}

module.exports = { getProfile ,
                  deleteProfile ,
                  editProfile
}