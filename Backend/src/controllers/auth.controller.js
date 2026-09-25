import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });




   // register...
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    const isOnboarded = Boolean(user.NativeLanguage && user.LearningLanguage);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || '',
        NativeLanguage: user.NativeLanguage || '',
        LearningLanguage: user.LearningLanguage || '',
        city: user.city || '',
        isOnboarded,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Login 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    const isOnboarded = Boolean(user.NativeLanguage && user.LearningLanguage);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || '',
        NativeLanguage: user.NativeLanguage || '',
        LearningLanguage: user.LearningLanguage || '',
        city: user.city || '',
        isOnboarded,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



