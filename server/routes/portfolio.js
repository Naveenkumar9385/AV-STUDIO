import express from 'express';
import { Portfolio } from '../models/Portfolio.js';
import { protectAdmin } from './auth.js';

const router = express.Router();

// GET /api/portfolio
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    const items = await Portfolio.find(query);
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/portfolio (Admin)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const newItem = await Portfolio.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/portfolio/:id (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
