const mongoose = require('mongoose') ;

// async function for connecting db
const connectDB = async () => {
   try {
      await mongoose.connect( process.env.MONGODB_CONNECTION_STRING ) 
      
   } catch (err) {
      console.log(err.message)
   }
};


module.exports = connectDB ;


