import express from 'express';
import { Booking } from '../models/Booking.js';
import { Availability } from '../models/Availability.js';
import { protectAdmin } from './auth.js';

const router = express.Router();

// Helper to generate readable reference code
const generateBookingId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `AV-2025-${randomNum}`;
};

// GET /api/bookings/stats - Dashboard Metrics
router.get('/stats', async (req, res) => {
  try {
    const allBookings = await Booking.find();
    const totalBookings = allBookings.length;
    const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const pendingPayments = allBookings.filter(b => b.status === 'Pending').length;
    const verifiedCount = allBookings.filter(b => b.status === 'Verified').length;
    const uniqueClients = new Set(allBookings.map(b => b.phone || b.email)).size;

    // Return real-time metrics strictly from active database records
    res.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue,
        pendingPayments,
        totalClients: uniqueClients,
        verifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings - List all bookings with optional query filters
router.get('/', async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { eventType: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/:id - Single booking details
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings - Create new booking from client wizard
router.post('/', async (req, res) => {
  try {
    const {
      clientName,
      email,
      phone,
      eventType,
      eventDate,
      venue,
      notes,
      services,
      frame,
      totalAmount,
      paymentMethod,
      transactionId
    } = req.body;

    if (!clientName || !email || !phone || !eventType || !eventDate || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required details (Name, Email, Phone, Event Type, Date, Total Amount)'
      });
    }

    const bookingId = generateBookingId();

    const newBooking = await Booking.create({
      bookingId,
      clientName,
      email,
      phone,
      eventType,
      eventDate,
      venue: venue || 'Chennai Studio / Venue',
      notes: notes || '',
      services: services || [],
      frame: frame || null,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      transactionId: transactionId || '',
      status: transactionId ? 'Pending' : 'Pending'
    });

    // Update availability calendar status for this date if it wasn't booked
    const existingAvail = await Availability.findOne({ date: eventDate });
    if (existingAvail) {
      if (existingAvail.status === 'available') {
        existingAvail.status = 'partial';
        existingAvail.reason = `Booked for ${eventType}`;
        await existingAvail.save();
      }
    } else {
      await Availability.create({
        date: eventDate,
        status: 'partial',
        reason: `Booked for ${eventType}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: newBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/bookings/:id/status - Update booking status
router.patch('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Verified', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/bookings/:id - Remove booking
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
