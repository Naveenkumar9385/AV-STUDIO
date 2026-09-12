import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { Portfolio } from './components/Portfolio';
import { EventBookingSection } from './components/EventBookingSection';
import { FrameCatalog } from './components/FrameCatalog';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { ContactUs } from './components/ContactUs';
import { EventBookingModal } from './components/EventBookingModal';
import { FrameOrderModal } from './components/FrameOrderModal';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ErrorBoundary } from './components/Admin/ErrorBoundary';
import { Camera, Heart, ArrowUp, MessageSquare } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './components/SocialIcons';
import { useSite } from './context/SiteContext';

export function App() {
  const { settings } = useSite();
  const [activeTab, setActiveTab] = useState('home');
  const [isEventBookingOpen, setIsEventBookingOpen] = useState(false);
  const [eventBookingInitialDate, setEventBookingInitialDate] = useState(null);
  const [eventBookingInitialPackage, setEventBookingInitialPackage] = useState(null);
  const [eventBookingInitialType, setEventBookingInitialType] = useState('Wedding');

  const [isFrameOrderOpen, setIsFrameOrderOpen] = useState(false);
  const [selectedFrameForOrder, setSelectedFrameForOrder] = useState(null);

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Restore saved admin session or auto-login
  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem('av_studio_admin');
      const token = localStorage.getItem('av_studio_token');
      if (savedAdmin && token && savedAdmin !== 'undefined') {
        const parsed = JSON.parse(savedAdmin);
        setIsAdminLoggedIn(true);
        setAdminUser(parsed);
      }
    } catch (e) {
      console.error('Session restore error:', e);
    }
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminLoggedIn(true);
    const savedAdmin = localStorage.getItem('av_studio_admin');
    const token = localStorage.getItem('av_studio_token');
    if (savedAdmin && token && savedAdmin !== 'undefined') {
      try {
        const parsed = JSON.parse(savedAdmin);
        setAdminUser(parsed);
      } catch (e) {}
    } else {
      const fallbackAdmin = { id: 'admin-1', username: 'admin', name: 'Arjun Prakash', role: 'admin' };
      setAdminUser(prev => prev || fallbackAdmin);
    }
    setShowAdminDashboard(true);

    if (token) {
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.admin) {
            setAdminUser(data.admin);
            localStorage.setItem('av_studio_admin', JSON.stringify(data.admin));
          }
        })
        .catch(() => {});
    } else {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.token) {
            localStorage.setItem('av_studio_token', data.token);
            localStorage.setItem('av_studio_admin', JSON.stringify(data.admin));
            setAdminUser(data.admin);
          }
        })
        .catch(err => {
          console.warn('Background admin auth sync notice:', err);
        });
    }
  };

  // Check URL hash or query for direct #admin access
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        handleOpenAdmin();
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenEventBooking = (date = null, eventPackage = null, eventType = null) => {
    setEventBookingInitialDate(date);
    setEventBookingInitialPackage(eventPackage);
    if (eventType) setEventBookingInitialType(eventType);
    else if (eventPackage?.eventType) setEventBookingInitialType(eventPackage.eventType);
    setIsEventBookingOpen(true);
  };

  const handleOpenFrameOrder = (frame = null) => {
    setSelectedFrameForOrder(frame);
    setIsFrameOrderOpen(true);
  };

  const handleAdminLoginSuccess = (admin) => {
    setIsAdminLoggedIn(true);
    setAdminUser(admin);
    setShowAdminDashboard(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setShowAdminDashboard(false);
    localStorage.removeItem('av_studio_token');
    localStorage.removeItem('av_studio_admin');
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
  };

  // If Admin Dashboard is active, render the dedicated dashboard protected by ErrorBoundary
  if (showAdminDashboard) {
    return (
      <ErrorBoundary onClose={() => {
        setShowAdminDashboard(false);
        if (window.location.hash === '#admin') {
          window.location.hash = '';
        }
      }}>
        <AdminDashboard
          admin={adminUser || { username: 'admin', name: 'Arjun Prakash', role: 'admin' }}
          onLogout={handleAdminLogout}
          onUpdateAdmin={(updated) => setAdminUser(updated)}
          onCloseDashboard={() => {
            setShowAdminDashboard(false);
            if (window.location.hash === '#admin') {
              window.location.hash = '';
            }
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Fixed Sticky Navigation */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isAdminLoggedIn}
        onLogout={handleAdminLogout}
      />

      {/* Main Public Website Sections with Top Padding for Fixed Navbar */}
      <main style={{ flexGrow: 1, width: '100%', maxWidth: '100%', overflowX: 'hidden', paddingTop: '68px' }}>
        <Hero
          onCheckAvailability={() => {
            document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onContactStudio={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <AboutUs />

        <Portfolio />

        {/* Dedicated Event Booking & Packages Section */}
        <EventBookingSection
          onBookEvent={(pkg) => handleOpenEventBooking(null, pkg, pkg.eventType)}
        />

        <FrameCatalog
          onOrderFrame={(frame) => handleOpenFrameOrder(frame)}
          onSelectFrameForBooking={(frame) => handleOpenFrameOrder(frame)}
        />

        <AvailabilityCalendar
          onBookDate={(date) => handleOpenEventBooking(date)}
        />

        <ContactUs />
      </main>

      {/* Dynamic Footer Configured via Admin CMS */}
      <footer style={{
        background: '#06070a',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: 'clamp(40px, 6vw, 60px) clamp(14px, 3vw, 24px) 30px',
        color: 'var(--text-muted)',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: 'clamp(24px, 4vw, 40px)',
          marginBottom: '40px',
          width: '100%'
        }}>
          {/* Col 1: Brand, About & Social Profiles */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.studioName || 'AV STUDIO'}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: '1.5px solid rgba(255, 42, 133, 0.5)'
                  }}
                />
              ) : (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff2a85 0%, #8a2be2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(255, 42, 133, 0.4)'
                }}>
                  <Camera size={20} color="#fff" />
                </div>
              )}
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'block', lineHeight: 1.1 }}>
                  {settings?.studioName || 'AV STUDIO'}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {settings?.studioTagline || 'Cinema & Photography'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: '20px' }}>
              {settings?.footerAbout || "Premier Photography & Cinematic Videography studio based in Chennai. Transforming life's greatest celebrations into timeless cinematic heirlooms."}
            </p>

            {/* Social Media Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(255, 42, 133, 0.1)',
                    border: '1px solid rgba(255, 42, 133, 0.3)',
                    color: '#ff2a85',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <InstagramIcon size={17} />
                </a>
              )}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <FacebookIcon size={17} />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <YoutubeIcon size={17} />
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${(settings.whatsapp || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(37, 211, 102, 0.1)',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    color: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <MessageSquare size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Quick Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.88rem' }}>
              {(settings?.footerQuickLinks || [
                'Home',
                'About Us & Gear',
                'Events & Portfolio',
                'Event Booking & Packages',
                'Frame Catalog',
                'Date Availability',
                'Contact Studio'
              ]).map((linkName, idx) => {
                const targetIds = ['home', 'about', 'portfolio', 'booking', 'frames', 'availability', 'contact'];
                const target = targetIds[idx % targetIds.length];
                return (
                  <a
                    key={idx}
                    href={`#${target}`}
                    style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.target.style.color = '#ff2a85'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    {linkName}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 3: Studio Services */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Studio Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.88rem' }}>
              {(settings?.footerServices || [
                'Destination Weddings',
                'Pre-Wedding Outdoor Cinema',
                'Drone 4K Aerial Cinematography',
                'Luxury Archival Albums',
                'Museum Quality Photo Framing'
              ]).map((srv, idx) => (
                <span key={idx} style={{ color: 'var(--text-dim)' }}>
                  {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Studio Headquarters Contact */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
              {settings?.hqTitle || 'Studio Headquarters'}
            </h4>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: '8px' }}>
              {settings?.address || '123, Creative Street, Anna Nagar, Chennai - 600040'}
            </p>
            {settings?.hqLandmark && (
              <p style={{ fontSize: '0.82rem', color: '#ff2a85', marginBottom: '10px' }}>
                📍 {settings.hqLandmark}
              </p>
            )}
            <div style={{ color: '#ff2a85', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
              <a href={`tel:${settings?.hqPhone || settings?.phone || '+91 98765 43210'}`} style={{ color: '#ff2a85', textDecoration: 'none' }}>
                {settings?.hqPhone || settings?.phone || '+91 98765 43210'}
              </a>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <a href={`mailto:${settings?.hqEmail || settings?.email || 'info@avstudio.com'}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                {settings?.hqEmail || settings?.email || 'info@avstudio.com'}
              </a>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px' }}>
              ⏰ {settings?.timings || '9:30 AM – 9:00 PM (Mon – Sun)'}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin note */}
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            {settings?.footerCopyright || `© ${new Date().getFullYear()} AV STUDIO. All rights reserved. Designed for excellence.`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>AV STUDIO Official Cinema & Photography Studio</span>
          </div>
        </div>
      </footer>

      {/* Dedicated Event Shoot Booking Modal */}
      <EventBookingModal
        isOpen={isEventBookingOpen}
        onClose={() => {
          setIsEventBookingOpen(false);
          setEventBookingInitialPackage(null);
        }}
        initialDate={eventBookingInitialDate}
        initialEventPackage={eventBookingInitialPackage}
        initialEventType={eventBookingInitialType}
      />

      {/* Dedicated Frame Order Modal */}
      <FrameOrderModal
        isOpen={isFrameOrderOpen}
        onClose={() => {
          setIsFrameOrderOpen(false);
          setSelectedFrameForOrder(null);
        }}
        frame={selectedFrameForOrder}
        initialFrame={selectedFrameForOrder}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
