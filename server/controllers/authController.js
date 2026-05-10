const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    const isMatch =
      await user.comparePassword(password);

    if (!isMatch) {

      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {

  try {

    const {
      name,
      email
    } = req.body;

    const updatedUser =
      await User.findByIdAndUpdate(

        req.userData.userId,

        {
          name,
          email
        },

        {
          new: true
        }
      );

    res.json({

      message: 'Profile updated',

      user: {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};