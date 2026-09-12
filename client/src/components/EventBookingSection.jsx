import React, { useState } from 'react';
import { 
  Calendar, 
  Check, 
  Sparkles, 
  Camera, 
  Video, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Star,
  Users,
  Film
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const EventBookingSection = ({ onBookEvent }) => {
  const { settings } = useSite();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const defaultEventPackages = [
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
      title: 'Birthday & Half Saree Ceremony',
      subtitle: 'Capturing joyful milestones with family and friends',
      badge: 'Family Special',
      category: 'Celebrations',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      features: [
        '1 Candid Photographer + 1 Traditional Photographer',
        'Stage Decor & Party Action Coverage',
        'Traditional Family Group Portraits',
        'Full HD Highlight Video + Instant Teaser Reel',
        'Mini Hardcover Photo Album'
      ],
      duration: '4 Hours Event'
    },
    {
      id: 'maternity-newborn',
      eventType: 'Maternity',
      title: 'Maternity & Newborn Baby Session',
      subtitle: 'Tender, intimate portraits celebrating new life',
      badge: 'Cherished',
      category: 'Portraits',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
      features: [
        'Indoor AC Luxury Studio with Baby Props & Themes',
        '3 Costume Changes with Creative Lighting',
        'Gentle Posing for Expecting Mothers & Infants',
        '25 Ultra High-Resolution Magazine Retouched Photos',
        '1 Complimentary 12x18 Archival Photo Frame'
      ],
      duration: '3 Hours Studio'
    },
    {
      id: 'corporate-commercial',
      eventType: 'Corporate',
      title: 'Corporate & Commercial Events',
      subtitle: 'High-profile conferences, awards, and brand galas',
      badge: 'Business Pro',
      category: 'Corporate',
      price: 30000,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      features: [
        '2 Senior Event Photographers + 4K Videographer',
        'Keynote, Panel & VIP Executive Headshots',
        'Same-Day Expedited PR Press Photos',
        'Full 4K Event Summary Video for Brand Marketing',
        'Digital Master Delivery on Cloud Drive'
      ],
      duration: 'Up to 8 Hours'
    },
    {
      id: 'housewarming-griha',
      eventType: 'Housewarming',
      title: 'Traditional Housewarming (Grihapravesham)',
      subtitle: 'Sacred homam rituals and heartfelt family memories',
      badge: 'Traditional',
      category: 'Tradition',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=800&q=80',
      features: [
        'Early Morning Homam & Puja Rituals Coverage',
        'Interior Architecture & Home Aesthetics Shots',
        'Extended Family Group Portrait Sessions',
        'Full HD Documentary Video with Traditional Music',
        '30-Page Silk Finish Keepsake Album'
      ],
      duration: '6 Hours'
    },
    {
      id: 'fashion-portfolio',
      eventType: 'Fashion',
      title: 'Fashion & Model Portfolio Shoot',
      subtitle: 'High-fashion editorial looks for aspiring models & artists',
      badge: 'Editorial',
      category: 'Portraits',
      price: 16000,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      features: [
        'Pro Studio Strobe Lighting with Color Gels',
        '4 Diverse Wardrobe & Aesthetic Looks',
        'Posing Direction & Mood Coaching',
        '15 High-End Editorial Retouched Images',
        'Digital Agency-Ready Comp Card'
      ],
      duration: '4 Hours'
    },
    {
      id: 'drone-aerial-cine',
      eventType: 'Drone Shoot',
      title: 'Pro Cine Drone 4K Aerial Coverage',
      subtitle: 'Breathtaking bird-eye perspectives of your grand venue',
      badge: 'Aerial Cinema',
      category: 'Cinema',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
      features: [
        'DGCA Certified Professional Drone Pilot',
        'DJI Mavic 3 Pro Triple Camera 4K 60fps',
        'Dynamic Fly-Throughs & Establishing Grand Shots',
        'Raw Flight Footage + Color Graded Highlight Edit',
        'Weather & Airspace Clearance Included'
      ],
      duration: '3 Flight Sessions'
    }
  ];

  const eventPackages = (settings?.eventPackages && settings.eventPackages.length > 0)
    ? settings.eventPackages
    : defaultEventPackages;

  const categories = ['All', 'Weddings', 'Pre-Wedding', 'Celebrations', 'Portraits', 'Corporate', 'Tradition', 'Cinema'];

  const filteredPackages = selectedFilter === 'All'
    ? eventPackages
    : eventPackages.filter(p => p.category === selectedFilter || p.eventType.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <section id="booking" style={{
      padding: 'clamp(40px, 6vw, 90px) clamp(12px, 3vw, 24px)',
      maxWidth: '1360px',
      margin: '0 auto',
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Decorative Top Accent */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(30px, 5vw, 45px)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          color: '#ff2a85',
          marginBottom: '10px'
        }}>
          <span style={{ height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #ff2a85)' }} />
          <Sparkles size={18} />
          <span style={{ height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #ff2a85)' }} />
        </div>

        <h2 style={{
          fontSize: 'clamp(1.9rem, 4vw, 3.2rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: '12px'
        }}>
          Event <span className="gradient-pink">Packages</span> & Pricing
        </h2>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 'clamp(0.92rem, 1.8vw, 1.05rem)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Explore our transparent, all-inclusive photography & cinematography packages. Inquire directly to reserve your shoot dates and discuss custom requirements.
        </p>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginTop: '24px',
          width: '100%'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: selectedFilter === cat ? '1px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedFilter === cat ? 'linear-gradient(135deg, #ff2a85 0%, #d81b60 100%)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedFilter === cat ? '#fff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedFilter === cat ? '0 0 15px rgba(255, 42, 133, 0.4)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: 'clamp(16px, 3vw, 28px)',
        marginBottom: '40px',
        width: '100%'
      }}>
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="glass-panel"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.35s ease',
              background: 'rgba(13, 14, 24, 0.85)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'rgba(255, 42, 133, 0.6)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 42, 133, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Event Cover Image */}
            <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
              <img
                src={pkg.image}
                alt={pkg.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13, 14, 24, 0.95) 0%, transparent 60%)'
              }} />

              {/* Badge */}
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'rgba(255, 42, 133, 0.9)',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '9999px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}>
                {pkg.badge}
              </div>

              {/* Duration Tag */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: '#e2e8f0',
                background: 'rgba(0, 0, 0, 0.65)',
                padding: '3px 10px',
                borderRadius: '6px',
                backdropFilter: 'blur(4px)'
              }}>
                <Clock size={12} color="#ff4d9d" />
                {pkg.duration}
              </div>
            </div>

            {/* Card Content */}
            <div style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{
                  fontSize: '0.74rem',
                  color: '#ff2a85',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  {pkg.eventType} PACKAGE
                </span>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#fff',
                  margin: '4px 0 6px',
                  lineHeight: 1.3
                }}>
                  {pkg.title}
                </h3>

                <p style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.45,
                  marginBottom: '16px'
                }}>
                  {pkg.subtitle}
                </p>

                {/* Features List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '14px'
                }}>
                  {pkg.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      <Check size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Book Action */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Package Starts At
                  </span>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#ff4d9d',
                    lineHeight: 1
                  }}>
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const contactEl = document.getElementById('contact');
                    if (contactEl) {
                      contactEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '10px'
                  }}
                >
                  <Calendar size={15} />
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Trust Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        borderRadius: '18px',
        border: '1px solid rgba(255, 42, 133, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(255, 42, 133, 0.08) 0%, rgba(13, 14, 24, 0.9) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(255, 42, 133, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={24} color="#ff2a85" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Need a Custom Tailored Package or Destination Shoot?
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              We shoot worldwide. Talk directly to Founder & Creative Director {settings.founderName || 'Arjun Prakash'}.
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${(settings.whatsapp || '919876543210').replace(/[^0-9]/g, '')}?text=Hello%20AV%20STUDIO%2C%20I%20want%20to%20customize%20my%20event%20photography%20package.`}
          target="_blank"
          rel="noreferrer"
          className="btn-outline"
          style={{
            padding: '10px 22px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={16} />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
};
