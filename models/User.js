const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
    // Note: Storing password as plain text as per user request
    // In production, passwords should always be hashed
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Method to verify password (plain text comparison)
userSchema.methods.verifyPassword = function(candidatePassword) {
  return this.password === candidatePassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;