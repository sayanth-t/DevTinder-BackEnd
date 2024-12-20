const mongoose = require('mongoose') ;
const {Schema} = mongoose ;



// creating connectionRequestSchema

const connectionRequestSchema = new Schema({
  fromUserId : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User", // reference to User collection
    required : true
  },
  toUserId : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "User" ,
    required : true
  },
  status : {
    type : String ,
    required : true ,
    enum : {
      values : ["ignored","interested","accepted","rejected"] ,
      message : `{VALUE} is incorrect status type`
    }
  }
},{ timestamps: true }) ;

// pre middleware function
connectionRequestSchema.pre("save", function (next) {

  const connectionRequest = this ;

  // check if logged user is send connection request to itself
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error('cant send connection request to yourself') ;
  }

  next() ;
      
})

// creating compound index for fromuserid and toUserId
connectionRequestSchema.index({ fromUserId : 1 , toUserId : 1 }) ;

// creating model
const ConnectionRequest = mongoose.model('ConnectionRequest',connectionRequestSchema) ;

module.exports = {ConnectionRequest} ;