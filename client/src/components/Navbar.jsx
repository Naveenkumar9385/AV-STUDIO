import React, { useState, useEffect } from 'react';
import { Camera, Calendar, LogIn, Menu, X, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';
import { useSite } from '../context/SiteContext';

export const Navbar = ({ onOpenBooking, onOpenAdmin, activeTab, setActiveTab, isLoggedIn, onLogout }) => {
  const { settings } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on window resize if scaled up to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'portfolio', label: 'Events' },
    { id: 'booking', label: 'Packages' },
    { id: 'frames', label: 'Frames' },
    { id: 'availability', label: 'Availability' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = () => {
    setActiveTab('portfolio');
    setMobileMenuOpen(false);
    const element = document.getElementById('portfolio') || document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cleanWhatsApp = (settings?.whatsapp || '919876543210').replace(/[^0-9]/g, '');

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(8, 9, 14, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px clamp(14px, 3vw, 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.7)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            flexShrink: 0,
            maxWidth: 'calc(100% - 60px)'
          }}
        >
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.studioName || 'AV STUDIO'}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                objectFit: 'cover',
                border: '1.5px solid rgba(255, 42, 133, 0.5)',
                boxShadow: '0 0 14px rgba(255, 42, 133, 0.4)',
                flexShrink: 0
              }}
            />
          ) : (
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ff2a85 0%, #8a2be2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(255, 42, 133, 0.5)',
              flexShrink: 0
            }}>
              <Camera size={20} color="#fff" />
            </div>
          )}
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.15rem, 2.4vw, 1.45rem)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {settings.studioName || 'AV STUDIO'}
            </div>
            <div style={{
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {settings.studioTagline || 'Cinema & Photography'}
            </div>
          </div>
        </div>

        {/* Desktop Links, Socials & Actions (Hidden on mobile < 1024px) */}
        <div className="nav-desktop">
          {/* Navigation links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === link.id ? 'var(--primary)' : 'var(--text-muted)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 2px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  borderBottom: activeTab === link.id ? '2px solid var(--primary)' : '2px solid transparent'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social Icons in Navbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 42, 133, 0.1)',
                  color: '#ff2a85',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <InstagramIcon size={15} />
              </a>
            )}
            {settings?.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <FacebookIcon size={15} />
              </a>
            )}
            {cleanWhatsApp && (
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(37, 211, 102, 0.1)',
                  color: '#25D366',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <MessageSquare size={15} />
              </a>
            )}
          </div>

          {/* Action Button: Book Now (Scrolls directly to Events) */}
          <button
            id="nav-book-now-btn"
            onClick={handleBookNow}
            className="btn-primary"
            style={{
              padding: '8px 20px',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              boxShadow: '0 0 15px rgba(255, 42, 133, 0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            <Calendar size={14} />
            Book Now
          </button>

          {/* Admin Login / Dashboard */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                id="nav-admin-dash-btn"
                onClick={() => onOpenAdmin()}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.86rem', whiteSpace: 'nowrap' }}
              >
                Dashboard
              </button>
              <button
                onClick={onLogout}
                className="btn-outline"
                style={{ padding: '8px 12px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              id="nav-admin-btn"
              onClick={() => onOpenAdmin()}
              className="btn-outline"
              style={{
                padding: '8px 16px',
                fontSize: '0.86rem',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogIn size={14} />
              Admin Dashboard
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle (Visible ONLY on mobile < 1024px) */}
        <div className="nav-mobile-toggle">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              background: mobileMenuOpen ? 'rgba(255, 42, 133, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              border: mobileMenuOpen ? '1px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              color: mobileMenuOpen ? '#ff2a85' : '#fff',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: mobileMenuOpen ? '0 0 15px rgba(255, 42, 133, 0.3)' : 'none'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu (Clean animated drawer for phone screens) */}
        <div className={`nav-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(link => (
              <div
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  color: activeTab === link.id ? '#ff2a85' : 'var(--text-main)',
                  fontWeight: activeTab === link.id ? 700 : 500,
                  fontSize: '1.02rem',
                  cursor: 'pointer',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: activeTab === link.id ? 'rgba(255, 42, 133, 0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.2s ease',
                  borderLeft: activeTab === link.id ? '3px solid #ff2a85' : '3px solid transparent'
                }}
              >
                <span>{link.label}</span>
                {activeTab === link.id && <Sparkles size={14} color="#ff2a85" />}
              </div>
            ))}
          </div>

          {/* Mobile Social Connections */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '12px 8px',
            margin: '6px 0',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#ff2a85',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <InstagramIcon size={16} /> Instagram
              </a>
            )}
            {settings?.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <FacebookIcon size={16} /> Facebook
              </a>
            )}
            {cleanWhatsApp && (
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <MessageSquare size={16} /> WhatsApp
              </a>
            )}
          </div>

          {/* Primary Action: Book Now (Scrolls directly to Events) */}
          <button
            id="mobile-book-now-btn"
            onClick={handleBookNow}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '0.98rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '12px',
              boxShadow: '0 0 20px rgba(255, 42, 133, 0.4)'
            }}
          >
            <Calendar size={17} />
            Book Now
          </button>

          {/* Admin Navigation */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '0.88rem' }}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="btn-outline"
                style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '0.88rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="btn-outline"
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogIn size={15} />
              Admin Portal
            </button>
          )}
        </div>
      </nav>

      {/* Backdrop overlay when mobile menu is open (closes menu when tapped) */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            zIndex: 99
          }}
        />
      )}
    </>
  );
};
