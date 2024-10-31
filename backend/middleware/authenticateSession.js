const Session = require("../models/Session");

const authenticateSession = async (req, res, next) => {

  console.log("cookies inside authenticate=",req.cookies);

  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({ msg: "No session ID found. Please log in." });
    }

    // Find the session in the database
    const session = await Session.findOne({ sessionId }).populate("userId", "username email");
    if (!session) {
      return res.status(401).json({ msg: "Invalid session. Please log in." });
    }

    // Check if IP address matches
    const requestIp = req.ip || req.connection.remoteAddress;
    console.log("session ip address=",session.ipAddress);
    console.log("ip address recieved=",req.ip);
    console.log("remote address=",req.connection.remoteAddress);
    if (session.ipAddress !== requestIp) {
      return res.status(403).json({ msg: "Session IP mismatch. Unauthorized access." });
    }

    // Optionally, check if user agent matches
    if (session.userAgent !== req.headers["user-agent"]) {
      return res.status(403).json({ msg: "Session User Agent mismatch. Unauthorized access." , sessionId:sessionId });
    }

    // Attach user data to request for further processing
    req.user = session.userId;

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error in session authentication" });
  }
};

module.exports = authenticateSession;
