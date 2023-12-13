const { Schema, model } = require("mongoose");

const partnerSchema = new Schema({
  name: {
    type: String},
  address: {
    country: {
      type: String,
      default: 'Germany'},
    city: {
      type: String,
      default: 'Berlin',},
    street: {
      type: String,
      required: [true, 'Street is required.'],},
    home: {
      type: Number,
      required: [true, 'Home number is required.'],},
    postcode: {
      type: Number,
      required: [true, 'Number is required.'],},
  }
  });


const Partner = model("Partner", partnerSchema);

module.exports = Partner;

