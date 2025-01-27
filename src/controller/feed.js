const {ConnectionRequest} = require('../models/connectionRequest') ;
// require user model
const User = require('../models/user') ;

const getFeed = async (req,res)=>{
  
  try {

    const page = parseInt(req.query.page) ;
    const limit = parseInt(req.query.limit) ;

    const skipNumber = page > 0 ? ( page - 1 ) * limit : 0 ;
    const limitNumber = limit ? limit : 2 ;
    
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

    if(!hideUsersFromFeed.has(loggedUser._id)){
      hideUsersFromFeed.add(loggedUser._id.toString()) ;
    }

    const feedUsers = await User
                              .find({
                                _id : { $nin : Array.from(hideUsersFromFeed) }
                              })
                              .select("firstName lastName age gender")
                              .skip(skipNumber)
                              .limit(limitNumber)
                                           

    res.json({
      feedUsers
    })
    
  } catch (error) {
    res.status(400).send("Something went Wrong.."+error.message) ;
  }
}

module.exports = {getFeed}