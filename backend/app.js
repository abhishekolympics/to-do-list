const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const app = express();

app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'your-mongo-db-url' }), // MongoDB session store
  cookie: { maxAge: 3600000, httpOnly: true, secure: true, sameSite: 'lax' }
}));

app.use(passport.initialize());
app.use(passport.session());

// Example Google OAuth callback route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  (req, res) => {
    req.session.save((err) => {  // Ensure session persistence before redirect
      if (err) console.error("Session save error:", err);
      res.redirect('/login/success');
    });
  }
);

// Protected route to verify login success
app.get('/login/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Login successful', user: req.user });
  } else {
    res.status(401).json({ message: 'Not Authorized' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
