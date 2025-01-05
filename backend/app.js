require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("./models/User");
const session = require("express-session");
const Session = require("./models/Session");
const authenticateSession = require("./middleware/authenticateSession");
const generateSessionId = require("./utils/sessionUtils");
const cookieParser = require("cookie-parser");

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Session configuration based on environment
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: process.env.NODE_ENV === 'production' 
    ? {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
      }
    : {
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      }
};

// Add session middleware
app.use(session(sessionConfig));

// Setup Passport
app.use(passport.initialize());
app.use(passport.session());

// Cookie configuration function
const getCookieConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      domain: '.railway.app',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    };
  } else {
    return {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    };
  }
};

// Configure Passport
passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: `http://localhost:5000/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URI}/login`,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const sessionId = generateSessionId();
    const userAgent = req.get("User-Agent");
    const ipAddress = req.ip;

    // Create session in database
    const session = await Session.create({
      sessionId,
      userId: req.user._id,
      userAgent,
      ipAddress,
    });

    console.log("Created session:", session);

    // Get cookie config
    const cookieConfig = getCookieConfig();
    console.log("Using cookie config:", cookieConfig);

    // Set cookie
    res.cookie("sessionId", sessionId, cookieConfig);
    
    // Log the Set-Cookie header
    console.log("Set-Cookie header:", res.getHeader('Set-Cookie'));

    res.redirect(`${process.env.FRONTEND_URI}/tasks`);
  }
);

app.get("/login/success", authenticateSession, async (req, res) => {
  res.status(200).json({ message: "User logged in successfully", user: req.user });
});

app.get("/logout", async (req, res) => {
  const sessionId = req.cookies.sessionId;
  console.log("Logout - session ID:", sessionId);

  if (sessionId) {
    const deletedSession = await Session.findOneAndDelete({ sessionId });
    console.log("Deleted session:", deletedSession);
  }

  // Clear both session types
  req.logout(() => {
    res.clearCookie('sessionId', getCookieConfig());
    res.redirect(`${process.env.FRONTEND_URI}/login`);
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