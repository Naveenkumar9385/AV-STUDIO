import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
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
  eventType: {
    type: String,
    required: true,
    enum: ['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate', 'Baby Shower', 'Drone Shoot', 'Maternity', 'Fashion']
  },
  eventDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  venue: {
    type: String,
    default: 'Chennai Studio'
  },
  notes: {
    type: String,
    default: ''
  },
  services: [{
    id: String,
    name: String,
    price: Number
  }],
  frame: {
    id: String,
    name: String,
    price: Number,
    dimensions: String
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
    enum: ['Pending', 'Verified', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Booking = mongoose.model('Booking', bookingSchema);
