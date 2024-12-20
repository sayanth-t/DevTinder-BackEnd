const mongoose = require('mongoose') ;

// async function for connecting db
const connectDB = async () => {
   await mongoose.connect( "mongodb+srv://sayantht160:rsj8N4VViJbxSd0K@dev-tinder.4grqp.mongodb.net/?retryWrites=true&w=majority&appName=dev-tinder" ) 
};


module.exports = connectDB ;


