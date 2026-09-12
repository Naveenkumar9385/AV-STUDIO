import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import availabilityRoutes from './routes/availability.js';
import frameRoutes from './routes/frames.js';
import portfolioRoutes from './routes/portfolio.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import frameOrderRoutes from './routes/frameOrders.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to cwd

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/frames', frameRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/frame-orders', frameOrderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', studio: 'AV STUDIO API', timestamp: new Date() });
});

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 AV STUDIO Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
