const Session = require("../models/Session");
const IpAddress = require("../models/IpAddress");
const ip = require('ip');

// Function to check if two IPs are in the same subnet
const isSameSubnet = (ip1, ip2, subnetMask = "255.255.255.0") => {
  // Convert IPs to their binary format
  const ip1Binary = ip.fromLong(ip.toLong(ip1) & ip.toLong(subnetMask));
  const ip2Binary = ip.fromLong(ip.toLong(ip2) & ip.toLong(subnetMask));

  return ip1Binary === ip2Binary; // Check if the binary representations match
};

const authenticateSession = async (req, res, next) => {
  console.log("cookies inside authenticate=", req.cookies);

  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res
        .status(401)
        .json({ msg: "No session ID found. Please log in." });
    }

    // Find the session in the database
    const session = await Session.findOne({ sessionId }).populate(
      "userId",
      "username email"
    );
    if (!session) {
      return res.status(401).json({ msg: "Invalid session. Please log in." });
    }

    const requestIp = req.ip || req.connection.remoteAddress; // Current request IP

    // Check if the current IP is already recorded for the user
    const ipAddressEntry = await IpAddress.findOne({
      userId: session.userId._id,
      ipAddresses: requestIp,
    });

    if (!ipAddressEntry) {
      // If the IP address is not found, store it
      await IpAddress.updateOne(
        { userId: session.userId._id },
        { $addToSet: { ipAddresses: requestIp } },
        { upsert: true } // Create a new document if it doesn't exist
      );
    }

    // Check if the recorded IP is the same or in the same subnet
    const recordedIp = session.ipAddress; // Previously recorded IP address
    const ipInRange = isSameSubnet(recordedIp, requestIp);

    // Allow access if either the current IP matches or it is in the same subnet
    if (!ipAddressEntry && !ipInRange) {
      return res
        .status(403)
        .json({ msg: "Session IP mismatch. Unauthorized access." });
    }

    // Optionally, check if user agent matches
    if (session.userAgent !== req.headers["user-agent"]) {
      return res
        .status(403)
        .json({ msg: "Session User Agent mismatch. Unauthorized access." });
    }

    // Attach user data to request for further processing
    req.user = session.userId;

    // Log the session information for monitoring
    console.log(
      `Session authenticated for user: ${req.user.username}, IP: ${requestIp}`
    );

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error in session authentication" });
  }
};

module.exports = authenticateSession;
