const Session = require("../models/Session");
const IpAddress = require("../models/IpAddress");
const ip = require('ip');

const isSameSubnet = (ip1, ip2, subnetMask = "255.255.255.0") => {
  const ip1Binary = ip.fromLong(ip.toLong(ip1) & ip.toLong(subnetMask));
  const ip2Binary = ip.fromLong(ip.toLong(ip2) & ip.toLong(subnetMask));

  return ip1Binary === ip2Binary;
};

const cache = new Map();

const authenticateSession = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res
        .status(401)
        .json({ msg: "No session ID found. Please log in." });
    }

    if (cache.has(sessionId)) {
      req.user = cache.get(sessionId);
      return next();
    }


    const session = await Session.findOne({ sessionId }).hint({ sessionId: 1}).populate(
      "userId",
      "username email"
    );
    if (!session) {
      return res.status(401).json({ msg: "Invalid session. Please log in." });
    }

    if (session) {
      cache.set(sessionId, session.userId);
    }
    
    const requestIp = req.ip || req.connection.remoteAddress;

    const ipAddressEntry = await IpAddress.findOne({
      userId: session.userId._id,
      ipAddresses: requestIp,
    });

    if (!ipAddressEntry) {
      await IpAddress.updateOne(
        { userId: session.userId._id },
        { $addToSet: { ipAddresses: requestIp } },
        { upsert: true }
      );
    }

    const recordedIp = session.ipAddress;
    const ipInRange = isSameSubnet(recordedIp, requestIp);
    if (!ipAddressEntry && !ipInRange) {
      return res
        .status(403)
        .json({ msg: "Session IP mismatch. Unauthorized access." });
    }
    if (session.userAgent !== req.headers["user-agent"]) {
      return res
        .status(403)
        .json({ msg: "Session User Agent mismatch. Unauthorized access." });
    }
    req.user = session.userId;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error in session authentication" });
  }
};

module.exports = authenticateSession;
