# AV STUDIO - Photography & Cinematic Videography Website (MERN Stack)

A luxury, high-end photography & cinematic videography studio web application designed specifically for **AV STUDIO** in Chennai, faithfully implementing all 10 screens and workflows from the reference design.

---

## 🌟 Key Features

### Public Experience
1. **Hero Section & Live Studio Ticker**:
   - Dynamic aperture & neon magenta ring lens visual.
   - Tagline: *"CAPTURING MOMENTS / CREATING MEMORIES"*.
   - Live status badge: `● OPEN NOW | Closes at 09:00 PM` with ticking countdown clock (`HRS : MINS : SECS`).
   - 4 Feature cards: 4K/8K Quality, Creative Team, Fast Delivery, Best Prices.

2. **About AV Studio & Gear Showcase**:
   - Story & founder card for **Arjun Prakash** (Founder & Creative Director) with glowing neon border.
   - Equipment highlight grid: *Sony A7 IV, Canon R5 8K, DJI Mavic 3 Pro Cine Drone, Ronin RS 3 Pro, Studio RGB Lighting*.

3. **Events & Portfolio**:
   - Category filter pills: *All, Weddings, Pre-Wedding, Birthdays, Corporate, Baby Shower, Drone Shoots*.
   - High-resolution interactive grid with hover details and full-screen lightbox preview.

4. **Frame Catalog**:
   - Real product catalog: *Classic Teak Wood (₹1,499), Canvas Wrap (₹1,999), Acrylic Floating (₹2,499), Matte Black Minimalist (₹1,799), Golden Vintage (₹2,199)*.
   - 4 Quality badges: Premium Quality, Custom Sizes, Secure Packaging, 100% Satisfaction.
   - Direct "Choose Frame" integration into booking modal.

5. **Date Availability Calendar**:
   - Interactive monthly calendar with color-coded day indicators (*Green: Available, Yellow: Partial, Red: Fully Booked*).
   - Date inspector showing slot breakdown and direct "Book This Date" action.

6. **5-Step Booking Wizard**:
   - **Step 1**: Personal & Event Details (Name, Phone, Email, Event Type, Date, Venue, Notes).
   - **Step 2**: Services & Packages with live subtotal calculation.
   - **Step 3**: Optional Frame Selection from catalog.
   - **Step 4**: Payment via dynamic **UPI QR Code** (GPay, PhonePe, Paytm) with `avstudio.shoot@oksbi` and UTR transaction ID input.
   - **Step 5**: Instant Booking Receipt with unique Reference ID, Confetti celebration, printable receipt, and direct WhatsApp confirmation.

7. **Contact Us & Chennai Studio Map**:
   - Contact details (+91 98765 43210, info@avstudio.com, Anna Nagar, Chennai).
   - Instant WhatsApp trigger.
   - Inquiry form & dark stylized interactive studio map preview.

---

### Admin Portal & Dashboard
- **Admin Login Modal**: Glowing neon card with demo auto-fill (`admin` / `admin123`).
- **KPI Metrics**: Total Bookings (125), Total Revenue (₹12,45,000), Pending Payments (15), Total Clients (320).
- **Recent Bookings Table**: Client details, event, date, amount, payment method, live status.
- **Manage Bookings**: Filter by *All, Pending, Verified, Cancelled*, search, view full client and UTR details, verify/cancel payments.
- **Manage Availability**: Interactive calendar to pick any date, set status (*Available / Partial / Booked*), enter reason, and update live schedule in MongoDB.

---

## 🚀 Running the Application Locally

### 1. Prerequisites
- **Node.js**: v18+ (v24 tested)
- **MongoDB**: Running on `mongodb://127.0.0.1:27017`

### 2. Start Backend Server
```powershell
cd server
npm start
```
*The server runs on `http://localhost:5000` with automatic MongoDB connection and database seeding.*

### 3. Start Frontend Client
```powershell
cd client
npm run dev
```
*The React + Vite app runs on `http://localhost:5173` with proxy configured to port 5000.*

### 4. Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`
*(Or click the "Demo: admin / admin123" shortcut button on the login modal)*
