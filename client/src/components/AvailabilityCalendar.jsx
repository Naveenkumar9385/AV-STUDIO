import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export const AvailabilityCalendar = ({ onBookDate }) => {
  // Default to June 2025 (matching the reference image), but fully navigable
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed: 5 is June
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [selectedDate, setSelectedDate] = useState('2025-06-16');
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [loading, setLoading] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchAvailability();
  }, [currentMonth, currentYear]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/availability?month=${currentMonth + 1}&year=${currentYear}`);
      const data = await res.json();
      if (data.success && data.lookup) {
        setAvailabilityMap(data.lookup);
      }
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Build calendar matrix
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDateClick = (day) => {
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formatted);
    const info = availabilityMap[formatted] || {
      status: 'available',
      reason: 'Open for shoots',
      morningAvailable: true,
      eveningAvailable: true
    };
    setSelectedDateData(info);
  };

  // Keep selectedDateData in sync with lookup
  useEffect(() => {
    if (selectedDate) {
      const info = availabilityMap[selectedDate] || {
        status: 'available',
        reason: 'Open for shoots',
        morningAvailable: true,
        eveningAvailable: true
      };
      setSelectedDateData(info);
    }
  }, [availabilityMap, selectedDate]);

  const getDayStatus = (day) => {
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availabilityMap[formatted]?.status || 'available';
  };

  const getStatusDotColor = (status) => {
    if (status === 'booked') return '#ef4444';
    if (status === 'partial') return '#f59e0b';
    return '#10b981';
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const month = monthNames[parseInt(m, 10) - 1];
    return `${parseInt(d, 10)} ${month} ${y}`;
  };

  return (
    <section id="availability" style={{
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
          marginBottom: '10px'
        }}>
          Date <span className="gradient-pink">Availability Calendar</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.92rem, 1.8vw, 1.02rem)', maxWidth: '650px', margin: '0 auto' }}>
          Check real-time slot availability for our studio and outdoor cinematic crew. Click any date to reserve immediately.
        </p>
      </div>

      {/* Main Calendar Card (Screen 5 in image) */}
      <div className="glass-panel" style={{
        padding: 'clamp(16px, 3.5vw, 36px) clamp(12px, 3vw, 28px)',
        maxWidth: '1050px',
        margin: '0 auto',
        borderRadius: '24px',
        border: '1px solid rgba(255, 42, 133, 0.25)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(255, 42, 133, 0.1)',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(24px, 4vw, 40px)',
          alignItems: 'start',
          width: '100%'
        }}>
          {/* Left: Monthly Calendar Grid */}
          <div>
            {/* Header: Month Navigator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '26px',
              padding: '0 8px'
            }}>
              <button
                onClick={handlePrevMonth}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ff2a85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              >
                <ChevronLeft size={18} />
              </button>

              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                color: '#fff'
              }}>
                {monthNames[currentMonth]} {currentYear}
              </div>

              <button
                onClick={handleNextMonth}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#ff2a85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekdays Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              marginBottom: '14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-dim)'
            }}>
              {daysOfWeek.map(d => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="calendar-grid-cells" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 'clamp(4px, 1.2vw, 10px)'
            }}>
              {/* Blank offset for month start */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const status = getDayStatus(day);
                const dotColor = getStatusDotColor(status);

                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    style={{
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(255, 42, 133, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '2px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.06)',
                      boxShadow: isSelected ? '0 0 15px rgba(255, 42, 133, 0.4)' : 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <span style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: isSelected ? '#fff' : '#e2e8f0'
                    }}>
                      {day}
                    </span>

                    {/* Status Dot */}
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: dotColor,
                      boxShadow: `0 0 8px ${dotColor}`,
                      marginTop: '4px'
                    }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Legend & Selected Date Action Panel (Screen 5 in image) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            paddingLeft: '24px'
          }}>
            {/* Legend */}
            <div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '14px'
              }}>
                Legend
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Available</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Full Day Available</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Partial</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Partially Booked</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Fully Booked</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Not Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Date Details Box */}
            <div className="glass-panel" style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 42, 133, 0.3)',
              background: 'rgba(12, 13, 24, 0.85)'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Selected Date
              </div>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#fff',
                margin: '4px 0 10px'
              }}>
                {formatDisplayDate(selectedDate)}
              </div>

              {/* Status pill */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: selectedDateData?.status === 'booked' ? 'rgba(239, 68, 68, 0.15)' : selectedDateData?.status === 'partial' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: selectedDateData?.status === 'booked' ? '#ef4444' : selectedDateData?.status === 'partial' ? '#f59e0b' : '#10b981',
                  border: `1px solid ${selectedDateData?.status === 'booked' ? 'rgba(239, 68, 68, 0.4)' : selectedDateData?.status === 'partial' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                }}>
                  {selectedDateData?.status === 'booked' ? 'Fully Booked' : selectedDateData?.status === 'partial' ? 'Partially Booked' : 'Available'}
                </span>
              </div>

              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                {selectedDateData?.reason || 'Date is open for custom wedding or portrait shoots.'}
              </div>

              {/* Action button */}
              <button
                disabled={selectedDateData?.status === 'booked'}
                onClick={() => {
                  const eventEl = document.getElementById('portfolio') || document.getElementById('booking');
                  if (eventEl) {
                    eventEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-primary"
                style={{
                  width: '100%',
                  opacity: selectedDateData?.status === 'booked' ? 0.5 : 1,
                  cursor: selectedDateData?.status === 'booked' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {selectedDateData?.status === 'booked' ? 'Date Unavailable' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
