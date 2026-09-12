import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'partial', 'booked'],
    default: 'available'
  },
  reason: {
    type: String,
    default: ''
  },
  morningAvailable: {
    type: Boolean,
    default: true
  },
  eveningAvailable: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Availability = mongoose.model('Availability', availabilitySchema);
