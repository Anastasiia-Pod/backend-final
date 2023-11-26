const { Schema, model } = require('mongoose');
const salesManSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      default: 'Logistic Officer',
    },   
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    birthday: {
      type: Date, 
      required: [false, 'Birthday is not required.'],
    },
    country: {
      type: String,
      required: [false, 'Country is not required.'],
    },
    city: {
      type: String,
      required: [false, 'City is not required.'],
    }
  },
  {
    timestamps: true
  }
);
 
const SalesManager = model('SalesMan', salesManSchema);
module.exports = SalesManager;