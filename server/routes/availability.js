import express from 'express';
import { Availability } from '../models/Availability.js';
import { protectAdmin } from './auth.js';

const router = express.Router();

// GET /api/availability - Get availability for calendar
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};

    if (year && month) {
      const monthStr = String(month).padStart(2, '0');
      query.date = { $regex: `^${year}-${monthStr}` };
    }

    const records = await Availability.find(query);
    // Convert to easy lookup map { 'YYYY-MM-DD': { status, reason, morningAvailable, eveningAvailable } }
    const lookup = {};
    records.forEach(r => {
      lookup[r.date] = {
        status: r.status,
        reason: r.reason,
        morningAvailable: r.morningAvailable,
        eveningAvailable: r.eveningAvailable
      };
    });

    res.json({
      success: true,
      data: records,
      lookup
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/availability/update - Admin update date status
router.post('/update', protectAdmin, async (req, res) => {
  try {
    const { date, status, reason, morningAvailable, eveningAvailable } = req.body;

    if (!date || !status) {
      return res.status(400).json({ success: false, message: 'Date and status are required' });
    }

    const updated = await Availability.findOneAndUpdate(
      { date },
      {
        date,
        status,
        reason: reason || (status === 'booked' ? 'Blocked by Studio Admin' : 'Open for Shoot'),
        morningAvailable: morningAvailable !== undefined ? morningAvailable : (status === 'available'),
        eveningAvailable: eveningAvailable !== undefined ? eveningAvailable : (status === 'available'),
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: `Date ${date} marked as ${status}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
