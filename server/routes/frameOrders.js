import express from 'express';
import { FrameOrder } from '../models/FrameOrder.js';
import { protectAdmin } from './auth.js';

const router = express.Router();

const generateOrderId = () => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AV-FRM-${rand}`;
};

// POST /api/frame-orders - Place a new frame order
router.post('/', async (req, res) => {
  try {
    const {
      clientName,
      customerName,
      email,
      phone,
      frameId,
      frameTitle,
      framePrice,
      price,
      dimensions,
      quantity = 1,
      customerPhoto,
      photoToFrame,
      shippingAddress,
      deliveryCharge = 0,
      totalAmount,
      paymentMethod,
      transactionId
    } = req.body;

    const resolvedName = clientName || customerName;
    const resolvedPrice = Number(framePrice || price || 0);
    const resolvedPhoto = customerPhoto || photoToFrame || '';

    if (!resolvedName || !phone || !frameTitle || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Name, Phone, Frame selection, and Total Amount are required.'
      });
    }

    const orderId = generateOrderId();

    const order = await FrameOrder.create({
      orderId,
      clientName: resolvedName,
      email: email || '',
      phone,
      frameId: frameId || '',
      frameTitle,
      framePrice: resolvedPrice,
      dimensions: dimensions || '12x18 inches',
      quantity: Number(quantity) || 1,
      customerPhoto: resolvedPhoto,
      shippingAddress: shippingAddress || {},
      deliveryCharge: Number(deliveryCharge) || 0,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'UPI',
      transactionId: transactionId || '',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Frame order placed successfully!',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/frame-orders - Admin get all orders
router.get('/', protectAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    const orders = await FrameOrder.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/frame-orders/:id/status - Admin update order status
router.patch('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await FrameOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: `Status updated to ${status}`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/frame-orders/:id - Admin delete frame order
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const order = await FrameOrder.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Frame order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
