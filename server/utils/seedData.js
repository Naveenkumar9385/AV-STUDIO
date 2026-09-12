import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { Booking } from '../models/Booking.js';
import { Availability } from '../models/Availability.js';
import { Frame } from '../models/Frame.js';
import { Portfolio } from '../models/Portfolio.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
        name: 'Arjun Prakash',
        role: 'admin'
      });
      console.log('✅ Admin user created (admin / admin123)');
    }

    // 2. Seed Frames
    const framesCount = await Frame.countDocuments();
    if (framesCount === 0) {
      const sampleFrames = [
        {
          title: 'Classic Teak Wood',
          style: 'Teak Wood Finish',
          price: 1499,
          dimensions: '12x18 inches',
          material: 'Handcrafted Natural Teak',
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
          badge: 'Most Popular',
          description: 'Timeless warm wood frame with anti-glare museum glass.'
        },
        {
          title: 'Canvas Wrap',
          style: 'Gallery Wrap Canvas',
          price: 1999,
          dimensions: '16x24 inches',
          material: 'Archival Poly-Cotton Canvas',
          image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
          badge: 'High Texture',
          description: 'Seamless gallery-wrapped edge stretched on solid pine bars.'
        },
        {
          title: 'Acrylic Floating',
          style: 'Floating Acrylic Glass',
          price: 2499,
          dimensions: '18x24 inches',
          material: 'High-Gloss Crystal Acrylic',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
          badge: 'Ultra Luxury',
          description: 'Floating effect with polished diamond edges and aluminum standoff mounts.'
        },
        {
          title: 'Matte Black Minimalist',
          style: 'Minimal Black Matte',
          price: 1799,
          dimensions: '14x20 inches',
          material: 'Anodized Aluminum Metal',
          image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
          badge: 'Modern Sleek',
          description: 'Slim bezel black metal profile for contemporary cinematic portraits.'
        },
        {
          title: 'Golden Vintage',
          style: 'Baroque Gilded Gold',
          price: 2199,
          dimensions: '16x20 inches',
          material: 'Ornate Gilded Resin & Wood',
          image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80',
          badge: 'Royal Heritage',
          description: 'Rich royal gold leaf finish detailing, perfect for wedding and traditional family portraits.'
        }
      ];
      await Frame.insertMany(sampleFrames);
      console.log('✅ Frame catalog seeded');
    }

    // 3. Seed Portfolio
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      const samplePortfolio = [
        {
          title: 'Royal Chettinad Wedding',
          category: 'Weddings',
          image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
          caption: 'Traditional south-Indian wedding vows captured in glorious candlelight.',
          date: 'May 2025',
          featured: true
        },
        {
          title: 'Sunset Beach Romance',
          category: 'Pre-Wedding',
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          caption: 'Golden hour silhouette at ECR Beach, Chennai.',
          date: 'June 2025',
          featured: true
        },
        {
          title: 'First Birthday Celebration',
          category: 'Birthdays',
          image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
          caption: 'Smiles, cake smashes and colorful joy.',
          date: 'April 2025',
          featured: true
        },
        {
          title: 'Global Tech Leadership Summit',
          category: 'Corporate',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
          caption: 'Keynote speakers and networking dinner coverage.',
          date: 'March 2025',
          featured: true
        },
        {
          title: 'Welcoming Baby Aarav',
          category: 'Baby Shower',
          image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
          caption: 'Maternal glow and traditional rituals documented with warmth.',
          date: 'January 2025',
          featured: true
        },
        {
          title: 'Cine Drone Over Coastal Bay',
          category: 'Drone Shoots',
          image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
          caption: '4K aerial tracking shot over Mahabalipuram shores.',
          date: 'May 2025',
          featured: true
        },
        {
          title: 'Intimate Temple Muhurtham',
          category: 'Weddings',
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
          caption: 'Candid smiles amidst fragrant jasmine and nadaswaram melodies.',
          date: 'February 2025',
          featured: false
        },
        {
          title: 'Heritage Palace Pre-Wedding',
          category: 'Pre-Wedding',
          image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
          caption: 'Cinematic royal backdrop with dramatic evening flares.',
          date: 'April 2025',
          featured: false
        },
        {
          title: 'Sweet 16 Twilight Gala',
          category: 'Birthdays',
          image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
          caption: 'Fairy lights and vibrant laughter with best friends.',
          date: 'May 2025',
          featured: false
        }
      ];
      await Portfolio.insertMany(samplePortfolio);
      console.log('✅ Portfolio items seeded');
    }

    // 4. Seed Availability Calendar (Matching the calendar screenshot pattern)
    const availCount = await Availability.countDocuments();
    if (availCount === 0) {
      const dates = [];
      const currentYear = 2025;
      const currentMonth = 6; // June 2025

      // Sample patterns matching UI:
      // Red dates (Fully Booked): 10, 15, 16, 20, 21, 22, 23, 25, 28
      // Yellow dates (Partial): 1, 3, 7, 18, 19
      // Others: Green (Available)
      const bookedDays = [10, 15, 16, 20, 21, 22, 23, 25, 28];
      const partialDays = [1, 3, 7, 18, 19];

      for (let day = 1; day <= 30; day++) {
        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let status = 'available';
        let reason = 'Open for booking';
        let morning = true;
        let evening = true;

        if (bookedDays.includes(day)) {
          status = 'booked';
          reason = 'Booked for Grand Wedding / Full Day Shoot';
          morning = false;
          evening = false;
        } else if (partialDays.includes(day)) {
          status = 'partial';
          reason = 'Morning slot reserved; Evening available';
          morning = false;
          evening = true;
        }

        dates.push({
          date: dateStr,
          status,
          reason,
          morningAvailable: morning,
          eveningAvailable: evening
        });
      }

      // Also seed next month July 2025
      for (let day = 1; day <= 31; day++) {
        const dateStr = `${currentYear}-07-${String(day).padStart(2, '0')}`;
        const isWeekend = [5, 6, 12, 13, 19, 20, 26, 27].includes(day);
        dates.push({
          date: dateStr,
          status: isWeekend ? (day % 2 === 0 ? 'booked' : 'partial') : 'available',
          reason: isWeekend ? 'Weekend Shoot Schedule' : 'Open for booking',
          morningAvailable: !isWeekend,
          eveningAvailable: true
        });
      }

      await Availability.insertMany(dates);
      console.log('✅ Availability calendar seeded');
    }

    // 5. Sample Bookings (Only seeded initially, never re-seeded after user clears/deletes them)
    const shouldSeedInitialBookings = false;
    if (shouldSeedInitialBookings) {
      const sampleBookings = [
        {
          bookingId: 'AV-2025-0891',
          clientName: 'Rahul & Priya',
          email: 'rahul.priya@gmail.com',
          phone: '+91 98401 23456',
          eventType: 'Wedding',
          eventDate: '2025-06-15',
          venue: 'Mayor Ramanathan Hall, MRC Nagar, Chennai',
          notes: 'Traditional Iyer wedding ritual + Drone coverage needed',
          services: [
            { id: 'wed-cand', name: 'Traditional & Candid Photography', price: 29999 },
            { id: 'cin-video', name: 'Cinematic 4K Wedding Film', price: 20000 }
          ],
          frame: { id: 'teak-1', name: 'Classic Teak Wood Frame', price: 1499, dimensions: '12x18' },
          totalAmount: 49999,
          paymentMethod: 'GPay',
          transactionId: 'UPI984019284712',
          status: 'Verified',
          createdAt: new Date('2025-06-01')
        },
        {
          bookingId: 'AV-2025-0892',
          clientName: 'Ananya Sharma',
          email: 'ananya.s@outlook.com',
          phone: '+91 98840 54321',
          eventType: 'Pre-Wedding',
          eventDate: '2025-06-16',
          venue: 'Mahabalipuram Shore Temple & Resort',
          notes: '3 costume changes, twilight beach shots',
          services: [
            { id: 'pre-shoot', name: 'Pre-Wedding Outdoor Shoot', price: 19999 }
          ],
          totalAmount: 19999,
          paymentMethod: 'PhonePe',
          transactionId: 'TXN91823746198',
          status: 'Pending',
          createdAt: new Date('2025-06-03')
        },
        {
          bookingId: 'AV-2025-0893',
          clientName: 'Karthik Reddy',
          email: 'karthik.reddy@gmail.com',
          phone: '+91 94440 98765',
          eventType: 'Birthday',
          eventDate: '2025-06-18',
          venue: 'The Leela Palace, Chennai',
          notes: 'Kid 5th birthday celebration & instant prints',
          services: [
            { id: 'bday-photo', name: 'Birthday Bash Event Coverage', price: 14999 }
          ],
          totalAmount: 14999,
          paymentMethod: 'Paytm',
          transactionId: 'PTM837192847',
          status: 'Pending',
          createdAt: new Date('2025-06-05')
        },
        {
          bookingId: 'AV-2025-0894',
          clientName: 'Meera Nair',
          email: 'meera.nair@corporate.com',
          phone: '+91 97910 11223',
          eventType: 'Corporate',
          eventDate: '2025-06-20',
          venue: 'ITC Grand Chola, Guindy',
          notes: 'Annual leadership conference and executive portraits',
          services: [
            { id: 'corp-summit', name: 'Full Day Corporate Photography', price: 22999 }
          ],
          totalAmount: 22999,
          paymentMethod: 'GPay',
          transactionId: 'GP8837192301',
          status: 'Verified',
          createdAt: new Date('2025-06-08')
        },
        {
          bookingId: 'AV-2025-0895',
          clientName: 'Vikram Singh',
          email: 'vikram.singh@gmail.com',
          phone: '+91 98412 88776',
          eventType: 'Drone Shoot',
          eventDate: '2025-06-21',
          venue: 'Kovalam Beach Bay, Chennai',
          notes: 'High speed boat tracking and cinematic promo reel',
          services: [
            { id: 'drone-cine', name: 'Pro Cine Drone Coverage (DJI Mavic 3 Pro)', price: 29999 }
          ],
          totalAmount: 29999,
          paymentMethod: 'PhonePe',
          transactionId: 'PP7728190334',
          status: 'Verified',
          createdAt: new Date('2025-06-09')
        }
      ];

      await Booking.insertMany(sampleBookings);
      console.log('✅ Sample bookings seeded');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};
