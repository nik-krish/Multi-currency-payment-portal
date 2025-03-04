const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String },
    userType: { type: String },
    stripeCustomerId: { type: String, default: null },
    bankAccountDetails: {
      country: { type: String },
      currency: { type: String },
      routingNumber: { type: String },
      accountNumber: { type: String },
      accountHolderName: { type: String },
    },
  },
  { collection: "users-data" }
);
const model = mongoose.model("UserData", User);
module.exports = model;
