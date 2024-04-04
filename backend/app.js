const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Create Express app
const app = express();

passport.use(new GoogleStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: 'http://localhost:3000/'
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  res.json({ token });

  // Use profile information to create or authenticate user
  // For example:
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
}));

app.get('/auth/google',
passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
(req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/');
});

// Backend route for initiating Google OAuth authentication
// app.get('/api/auth/google', (req, res) => {
//   // Redirect the user to Google's OAuth consent screen
//   res.redirect('https://accounts.google.com/o/oauth2/v2/auth?client_id=31010736820-uk9hc3go21lau3bkb183m4jak8hsomon.apps.googleusercontent.com&redirect_uri=http://localhost:5000/api/auth/google/callback&response_type=code&scope=email profile openid');
// });


// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
