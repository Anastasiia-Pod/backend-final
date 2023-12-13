const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SalesManager = require('../models/SalesManager.model.js');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const router = express.Router();
const saltRounds = 10;

// POST /sales/signup - Creates a new Sales Manager in the database
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if email, password, or name is provided as an empty string
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Provide email, password, and name' });
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Provide a valid email address.' });
    }

    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
      });
    }

    // Check if a user with the same email already exists
    const foundUser = await SalesManager.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create the new user in the database
    const createdUser = await SalesManager.create({ email, password: hashedPassword, name, role });

    // Omit the password from the response
    const { _id, email: userEmail, name: userName } = createdUser;
    const user = { _id, email: userEmail, name: userName, role };

    // Send a json response containing the user object
    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /sales/login - Verifies email and password and returns a JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is provided as an empty string
    if (!email || !password) {
      return res.status(400).json({ message: 'Provide email and password.' });
    }

    // Check if a user with the given email exists
    const foundUser = await SalesManager.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Compare the provided password with the one saved in the database
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {
      // Omit the password from the response
      const { _id, email: userEmail, name: userName, role } = foundUser;
      const payload = { _id, email: userEmail, name: userName, role };

      // Create and sign the token
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '6h' });

      // Send the token as the response
      res.status(200).json({ authToken });
    } else {
      res.status(401).json({ message: 'Unable to authenticate the user' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /sales/verify - Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res) => {
  // If JWT token is valid, the payload gets decoded by the isAuthenticated middleware
  console.log('req.payload', req.payload);

  // Send back the object with user data previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;

