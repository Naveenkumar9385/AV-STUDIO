import express from 'express';
import { Frame } from '../models/Frame.js';
import { protectAdmin } from './auth.js';

const router = express.Router();

// GET /api/frames
router.get('/', async (req, res) => {
  try {
    const frames = await Frame.find().sort({ price: 1 });
    res.json({ success: true, data: frames });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/frames (Admin)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const newFrame = await Frame.create(req.body);
    res.status(201).json({ success: true, data: newFrame });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/frames/:id (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    await Frame.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Frame deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
