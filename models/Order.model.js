const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  name: String,
  email: String,
  address: String, 
  restaurantName: String,
  good: [
    {
      name: String,
      price: Number,
      weight: Number,
    }
  ],
});

const Order = model("Order", orderSchema);

module.exports = Order;