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
const MongoStore = require("connect-mongo");

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

//Enable cross origin Resource Sharing
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// Setup session
app.use(
  session({
    secret: "yourSecret",
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    // cookie: {
    //   domain: '.railway.app', // Explicitly set for Railway
    //   httpOnly: true,        // Adjust if you need access in frontend JS
    //   secure: true,          // Ensure secure only
    //   sameSite: 'none',      // Required for cross-origin cookies
    // },
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
      callbackURL:
        "https://to-do-list-production-8145.up.railway.app/auth/google/callback",
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

//Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (user, done) => {
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

    // Generate session ID
    const sessionId = generateSessionId();

    // Capture user-agent and IP address
    const userAgent = req.get("User-Agent");
    const ipAddress = req.ip;

    // Save session with user ID, user-agent, and IP address
    await Session.create({
      sessionId,
      userId: req.user._id,
      userAgent,
      ipAddress,
    });

    // Set session ID as an HTTP-only cookie
    res.cookie("sessionId", sessionId, {
      httpOnly: false,
      // secure: process.env.NODE_ENV === "production",
      domain: undefined,
      maxAge: 3600 * 1000, // 1 hour
    });

    console.log("session id inside google auth=", sessionId);

    // Redirect to the tasks page without showing the token in the URL
    res.redirect("http://localhost:3000/tasks");
  }
);

app.get("/login/success", authenticateSession, async (req, res) => {
  res
    .status(200)
    .json({ message: "User logged in successfully", user: req.user });
});

app.get("/logout", async (req, res, next) => {
  const sessionId = req.cookies.sessionId;

  // Remove the session from the database on logout
  await Session.findOneAndDelete({ sessionId });

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
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
