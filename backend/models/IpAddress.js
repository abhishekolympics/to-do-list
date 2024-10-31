const mongoose = require("mongoose");

const ipAddressSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true, // Ensure each sessionId can only have one associated IP
  },
  ipAddresses: [{
    type: String,
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 const IpAddress = new mongoose.model("IpAddress", ipAddressSchema);

 module.exports = IpAddress;
