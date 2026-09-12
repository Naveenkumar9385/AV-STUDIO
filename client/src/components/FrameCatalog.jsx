import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Box, Heart, Sparkles, ShoppingBag } from 'lucide-react';

export const FrameCatalog = ({ onSelectFrameForBooking, onOrderFrame }) => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleOrder = onOrderFrame || onSelectFrameForBooking;

  useEffect(() => {
    fetchFrames();
  }, []);

  const fetchFrames = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/frames');
      const data = await res.json();
      if (data.success) {
        setFrames(data.data);
      }
    } catch (err) {
      console.error('Error fetching frames:', err);
    } finally {
      setLoading(false);
    }
  };

  const trustBadges = [
    {
      icon: <Sparkles size={22} color="#ff2a85" />,
      title: 'Premium Quality',
      subtitle: 'Best Materials'
    },
    {
      icon: <Box size={22} color="#ff2a85" />,
      title: 'Custom Sizes',
      subtitle: 'Made For You'
    },
    {
      icon: <ShieldCheck size={22} color="#ff2a85" />,
      title: 'Secure Packaging',
      subtitle: 'Safe Delivery'
    },
    {
      icon: <Heart size={22} color="#ff2a85" />,
      title: '100% Satisfaction',
      subtitle: 'Guaranteed'
    }
  ];

  return (
    <section id="frames" style={{
      padding: '80px 24px',
      maxWidth: '1360px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        {/* Decorative flourishes matching screenshot */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          color: '#ff2a85',
          marginBottom: '8px'
        }}>
          <span style={{ height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #ff2a85)' }} />
          <Sparkles size={16} />
          <span style={{ height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #ff2a85)' }} />
        </div>

        <h2 style={{
          fontSize: 'clamp(2rem, 3.5vw, 3rem)',
          fontWeight: 800,
          marginBottom: '10px'
        }}>
          Frame <span className="gradient-pink">Catalog</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '650px', margin: '0 auto' }}>
          Display your favorite wedding portraits and cherished family milestones in our museum-grade handcrafted frames.
        </p>
      </div>

      {/* Frame Product Cards Grid (Screen 4 in image) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-dim)' }}>
          Loading frame collections...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {frames.map((frame, idx) => (
            <div
              key={frame._id || idx}
              className="glass-panel"
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255, 42, 133, 0.2)',
                background: 'rgba(16, 18, 30, 0.7)'
              }}
            >
              {/* Product Image preview */}
              <div style={{
                position: 'relative',
                height: '240px',
                background: '#0a0b12',
                overflow: 'hidden',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={frame.image}
                  alt={frame.title}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.8)'
                  }}
                />
                {frame.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(255, 42, 133, 0.9)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {frame.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '4px'
                  }}>
                    {frame.title}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                    {frame.dimensions} • {frame.material}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '16px' }}>
                    {frame.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>PRICE</span>
                    <span style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: '#ff4d9d'
                    }}>
                      ₹{frame.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOrder && handleOrder(frame)}
                    className="btn-primary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.84rem',
                      borderRadius: '8px'
                    }}
                  >
                    <ShoppingBag size={14} />
                    Order Frame
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trust Badges Footer (Screen 4 in image) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        padding: '30px 20px',
        background: 'rgba(12, 13, 22, 0.6)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        {trustBadges.map((badge, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(255, 42, 133, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {badge.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                {badge.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                {badge.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
