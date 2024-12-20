const { connect } = require('mongoose');
const {ConnectionRequest} = require('../models/connectionRequest') ;

const getRequests = async (req,res) => {
  try {
    const loggedInUser = req.user ;
    const requests = await ConnectionRequest
                                          .find({
                                            toUserId : loggedInUser._id ,
                                            status : "interested"
                                          })
                                          .populate({ path: 'fromUserId' , select : ['firstName','lastName','age']}) ;

    res.json({
      requests :  requests
    })
    } catch (err) {
      res.status(400).send('Something went wrong!'+err.message) ;
    }
}

const getConnections = async (req,res) => {

  const loggedInUser = req.user ;
  const connectionRequests = await ConnectionRequest
                                  .find({ 
                                    $or : [ { toUserId : loggedInUser._id , status : 'accepted' } , 
                                      { fromUserId : loggedInUser._id , status : 'accepted' } ] })
                                  .populate('fromUserId',['firstName','lastName','age']) 
                                  .populate('toUserId',['firstName','lastName','age']) 
 
  const loggedInUserId = (loggedInUser._id ).toString()  


  const connections = connectionRequests.map((connection)=> {
    if( connection.fromUserId._id === loggedInUserId ){
      return (connection.toUserId) ;
    }
    else{
      return (connection.fromUserId) ;
    }
  } )

  res.json({
    connections : connections
  })
}
module.exports = {
                  getRequests,
                  getConnections
                  } ;