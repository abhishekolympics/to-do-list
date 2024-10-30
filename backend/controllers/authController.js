const bcrypt = require("bcryptjs");
const User = require("../models/User");
const config = require("../config/index");
const Session = require("../models/Session");

// Register a new user
const register = async (req, res) => {
  try {
    // Extract user details from request body
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User with this email already exists" });
    }

    // Create a new user instance
    user = new User({ username, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Generate session ID
    const sessionId = generateSessionId();
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    await Session.create({
      sessionId,
      userId: user._id,
      userAgent,
      ipAddress,
    });

    // Set session ID as HTTP-only cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      domain: undefined,
      maxAge: 3600 * 1000,
    });

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Login user
const login = async (req, res) => {
  try {
    // Extract user details from request body
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate session ID
    const sessionId = generateSessionId();
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    await Session.create({
      sessionId,
      userId: user._id,
      userAgent,
      ipAddress,
    });

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      domain: undefined,
      maxAge: 3600 * 1000,
    });

    res.status(200).json({ msg: "User logged in successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  register,
  login,
};
