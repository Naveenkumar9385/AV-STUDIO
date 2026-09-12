import React, { useState, useEffect } from 'react';
import { X, Check, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Printer, MessageCircle, Calendar, CreditCard, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSite } from '../context/SiteContext';

export const EventBookingModal = ({ isOpen, onClose, initialDate, initialEventPackage, initialEventType }) => {
  const { settings } = useSite();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [paymentApp, setPaymentApp] = useState('GPay');
  const [bookingResult, setBookingResult] = useState(null);

  const defaultServices = [
    { id: 'cand-photo', name: 'Candid & Traditional Photography', price: 24999, desc: 'Full-day coverage with 2 pro photographers' },
    { id: 'cin-video', name: 'Cinematic 4K Wedding / Event Film', price: 20000, desc: 'Teaser + full documentary film with color grading' },
    { id: 'drone-cov', name: 'Pro Cine Drone Coverage', price: 12000, desc: 'DJI Mavic 3 Pro aerial perspectives' },
    { id: 'album-lux', name: 'Custom Leatherette Photobook Album', price: 8000, desc: '40 archival silk pages with luxury box' },
    { id: 'pre-shoot', name: 'Pre-Wedding Outdoor Sunset Shoot', price: 15000, desc: 'Half-day outdoor location shoot' }
  ];

  const availableServices = settings.services && settings.services.length > 0
    ? settings.services
    : defaultServices;

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    eventType: 'Wedding',
    eventDate: initialDate || '2025-06-16',
    venue: 'Chennai Venue / Studio',
    notes: '',
    selectedServices: [availableServices[0] || defaultServices[0]],
    transactionId: ''
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBookingResult(null);
      setTransactionId('');
      if (initialDate) {
        setFormData(prev => ({ ...prev, eventDate: initialDate }));
      }
      if (initialEventPackage) {
        setFormData(prev => ({
          ...prev,
          eventType: initialEventPackage.eventType || prev.eventType,
          selectedServices: [{
            id: initialEventPackage.id,
            name: initialEventPackage.title,
            price: initialEventPackage.price,
            desc: initialEventPackage.subtitle || 'All-inclusive shoot package'
          }]
        }));
      } else if (initialEventType) {
        setFormData(prev => ({ ...prev, eventType: initialEventType }));
      }
    }
  }, [isOpen, initialDate, initialEventPackage, initialEventType]);

  if (!isOpen) return null;

  const toggleService = (srv) => {
    const exists = formData.selectedServices.some(s => s.id === srv.id);
    if (exists) {
      if (formData.selectedServices.length === 1) {
        alert('Please select at least one photography or videography service for your shoot.');
        return;
      }
      setFormData({
        ...formData,
        selectedServices: formData.selectedServices.filter(s => s.id !== srv.id)
      });
    } else {
      setFormData({
        ...formData,
        selectedServices: [...formData.selectedServices, srv]
      });
    }
  };

  // Accurate Real-time Price Calculation
  const subtotal = formData.selectedServices.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const totalAmount = subtotal;

  const handleNext = () => {
    if (step === 1) {
      if (!formData.clientName || !formData.phone || !formData.eventDate) {
        alert('Please enter your Name, Phone Number, and Event Date to proceed.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitBooking = async () => {
    if (!formData.transactionId) {
      alert('Please enter your 12-digit UPI Transaction ID or UTR reference number.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        venue: formData.venue,
        notes: formData.notes,
        services: formData.selectedServices,
        totalAmount,
        paymentMethod: paymentApp,
        transactionId: formData.transactionId
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setBookingResult(data.data);
        setStep(4);
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        alert(data.message || 'Error processing booking');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to booking server.');
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic UPI Details directly from Admin Settings
  const upiId = settings.upiId || 'avstudio.shoot@oksbi';
  const upiQrString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(settings.studioName || 'AV STUDIO')}&am=${totalAmount}&cu=INR&tn=Shoot-${encodeURIComponent(formData.eventType)}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiQrString)}&color=0-0-0&bgcolor=255-255-255`;

  const stepsHeader = [
    { num: 1, label: 'Event Details' },
    { num: 2, label: 'Packages & Pricing' },
    { num: 3, label: 'UPI Payment' },
    { num: 4, label: 'Confirmation' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          background: '#0d0e18',
          border: '1px solid rgba(255, 42, 133, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 42, 133, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
      >
        {/* Modal Top Bar */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(18, 20, 32, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#ff2a85',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <Calendar size={18} color="#fff" />
            </div>
            <div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Book Event / Session Shoot
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginLeft: '8px' }}>
                Step {step} of 4
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '6px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Step Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px clamp(12px, 3vw, 28px)',
          background: 'rgba(10, 11, 18, 0.7)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {stepsHeader.map((st) => {
            const isActive = step === st.num;
            const isCompleted = step > st.num;
            return (
              <div key={st.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isActive ? '#ff2a85' : isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? '0 0 12px rgba(255, 42, 133, 0.6)' : 'none',
                  flexShrink: 0
                }}>
                  {isCompleted ? <Check size={14} /> : st.num}
                </span>
                <span className="modal-step-label" style={{
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : 'var(--text-dim)'
                }}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'clamp(16px, 3vw, 28px)', overflowY: 'auto', flexGrow: 1 }}>
          {/* STEP 1: Personal & Event Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                1. Client & Event Schedule Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label>Event Type *</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Drone Shoot">Drone Shoot</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Housewarming">Housewarming (Grihapravesham)</option>
                    <option value="Fashion">Fashion & Portrait</option>
                  </select>
                </div>

                <div>
                  <label>Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Shoot Venue / City</label>
                  <input
                    type="text"
                    placeholder="e.g. MRC Nagar, Chennai"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label>Special Instructions / Notes</label>
                <textarea
                  rows="3"
                  placeholder="Tell us about timing, number of functions, special moments to capture..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Service Packages & Accurate Price Calculation */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                  2. Select Shoot Packages & Services
                </h3>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Select 1 or more services</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {availableServices.map((srv) => {
                  const isChecked = formData.selectedServices.some(s => s.id === srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '14px',
                        background: isChecked ? 'rgba(255, 42, 133, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isChecked ? '1px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          background: isChecked ? '#ff2a85' : 'transparent',
                          border: isChecked ? 'none' : '2px solid rgba(255, 255, 255, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isChecked && <Check size={14} color="#fff" />}
                        </div>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{srv.name}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{srv.desc}</div>
                        </div>
                      </div>

                      <div style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: isChecked ? '#ff4d9d' : 'var(--text-muted)'
                      }}>
                        ₹{Number(srv.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Exact Accurate Calculation Summary Box */}
              <div style={{
                padding: '18px 22px',
                borderRadius: '16px',
                background: 'rgba(12, 13, 24, 0.95)',
                border: '1px solid rgba(255, 42, 133, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Price Calculation Breakdown
                </div>

                {formData.selectedServices.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{s.name}</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>₹{Number(s.price).toLocaleString('en-IN')}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#10b981' }}>
                  <span>Taxes & Equipment Crew Fee</span>
                  <span>Included</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '12px',
                  marginTop: '4px'
                }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>Total Session Amount</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 900, color: '#ff2a85' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPI Payment (Directly using Admin's custom UPI ID) */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                background: 'rgba(255, 42, 133, 0.08)',
                border: '1px solid rgba(255, 42, 133, 0.25)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Total Shoot Amount
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 900, color: '#ff2a85' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <div>{formData.eventType} Shoot</div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{formData.eventDate}</div>
                </div>
              </div>

              {/* Payment App Selector: GPay / PhonePe / Paytm */}
              <div>
                <label>Choose Your UPI App</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['GPay', 'PhonePe', 'Paytm'].map((app) => (
                    <button
                      key={app}
                      onClick={() => setPaymentApp(app)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: paymentApp === app ? 'rgba(255, 42, 133, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: paymentApp === app ? '1px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: paymentApp === app ? '#fff' : 'var(--text-muted)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scan & Pay UPI QR Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
                alignItems: 'center',
                background: 'rgba(12, 13, 24, 0.9)',
                padding: '24px',
                borderRadius: '18px',
                border: '1px solid rgba(255, 42, 133, 0.3)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: '#fff',
                    padding: '14px',
                    borderRadius: '16px',
                    boxShadow: '0 0 25px rgba(255, 42, 133, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '200px',
                    height: '200px'
                  }}>
                    <img
                      src={qrCodeApiUrl}
                      alt="AV Studio Dynamic UPI QR"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>OFFICIAL STUDIO UPI ID</span>
                    <code style={{
                      color: '#ff4d9d',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      background: 'rgba(255, 42, 133, 0.1)',
                      padding: '3px 10px',
                      borderRadius: '6px'
                    }}>
                      {upiId}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                    Payment Instructions
                  </h4>
                  <ol style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '20px', marginBottom: '20px' }}>
                    <li>Open <strong>{paymentApp}</strong> or any UPI app.</li>
                    <li>Scan the QR code or pay to UPI ID <strong>{upiId}</strong>.</li>
                    <li>Pay exact amount: <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>.</li>
                    <li>Enter the 12-digit UPI Transaction ID / UTR below to confirm.</li>
                  </ol>

                  <div>
                    <label>Transaction ID / UTR Reference *</label>
                    <input
                      type="text"
                      placeholder="e.g. 984019284712"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      style={{ letterSpacing: '0.05em' }}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && bookingResult && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
              }}>
                <CheckCircle size={40} color="#10b981" />
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Event Shoot Booked Successfully!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 24px' }}>
                Thank you, <strong>{bookingResult.clientName}</strong>! Your shoot for <strong>{bookingResult.eventDate}</strong> is reserved.
              </p>

              <div className="glass-panel" style={{
                maxWidth: '520px',
                margin: '0 auto 24px',
                padding: '24px',
                textAlign: 'left',
                border: '1px solid rgba(255, 42, 133, 0.3)',
                background: 'rgba(14, 16, 28, 0.9)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Booking Reference</span>
                  <span style={{ fontWeight: 800, color: '#ff2a85', fontSize: '1.05rem', fontFamily: "'Outfit', monospace" }}>
                    {bookingResult.bookingId}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Event Type</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{bookingResult.eventType}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Event Date</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{bookingResult.eventDate}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Status</span>
                  <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.78rem' }}>
                    Payment Verification Pending
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', marginTop: '12px' }}>
                  <span style={{ color: '#fff', fontWeight: 700 }}>Total Amount</span>
                  <span style={{ color: '#ff4d9d', fontWeight: 800, fontSize: '1.25rem' }}>
                    ₹{bookingResult.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${(settings.whatsapp || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${settings.studioName || 'AV STUDIO'}, I have completed payment for booking ${bookingResult.bookingId} (${bookingResult.eventType} on ${bookingResult.eventDate}). My UTR is ${bookingResult.transactionId}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ background: '#25D366', boxShadow: '0 0 20px rgba(37, 211, 102, 0.4)' }}
                >
                  <MessageCircle size={18} />
                  Confirm on WhatsApp
                </a>

                <button onClick={() => window.print()} className="btn-outline">
                  <Printer size={18} />
                  Print Receipt
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {step < 4 && (
          <div style={{
            padding: '18px 28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(12, 13, 22, 0.95)'
          }}>
            {step > 1 ? (
              <button onClick={handleBack} className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} />
                Back
              </button>
            ) : <div />}

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                Total: <strong style={{ color: '#fff' }}>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </span>

              {step < 3 ? (
                <button onClick={handleNext} className="btn-primary" style={{ padding: '10px 22px' }}>
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitBooking}
                  disabled={submitting}
                  className="btn-primary"
                  style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' }}
                >
                  {submitting ? 'Verifying...' : 'I Have Paid, Verify Payment'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
