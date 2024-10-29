require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("./models/User");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Enable cross-origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Setup session with secure options
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      httpOnly: true, // Prevent JavaScript access to cookies
      sameSite: "lax", // Set cookie sharing policy
      maxAge: 3600 * 1000, // 1 hour in milliseconds
    },
  })
);

// Setup Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Google OAuth 2.0
passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "https://to-do-list-0kqb.onrender.com/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new User({
            username: profile?.displayName,
            email: profile?.emails[0].value,
            password: "Abhishek",
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate JWT token using the user's ID
    const token = jwt.sign({ user: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "3600s",
    });

    // Set token as a secure, HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      maxAge: 3600 * 1000, // 1 hour in milliseconds
    });

    // Redirect to tasks page
    res.redirect("http://localhost:3000/tasks");
  }
);

app.get("/login/success", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  const token = jwt.sign({ user: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "3600s",
  });

  res.status(200).json({ message: "User logged in", user: req.user, token });
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("token"); // Clear JWT cookie on logout
    res.redirect("http://localhost:3000/login");
  });
});

// Define routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
