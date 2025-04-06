// import jsonwebtoken
const jwt = require('jsonwebtoken');
// require user model
const User = require('../models/user');
// import bcrypt
const bcrypt = require('bcrypt');
// import validation function
const { signupDataValidate, passwordValidate } = require('../utils/validation');
const nodemailer = require('nodemailer') ;
const {OAuth2Client} = require('google-auth-library') ;
const Mailgen = require('mailgen') ;
const crypto = require('crypto')
 
const client = new OAuth2Client(process.env.CLIENT_ID) ;

// create transporter
const transporter = nodemailer.createTransport({
  service : "gmail",
  auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
  },
});

const postSignupData = async (req, res) => {
  const { firstName, lastName, emailID, age } = req.body;

  try {
    const userExist = await User.findOne({ emailID });
    if (userExist) {
      throw new Error('Already have account with this EmailId');
    }

    // passing req to validation function
    signupDataValidate(req);
    // const passwordHash = await bcrypt.hash(password, 10);

    // creating a instance of User model and passing reqBody
    const user = new User({
      firstName,
      lastName,
      emailID,
      age
    });

    // saving into database
    await user.save();

    // for otp generation
    const otp = user.generateOtp() ;

    await user.save() ;

    const email = {
      body: {
        name: `${firstName}`,
        intro: "Welcome to devTinder We're very excited to have you on board.",
        // Add the verification code section
        instructions:
          'Please use the following verification code to complete your registration:',
        action: {
          button: {
            text: `Your Verification Code: ${otp} `, 
            color: '#22BC66', 
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        // Appears in header & footer of e-mails
        name: 'devTinder',
        link : "https://github.com/sayanth-t"
      },
    });

    const emailBody = mailGenerator.generate(email) ;

    const info = await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: emailID, 
      subject: 'Verification Code', 
      html: emailBody
    });
  
    console.log("Message sent: %s", info.messageId);

    if(info){
      res.json({
        userId : user._id ,
        message: `account creation for ${firstName} is successfull`,
      });
    }

  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

const verifyEmail = async (req,res) => {
  try {

    const {otp} = req.body ;
    const {userId} = req.params ;
    const user = await User.findById(userId) ;

    if(!user){
      throw new Error("user is not exist!") ;
    }

    if(!user.otp){
      throw new Error("Try Again!") ;
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")
    // check the otp is valid
    if(user.otp !== hashedOtp ){
      throw new Error("Entered OTP is not correct!") ;
    }
    if(Date.now() > user.otpExpires){
      throw new Error("OTP time Expires!") ;
    }

    res.json({
      verification : true ,
      message: "OTP verified"
    })
    
  } catch (err) {
    console.log(err.message)
    res.json({
      verification : false ,
      message : err.message
    })
  }
}

const verifyPassword = async (req,res) => {
  try {
    const {userId} = req.params ;
    const {password } = req.body ;

    passwordValidate(req) ;

    const user = await User.findById(userId) ;
    if(!user) {
      throw new Error("User is not found!" ) ;
    }

    // hashing the password
    const passwordHash = await bcrypt.hash(password,10) ;

    user.password = passwordHash ;
    await user.save() ;
    
    // creating jwt token 
    const token = await jwt.sign({ _id : user._id } ,  process.env.JWT_KEY ) ;
    // sending token to the user as cookie
    res.cookie('token', token);

    res.json({
      passwordVerification : true 
    })
  } catch (err) {
    console.log(err.message)
    res.status(400).json({
      passwordVerification : false ,
      message : err.message
    })
  }
}

const userLogin = async (req, res) => {
  try {
    
    const { emailID, password } = req.body;

    // check the user with entered emailID
    const user = await User.findOne({ emailID });

    if (!user) {
      throw new Error('invalid credentilas');
    }

    // To check a password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Creating and signing a JWT
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_KEY );

      // sending token to the user as cookie
      res.cookie('token', token);

      res.json({
        message: 'Login Successfully',
        user: user,
      });
    } else {
      throw new Error('invalid credentilas');
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
};

const googleAuthentication = async (req,res) => {
  try {
    const {token} = req.body ;

    const tokenTicket = await client.verifyIdToken({
      idToken : token ,
      audience : process.env.CLIENT_ID
    })

    const {name,email,picture,email_verified} = tokenTicket.getPayload() ;

    if(!email_verified){
      throw new Error("Email is not verified") ;
    }

    // checking the user email is already exist
    const userExist = await User.findOne({ emailID : email }) ;

  
    if(!userExist) {
      const user = new User({
        firstName : name ,
        emailID : email ,
        avatarURL : picture  
      })
      await user.save() ;

      const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_KEY) ;
      res.cookie('token', jwtToken);

      res.status(200).json({
        user : user ,
        message : "Logged Successfully!"
      })
    }
    else {
      const jwtToken = jwt.sign({ _id: userExist._id }, process.env.JWT_KEY) ;
      res.cookie('token', jwtToken);

      res.json({
        user : userExist ,
        message : "email already exist"
      })
    }

  } catch (err) {
    res.status(400).json({
      message : err.message
    })
    console.log(err.message)
  }
}

const userLogout = async (req, res) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
    });
    res.json({
      message: 'Logout Successfully',
    });
  } catch (error) {
    res.json({
      message : error.message
    })
  }
};

module.exports = { postSignupData, userLogin, userLogout , googleAuthentication , verifyEmail , verifyPassword };