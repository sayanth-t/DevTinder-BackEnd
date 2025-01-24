const {ConnectionRequest} = require('../models/connectionRequest') ;
// require user model
const User = require('../models/user') ;

const getFeed = async (req,res)=>{
  
  try {
    
    const loggedUser = req.user ;

    // find all connection requestes [ either sent or recieved ] 
    const connections = await ConnectionRequest
                                            .find({
                                              $or : [
                                                { fromUserId : loggedUser._id },
                                                { toUserId : loggedUser._id }
                                              ]
                                            })
                                            .select(['fromUserId' , 'toUserId'])
                                           

    const hideUsersFromFeed = new Set() ;
    connections.forEach( req => {
      hideUsersFromFeed.add(req.fromUserId.toString()) ;
      hideUsersFromFeed.add(req.toUserId.toString()) ;
    })

    

    const feedUsers = await User.find({
      _id : { $nin : Array.from(hideUsersFromFeed) }
    })

    console.log('feed users : ',feedUsers) ;

    res.json({
      hideUsersFromFeed
    })
    
  } catch (error) {
    res.status(400).send("Something went Wrong.."+error.message) ;
  }
}

module.exports = {getFeed}