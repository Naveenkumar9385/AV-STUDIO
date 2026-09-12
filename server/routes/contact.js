import express from 'express';
import { Contact } from '../models/Contact.js';
import { protectAdmin } from './auth.js';
import { sendContactInquiryEmail, sendTestEmail } from '../utils/emailService.js';

const router = express.Router();

// POST /api/contact - Submit client message & send email notification
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide Name, Email and Message' });
    }

    // 1. Save to MongoDB
    const newContact = await Contact.create({
      name,
      email,
      phone: phone || '',
      message,
      status: 'New'
    });

    // 2. Trigger asynchronous email notification to admin/studio email
    let emailStatus = null;
    try {
      emailStatus = await sendContactInquiryEmail({
        name,
        email,
        phone,
        message,
        inquiryId: newContact._id
      });
    } catch (emailErr) {
      console.error('Email dispatch error (inquiry saved anyway):', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to AV STUDIO team. We will get back to you shortly.',
      data: newContact,
      emailSent: emailStatus?.delivered || false,
      recipient: emailStatus?.recipient || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/contact - Admin view inquiries
router.get('/', protectAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    const newCount = messages.filter(m => m.status === 'New').length;
    res.json({ success: true, count: messages.length, newCount, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/contact/:id/status - Admin update inquiry status
router.patch('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Status updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/contact/:id - Admin delete inquiry
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/contact/test-email - Admin test SMTP configuration
router.post('/test-email', protectAdmin, async (req, res) => {
  try {
    const { testRecipient } = req.body;
    const result = await sendTestEmail({ testRecipient });
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
