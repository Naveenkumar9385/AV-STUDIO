import React from 'react';
import { Camera, Film, Compass, Zap, Award } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const AboutUs = () => {
  const { settings } = useSite();

  const defaultGear = [
    {
      name: 'Sony A7 IV',
      desc: '45MP Full Frame',
      icon: <Camera size={26} color="#ff2a85" />
    },
    {
      name: 'Canon R5',
      desc: '8K Video Cinema',
      icon: <Film size={26} color="#ff2a85" />
    },
    {
      name: 'DJI Mavic 3 Pro',
      desc: 'Cine Tri-Camera Drone',
      icon: <Compass size={26} color="#ff2a85" />
    },
    {
      name: 'Ronin RS 3 Pro',
      desc: 'Cinematic Gimbal',
      icon: <Zap size={26} color="#ff2a85" />
    },
    {
      name: 'Lighting Setup',
      desc: 'Godox & Nanlite RGB',
      icon: <Zap size={26} color="#ff2a85" />
    }
  ];

  const gearItems = settings.gearItems && settings.gearItems.length > 0
    ? settings.gearItems.map((g, idx) => ({
        ...g,
        icon: defaultGear[idx % defaultGear.length].icon
      }))
    : defaultGear;

  return (
    <section id="about" style={{
      padding: 'clamp(40px, 6vw, 80px) clamp(12px, 3vw, 24px)',
      maxWidth: '1360px',
      margin: '0 auto',
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(30px, 5vw, 50px)' }}>
        <h2 style={{
          fontSize: 'clamp(1.9rem, 4vw, 3rem)',
          fontWeight: 800,
          marginBottom: '14px'
        }}>
          {settings.aboutTitle?.includes(' ') ? (
            <>
              {settings.aboutTitle.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="gradient-pink">{settings.aboutTitle.split(' ').slice(-1)}</span>
            </>
          ) : (
            <span className="gradient-pink">{settings.aboutTitle || 'About AV Studio'}</span>
          )}
        </h2>
        <p style={{
          maxWidth: '750px',
          margin: '0 auto',
          color: 'var(--text-muted)',
          fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
          lineHeight: 1.7
        }}>
          {settings.aboutStory || 'Founded in 2018, AV Studio is a passionate team of creative storytellers, dedicated to capturing your most precious moments with artistic vision and modern technology. We believe every moment is unique and we make it timeless.'}
        </p>
      </div>

      {/* Founder Philosophy & Story Card (CEO Photo Removed as requested) */}
      <div style={{
        maxWidth: '850px',
        margin: '0 auto clamp(40px, 6vw, 60px)',
        position: 'relative',
        width: '100%'
      }}>
        <div className="glass-panel" style={{
          padding: 'clamp(28px, 5vw, 44px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 42, 133, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 42, 133, 0.15)',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#ff2a85',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '10px'
          }}>
            <Award size={16} />
            {settings.founderTagline || 'Leader & Lead Cinematographer'}
          </div>

          <h3 style={{
            fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '4px'
          }}>
            {settings.founderName || 'Arjun Prakash'}
          </h3>

          <div style={{
            color: 'var(--text-dim)',
            fontSize: '0.95rem',
            fontWeight: 500,
            marginBottom: '18px'
          }}>
            {settings.founderRole || 'Founder & Creative Director'}
          </div>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.08rem)',
            lineHeight: 1.8,
            maxWidth: '720px',
            margin: '0 auto 24px',
            fontStyle: 'italic'
          }}>
            {settings.founderQuote || '"A passionate visual storyteller with over a decade of experience in Photography and Filmmaking. At AV Studio, we do not just press the shutter — we capture feelings, laughter, and heritage that your family will cherish for generations."'}
          </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <a
                href="#social"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ff2a85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="#social"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ff2a85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="#social"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ff2a85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>

      {/* Our Gear Section (Screen 2 in image) */}
      <div>
        <h4 style={{
          textAlign: 'center',
          fontSize: '1.4rem',
          fontWeight: 700,
          marginBottom: '26px',
          color: '#fff',
          letterSpacing: '0.04em'
        }}>
          Our <span style={{ color: '#ff2a85' }}>Gear</span>
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: 'clamp(10px, 2vw, 16px)',
          width: '100%'
        }}>
          {gearItems.map((gear, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '20px 16px',
                textAlign: 'center',
                borderRadius: '16px',
                border: '1px solid rgba(255, 42, 133, 0.2)'
              }}
            >
              <div style={{
                width: '54px',
                height: '54px',
                margin: '0 auto 12px',
                borderRadius: '50%',
                background: 'rgba(255, 42, 133, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {gear.icon}
              </div>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '4px'
              }}>
                {gear.name}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-dim)'
              }}>
                {gear.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
