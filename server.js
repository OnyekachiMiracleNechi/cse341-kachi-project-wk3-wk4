require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');

const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const authenticate = require('./middlewares/auth'); // JWT middleware
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for Swagger and front-end requests
app.use(cors());

// Middleware
app.use(express.json());

// Session for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport setup for Google OAuth
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const User = require('./models/users');
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            password: '', // OAuth user doesn't need password
            role: 'customer',
          });
        }
        // Generate JWT
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        user.token = token; // attach token for frontend use
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
// Users routes (protected)
app.use('/users', authenticate, usersRoutes);
app.use('/api/users', authenticate, usersRoutes);

// Products routes
// Only GET routes are public, others are protected
app.use('/products', productsRoutes);
app.use('/api/products', productsRoutes);

// Orders routes
// GET routes are public, POST/PUT/DELETE are protected inside the router
app.use('/orders', ordersRoutes);
app.use('/api/orders', ordersRoutes);

// OAuth Routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.json({
      success: true,
      message: 'Logged in with Google',
      token: req.user.token,
      user: req.user,
    });
  }
);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the API 🚀');
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: 'ecommerce-api',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ MongoDB connected via Mongoose');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in this DB:', collections.map((c) => c.name));

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
