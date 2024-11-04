// Import jsonwebtoken
const jwt = require('jsonwebtoken');

// Import User collection
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    // Read the token from req.cookies
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error('Token is not valid!');
    }

    // Validate the token
    const decoded = await jwt.verify(token, 'DeV@ti8*9rR');

    // Destructure decoded and extract _id
    const { _id } = decoded;

    // Find the user
    const user = await User.findById(_id);  // Added await here

    if (!user) {
      throw new Error('User is not present!');
    }

    // Attach the user to the request object
    req.user = user;

    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    // Send a 401 Unauthorized status 
    res.status(401).send({ error: 'Authentication failed: ' + error.message });
  }
};

module.exports = { userAuth };
