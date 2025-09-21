const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update their password
      user.password = password;
      user.loginAttempts += 1;
      user.lastLogin = new Date();
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: 'Password updated and logged in successfully',
        user: {
          id: user._id,
          email: user.email,
          lastLogin: user.lastLogin
        }
      });
    } else {
      // If user doesn't exist, create a new one
      user = new User({
        email,
        password // Storing as plain text as requested
      });
      await user.save();
      
      return res.status(201).json({
        success: true,
        message: 'User created and logged in successfully',
        user: {
          id: user._id,
          email: user.email,
          lastLogin: user.lastLogin
        }
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user information endpoint
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ email }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        lastLogin: user.lastLogin,
        loginAttempts: user.loginAttempts,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register endpoint (for testing purposes)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = new User({
      email,
      password // Storing as plain text as requested
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all users endpoint
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}); // Include passwords in query
    
    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        password: user.password,
        loginAttempts: user.loginAttempts,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;