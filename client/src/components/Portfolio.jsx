import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, X, Filter } from 'lucide-react';

export const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const categories = [
    'All',
    'Weddings',
    'Pre-Wedding',
    'Birthdays',
    'Corporate',
    'Baby Shower',
    'Drone Shoots'
  ];

  useEffect(() => {
    fetchPortfolio();
  }, [selectedCategory]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'All'
        ? '/api/portfolio'
        : `/api/portfolio?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPortfolioItems(data.data);
      }
    } catch (err) {
      console.error('Error loading portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayedItems = showAll ? portfolioItems : portfolioItems.slice(0, 6);

  return (
    <section id="portfolio" style={{
      padding: 'clamp(40px, 6vw, 80px) clamp(12px, 3vw, 24px)',
      maxWidth: '1360px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 40px)' }}>
        <h2 style={{
          fontSize: 'clamp(1.9rem, 4vw, 3rem)',
          fontWeight: 800,
          marginBottom: '12px'
        }}>
          Events & <span className="gradient-pink">Portfolio</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.92rem, 1.8vw, 1.02rem)', maxWidth: '600px', margin: '0 auto' }}>
          Explore our signature visual stories across grand weddings, outdoor romance, corporate events, and aerial perspectives.
        </p>
      </div>

      {/* Category Pills (Screen 3 in image) */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: 'clamp(28px, 4vw, 40px)',
        width: '100%'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setShowAll(false); }}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              border: selectedCategory === cat ? '1px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedCategory === cat ? '#ff2a85' : 'rgba(255, 255, 255, 0.04)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
              boxShadow: selectedCategory === cat ? '0 0 20px rgba(255, 42, 133, 0.45)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Gallery Grid (Screen 3 in image) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-dim)' }}>
          Loading creative captures...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(16px, 3vw, 24px)',
          marginBottom: '40px',
          width: '100%'
        }}>
          {displayedItems.map((item, idx) => (
            <div
              key={item._id || idx}
              onClick={() => setLightboxImage(item)}
              className="glass-panel"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                height: '320px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              />

              {/* Hover overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(8, 9, 14, 0.95) 0%, rgba(8, 9, 14, 0.2) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '24px',
                transition: 'opacity 0.3s ease'
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#ff2a85',
                  marginBottom: '4px'
                }}>
                  {item.category}
                </span>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '4px'
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.caption}
                </p>
              </div>

              {/* Top zoom icon badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(10, 11, 20, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 42, 133, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Eye size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View More Photos Button */}
      {portfolioItems.length > 6 && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-primary"
            style={{ padding: '12px 32px' }}
          >
            {showAll ? 'Show Fewer Photos' : 'View More Photos'}
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="modal-overlay" onClick={() => setLightboxImage(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#10121d',
              border: '1px solid rgba(255, 42, 133, 0.4)',
              boxShadow: '0 0 50px rgba(0,0,0,0.9), 0 0 30px rgba(255, 42, 133, 0.3)'
            }}
          >
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                color: '#fff',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', background: '#07080e' }}
            />
            <div style={{ padding: '24px' }}>
              <div style={{ color: '#ff2a85', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                {lightboxImage.category} • {lightboxImage.date || 'AV STUDIO Special'}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {lightboxImage.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
                {lightboxImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
