import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Video, Award, Clock, Sparkles, ShieldCheck, MessageSquare } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const Hero = ({ onCheckAvailability, onBookSession, onContactStudio }) => {
  const { settings } = useSite();
  const [studioStatus, setStudioStatus] = useState({
    isOpen: true,
    statusText: 'OPEN NOW',
    subText: 'Closes at 09:00 PM',
    hours: 0,
    minutes: 0,
    seconds: 0,
    label: 'CLOSES IN'
  });

  // Calculate real live countdown based on actual system time & studio hours
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();

      // Studio operating hours:
      // Morning Opening: 09:30 AM (9h 30m)
      // Night Closing: 09:00 PM (21h 00m)
      const openTimeToday = new Date(now);
      openTimeToday.setHours(9, 30, 0, 0);

      const closeTimeToday = new Date(now);
      closeTimeToday.setHours(21, 0, 0, 0);

      let isOpen = false;
      let targetTime;
      let statusText = 'OPEN NOW';
      let subText = 'Closes at 09:00 PM';
      let label = 'CLOSES IN';

      if (now >= openTimeToday && now < closeTimeToday) {
        // Between 09:30 AM and 09:00 PM: Studio is OPEN
        isOpen = true;
        targetTime = closeTimeToday;
        statusText = settings?.studioStatus || 'OPEN NOW';
        subText = settings?.closingTime || 'Closes at 09:00 PM';
        label = 'CLOSES IN';
      } else {
        // Outside operating hours: Studio is CLOSED
        isOpen = false;
        statusText = 'CLOSED NOW';
        label = 'OPENS IN';

        if (now < openTimeToday) {
          // Early morning before 09:30 AM -> opens today
          targetTime = openTimeToday;
          subText = 'Opens today at 09:30 AM';
        } else {
          // Night after 09:00 PM -> opens tomorrow morning
          const openTimeTomorrow = new Date(now);
          openTimeTomorrow.setDate(now.getDate() + 1);
          openTimeTomorrow.setHours(9, 30, 0, 0);
          targetTime = openTimeTomorrow;
          subText = 'Opens tomorrow at 09:30 AM';
        }
      }

      const diffMs = Math.max(0, targetTime.getTime() - now.getTime());
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setStudioStatus({
        isOpen,
        statusText,
        subText,
        hours,
        minutes,
        seconds,
        label
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [settings?.studioStatus, settings?.closingTime]);

  const formatDigit = (num) => String(num).padStart(2, '0');

  const defaultHighlightFeatures = [
    {
      icon: <Video size={24} color="#ff2a85" />,
      title: '4K/8K Quality',
      subtitle: 'Premium Cameras'
    },
    {
      icon: <Award size={24} color="#ff2a85" />,
      title: 'Creative Team',
      subtitle: 'Expert Photographers'
    },
    {
      icon: <Clock size={24} color="#ff2a85" />,
      title: 'Fast Delivery',
      subtitle: 'Quick & Reliable'
    },
    {
      icon: <ShieldCheck size={24} color="#ff2a85" />,
      title: 'Best Prices',
      subtitle: 'Affordable Packages'
    }
  ];

  const highlightFeatures = settings.highlightFeatures && settings.highlightFeatures.length > 0
    ? settings.highlightFeatures.map((f, i) => ({
        ...f,
        icon: defaultHighlightFeatures[i % defaultHighlightFeatures.length].icon
      }))
    : defaultHighlightFeatures;

  return (
    <section id="home" style={{
      position: 'relative',
      padding: 'clamp(30px, 5vw, 40px) clamp(12px, 3vw, 24px) clamp(40px, 6vw, 60px)',
      maxWidth: '1360px',
      margin: '0 auto',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Background ambient neon glow balls */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: 'min(450px, 80vw)',
        height: 'min(450px, 80vw)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 42, 133, 0.22) 0%, rgba(138, 43, 226, 0.08) 60%, transparent 80%)',
        filter: 'blur(70px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Hero Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: 'clamp(28px, 4vw, 40px)',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        width: '100%'
      }}>
        {/* Left Column: Headings, Live Ticker, Action CTAs */}
        <div>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 42, 133, 0.1)',
            border: '1px solid rgba(255, 42, 133, 0.3)',
            borderRadius: '9999px',
            padding: '6px 16px',
            marginBottom: '20px'
          }}>
            <Sparkles size={14} color="#ff2a85" />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#ff4d9d'
            }}>
              {settings.heroEyebrow || 'Capturing Moments'}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 5vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            marginBottom: '20px',
            textTransform: 'uppercase',
            wordBreak: 'break-word'
          }}>
            {settings.heroTitle?.includes(' ') ? (
              <>
                {settings.heroTitle.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="gradient-pink">{settings.heroTitle.split(' ').slice(-1)}</span>
              </>
            ) : (
              <span className="gradient-pink">{settings.heroTitle || 'Creating Memories'}</span>
            )}
          </h1>

          <p style={{
            fontSize: 'clamp(0.98rem, 1.8vw, 1.12rem)',
            color: 'var(--text-muted)',
            marginBottom: '32px',
            maxWidth: '520px',
            lineHeight: 1.6
          }}>
            {settings.heroSubtitle || 'Professional Photography & Cinematic Videography for Every Occasion. Capturing authentic emotions, majestic rituals, and timeless stories with artistic elegance.'}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
            <button onClick={onCheckAvailability} className="btn-primary" id="hero-check-avail-btn">
              <CheckCircle size={18} />
              Check Availability
            </button>
            <button 
              onClick={() => {
                const eventEl = document.getElementById('portfolio') || document.getElementById('booking');
                if (eventEl) eventEl.scrollIntoView({ behavior: 'smooth' });
                else if (onBookSession) onBookSession();
              }} 
              className="btn-outline" 
              id="hero-book-now-btn"
            >
              <Calendar size={18} />
              Book Now
            </button>
          </div>

          {/* Live Studio Status Box */}
          <div className="glass-panel-neon" style={{
            padding: '14px clamp(14px, 3vw, 22px)',
            maxWidth: '460px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'rgba(15, 17, 28, 0.85)',
            boxSizing: 'border-box',
            border: studioStatus.isOpen ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: studioStatus.isOpen ? '#10b981' : '#f59e0b',
                boxShadow: studioStatus.isOpen ? '0 0 12px #10b981' : '0 0 12px #f59e0b',
                animation: 'pulseNeon 2s infinite',
                flexShrink: 0
              }} />
              <div>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  color: studioStatus.isOpen ? '#10b981' : '#f59e0b',
                  letterSpacing: '0.04em'
                }}>
                  {studioStatus.statusText}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {studioStatus.subText}
                </div>
              </div>
            </div>

            {/* Live Real-time Countdown Clock */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              fontFamily: "'Outfit', monospace"
            }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '2px' }}>
                {studioStatus.label}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff2a85', lineHeight: 1 }}>
                    {formatDigit(studioStatus.hours)}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>HRS</div>
                </div>
                <span style={{ color: '#ff2a85', fontWeight: 700, lineHeight: 1 }}>:</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff2a85', lineHeight: 1 }}>
                    {formatDigit(studioStatus.minutes)}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>MINS</div>
                </div>
                <span style={{ color: '#ff2a85', fontWeight: 700, lineHeight: 1 }}>:</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff2a85', lineHeight: 1 }}>
                    {formatDigit(studioStatus.seconds)}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>SECS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual - Glowing Camera Lens */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'clamp(280px, 40vw, 420px)',
          width: '100%',
          overflow: 'hidden',
          padding: '20px 0'
        }}>
          {/* Neon Ring Halo */}
          <div style={{
            position: 'absolute',
            width: 'min(340px, 82vw)',
            height: 'min(340px, 82vw)',
            borderRadius: '50%',
            border: '2px solid rgba(255, 42, 133, 0.6)',
            boxShadow: '0 0 40px rgba(255, 42, 133, 0.4), inset 0 0 30px rgba(255, 42, 133, 0.3)',
            animation: 'pulseNeon 4s infinite ease-in-out'
          }} />

          {/* Secondary Outer Orbit */}
          <div style={{
            position: 'absolute',
            width: 'min(390px, 90vw)',
            height: 'min(390px, 90vw)',
            borderRadius: '50%',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            transform: 'rotate(25deg)'
          }} />

          {/* Main Cinematic Camera Lens Image */}
          <div style={{
            position: 'relative',
            width: 'min(300px, 72vw)',
            height: 'min(300px, 72vw)',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 42, 133, 0.3)',
            border: '4px solid #1a1c2e'
          }} className="animate-float">
            <img
              src={settings.heroLensImage || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"}
              alt="AV Studio Cinema Camera Lens"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.1) brightness(0.95)'
              }}
            />
            {/* Dark glass overlay with aperture ring shimmer */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 35% 35%, rgba(255, 42, 133, 0.25) 0%, transparent 60%)',
              mixBlendMode: 'screen'
            }} />
          </div>

          {/* Floating Tag */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: 'clamp(5px, 4vw, 20px)',
            background: 'rgba(10, 11, 20, 0.92)',
            border: '1px solid rgba(255, 42, 133, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '8px 14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#ff4d9d', fontWeight: 700, textTransform: 'uppercase' }}>
              Equipment Grade
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
              Sony FX3 & Canon R5
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
        gap: '16px',
        marginTop: 'clamp(36px, 6vw, 60px)',
        width: '100%'
      }}>
        {highlightFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '20px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'default',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255, 42, 133, 0.1)',
              border: '1px solid rgba(255, 42, 133, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {feat.icon}
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {feat.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {feat.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
