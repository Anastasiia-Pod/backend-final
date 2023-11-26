const { Schema, model } = require("mongoose");

const partnerSchema = new Schema({
  name: String,
  address: String,
  });

const Partner = model("Partner", partnerSchema);

module.exports = Partner;