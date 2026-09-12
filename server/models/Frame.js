import mongoose from 'mongoose';

const frameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  dimensions: {
    type: String,
    default: '12x18 inches'
  },
  material: {
    type: String,
    default: 'Premium Wood'
  },
  image: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: 'Best Seller'
  },
  description: {
    type: String,
    default: ''
  }
});

export const Frame = mongoose.model('Frame', frameSchema);
