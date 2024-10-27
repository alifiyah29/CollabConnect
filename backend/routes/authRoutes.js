const express = require('express');
const passport = require('passport');

const router = express.Router();

// Initiate Google Authentication
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Handle Google callback and redirect
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/');  // Redirect to your frontend app
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
