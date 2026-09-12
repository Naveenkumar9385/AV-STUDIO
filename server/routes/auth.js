import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';

const router = express.Router();

// Middleware to protect admin routes
export const protectAdmin = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'av_studio_super_secret_jwt_key_2025_luxury');
      req.admin = await Admin.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
  }
  return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'av_studio_super_secret_jwt_key_2025_luxury',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/verify
router.get('/verify', protectAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// PUT /api/auth/profile - Update admin username, password, name, avatar
router.put('/profile', protectAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    const { username, name, avatar, currentPassword, newPassword } = req.body;

    // 1. Username change
    if (username && username.trim() && username.trim() !== admin.username) {
      const trimmedUsername = username.trim();
      const existing = await Admin.findOne({ username: trimmedUsername });
      if (existing && existing._id.toString() !== admin._id.toString()) {
        return res.status(400).json({ success: false, message: 'Username is already taken by another account' });
      }
      admin.username = trimmedUsername;
    }

    // 2. Name change
    if (name !== undefined) {
      admin.name = name.trim();
    }

    // 3. Avatar change (base64 image or url)
    if (avatar !== undefined) {
      admin.avatar = avatar;
    }

    // 4. Password change
    if (newPassword && newPassword.trim()) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new password' });
      }
      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match' });
      }
      if (newPassword.trim().length < 4) {
        return res.status(400).json({ success: false, message: 'New password must be at least 4 characters long' });
      }
      admin.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    await admin.save();

    // Re-issue JWT token with updated username/role
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'av_studio_super_secret_jwt_key_2025_luxury',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin credentials and profile updated successfully!',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar || ''
      }
    });
  } catch (error) {
    console.error('Failed to update admin profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
