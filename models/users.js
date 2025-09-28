const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'], trim: true },
    lastName: { type: String, required: [true, 'Last name is required'], trim: true },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] 
    },
    password: { 
      type: String, 
      required: function() { return !this.oauth; } // only required if not an OAuth user
    },
    oauth: { type: Boolean, default: false }, // indicates OAuth user
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    address: String,
    phone: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema, 'users');
