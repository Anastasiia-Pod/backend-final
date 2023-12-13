const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SalesManager = require('../models/SalesManager.model.js');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const router = express.Router();
const saltRounds = 10;



router.get('/verify', isAuthenticated, (req, res) => {
  // If JWT token is valid, the payload gets decoded by the isAuthenticated middleware
  console.log('req.payload', req.payload);

  // Send back the object with user data previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;