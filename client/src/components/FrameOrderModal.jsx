import React, { useState, useEffect } from 'react';
import { X, Check, CheckCircle, ArrowRight, ArrowLeft, Upload, Image as ImageIcon, MapPin, Printer, MessageCircle, Truck, PackageCheck, Box } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSite } from '../context/SiteContext';

export const FrameOrderModal = ({ isOpen, onClose, frame: propFrame, initialFrame }) => {
  const { settings } = useSite();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [paymentApp, setPaymentApp] = useState('GPay');
  const [orderResult, setOrderResult] = useState(null);

  const fallbackFrame = {
    title: 'Custom Photo Frame',
    price: 1499,
    dimensions: '12x18 inches',
    material: 'Natural Wood',
    style: 'Modern Minimalist',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
  };

  const frame = propFrame || initialFrame || fallbackFrame;

  const [quantity, setQuantity] = useState(1);
  const [customerPhoto, setCustomerPhoto] = useState('');
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040'
  });
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setQuantity(1);
      setCustomerPhoto('');
      setTransactionId('');
      setOrderResult(null);
    }
  }, [isOpen, propFrame, initialFrame]);

  if (!isOpen) return null;

  // Handle Photo File Upload from Customer's System/Gallery
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomerPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const frameUnitPrice = Number(frame.price) || 1499;
  const deliveryCharge = 0; // Free delivery
  const totalAmount = (frameUnitPrice * quantity) + deliveryCharge;

  const handleNext = () => {
    if (step === 2) {
      if (!shippingData.fullName || !shippingData.phone || !shippingData.streetAddress) {
        alert('Please fill in recipient Name, Phone, and Street Address for courier delivery.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitFrameOrder = async () => {
    if (!transactionId) {
      alert('Please enter your UPI Transaction ID or UTR reference number.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        clientName: shippingData.fullName,
        email: shippingData.email,
        phone: shippingData.phone,
        frameId: frame._id || frame.id,
        frameTitle: frame.title,
        framePrice: frameUnitPrice,
        dimensions: frame.dimensions || '12x18 inches',
        quantity,
        customerPhoto,
        shippingAddress: shippingData,
        deliveryCharge,
        totalAmount,
        paymentMethod: paymentApp,
        transactionId
      };

      const res = await fetch('/api/frame-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setOrderResult(data.data);
        setStep(4);
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        alert(data.message || 'Error processing frame order');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to frame order service.');
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic UPI Details directly from Admin Settings
  const upiId = settings.upiId || 'avstudio.shoot@oksbi';
  const upiQrString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(settings.studioName || 'AV STUDIO')}&am=${totalAmount}&cu=INR&tn=FrameOrder-${encodeURIComponent(frame.title)}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiQrString)}&color=0-0-0&bgcolor=255-255-255`;

  const stepsHeader = [
    { num: 1, label: 'Customize Frame' },
    { num: 2, label: 'Delivery Address' },
    { num: 3, label: 'UPI Payment' },
    { num: 4, label: 'Order Receipt' }
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
        {/* Header */}
        <div style={{
          padding: '16px clamp(14px, 3vw, 28px)',
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
              <Box size={18} color="#fff" />
            </div>
            <div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)', fontWeight: 800, color: '#fff' }}>
                Order Custom Photo Frame
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
          {/* STEP 1: Frame Customization & Photo Upload */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
                background: 'rgba(15, 17, 28, 0.8)',
                padding: '20px',
                borderRadius: '18px',
                border: '1px solid rgba(255, 42, 133, 0.25)',
                alignItems: 'center'
              }}>
                <div style={{
                  height: '180px',
                  background: '#090a12',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  padding: '12px'
                }}>
                  <img
                    src={customerPhoto || frame.image}
                    alt={frame.title}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }}
                  />
                  {customerPhoto && (
                    <span style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: '#10b981',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      Your Photo Fitted
                    </span>
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#ff2a85', fontWeight: 700, textTransform: 'uppercase' }}>
                    {frame.badge || 'Museum Grade'}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                    {frame.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
                    {frame.dimensions || '12x18 inches'} • {frame.material || 'Premium Wood & Museum Glass'}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 900, color: '#ff4d9d' }}>
                    ₹{frameUnitPrice.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>per unit</span>
                  </div>
                </div>
              </div>

              {/* Upload Your Photo Box (System Gallery File Picker) */}
              <div style={{
                border: '2px dashed rgba(255, 42, 133, 0.4)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                background: 'rgba(255, 42, 133, 0.04)'
              }}>
                <Upload size={32} color="#ff2a85" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  Upload Your Photo from Device Gallery
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Select high-resolution wedding, family, or portrait photo from your computer to be printed in this frame.
                </p>

                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 42, 133, 0.2)',
                  border: '1px solid #ff2a85',
                  color: '#fff',
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}>
                  <ImageIcon size={16} />
                  Choose Photo from Computer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                {customerPhoto && (
                  <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                    ✓ Custom photo loaded successfully for printing!
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'rgba(12, 13, 24, 0.9)',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>Number of Frames</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Order multiple copies for gifts</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ fontFamily: "'Outfit', monospace", fontSize: '1.2rem', fontWeight: 800, color: '#fff', minWidth: '24px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping & Delivery Address */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={22} color="#ff2a85" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                  Delivery & Shipping Address
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label>Recipient Name *</label>
                  <input
                    type="text"
                    placeholder="Enter recipient full name"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="For courier tracking link"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label>Street Address, House/Flat No., Area *</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Flat 3B, Sunshine Apartments, 2nd Cross, Anna Nagar"
                  value={shippingData.streetAddress}
                  onChange={(e) => setShippingData({ ...shippingData, streetAddress: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                <div>
                  <label>City *</label>
                  <input
                    type="text"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>State *</label>
                  <input
                    type="text"
                    value={shippingData.state}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Pincode *</label>
                  <input
                    type="text"
                    value={shippingData.pincode}
                    onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Order Cost Breakdown Box */}
              <div style={{
                padding: '16px 20px',
                borderRadius: '14px',
                background: 'rgba(12, 13, 24, 0.9)',
                border: '1px solid rgba(255, 42, 133, 0.25)',
                marginTop: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{frame.title} (x{quantity})</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₹{(frameUnitPrice * quantity).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Secure Courier Packaging & Shipping</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', marginTop: '6px' }}>
                  <span style={{ color: '#fff', fontWeight: 700 }}>Total Frame Order Amount</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 900, color: '#ff2a85' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPI Payment (Dynamic from Admin Settings) */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Total Frame Order Amount
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 900, color: '#ff2a85' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <div>{frame.title} ({quantity} qty)</div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{shippingData.city} Delivery</div>
                </div>
              </div>

              {/* Payment App Selector */}
              <div>
                <label>Choose UPI App</label>
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
                      alt="AV Studio Frame Order QR"
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
                    Scan & Pay Instructions
                  </h4>
                  <ol style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '20px', marginBottom: '20px' }}>
                    <li>Scan the QR code with <strong>{paymentApp}</strong> or any UPI app.</li>
                    <li>Pay exact total: <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>.</li>
                    <li>Copy and paste your 12-digit UPI UTR / Transaction ID below.</li>
                  </ol>

                  <div>
                    <label>Transaction ID / UTR Reference *</label>
                    <input
                      type="text"
                      placeholder="e.g. 984019284712"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      style={{ letterSpacing: '0.05em' }}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && orderResult && (
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
                <PackageCheck size={40} color="#10b981" />
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Frame Order Placed Successfully!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 24px' }}>
                Thank you, <strong>{orderResult.clientName}</strong>! We will print, frame, and dispatch your order to <strong>{orderResult.shippingAddress?.city}</strong>.
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
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Order Reference ID</span>
                  <span style={{ fontWeight: 800, color: '#ff2a85', fontSize: '1.05rem', fontFamily: "'Outfit', monospace" }}>
                    {orderResult.orderId}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Frame Item</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{orderResult.frameTitle} (x{orderResult.quantity})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Deliver To</span>
                  <span style={{ color: '#fff' }}>{orderResult.shippingAddress?.streetAddress}, {orderResult.shippingAddress?.city} - {orderResult.shippingAddress?.pincode}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Order Status</span>
                  <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.78rem' }}>
                    Payment Verification Pending
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', marginTop: '12px' }}>
                  <span style={{ color: '#fff', fontWeight: 700 }}>Total Paid</span>
                  <span style={{ color: '#ff4d9d', fontWeight: 800, fontSize: '1.25rem' }}>
                    ₹{orderResult.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${(settings.whatsapp || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${settings.studioName || 'AV STUDIO'}, I have placed a Frame Order: ${orderResult.orderId} (${orderResult.frameTitle} x${orderResult.quantity}). My UTR is ${orderResult.transactionId}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ background: '#25D366', boxShadow: '0 0 20px rgba(37, 211, 102, 0.4)' }}
                >
                  <MessageCircle size={18} />
                  Confirm Frame Order on WhatsApp
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
                  onClick={handleSubmitFrameOrder}
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
