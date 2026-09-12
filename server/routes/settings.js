import express from 'express';
import { SiteSettings } from '../models/SiteSettings.js';
import { protectAdmin } from './auth.js';

const router = express.Router();

const getDefaultSettings = () => ({
  studioName: 'AV STUDIO',
  heroEyebrow: 'Capturing Moments',
  heroTitle: 'Creating Memories',
  heroSubtitle: 'Professional Photography & Cinematic Videography for Every Occasion. Capturing authentic emotions, majestic rituals, and timeless stories with artistic elegance.',
  heroLensImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  studioStatus: 'OPEN NOW',
  closingTime: 'Closes at 09:00 PM',
  highlightFeatures: [
    { title: '4K/8K Quality', subtitle: 'Premium Cameras' },
    { title: 'Creative Team', subtitle: 'Expert Photographers' },
    { title: 'Fast Delivery', subtitle: 'Quick & Reliable' },
    { title: 'Best Prices', subtitle: 'Affordable Packages' }
  ],
  aboutTitle: 'About AV Studio',
  aboutStory: 'Founded in 2018, AV Studio is a passionate team of creative storytellers, dedicated to capturing your most precious moments with artistic vision and modern technology. We believe every moment is unique and we make it timeless.',
  founderName: 'Arjun Prakash',
  founderRole: 'Founder & Creative Director',
  founderTagline: 'Leader & Lead Cinematographer',
  founderQuote: '"A passionate visual storyteller with over a decade of experience in Photography and Filmmaking. At AV Studio, we do not just press the shutter — we capture feelings, laughter, and heritage that your family will cherish for generations."',
  founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
  gearItems: [
    { name: 'Sony A7 IV', desc: '45MP Full Frame' },
    { name: 'Canon R5', desc: '8K Video Cinema' },
    { name: 'DJI Mavic 3 Pro', desc: 'Cine Tri-Camera Drone' },
    { name: 'Ronin RS 3 Pro', desc: 'Cinematic Gimbal' },
    { name: 'Lighting Setup', desc: 'Godox & Nanlite RGB' }
  ],
  services: [
    { id: 'cand-photo', name: 'Candid & Traditional Photography', price: 24999, desc: 'Full-day coverage with 2 pro photographers' },
    { id: 'cin-video', name: 'Cinematic 4K Wedding / Event Film', price: 20000, desc: 'Teaser + full documentary film with color grading' },
    { id: 'drone-cov', name: 'Pro Cine Drone Coverage', price: 12000, desc: 'DJI Mavic 3 Pro aerial perspectives' },
    { id: 'album-lux', name: 'Custom Leatherette Photobook Album', price: 8000, desc: '40 archival silk pages with luxury box' },
    { id: 'pre-shoot', name: 'Pre-Wedding Outdoor Sunset Shoot', price: 15000, desc: 'Half-day outdoor location shoot' }
  ],
  // Logo & Branding
  logoUrl: '',
  logoType: 'icon',
  studioTagline: 'Cinema & Photography',

  // Social Profiles
  instagramUrl: 'https://instagram.com/avstudio',
  facebookUrl: 'https://facebook.com/avstudio',
  youtubeUrl: 'https://youtube.com/@avstudio',
  twitterUrl: 'https://twitter.com/avstudio',

  // Studio Headquarters
  hqTitle: 'Studio Headquarters',
  hqLandmark: 'Near Roundtana, Anna Nagar',
  hqPhone: '+91 98765 43210',
  hqEmail: 'info@avstudio.com',

  // Footer Content
  footerAbout: "Premier Photography & Cinematic Videography studio based in Chennai. Transforming life's greatest celebrations into timeless cinematic heirlooms.",
  footerCopyright: '© 2026 AV STUDIO. All rights reserved. Designed for excellence.',
  footerServices: [
    'Destination Weddings',
    'Pre-Wedding Outdoor Cinema',
    'Drone 4K Aerial Cinematography',
    'Luxury Archival Albums',
    'Museum Quality Photo Framing'
  ],
  footerQuickLinks: [
    'Home',
    'About Us & Gear',
    'Events & Portfolio',
    'Event Booking & Packages',
    'Frame Catalog',
    'Date Availability',
    'Contact Studio'
  ],

  // Email & SMTP Settings
  notificationEmail: 'info@avstudio.com',
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
  smtpSecure: false,

  // Event Packages
  eventPackages: [
    {
      id: 'wedding-signature',
      eventType: 'Wedding',
      title: 'Grand Wedding Photography & Cinema',
      subtitle: 'Complete two-day muhurtham & reception grand coverage',
      badge: 'Most Popular',
      category: 'Weddings',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      features: [
        '2 Candid Photographers + 2 Traditional Photographers',
        '2 Cinematic 4K Videographers',
        'DJI Mavic 3 Pro 4K Drone Aerial Coverage',
        '40-Page Premium Archival Leatherette Album',
        '3-5 Min Cinematic Teaser + Full Documentary Film'
      ],
      duration: 'Full Day Coverage'
    },
    {
      id: 'pre-wedding-cinema',
      eventType: 'Pre-Wedding',
      title: 'Pre-Wedding & Outdoor Couple Shoot',
      subtitle: 'Artistic love story film at scenic outdoor locations',
      badge: 'Couple Favorite',
      category: 'Pre-Wedding',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      features: [
        'Lead Creative Photographer + 4K Cinematographer',
        '2 Scenic Outdoor Locations (Beach / Heritage Resort)',
        'Drone Aerial Couple Portraits',
        '1-Minute Romantic Instagram Reel',
        '50 High-End Retouched Photos'
      ],
      duration: 'Half Day (5 Hours)'
    },
    {
      id: 'birthday-party',
      eventType: 'Birthday',
      title: 'Birthday & Milestone Celebration',
      subtitle: 'Fun, vibrant candid moments and family portraits',
      badge: 'Kids & Family',
      category: 'Birthdays',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      features: [
        '1 Candid Photographer + 1 Traditional Photographer',
        'High-Resolution Highlight Video (3-5 min)',
        '100+ Edited High-Res Digital Images',
        'Fast 48-Hour Digital Delivery'
      ],
      duration: '4 Hours Coverage'
    },
    {
      id: 'corporate-gala',
      eventType: 'Corporate',
      title: 'Corporate Summit & Brand Events',
      subtitle: 'Polished executive coverage, keynote speeches, and team portraits',
      badge: 'B2B Enterprise',
      category: 'Corporate',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      features: [
        '2 Commercial Photographers',
        'Full HD Multi-Cam Live Recording & Event Recap Reel',
        'Same-Day Press Release Photography Pack',
        'Complete Commercial Usage Rights'
      ],
      duration: 'Full Day Summit'
    },
    {
      id: 'baby-shower',
      eventType: 'Baby Shower',
      title: 'Baby Shower & Seemantham Special',
      subtitle: 'Cherishing motherhood with graceful traditional & candid memories',
      badge: 'Family Heritage',
      category: 'Baby Shower',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      features: [
        '1 Lead Candid Photographer',
        '1 Cinematic Videographer',
        'Traditional Rituals Full Coverage',
        'Custom 20-Page Mini Keepsake Album'
      ],
      duration: '4 Hours Coverage'
    },
    {
      id: 'drone-aerial',
      eventType: 'Drone Shoots',
      title: 'Cinematic 4K/8K Drone Aerial Showcase',
      subtitle: 'Breathtaking high-altitude perspectives for architecture & events',
      badge: 'High Altitude',
      category: 'Drone Shoots',
      price: 14000,
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
      features: [
        'Licensed DGCA Certified Drone Pilot',
        'DJI Mavic 3 Pro Cine with Hasselblad Sensor',
        '4K 60fps & 5.1K Apple ProRes Aerial Footage',
        'Color Graded Cinematic Reel'
      ],
      duration: '2 Flight Sessions'
    }
  ],

  // Contact & Payment Details
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'info@avstudio.com',
  address: '123, Creative Street, Anna Nagar, Chennai - 600040, Tamil Nadu',
  timings: '9:30 AM – 9:00 PM (Mon – Sun)',
  upiId: 'avstudio.shoot@oksbi',
  mapEmbedUrl: '',
  mapLocationName: 'AV Studio, Anna Nagar, Chennai'
});

// GET /api/settings - Public website settings
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(getDefaultSettings());
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings - Admin update website settings
router.put('/', protectAdmin, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ ...getDefaultSettings(), ...req.body });
    } else {
      Object.assign(settings, req.body);
      settings.updatedAt = new Date();
      await settings.save();
    }
    res.json({ success: true, message: 'Website content updated successfully!', data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
