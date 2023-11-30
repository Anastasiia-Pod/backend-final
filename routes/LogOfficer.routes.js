const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const LogOfficer = require("../models/LogOfficer.model.js");


const { isAuthenticated } = require('../middleware/jwt.middleware.js');


const router = express.Router();
const saltRounds = 10;


// POST /LogOff/signup  - Creates a new LogOff in the database
router.post('/logistics/signup', (req, res, next) => {
  const { email, password, name, role} = req.body;
console.log(email)
  // Check if email or password or name are provided as empty string 
  if (email === '' || password === '' || name === '') {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }
  
  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }


  // Check the LogOfficer collection if a LogOfficer with the same email already exists
  LogOfficer.findOne({ email })
    .then((foundLogOfficer) => {
      // If the LogOfficer with the same email already exists, send an error response
      if (foundLogOfficer) {
        res.status(400).json({ message: "Logistic Officer already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new LogOfficer in the database
      // We return a pending promise, which allows us to chain another `then` 
      return LogOfficer.create({ email, passwordHash :hashedPassword, username:name , role});
    })
    .then((createdLogOfficer) => {
        if(!createdLogOfficer){return}
        console.log(createdLogOfficer)

      // Deconstruct the newly created LogOfficer object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id, role } = createdLogOfficer;
    
      // Create a new object that doesn't expose the password
      const user = { email, name, _id, role };

      // Send a json response containing the LogOfficer object
      res.status(201).json({ logOfficer: user });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" })
    });
});


// POST  /auth/login - Verifies email and password and returns a JWT
router.post('/logistics/login', (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string 
  if (email === '' || password === '') {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the logOfficer collection if a user with the same email exists
  LogOfficer.findOne({ email })
    .then((foundLogOfficer) => {
    
      if (!foundLogOfficer) {
        // If the LogOfficer is not found, send an error response
        res.status(401).json({ message: "Logistic Officer not found." })
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundLogOfficer.passwordHash);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name , role} = foundLogOfficer;
        
        // Create an object that will be set as the token payload
        const payload = { _id, email, name,role };

        // Create and sign the token
        const authToken = jwt.sign( 
          payload,
          process.env.TOKEN_SECRET,
          { algorithm: 'HS256', expiresIn: "6h" }
        );

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      }
      else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }

    })
    .catch((err) => { console.log(err),    res.status(500).json({ message: "Internal Server Error" })    });
});


// GET  /logistics/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});


module.exports = router;