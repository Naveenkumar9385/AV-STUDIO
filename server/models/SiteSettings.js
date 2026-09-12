import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  // Studio & Hero Section
  studioName: {
    type: String,
    default: 'AV STUDIO'
  },
  heroEyebrow: {
    type: String,
    default: 'Capturing Moments'
  },
  heroTitle: {
    type: String,
    default: 'Creating Memories'
  },
  heroSubtitle: {
    type: String,
    default: 'Professional Photography & Cinematic Videography for Every Occasion. Capturing authentic emotions, majestic rituals, and timeless stories with artistic elegance.'
  },
  heroLensImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
  },
  studioStatus: {
    type: String,
    default: 'OPEN NOW'
  },
  closingTime: {
    type: String,
    default: 'Closes at 09:00 PM'
  },
  highlightFeatures: [{
    title: String,
    subtitle: String
  }],

  // About Us Section
  aboutTitle: {
    type: String,
    default: 'About AV Studio'
  },
  aboutStory: {
    type: String,
    default: 'Founded in 2018, AV Studio is a passionate team of creative storytellers, dedicated to capturing your most precious moments with artistic vision and modern technology. We believe every moment is unique and we make it timeless.'
  },
  founderName: {
    type: String,
    default: 'Arjun Prakash'
  },
  founderRole: {
    type: String,
    default: 'Founder & Creative Director'
  },
  founderTagline: {
    type: String,
    default: 'Leader & Lead Cinematographer'
  },
  founderQuote: {
    type: String,
    default: '"A passionate visual storyteller with over a decade of experience in Photography and Filmmaking. At AV Studio, we do not just press the shutter — we capture feelings, laughter, and heritage that your family will cherish for generations."'
  },
  founderImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'
  },
  gearItems: [{
    name: String,
    desc: String
  }],

  // Services & Pricing List
  services: [{
    id: String,
    name: String,
    price: Number,
    desc: String
  }],

  // Logo & Branding
  logoUrl: {
    type: String,
    default: ''
  },
  logoType: {
    type: String,
    default: 'icon'
  },
  studioTagline: {
    type: String,
    default: 'Cinema & Photography'
  },

  // Social Profiles
  instagramUrl: {
    type: String,
    default: 'https://instagram.com/avstudio'
  },
  facebookUrl: {
    type: String,
    default: 'https://facebook.com/avstudio'
  },
  youtubeUrl: {
    type: String,
    default: 'https://youtube.com/@avstudio'
  },
  twitterUrl: {
    type: String,
    default: 'https://twitter.com/avstudio'
  },

  // Studio Headquarters
  hqTitle: {
    type: String,
    default: 'Studio Headquarters'
  },
  hqLandmark: {
    type: String,
    default: 'Near Roundtana, Anna Nagar'
  },
  hqPhone: {
    type: String,
    default: '+91 98765 43210'
  },
  hqEmail: {
    type: String,
    default: 'info@avstudio.com'
  },

  // Footer Content
  footerAbout: {
    type: String,
    default: "Premier Photography & Cinematic Videography studio based in Chennai. Transforming life's greatest celebrations into timeless cinematic heirlooms."
  },
  footerCopyright: {
    type: String,
    default: '© 2026 AV STUDIO. All rights reserved. Designed for excellence.'
  },
  footerServices: {
    type: [String],
    default: [
      'Destination Weddings',
      'Pre-Wedding Outdoor Cinema',
      'Drone 4K Aerial Cinematography',
      'Luxury Archival Albums',
      'Museum Quality Photo Framing'
    ]
  },
  footerQuickLinks: {
    type: [String],
    default: [
      'Home',
      'About Us & Gear',
      'Events & Portfolio',
      'Event Booking & Packages',
      'Frame Catalog',
      'Date Availability',
      'Contact Studio'
    ]
  },

  // Email Notification & SMTP Settings
  notificationEmail: {
    type: String,
    default: 'info@avstudio.com'
  },
  smtpHost: {
    type: String,
    default: ''
  },
  smtpPort: {
    type: Number,
    default: 587
  },
  smtpUser: {
    type: String,
    default: ''
  },
  smtpPass: {
    type: String,
    default: ''
  },
  smtpSecure: {
    type: Boolean,
    default: false
  },

  // Event Packages
  eventPackages: [{
    id: String,
    eventType: String,
    title: String,
    subtitle: String,
    badge: String,
    category: String,
    price: Number,
    image: String,
    features: [String],
    duration: String
  }],

  // Contact & Payment Details
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  whatsapp: {
    type: String,
    default: '+91 98765 43210'
  },
  email: {
    type: String,
    default: 'info@avstudio.com'
  },
  address: {
    type: String,
    default: '123, Creative Street, Anna Nagar, Chennai - 600040, Tamil Nadu'
  },
  timings: {
    type: String,
    default: '9:30 AM – 9:00 PM (Mon – Sun)'
  },
  upiId: {
    type: String,
    default: 'avstudio.shoot@oksbi'
  },
  mapEmbedUrl: {
    type: String,
    default: ''
  },
  mapLocationName: {
    type: String,
    default: 'AV Studio, Anna Nagar, Chennai'
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
