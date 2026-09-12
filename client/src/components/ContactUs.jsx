import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Navigation, ExternalLink } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const ContactUs = () => {
  const { settings } = useSite();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in your Name, Email, and Message.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMapEmbedSrc = () => {
    if (settings.mapEmbedUrl && settings.mapEmbedUrl.trim()) {
      const match = settings.mapEmbedUrl.match(/src=["']([^"']+)["']/i);
      if (match) return match[1];
      return settings.mapEmbedUrl.trim();
    }
    const locationQuery = encodeURIComponent(settings.mapLocationName || settings.address || 'AV Studio, Anna Nagar, Chennai');
    return `https://maps.google.com/maps?q=${locationQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const getDirectionsUrl = () => {
    const locationQuery = encodeURIComponent(settings.mapLocationName || settings.address || 'AV Studio, Anna Nagar, Chennai');
    return `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
  };

  return (
    <section id="contact" style={{
      padding: 'clamp(40px, 6vw, 80px) clamp(12px, 3vw, 24px)',
      maxWidth: '1360px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(30px, 5vw, 50px)' }}>
        <h2 style={{
          fontSize: 'clamp(1.9rem, 4vw, 3rem)',
          fontWeight: 800,
          marginBottom: '10px'
        }}>
          Contact <span className="gradient-pink">Us</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.92rem, 1.8vw, 1.02rem)', maxWidth: '600px', margin: '0 auto' }}>
          Have questions about custom wedding packages, portrait sessions, or frame customizations? Reach out to us directly.
        </p>
      </div>

      {/* Main Contact Grid (Screen 7 in image) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: 'clamp(18px, 3vw, 30px)',
        width: '100%'
      }}>
        {/* Left Column: Direct Studio Information */}
        <div className="glass-panel" style={{
          padding: 'clamp(18px, 4vw, 36px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 42, 133, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              {settings.hqTitle || 'Studio Headquarters'}
            </h3>

            {/* Phone */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 42, 133, 0.1)',
                border: '1px solid rgba(255, 42, 133, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={20} color="#ff2a85" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Call Us
                </div>
                <a href={`tel:${settings.hqPhone || settings.phone || '+91 98765 43210'}`} style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                  {settings.hqPhone || settings.phone || '+91 98765 43210'}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare size={20} color="#25D366" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  WhatsApp
                </div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                  {settings.whatsapp || '+91 98765 43210'}
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 42, 133, 0.1)',
                border: '1px solid rgba(255, 42, 133, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Mail size={20} color="#ff2a85" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email Us
                </div>
                <a href={`mailto:${settings.hqEmail || settings.email || 'info@avstudio.com'}`} style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                  {settings.hqEmail || settings.email || 'info@avstudio.com'}
                </a>
              </div>
            </div>

            {/* Studio Address & Landmark */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 42, 133, 0.1)',
                border: '1px solid rgba(255, 42, 133, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={20} color="#ff2a85" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Studio Address
                </div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {settings.address || '123, Creative Street, Anna Nagar, Chennai - 600040, Tamil Nadu'}
                </div>
                {settings.hqLandmark && (
                  <div style={{ fontSize: '0.8rem', color: '#ff2a85', marginTop: '4px', fontWeight: 500 }}>
                    📍 Landmark: {settings.hqLandmark}
                  </div>
                )}
              </div>
            </div>

            {/* Studio Timings */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 42, 133, 0.1)',
                border: '1px solid rgba(255, 42, 133, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={20} color="#ff2a85" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Studio Timings
                </div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                  {settings.timings || '9:30 AM – 9:00 PM (Mon – Sun)'}
                </div>
              </div>
            </div>
          </div>

          {/* Social Profiles & Direct WhatsApp CTAs */}
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={`https://wa.me/${(settings.whatsapp || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${settings.studioName || 'AV STUDIO'}, I would like to inquire about booking a shoot.`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{
                background: '#25D366',
                boxShadow: '0 0 25px rgba(37, 211, 102, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                textDecoration: 'none'
              }}
            >
              <MessageSquare size={18} />
              Chat on WhatsApp
            </a>

            <div style={{ display: 'grid', gridTemplateColumns: settings.instagramUrl && settings.facebookUrl ? 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))' : '1fr', gap: '10px' }}>
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.2) 0%, rgba(253, 29, 29, 0.2) 100%)',
                    border: '1px solid rgba(225, 48, 108, 0.4)',
                    color: '#fff',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <ExternalLink size={14} color="#ff2a85" />
                  Instagram
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#fff',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <ExternalLink size={14} color="#3b82f6" />
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Send Message Form & Dark Map Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          {/* Form */}
          <div className="glass-panel" style={{
            padding: 'clamp(18px, 4vw, 36px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 42, 133, 0.25)',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>
              Send Us a Message
            </h3>

            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '16px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>Message Received!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
                  Our photography director will get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline"
                  style={{ marginTop: '16px', padding: '6px 16px', fontSize: '0.82rem' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label>Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                  <div>
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label>Your Message *</label>
                  <textarea
                    rows="3"
                    placeholder="Describe your event date, location, or package preferences..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '6px' }}
                >
                  <Send size={16} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginTop: '10px'
                }}>
                  <Mail size={12} color="#ff2a85" />
                  Inquiries are saved and emailed directly to our studio inbox
                </div>
              </form>
            )}
          </div>

          {/* Dynamic Studio Google Map Card (Configured via Admin CMS) */}
          <div className="glass-panel" style={{
            position: 'relative',
            height: '240px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 42, 133, 0.3)',
            background: '#090a12',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <iframe
              title="Studio Location Map"
              src={getMapEmbedSrc()}
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: 'invert(90%) hue-rotate(180deg) contrast(1.15) brightness(0.9)',
                opacity: 0.92,
                display: 'block'
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Live Studio Pin Badge */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(8, 9, 14, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 42, 133, 0.5)',
              borderRadius: '10px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
              pointerEvents: 'none'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ff2a85',
                boxShadow: '0 0 8px #ff2a85',
                animation: 'pulseNeon 2s infinite'
              }} />
              <MapPin size={15} color="#ff2a85" />
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.02em'
              }}>
                {settings.mapLocationName || 'AV Studio • Anna Nagar'}
              </span>
            </div>

            {/* Direct Google Maps Navigation Button */}
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                background: 'rgba(8, 9, 14, 0.88)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}
            >
              <Navigation size={13} color="#ff2a85" />
              Open in Maps
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
