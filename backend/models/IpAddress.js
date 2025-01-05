const mongoose = require("mongoose");

const ipAddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
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

ipAddressSchema.index({ userId: 1, createdAt: -1 });
module.exports = mongoose.model("IpAddress", ipAddressSchema);
