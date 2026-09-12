import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Weddings', 'Pre-Wedding', 'Birthdays', 'Corporate', 'Baby Shower', 'Drone Shoots']
  },
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  }
});

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
