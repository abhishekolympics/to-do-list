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
  callbackURL: 'http://localhost:3000/tasks'
}, (accessToken, refreshToken, profile, done) => {

  const userEmail = profile.emails[0].value;
    
    // Use the userEmail variable as needed, e.g., send it to the server or display it in the UI
    console.log('User Email:', userEmail);
  console.log('Google profile:');
  console.log('Name:', profile.displayName);
  console.log('Email:', profile.emails[0].value);

  // Generate a random password for the user
  const randomPassword = Math.random().toString(36).slice(-8);
  console.log('Random Password:', randomPassword);

  // Call done with the profile to proceed with authentication
  done(null, profile);
}));

app.get('/auth/google',
passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Extract user information from the Google profile
      const { id, displayName, emails } = req.user;

      // Generate a random password for the user
      const randomPassword = Math.random().toString(36).slice(-8);

      // Create a new user document in MongoDB
      const newUser = new User({
        username: displayName,
        email: emails[0].value,
        password: randomPassword // You might want to hash this password before saving
      });

      // Save the new user document to the database
      await newUser.save();

      // Redirect the user to the desired location
      res.redirect('/');
    } catch (error) {
      console.error('Error storing user data:', error);
      res.status(500).send('Server Error');
    }
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
