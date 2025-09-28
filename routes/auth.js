const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // ✅ Make sure this path is correct

// Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      // 🔎 Find existing user by email
      let user = await User.findOne({ email: req.user.emails[0].value });

      // 🆕 If not found, create a new one
      if (!user) {
        user = await User.create({
          firstName: req.user.name.givenName,
          lastName: req.user.name.familyName,
          email: req.user.emails[0].value,
          password: 'GOOGLE_OAUTH_USER', // 👈 Bypass required field
          role: 'customer'
        });
      }

      // ✅ Sign JWT with DB user's _id
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect with token
      res.redirect(`/welcome?token=${token}`);
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.redirect('/error');
    }
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
