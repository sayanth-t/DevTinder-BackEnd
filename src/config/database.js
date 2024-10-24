const mongoose = require('mongoose') ;

// async function for connecting db
const connectDB = async () => {
   await mongoose.connect('mongodb+srv://sayantht160:r5RIvuaOeCl3XEg6@cluster0.2issj.mongodb.net/devTinder?retryWrites=true&w=majority') 
};


module.exports = connectDB ;


