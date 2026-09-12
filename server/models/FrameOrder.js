import mongoose from 'mongoose';

const frameOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  clientName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  frameId: String,
  frameTitle: {
    type: String,
    required: true
  },
  framePrice: {
    type: Number,
    required: true
  },
  dimensions: {
    type: String,
    default: '12x18 inches'
  },
  quantity: {
    type: Number,
    default: 1
  },
  customerPhoto: {
    type: String, // Base64 data URI or image URL to be printed & framed
    default: ''
  },
  shippingAddress: {
    fullName: String,
    streetAddress: String,
    city: String,
    state: String,
    pincode: String
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['GPay', 'PhonePe', 'Paytm', 'UPI'],
    default: 'UPI'
  },
  transactionId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const FrameOrder = mongoose.model('FrameOrder', frameOrderSchema);
