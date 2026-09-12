import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Image as ImageIcon,
  CreditCard,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  X,
  Menu,
  Edit3,
  Plus,
  Trash2,
  Save,
  Camera,
  Layers,
  Phone,
  DollarSign,
  Palette,
  ShoppingBag,
  FolderOpen,
  Upload,
  Truck,
  PackageCheck,
  ExternalLink,
  MapPin,
  Mail,
  Share2,
  Send,
  Check,
  Globe,
  Building2,
  MessageSquare,
  ShieldCheck,
  Lock,
  Key,
  User,
  AlertCircle
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '../SocialIcons';
import { useSite } from '../../context/SiteContext';

export const AdminDashboard = ({ admin, onLogout, onCloseDashboard, onUpdateAdmin }) => {
  const { settings, updateSettings, refreshSettings } = useSite();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    totalClients: 0,
    totalFrameOrders: 0,
    frameRevenue: 0
  });

  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Dedicated Frame Orders State
  const [frameOrders, setFrameOrders] = useState([]);
  const [frameOrderFilter, setFrameOrderFilter] = useState('All');
  const [frameSearchQuery, setFrameSearchQuery] = useState('');
  const [selectedFrameOrder, setSelectedFrameOrder] = useState(null);
  const [loadingFrameOrders, setLoadingFrameOrders] = useState(false);

  // Availability Management State
  const [availYear, setAvailYear] = useState(2025);
  const [availMonth, setAvailMonth] = useState(5); // June
  const [adminAvailMap, setAdminAvailMap] = useState({});
  const [selectedAdminDate, setSelectedAdminDate] = useState('2025-06-15');
  const [editStatus, setEditStatus] = useState('booked');
  const [editReason, setEditReason] = useState('Booked for Grand Wedding Shoot');
  const [updatingDate, setUpdatingDate] = useState(false);

  // CMS Form States (Initialized from site settings)
  const [cmsHero, setCmsHero] = useState({ ...settings });
  const [cmsAbout, setCmsAbout] = useState({ ...settings });
  const [cmsContact, setCmsContact] = useState({ ...settings });
  const [cmsServices, setCmsServices] = useState(settings.services || []);
  const [cmsGear, setCmsGear] = useState(settings.gearItems || []);
  const [cmsBranding, setCmsBranding] = useState({ ...settings });
  const [cmsHeadquarters, setCmsHeadquarters] = useState({ ...settings });
  const [cmsSocials, setCmsSocials] = useState({ ...settings });
  const [cmsFooter, setCmsFooter] = useState({ ...settings });
  const [cmsEmailConfig, setCmsEmailConfig] = useState({ ...settings });
  const [cmsPackages, setCmsPackages] = useState(settings.eventPackages || []);

  // Client Inquiries Inbox State
  const [inquiries, setInquiries] = useState([]);
  const [inquiryFilter, setInquiryFilter] = useState('All');
  const [inquirySearchQuery, setInquirySearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  // New Event Package Form State
  const [newPackage, setNewPackage] = useState({
    id: '',
    eventType: 'Wedding',
    title: '',
    subtitle: '',
    badge: 'Popular',
    category: 'Weddings',
    price: '',
    image: '',
    featuresText: '',
    duration: 'Full Day Coverage'
  });

  // Frame and Portfolio items from database
  const [portfolioList, setPortfolioList] = useState([]);
  const [frameList, setFrameList] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [loadingFrames, setLoadingFrames] = useState(false);

  // New Item Modals / Inputs
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: 'Weddings',
    image: '',
    caption: ''
  });

  const [newFrame, setNewFrame] = useState({
    title: '',
    style: '',
    price: '',
    dimensions: '12x18 inches',
    material: 'Natural Wood',
    image: '',
    badge: 'Popular'
  });

  const [newService, setNewService] = useState({
    id: '',
    name: '',
    price: '',
    desc: ''
  });

  const [newGear, setNewGear] = useState({
    name: '',
    desc: ''
  });

  // Admin Profile & Credentials Management State
  const [profileForm, setProfileForm] = useState({
    username: admin?.username || 'admin',
    name: admin?.name || 'Arjun Prakash',
    avatar: admin?.avatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    if (admin) {
      setProfileForm(prev => ({
        ...prev,
        username: admin.username || prev.username,
        name: admin.name || prev.name,
        avatar: admin.avatar || prev.avatar
      }));
    }
  }, [admin]);

  const handleUpdateAdminProfile = async (e) => {
    if (e) e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (profileForm.newPassword) {
      if (!profileForm.currentPassword) {
        setProfileError('Please enter your current password to set a new password');
        return;
      }
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setProfileError('New password and confirm password do not match');
        return;
      }
      if (profileForm.newPassword.length < 4) {
        setProfileError('New password must be at least 4 characters long');
        return;
      }
    }

    setProfileLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: profileForm.username,
          name: profileForm.name,
          avatar: profileForm.avatar,
          currentPassword: profileForm.currentPassword || undefined,
          newPassword: profileForm.newPassword || undefined
        })
      });
      const data = await res.json();
      if (data.success && data.admin) {
        if (data.token) {
          localStorage.setItem('av_studio_token', data.token);
        }
        localStorage.setItem('av_studio_admin', JSON.stringify(data.admin));
        if (onUpdateAdmin) {
          onUpdateAdmin(data.admin);
        }
        setProfileSuccess('✅ Admin username, password, and profile photo updated successfully!');
        showNotification('✅ Admin profile updated successfully!');
        setProfileForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setProfileError(data.message || 'Failed to update admin profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setProfileError('Server error while updating profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const [saveMessage, setSaveMessage] = useState('');
  const token = localStorage.getItem('av_studio_token');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchStats();
    fetchBookings();
    fetchPortfolioAdmin();
    fetchFramesAdmin();
    fetchFrameOrders();
    fetchInquiries();
  }, [bookingFilter, frameOrderFilter]);

  useEffect(() => {
    fetchAdminAvailability();
  }, [availMonth, availYear]);

  useEffect(() => {
    if (settings) {
      setCmsHero({ ...settings });
      setCmsAbout({ ...settings });
      setCmsContact({ ...settings });
      setCmsServices(settings.services || []);
      setCmsGear(settings.gearItems || []);
      setCmsBranding({ ...settings });
      setCmsHeadquarters({ ...settings });
      setCmsSocials({ ...settings });
      setCmsFooter({ ...settings });
      setCmsEmailConfig({ ...settings });
      setCmsPackages(settings.eventPackages || []);
    }
  }, [settings]);

  const showNotification = (msg) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 4000);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/bookings/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      let url = '/api/bookings';
      const params = new URLSearchParams();
      if (bookingFilter !== 'All') params.append('status', bookingFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const fetchPortfolioAdmin = async () => {
    try {
      setLoadingPortfolio(true);
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (data.success) setPortfolioList(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const fetchFramesAdmin = async () => {
    try {
      setLoadingFrames(true);
      const res = await fetch('/api/frames');
      const data = await res.json();
      if (data.success) setFrameList(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFrames(false);
    }
  };

  const fetchFrameOrders = async () => {
    try {
      setLoadingFrameOrders(true);
      let url = '/api/frame-orders';
      const params = new URLSearchParams();
      if (frameOrderFilter !== 'All') params.append('status', frameOrderFilter);
      if (frameSearchQuery) params.append('search', frameSearchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFrameOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to load frame orders:', err);
    } finally {
      setLoadingFrameOrders(false);
    }
  };

  const handleUpdateFrameOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/frame-orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchFrameOrders();
        if (selectedFrameOrder && selectedFrameOrder._id === orderId) {
          setSelectedFrameOrder({ ...selectedFrameOrder, status: newStatus });
        }
        showNotification(`Frame order status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update frame order status:', err);
    }
  };

  const handleLocalImageSelect = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('Selected image exceeds 20MB limit. Please choose a smaller photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result);
      showNotification('📷 Photo chosen from computer / gallery!');
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
        fetchStats();
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
        showNotification(`Booking status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking record? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
        fetchStats();
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking(null);
        }
        showNotification('🗑️ Booking record deleted successfully');
      } else {
        alert(data.message || 'Failed to delete booking');
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
      alert('Error deleting booking.');
    }
  };

  const handleDeleteFrameOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this frame order? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`/api/frame-orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchFrameOrders();
        fetchStats();
        if (selectedFrameOrder && selectedFrameOrder._id === orderId) {
          setSelectedFrameOrder(null);
        }
        showNotification('🗑️ Frame order deleted successfully');
      } else {
        alert(data.message || 'Failed to delete frame order');
      }
    } catch (err) {
      console.error('Failed to delete frame order:', err);
      alert('Error deleting frame order.');
    }
  };

  const fetchAdminAvailability = async () => {
    try {
      const res = await fetch(`/api/availability?month=${availMonth + 1}&year=${availYear}`);
      const data = await res.json();
      if (data.success && data.lookup) {
        setAdminAvailMap(data.lookup);
      }
    } catch (err) {
      console.error('Failed to load availability for admin:', err);
    }
  };

  const handleSaveDateStatus = async (overrideStatus) => {
    try {
      setUpdatingDate(true);
      const targetStatus = overrideStatus || editStatus;
      const res = await fetch('/api/availability/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedAdminDate,
          status: targetStatus,
          reason: editReason
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminAvailability();
        showNotification(`Date ${selectedAdminDate} updated to ${targetStatus}!`);
      }
    } catch (err) {
      alert('Error updating date status');
    } finally {
      setUpdatingDate(false);
    }
  };

  // CMS: Save General & Hero Settings
  const handleSaveHeroSettings = async (e) => {
    e.preventDefault();
    const res = await updateSettings({
      studioName: cmsHero.studioName,
      heroEyebrow: cmsHero.heroEyebrow,
      heroTitle: cmsHero.heroTitle,
      heroSubtitle: cmsHero.heroSubtitle,
      heroLensImage: cmsHero.heroLensImage,
      studioStatus: cmsHero.studioStatus,
      closingTime: cmsHero.closingTime
    });
    if (res.success) {
      showNotification('✅ Hero & Studio Information updated live on website!');
    }
  };

  // CMS: Save About Us & Founder Settings
  const handleSaveAboutSettings = async (e) => {
    e.preventDefault();
    const res = await updateSettings({
      aboutTitle: cmsAbout.aboutTitle,
      aboutStory: cmsAbout.aboutStory,
      founderName: cmsAbout.founderName,
      founderRole: cmsAbout.founderRole,
      founderTagline: cmsAbout.founderTagline,
      founderQuote: cmsAbout.founderQuote,
      founderImage: cmsAbout.founderImage
    });
    if (res.success) {
      showNotification('✅ About Us & Founder Profile updated live on website!');
    }
  };

  // CMS: Save Contact, Map & UPI Settings
  const handleSaveContactSettings = async (e) => {
    e.preventDefault();
    const res = await updateSettings({
      phone: cmsContact.phone,
      whatsapp: cmsContact.whatsapp,
      email: cmsContact.email,
      address: cmsContact.address,
      timings: cmsContact.timings,
      upiId: cmsContact.upiId,
      mapEmbedUrl: cmsContact.mapEmbedUrl || '',
      mapLocationName: cmsContact.mapLocationName || ''
    });
    if (res.success) {
      showNotification('✅ Studio Contact, Google Map & UPI details updated live!');
    }
  };

  // Inquiries Operations
  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const res = await fetch('/api/contact', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
        showNotification(`Inquiry marked as ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(null);
        }
        showNotification('Inquiry message deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTestEmail = async (e) => {
    e?.preventDefault();
    try {
      setTestEmailLoading(true);
      setTestEmailResult(null);
      const target = testEmailRecipient || cmsEmailConfig.notificationEmail || settings.email;
      const res = await fetch('/api/contact/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ testRecipient: target })
      });
      const data = await res.json();
      setTestEmailResult({ success: data.success, message: data.message });
      if (data.success) {
        showNotification('✅ Test email delivered successfully!');
      }
    } catch (err) {
      setTestEmailResult({ success: false, message: err.message });
    } finally {
      setTestEmailLoading(false);
    }
  };

  // CMS: Branding & Logo
  const handleSaveBranding = async (e) => {
    e?.preventDefault();
    const res = await updateSettings({
      studioName: cmsBranding.studioName,
      studioTagline: cmsBranding.studioTagline,
      logoUrl: cmsBranding.logoUrl,
      logoType: cmsBranding.logoType
    });
    if (res.success) {
      showNotification('✅ Brand Logo & Studio Identity updated live!');
    }
  };

  const handleLogoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please select a smaller logo image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCmsBranding(prev => ({ ...prev, logoUrl: reader.result }));
        showNotification('Logo image loaded! Click "Save Brand & Logo Settings" to publish.');
      };
      reader.readAsDataURL(file);
    }
  };

  // CMS: Studio Headquarters
  const handleSaveHeadquarters = async (e) => {
    e?.preventDefault();
    const res = await updateSettings({
      hqTitle: cmsHeadquarters.hqTitle,
      address: cmsHeadquarters.address,
      hqLandmark: cmsHeadquarters.hqLandmark,
      hqPhone: cmsHeadquarters.hqPhone,
      hqEmail: cmsHeadquarters.hqEmail,
      timings: cmsHeadquarters.timings,
      phone: cmsHeadquarters.phone || cmsHeadquarters.hqPhone,
      email: cmsHeadquarters.email || cmsHeadquarters.hqEmail,
      mapEmbedUrl: cmsHeadquarters.mapEmbedUrl,
      mapLocationName: cmsHeadquarters.mapLocationName
    });
    if (res.success) {
      showNotification('✅ Studio Headquarters & Map updated live!');
    }
  };

  // CMS: Social Profiles
  const handleSaveSocials = async (e) => {
    e?.preventDefault();
    const res = await updateSettings({
      instagramUrl: cmsSocials.instagramUrl,
      facebookUrl: cmsSocials.facebookUrl,
      youtubeUrl: cmsSocials.youtubeUrl,
      twitterUrl: cmsSocials.twitterUrl,
      whatsapp: cmsSocials.whatsapp
    });
    if (res.success) {
      showNotification('✅ Social media profiles updated live on public site!');
    }
  };

  // CMS: Footer Content
  const handleSaveFooter = async (e) => {
    e?.preventDefault();
    const res = await updateSettings({
      footerAbout: cmsFooter.footerAbout,
      footerCopyright: cmsFooter.footerCopyright,
      footerServices: Array.isArray(cmsFooter.footerServices)
        ? cmsFooter.footerServices
        : (cmsFooter.footerServices || '').split(',').map(s => s.trim()).filter(Boolean),
      footerQuickLinks: Array.isArray(cmsFooter.footerQuickLinks)
        ? cmsFooter.footerQuickLinks
        : (cmsFooter.footerQuickLinks || '').split(',').map(s => s.trim()).filter(Boolean)
    });
    if (res.success) {
      showNotification('✅ Complete Footer content updated live!');
    }
  };

  // CMS: Email & SMTP Configuration
  const handleSaveEmailConfig = async (e) => {
    e?.preventDefault();
    const res = await updateSettings({
      notificationEmail: cmsEmailConfig.notificationEmail,
      smtpHost: cmsEmailConfig.smtpHost,
      smtpPort: Number(cmsEmailConfig.smtpPort) || 587,
      smtpUser: cmsEmailConfig.smtpUser,
      smtpPass: cmsEmailConfig.smtpPass,
      smtpSecure: Boolean(cmsEmailConfig.smtpSecure)
    });
    if (res.success) {
      showNotification('✅ Email notification and SMTP settings saved!');
    }
  };

  // CMS: Add / Delete Event Package
  const handleAddPackage = async (e) => {
    e?.preventDefault();
    if (!newPackage.title || !newPackage.price) {
      alert('Please enter Package Title and Price');
      return;
    }
    const pkgObj = {
      id: newPackage.id || (newPackage.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()),
      eventType: newPackage.eventType,
      title: newPackage.title,
      subtitle: newPackage.subtitle,
      badge: newPackage.badge || 'Popular',
      category: newPackage.category || newPackage.eventType,
      price: Number(newPackage.price),
      image: newPackage.image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      features: newPackage.featuresText
        ? newPackage.featuresText.split('\n').map(f => f.trim()).filter(Boolean)
        : ['Full day photography coverage', 'Cinematic video highlight film'],
      duration: newPackage.duration || 'Full Day Coverage'
    };

    const updatedPackages = [...cmsPackages, pkgObj];
    const res = await updateSettings({ eventPackages: updatedPackages });
    if (res.success) {
      setCmsPackages(updatedPackages);
      setNewPackage({
        id: '',
        eventType: 'Wedding',
        title: '',
        subtitle: '',
        badge: 'Popular',
        category: 'Weddings',
        price: '',
        image: '',
        featuresText: '',
        duration: 'Full Day Coverage'
      });
      showNotification('✅ New Event Package added to live website!');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete this event package from the website?')) return;
    const updatedPackages = cmsPackages.filter(p => p.id !== id);
    const res = await updateSettings({ eventPackages: updatedPackages });
    if (res.success) {
      setCmsPackages(updatedPackages);
      showNotification('Event package removed');
    }
  };

  const handleUpdatePackageImage = async (id, base64Image) => {
    const updatedPackages = cmsPackages.map(p => {
      if (p.id === id) {
        return { ...p, image: base64Image };
      }
      return p;
    });
    const res = await updateSettings({ eventPackages: updatedPackages });
    if (res.success) {
      setCmsPackages(updatedPackages);
      showNotification('📷 Event package photo updated from device!');
    }
  };

  // CMS: Add / Delete Gear Item
  const handleAddGear = async () => {
    if (!newGear.name || !newGear.desc) {
      alert('Please enter Gear name and description');
      return;
    }
    const updatedGear = [...cmsGear, { ...newGear }];
    const res = await updateSettings({ gearItems: updatedGear });
    if (res.success) {
      setCmsGear(updatedGear);
      setNewGear({ name: '', desc: '' });
      showNotification('✅ New Camera Gear added!');
    }
  };

  const handleDeleteGear = async (index) => {
    const updatedGear = cmsGear.filter((_, i) => i !== index);
    const res = await updateSettings({ gearItems: updatedGear });
    if (res.success) {
      setCmsGear(updatedGear);
      showNotification('Gear item removed');
    }
  };

  // CMS: Add / Delete Service Package
  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      alert('Please enter Service Name and Price');
      return;
    }
    const serviceObj = {
      id: newService.name.toLowerCase().replace(/\s+/g, '-').slice(0, 10) + '-' + Date.now(),
      name: newService.name,
      price: Number(newService.price),
      desc: newService.desc || 'Full professional studio coverage'
    };
    const updatedServices = [...cmsServices, serviceObj];
    const res = await updateSettings({ services: updatedServices });
    if (res.success) {
      setCmsServices(updatedServices);
      setNewService({ id: '', name: '', price: '', desc: '' });
      showNotification('✅ New Service Package added to Booking Wizard!');
    }
  };

  const handleDeleteService = async (id) => {
    const updatedServices = cmsServices.filter(s => s.id !== id);
    const res = await updateSettings({ services: updatedServices });
    if (res.success) {
      setCmsServices(updatedServices);
      showNotification('Service package removed');
    }
  };

  // CMS: Add / Delete Portfolio Items
  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.image) {
      alert('Please provide Title and Image URL');
      return;
    }
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newPortfolio)
      });
      const data = await res.json();
      if (data.success) {
        fetchPortfolioAdmin();
        setNewPortfolio({ title: '', category: 'Weddings', image: '', caption: '' });
        showNotification('✅ New Portfolio Photo added to live gallery!');
      }
    } catch (err) {
      alert('Error adding portfolio item');
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!window.confirm('Delete this photo from the public gallery?')) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchPortfolioAdmin();
        showNotification('Portfolio photo removed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CMS: Add / Delete Frame Catalog Items
  const handleAddFrame = async (e) => {
    e.preventDefault();
    if (!newFrame.title || !newFrame.price || !newFrame.image) {
      alert('Please enter Frame Title, Price and Image URL');
      return;
    }
    try {
      const res = await fetch('/api/frames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newFrame,
          price: Number(newFrame.price)
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchFramesAdmin();
        setNewFrame({ title: '', style: '', price: '', dimensions: '12x18 inches', material: 'Natural Wood', image: '', badge: 'Popular' });
        showNotification('✅ New Frame added to live catalog!');
      }
    } catch (err) {
      alert('Error adding frame');
    }
  };

  const handleDeleteFrame = async (id) => {
    if (!window.confirm('Delete this frame from the catalog?')) return;
    try {
      const res = await fetch(`/api/frames/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchFramesAdmin();
        showNotification('Frame removed from catalog');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const firstDay = new Date(availYear, availMonth, 1).getDay();
  const daysInMonth = new Date(availYear, availMonth + 1, 0).getDate();

  const handleAdminDatePick = (day) => {
    const formatted = `${availYear}-${String(availMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedAdminDate(formatted);
    const existing = adminAvailMap[formatted];
    if (existing) {
      setEditStatus(existing.status);
      setEditReason(existing.reason || '');
    } else {
      setEditStatus('available');
      setEditReason('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07080d',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toast Notification */}
      {saveMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: '#fff',
          padding: '12px 22px',
          borderRadius: '12px',
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 9999,
          animation: 'pulseNeon 1s'
        }}>
          {saveMessage}
        </div>
      )}

      {/* Top Header */}
      <header style={{
        padding: '14px clamp(12px, 3vw, 28px)',
        background: 'rgba(12, 13, 22, 0.95)',
        borderBottom: '1px solid rgba(255, 42, 133, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="nav-mobile-toggle"
            aria-label="Toggle Admin Sidebar"
            style={{
              background: mobileSidebarOpen ? 'rgba(255, 42, 133, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: mobileSidebarOpen ? '1px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: mobileSidebarOpen ? '#ff2a85' : '#fff',
              padding: '8px',
              cursor: 'pointer'
            }}
          >
            {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontWeight: 800,
            color: '#fff'
          }}>
            {settings.studioName || 'AV STUDIO'} <span style={{ color: '#ff2a85' }}>CMS CONTROL CENTER</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div
            onClick={() => setActiveTab('admin-profile')}
            title="Click to manage Admin Profile & Credentials"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '10px',
              background: activeTab === 'admin-profile' ? 'rgba(255, 42, 133, 0.15)' : 'transparent',
              border: activeTab === 'admin-profile' ? '1px solid rgba(255, 42, 133, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {profileForm.avatar || admin?.avatar ? (
              <img
                src={profileForm.avatar || admin?.avatar}
                alt="Admin Profile"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ff2a85',
                  boxShadow: '0 0 10px rgba(255, 42, 133, 0.4)'
                }}
              />
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff2a85 0%, #8a2be2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: '#fff',
                boxShadow: '0 0 10px rgba(255, 42, 133, 0.3)'
              }}>
                {(admin?.name || profileForm.name || 'AP').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {admin?.name || profileForm.name || 'Admin'}
                <span style={{ fontSize: '0.65rem', background: 'rgba(255, 42, 133, 0.2)', color: '#ff2a85', border: '1px solid rgba(255, 42, 133, 0.4)', borderRadius: '4px', padding: '1px 5px', fontWeight: 800 }}>
                  @{admin?.username || profileForm.username || 'admin'}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Account Settings & Password
              </div>
            </div>
          </div>

          <button onClick={onCloseDashboard} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            View Public Site
          </button>

          <button onClick={onLogout} style={{
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + CMS Views */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        {/* Sidebar */}
        <aside
          onClick={() => setMobileSidebarOpen(false)}
          className={`admin-sidebar ${mobileSidebarOpen ? 'admin-sidebar-open' : ''}`}
          style={{
            width: '260px',
            background: '#0a0b12',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '12px', marginBottom: '6px' }}>
            Main Operations
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'dashboard' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'dashboard' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('admin-profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'admin-profile' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'admin-profile' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <ShieldCheck size={17} />
            Admin Profile & Security
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'bookings' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'bookings' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <CalendarCheck size={17} />
            Manage Bookings
          </button>

          <button
            onClick={() => {
              setActiveTab('frame-orders');
              fetchFrameOrders();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'frame-orders' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'frame-orders' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShoppingBag size={17} />
              Frame Orders
            </div>
            {frameOrders.length > 0 && (
              <span style={{
                background: '#ff2a85',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '9999px'
              }}>
                {frameOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('inquiries');
              fetchInquiries();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'inquiries' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'inquiries' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={17} />
              Inquiries & Email
            </div>
            {inquiries.filter(m => m.status === 'New').length > 0 && (
              <span style={{
                background: '#ff2a85',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '9999px'
              }}>
                {inquiries.filter(m => m.status === 'New').length} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('availability')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'availability' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'availability' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Calendar size={17} />
            Manage Availability
          </button>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '12px', margin: '18px 0 6px' }}>
            Website Editor (CMS)
          </div>

          <button
            onClick={() => setActiveTab('cms-branding')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-branding' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-branding' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <ImageIcon size={17} />
            Logo & Brand Identity
          </button>

          <button
            onClick={() => setActiveTab('cms-hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-hero' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-hero' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Palette size={17} />
            Edit Hero & Title
          </button>

          <button
            onClick={() => setActiveTab('cms-about')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-about' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-about' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Users size={17} />
            Edit About & Founder
          </button>

          <button
            onClick={() => setActiveTab('cms-headquarters')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-headquarters' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-headquarters' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Building2 size={17} />
            Studio Headquarters
          </button>

          <button
            onClick={() => setActiveTab('cms-socials')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-socials' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-socials' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Share2 size={17} />
            Instagram & Facebook
          </button>

          <button
            onClick={() => setActiveTab('cms-footer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-footer' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-footer' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Globe size={17} />
            Footer Customizer
          </button>

          <button
            onClick={() => setActiveTab('cms-packages')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-packages' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-packages' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <ShoppingBag size={17} />
            Event Packages
          </button>

          <button
            onClick={() => setActiveTab('cms-gear')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-gear' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-gear' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Camera size={17} />
            Camera & Gear
          </button>

          <button
            onClick={() => setActiveTab('cms-services')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-services' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-services' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <DollarSign size={17} />
            Add-on Services
          </button>

          <button
            onClick={() => setActiveTab('cms-portfolio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-portfolio' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-portfolio' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <ImageIcon size={17} />
            Portfolio Gallery
          </button>

          <button
            onClick={() => setActiveTab('cms-frames')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-frames' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-frames' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Layers size={17} />
            Frame Catalog
          </button>

          <button
            onClick={() => setActiveTab('cms-contact')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'cms-contact' ? 'rgba(255, 42, 133, 0.18)' : 'transparent',
              color: activeTab === 'cms-contact' ? '#ff2a85' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Phone size={17} />
            Payment UPI Setup
          </button>
        </aside>

        {/* Main Content Area */}
        <main style={{ flexGrow: 1, padding: '32px', overflowY: 'auto' }}>
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div>
              {/* 4 KPI Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '36px'
              }}>
                <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 42, 133, 0.25)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Total Bookings
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.4rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                    {stats.totalBookings || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: stats.totalBookings > 0 ? '#10b981' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} />
                    {stats.totalBookings > 0 ? `${stats.totalBookings} Active Record${stats.totalBookings > 1 ? 's' : ''}` : '0 active bookings'}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 42, 133, 0.25)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Total Revenue
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.4rem', fontWeight: 800, color: '#ff2a85', margin: '4px 0' }}>
                    ₹{(Number(stats?.totalRevenue) || 0).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: stats.totalRevenue > 0 ? '#10b981' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} />
                    {stats.totalRevenue > 0 ? 'Total received & invoiced' : '₹0 collected'}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 42, 133, 0.25)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Pending Payments
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>
                    {stats.pendingPayments || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: stats.pendingPayments > 0 ? '#f59e0b' : '#10b981' }}>
                    {stats.pendingPayments > 0 ? `${stats.pendingPayments} Requires UPI check` : 'All payments clear'}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 42, 133, 0.25)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Total Clients
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.4rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                    {stats.totalClients || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: stats.totalClients > 0 ? '#10b981' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} />
                    {stats.totalClients > 0 ? `${stats.totalClients} Unique client${stats.totalClients > 1 ? 's' : ''}` : '0 client records'}
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255, 42, 133, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                    Recent Bookings
                  </h3>
                  <button onClick={() => setActiveTab('bookings')} className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                    View All
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-dim)' }}>
                        <th style={{ padding: '12px 16px' }}>Client Name</th>
                        <th style={{ padding: '12px 16px' }}>Event Type</th>
                        <th style={{ padding: '12px 16px' }}>Date</th>
                        <th style={{ padding: '12px 16px' }}>Amount</th>
                        <th style={{ padding: '12px 16px' }}>Payment</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff' }}>{b.clientName}</td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{b.eventType}</td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-dim)' }}>{b.eventDate}</td>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: '#fff' }}>₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                              {b.paymentMethod || 'UPI'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: b.status === 'Verified' ? 'rgba(16, 185, 129, 0.15)' : b.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: b.status === 'Verified' ? '#10b981' : b.status === 'Pending' ? '#f59e0b' : '#ef4444'
                            }}>
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <button
                              onClick={() => setSelectedBooking(b)}
                              style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 42, 133, 0.3)',
                                color: '#ff2a85',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                fontWeight: 600
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                  Manage Bookings
                </h2>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {['All', 'Pending', 'Verified', 'Cancelled'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setBookingFilter(f)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        border: bookingFilter === f ? '1px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: bookingFilter === f ? '#ff2a85' : 'rgba(255, 255, 255, 0.04)',
                        color: bookingFilter === f ? '#fff' : 'var(--text-muted)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 42, 133, 0.2)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-dim)' }}>
                        <th style={{ padding: '12px 14px' }}>Client</th>
                        <th style={{ padding: '12px 14px' }}>Event</th>
                        <th style={{ padding: '12px 14px' }}>Date</th>
                        <th style={{ padding: '12px 14px' }}>Amount</th>
                        <th style={{ padding: '12px 14px' }}>Payment</th>
                        <th style={{ padding: '12px 14px' }}>Status</th>
                        <th style={{ padding: '12px 14px' }}>UTR / Txn</th>
                        <th style={{ padding: '12px 14px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{b.clientName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{b.phone}</div>
                          </td>
                          <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{b.eventType}</td>
                          <td style={{ padding: '14px', color: 'var(--text-dim)' }}>{b.eventDate}</td>
                          <td style={{ padding: '14px', fontWeight: 800, color: '#ff4d9d' }}>₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '14px' }}>{b.paymentMethod}</td>
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: b.status === 'Verified' ? 'rgba(16, 185, 129, 0.15)' : b.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: b.status === 'Verified' ? '#10b981' : b.status === 'Pending' ? '#f59e0b' : '#ef4444'
                            }}>
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px', fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {b.transactionId || 'None'}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => setSelectedBooking(b)}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                  color: '#fff',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem'
                                }}
                              >
                                View
                              </button>
                              {b.status !== 'Verified' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b._id, 'Verified')}
                                  style={{
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    border: '1px solid #10b981',
                                    color: '#10b981',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                  }}
                                >
                                  Verify
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteBooking(b._id)}
                                title="Delete booking record"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.35)',
                                  color: '#ef4444',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MANAGE FRAME ORDERS */}
          {activeTab === 'frame-orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    Physical Frame Orders
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                    Verify customer uploaded photos to print, packaging addresses, and UPI payments.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['All', 'Pending', 'Confirmed', 'In Production', 'Dispatched', 'Delivered', 'Cancelled'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrameOrderFilter(f)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        border: frameOrderFilter === f ? '1px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: frameOrderFilter === f ? '#ff2a85' : 'rgba(255, 255, 255, 0.04)',
                        color: frameOrderFilter === f ? '#fff' : 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                  <button
                    onClick={fetchFrameOrders}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      borderRadius: '9999px',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    <RefreshCw size={13} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(255, 42, 133, 0.2)' }}>
                {loadingFrameOrders ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                    Loading frame orders...
                  </div>
                ) : frameOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-dim)' }}>
                    <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: '12px', color: '#ff2a85' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>No Frame Orders Found</div>
                    <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                      Orders placed from the public Frame Catalog will appear here.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-dim)' }}>
                          <th style={{ padding: '12px 14px' }}>Order ID & Date</th>
                          <th style={{ padding: '12px 14px' }}>Customer Details</th>
                          <th style={{ padding: '12px 14px' }}>Frame Item</th>
                          <th style={{ padding: '12px 14px' }}>Photo to Frame</th>
                          <th style={{ padding: '12px 14px' }}>Qty & Total</th>
                          <th style={{ padding: '12px 14px' }}>UPI UTR</th>
                          <th style={{ padding: '12px 14px' }}>Status</th>
                          <th style={{ padding: '12px 14px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {frameOrders.map((o) => {
                          const statusColor =
                            o.status === 'Confirmed' ? '#3b82f6' :
                            o.status === 'In Production' ? '#8b5cf6' :
                            o.status === 'Dispatched' ? '#f59e0b' :
                            o.status === 'Delivered' ? '#10b981' :
                            o.status === 'Cancelled' ? '#ef4444' : '#e2e8f0';

                          return (
                            <tr key={o._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                              <td style={{ padding: '14px' }}>
                                <div style={{ fontWeight: 700, color: '#fff' }}>{o.orderId}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                  {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                              </td>
                              <td style={{ padding: '14px' }}>
                                <div style={{ fontWeight: 700, color: '#fff' }}>{o.clientName || o.customerName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{o.phone}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.shippingAddress?.city}, {o.shippingAddress?.state}</div>
                              </td>
                              <td style={{ padding: '14px' }}>
                                <div style={{ fontWeight: 600, color: '#fff' }}>{o.frameTitle}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{o.dimensions} • {o.material || 'Natural Wood'}</div>
                              </td>
                              <td style={{ padding: '14px' }}>
                                {(o.customerPhoto || o.photoToFrame) ? (
                                  <div
                                    onClick={() => setSelectedFrameOrder(o)}
                                    style={{
                                      cursor: 'pointer',
                                      width: '46px',
                                      height: '46px',
                                      borderRadius: '8px',
                                      overflow: 'hidden',
                                      border: '2px solid #ff2a85',
                                      position: 'relative'
                                    }}
                                    title="Click to view photo"
                                  >
                                    <img src={o.customerPhoto || o.photoToFrame} alt="Frame Upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Not provided</span>
                                )}
                              </td>
                              <td style={{ padding: '14px' }}>
                                <div style={{ fontWeight: 800, color: '#ff4d9d', fontSize: '1rem' }}>
                                  ₹{o.totalAmount?.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Qty: {o.quantity}</div>
                              </td>
                              <td style={{ padding: '14px' }}>
                                <code style={{ fontSize: '0.78rem', background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                                  {o.transactionId || 'Pending'}
                                </code>
                              </td>
                              <td style={{ padding: '14px' }}>
                                <span style={{
                                  padding: '4px 10px',
                                  borderRadius: '9999px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: `${statusColor}20`,
                                  color: statusColor,
                                  border: `1px solid ${statusColor}`
                                }}>
                                  {o.status}
                                </span>
                              </td>
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    onClick={() => setSelectedFrameOrder(o)}
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid rgba(255, 255, 255, 0.15)',
                                      color: '#fff',
                                      borderRadius: '6px',
                                      padding: '4px 8px',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    View
                                  </button>
                                  {o.status === 'Pending' && (
                                    <button
                                      onClick={() => handleUpdateFrameOrderStatus(o._id, 'Confirmed')}
                                      style={{
                                        background: 'rgba(59, 130, 246, 0.2)',
                                        border: '1px solid #3b82f6',
                                        color: '#60a5fa',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 700
                                      }}
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {o.status === 'In Production' && (
                                    <button
                                      onClick={() => handleUpdateFrameOrderStatus(o._id, 'Dispatched')}
                                      style={{
                                        background: 'rgba(245, 158, 11, 0.2)',
                                        border: '1px solid #f59e0b',
                                        color: '#f59e0b',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 700
                                      }}
                                    >
                                      Dispatch
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteFrameOrder(o._id)}
                                    title="Delete frame order"
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.15)',
                                      border: '1px solid rgba(239, 68, 68, 0.35)',
                                      color: '#ef4444',
                                      borderRadius: '6px',
                                      padding: '4px 8px',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    <Trash2 size={12} />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE AVAILABILITY */}
          {activeTab === 'availability' && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '24px' }}>
                Manage Date Availability & Schedule
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '30px'
              }}>
                <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255, 42, 133, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={() => setAvailMonth(prev => prev === 0 ? 11 : prev - 1)} className="btn-outline" style={{ padding: '6px 12px' }}>
                      <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {monthNames[availMonth]} {availYear}
                    </span>
                    <button onClick={() => setAvailMonth(prev => prev === 11 ? 0 : prev + 1)} className="btn-outline" style={{ padding: '6px 12px' }}>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700 }}>{d}</div>
                    ))}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`emp-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const day = idx + 1;
                      const dateStr = `${availYear}-${String(availMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isSelected = selectedAdminDate === dateStr;
                      const st = adminAvailMap[dateStr]?.status || 'available';
                      const color = st === 'booked' ? '#ef4444' : st === 'partial' ? '#f59e0b' : '#10b981';

                      return (
                        <div
                          key={day}
                          onClick={() => handleAdminDatePick(day)}
                          style={{
                            aspectRatio: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(255, 42, 133, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSelected ? '2px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.06)'
                          }}
                        >
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#fff' : '#cbd5e1' }}>{day}</span>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, marginTop: '2px' }} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                    Date Details
                  </h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ff2a85', marginBottom: '18px' }}>
                    {selectedAdminDate}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label>Status</label>
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                        <option value="available">Available (Open for shoots)</option>
                        <option value="partial">Partial (Morning/Evening Booked)</option>
                        <option value="booked">Fully Booked / Blocked</option>
                      </select>
                    </div>

                    <div>
                      <label>Reason (If Blocked or Reserved)</label>
                      <input
                        type="text"
                        placeholder="e.g. Grand Wedding Shoot / Maintenance"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                      <button onClick={() => handleSaveDateStatus()} disabled={updatingDate} className="btn-primary" style={{ flex: 1 }}>
                        {updatingDate ? 'Updating...' : 'Update Date'}
                      </button>
                      <button onClick={() => handleSaveDateStatus('booked')} disabled={updatingDate} style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '9999px', fontWeight: 700, cursor: 'pointer', padding: '10px' }}>
                        Block Date
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CMS HERO & TITLE */}
          {activeTab === 'cms-hero' && (
            <div style={{ maxWidth: '850px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Edit Hero Section & Branding
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Customize the studio name, main headlines, camera lens image, and live opening status.
              </p>

              <form onSubmit={handleSaveHeroSettings} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label>Studio Brand Name</label>
                    <input
                      type="text"
                      value={cmsHero.studioName || ''}
                      onChange={(e) => setCmsHero({ ...cmsHero, studioName: e.target.value })}
                      placeholder="e.g. AV STUDIO"
                    />
                  </div>

                  <div>
                    <label>Eyebrow Tagline Badge</label>
                    <input
                      type="text"
                      value={cmsHero.heroEyebrow || ''}
                      onChange={(e) => setCmsHero({ ...cmsHero, heroEyebrow: e.target.value })}
                      placeholder="e.g. Capturing Moments"
                    />
                  </div>
                </div>

                <div>
                  <label>Main Headline Title</label>
                  <input
                    type="text"
                    value={cmsHero.heroTitle || ''}
                    onChange={(e) => setCmsHero({ ...cmsHero, heroTitle: e.target.value })}
                    placeholder="e.g. Creating Memories"
                  />
                </div>

                <div>
                  <label>Hero Subtitle Description</label>
                  <textarea
                    rows="3"
                    value={cmsHero.heroSubtitle || ''}
                    onChange={(e) => setCmsHero({ ...cmsHero, heroSubtitle: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label>Live Status Badge</label>
                    <input
                      type="text"
                      value={cmsHero.studioStatus || ''}
                      onChange={(e) => setCmsHero({ ...cmsHero, studioStatus: e.target.value })}
                      placeholder="e.g. OPEN NOW"
                    />
                  </div>

                  <div>
                    <label>Closing Hours Text</label>
                    <input
                      type="text"
                      value={cmsHero.closingTime || ''}
                      onChange={(e) => setCmsHero({ ...cmsHero, closingTime: e.target.value })}
                      placeholder="e.g. Closes at 09:00 PM"
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ margin: 0 }}>Camera Lens Graphic / Studio Icon</label>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(255, 42, 133, 0.15)',
                      border: '1px solid #ff2a85',
                      color: '#ff4d9d',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}>
                      <FolderOpen size={14} />
                      Choose from Computer / Gallery
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleLocalImageSelect(e, (base64) => setCmsHero({ ...cmsHero, heroLensImage: base64 }))}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={cmsHero.heroLensImage || ''}
                    onChange={(e) => setCmsHero({ ...cmsHero, heroLensImage: e.target.value })}
                    placeholder="Enter image URL or select from computer above"
                  />
                  {cmsHero.heroLensImage && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={cmsHero.heroLensImage} alt="Lens Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff2a85' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Live Lens Preview (Saved to Studio DB)</span>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '12px' }}>
                  <Save size={18} />
                  Save Hero Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: CMS ABOUT & FOUNDER */}
          {activeTab === 'cms-about' && (
            <div style={{ maxWidth: '850px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Edit About AV Studio & Founder Profile
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Update the studio history story, founder Arjun Prakash details, quote, and portrait photo.
              </p>

              <form onSubmit={handleSaveAboutSettings} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                <div>
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={cmsAbout.aboutTitle || ''}
                    onChange={(e) => setCmsAbout({ ...cmsAbout, aboutTitle: e.target.value })}
                  />
                </div>

                <div>
                  <label>About Us Story Paragraph</label>
                  <textarea
                    rows="4"
                    value={cmsAbout.aboutStory || ''}
                    onChange={(e) => setCmsAbout({ ...cmsAbout, aboutStory: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label>Founder Name</label>
                    <input
                      type="text"
                      value={cmsAbout.founderName || ''}
                      onChange={(e) => setCmsAbout({ ...cmsAbout, founderName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label>Founder Role / Title</label>
                    <input
                      type="text"
                      value={cmsAbout.founderRole || ''}
                      onChange={(e) => setCmsAbout({ ...cmsAbout, founderRole: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label>Founder Tagline Badge</label>
                  <input
                    type="text"
                    value={cmsAbout.founderTagline || ''}
                    onChange={(e) => setCmsAbout({ ...cmsAbout, founderTagline: e.target.value })}
                  />
                </div>

                <div>
                  <label>Founder Quote</label>
                  <textarea
                    rows="3"
                    value={cmsAbout.founderQuote || ''}
                    onChange={(e) => setCmsAbout({ ...cmsAbout, founderQuote: e.target.value })}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ margin: 0, fontWeight: 700 }}>Founder & CEO Portrait Photo</label>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255, 42, 133, 0.2)',
                      border: '1px solid #ff2a85',
                      color: '#ff4d9d',
                      padding: '7px 16px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                      <FolderOpen size={16} />
                      Choose Photo from System Gallery / Computer
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleLocalImageSelect(e, (base64) => setCmsAbout({ ...cmsAbout, founderImage: base64 }))}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={cmsAbout.founderImage || ''}
                    onChange={(e) => setCmsAbout({ ...cmsAbout, founderImage: e.target.value })}
                    placeholder="Enter image URL or select photo from your computer gallery above"
                  />
                  {cmsAbout.founderImage && (
                    <div style={{
                      marginTop: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      border: '1px solid rgba(255, 42, 133, 0.3)'
                    }}>
                      <img
                        src={cmsAbout.founderImage}
                        alt="Founder Preview"
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '14px',
                          objectFit: 'cover',
                          border: '2px solid #ff2a85',
                          boxShadow: '0 4px 14px rgba(255, 42, 133, 0.3)'
                        }}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                          Founder & CEO Portrait Ready
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>
                          ✓ Live preview active. Click "Save About & Founder Details" below to publish.
                        </div>
                      </div>
                      <label style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}>
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleLocalImageSelect(e, (base64) => setCmsAbout({ ...cmsAbout, founderImage: base64 }))}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '12px' }}>
                  <Save size={18} />
                  Save About & Founder Details
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: CMS CAMERA GEAR */}
          {activeTab === 'cms-gear' && (
            <div style={{ maxWidth: '900px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Camera & Cinema Gear Manager
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Add, modify or delete cameras, gimbals, and drones shown in "Our Gear" section.
              </p>

              {/* Add New Gear */}
              <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                  Add New Equipment
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label>Gear Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sony FX3 Cinema"
                      value={newGear.name}
                      onChange={(e) => setNewGear({ ...newGear, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Specification / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. 4K 120p Full Frame"
                      value={newGear.desc}
                      onChange={(e) => setNewGear({ ...newGear, desc: e.target.value })}
                    />
                  </div>
                </div>
                <button onClick={handleAddGear} className="btn-primary" style={{ padding: '8px 20px' }}>
                  <Plus size={16} />
                  Add to Gear List
                </button>
              </div>

              {/* Current Gear Items */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {cmsGear.map((g, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{g.name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{g.desc}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteGear(idx)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CMS SERVICES & PRICING */}
          {activeTab === 'cms-services' && (
            <div style={{ maxWidth: '900px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Services & Package Pricing Manager
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Edit service rates and add new packages. Prices automatically reflect in the public 5-Step Booking Calculator!
              </p>

              {/* Add New Service */}
              <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                  Add New Service Package
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label>Package Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Maternity Creative Film"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 18000"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Short Description</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 hours studio shoot"
                      value={newService.desc}
                      onChange={(e) => setNewService({ ...newService, desc: e.target.value })}
                    />
                  </div>
                </div>
                <button onClick={handleAddService} className="btn-primary" style={{ padding: '8px 20px' }}>
                  <Plus size={16} />
                  Add Service
                </button>
              </div>

              {/* Current Services List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {cmsServices.map((srv) => (
                  <div key={srv.id} className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255, 42, 133, 0.2)' }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{srv.name}</div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>{srv.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#ff4d9d' }}>
                        ₹{srv.price?.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CMS PORTFOLIO */}
          {activeTab === 'cms-portfolio' && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Events & Portfolio Gallery Manager
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Upload or link new photos to the public gallery under Weddings, Pre-Wedding, Birthdays, etc.
              </p>

              {/* Add New Photo */}
              <form onSubmit={handleAddPortfolio} className="glass-panel" style={{ padding: '24px', marginBottom: '32px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                  Add Photo to Gallery
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Sunset Muhurtham at ECR"
                      value={newPortfolio.title}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <select
                      value={newPortfolio.category}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                    >
                      <option value="Weddings">Weddings</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Birthdays">Birthdays</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Baby Shower">Baby Shower</option>
                      <option value="Drone Shoots">Drone Shoots</option>
                    </select>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ margin: 0 }}>Photo Source</label>
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#ff4d9d',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>
                        <FolderOpen size={13} />
                        Choose from Device / Gallery
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleLocalImageSelect(e, (base64) => setNewPortfolio({ ...newPortfolio, image: base64 }))}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Image URL or choose from device above"
                      value={newPortfolio.image}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, image: e.target.value })}
                      required
                    />
                    {newPortfolio.image && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={newPortfolio.image} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ff2a85' }} />
                        <span style={{ fontSize: '0.75rem', color: '#10b981' }}>✓ Photo selected</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label>Caption / Story</label>
                  <input
                    type="text"
                    placeholder="Short description of the photo"
                    value={newPortfolio.caption}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, caption: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '8px 22px' }}>
                  <Plus size={16} />
                  Publish to Gallery
                </button>
              </form>

              {/* Existing Items Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {portfolioList.map((item) => (
                  <div key={item._id} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ position: 'relative', height: '180px' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        onClick={() => handleDeletePortfolio(item._id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(239, 68, 68, 0.85)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ padding: '14px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#ff2a85', fontWeight: 700, textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginTop: '2px' }}>
                        {item.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: CMS FRAME CATALOG */}
          {activeTab === 'cms-frames' && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Frame Catalog Manager
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Add new custom photo frames or change frame prices and dimensions.
              </p>

              {/* Add New Frame */}
              <form onSubmit={handleAddFrame} className="glass-panel" style={{ padding: '24px', marginBottom: '32px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                  Add New Frame
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label>Frame Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Walnut Frame"
                      value={newFrame.title}
                      onChange={(e) => setNewFrame({ ...newFrame, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1999"
                      value={newFrame.price}
                      onChange={(e) => setNewFrame({ ...newFrame, price: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label>Dimensions</label>
                    <input
                      type="text"
                      placeholder="e.g. 16x24 inches"
                      value={newFrame.dimensions}
                      onChange={(e) => setNewFrame({ ...newFrame, dimensions: e.target.value })}
                    />
                  </div>

                  <div>
                    <label>Badge Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Best Seller"
                      value={newFrame.badge}
                      onChange={(e) => setNewFrame({ ...newFrame, badge: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ margin: 0 }}>Frame Mockup Image Source</label>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#ff4d9d',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}>
                      <FolderOpen size={13} />
                      Choose from Device / Gallery
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleLocalImageSelect(e, (base64) => setNewFrame({ ...newFrame, image: base64 }))}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL or choose frame image from device above"
                    value={newFrame.image}
                    onChange={(e) => setNewFrame({ ...newFrame, image: e.target.value })}
                    required
                  />
                  {newFrame.image && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={newFrame.image} alt="Frame Preview" style={{ width: '56px', height: '56px', objectFit: 'contain', background: '#0a0b12', borderRadius: '8px', border: '1px solid #ff2a85', padding: '4px' }} />
                      <span style={{ fontSize: '0.75rem', color: '#10b981' }}>✓ Frame image selected</span>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '8px 22px' }}>
                  <Plus size={16} />
                  Add Frame to Catalog
                </button>
              </form>

              {/* Existing Frames */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {frameList.map((f) => (
                  <div key={f._id} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ position: 'relative', height: '180px', background: '#0a0b12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={f.image} alt={f.title} style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }} />
                      <button
                        onClick={() => handleDeleteFrame(f._id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(239, 68, 68, 0.85)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{f.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{f.dimensions}</div>
                      </div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#ff2a85' }}>
                        ₹{f.price?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: CMS CONTACT & UPI SETUP */}
          {activeTab === 'cms-contact' && (
            <div style={{ maxWidth: '850px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                Studio Contact & UPI QR Settings
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Set up your studio's official contact number, WhatsApp, email, physical studio address, and UPI ID.
              </p>

              <form onSubmit={handleSaveContactSettings} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label>Studio Phone Number</label>
                    <input
                      type="text"
                      value={cmsContact.phone || ''}
                      onChange={(e) => setCmsContact({ ...cmsContact, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label>WhatsApp Number (Used for all WhatsApp chat buttons)</label>
                    <input
                      type="text"
                      value={cmsContact.whatsapp || ''}
                      onChange={(e) => setCmsContact({ ...cmsContact, whatsapp: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                  <div>
                    <label>Studio Email</label>
                    <input
                      type="email"
                      value={cmsContact.email || ''}
                      onChange={(e) => setCmsContact({ ...cmsContact, email: e.target.value })}
                      placeholder="info@avstudio.com"
                    />
                  </div>

                  <div>
                    <label>Studio Timings</label>
                    <input
                      type="text"
                      value={cmsContact.timings || ''}
                      onChange={(e) => setCmsContact({ ...cmsContact, timings: e.target.value })}
                      placeholder="9:30 AM – 9:00 PM (Mon – Sun)"
                    />
                  </div>
                </div>

                <div>
                  <label>Physical Studio Address</label>
                  <textarea
                    rows="3"
                    value={cmsContact.address || ''}
                    onChange={(e) => setCmsContact({ ...cmsContact, address: e.target.value })}
                  />
                </div>

                {/* Google Map & Location Configuration */}
                <div style={{
                  padding: '22px',
                  borderRadius: '16px',
                  background: 'rgba(138, 43, 226, 0.07)',
                  border: '1px solid rgba(138, 43, 226, 0.35)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #ff2a85, #8a2be2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                        Studio Google Map & Pin Configuration
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Control the location map shown at the bottom of the public website.
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 600, color: '#fff' }}>Map Pin Title / Display Location</label>
                    <input
                      type="text"
                      value={cmsContact.mapLocationName || ''}
                      onChange={(e) => setCmsContact({ ...cmsContact, mapLocationName: e.target.value })}
                      placeholder="e.g. AV Studio, Anna Nagar, Chennai"
                      style={{ marginTop: '6px' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                      This title appears as the glowing pin badge on the map and is used to search on Google Maps automatically.
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 600, color: '#fff' }}>Google Maps Custom Embed Link / iFrame (Optional)</label>
                    <input
                      type="text"
                      value={cmsContact.mapEmbedUrl || ''}
                      onChange={(e) => setCmsContact({ ...cmsContact, mapEmbedUrl: e.target.value })}
                      placeholder="Paste Google Maps embed URL or <iframe ...></iframe> (or leave empty for auto-map)"
                      style={{ marginTop: '6px' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                      Tip: Open Google Maps &gt; Search your studio address &gt; Click <strong>Share</strong> &gt; <strong>Embed a map</strong> &gt; Copy and paste here. If empty, the location name above will be embedded automatically.
                    </span>
                  </div>

                  {/* Live Interactive Map Preview */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff2a85', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Live Map Preview (Changes reflected in real-time)
                      </span>
                    </div>
                    <div style={{
                      height: '200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 42, 133, 0.35)',
                      background: '#0a0b14',
                      position: 'relative',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
                    }}>
                      <iframe
                        title="Admin Map Live Preview"
                        src={(() => {
                          const url = cmsContact.mapEmbedUrl?.trim();
                          if (url) {
                            const match = url.match(/src=["']([^"']+)["']/i);
                            if (match) return match[1];
                            return url;
                          }
                          const query = encodeURIComponent(cmsContact.mapLocationName || cmsContact.address || 'AV Studio, Anna Nagar, Chennai');
                          return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                        })()}
                        width="100%"
                        height="100%"
                        style={{
                          border: 0,
                          filter: 'invert(90%) hue-rotate(180deg) contrast(1.15) brightness(0.9)',
                          opacity: 0.92
                        }}
                        loading="lazy"
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(8, 9, 14, 0.92)',
                        padding: '5px 12px',
                        borderRadius: '8px',
                        border: '1px solid #ff2a85',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        pointerEvents: 'none'
                      }}>
                        <MapPin size={13} color="#ff2a85" />
                        {cmsContact.mapLocationName || 'AV Studio'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* UPI ID Setup */}
                <div style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 42, 133, 0.08)',
                  border: '1px solid rgba(255, 42, 133, 0.3)'
                }}>
                  <label style={{ color: '#ff4d9d', fontWeight: 700 }}>Studio UPI ID (For Scan & Pay QR Code)</label>
                  <input
                    type="text"
                    value={cmsContact.upiId || ''}
                    onChange={(e) => setCmsContact({ ...cmsContact, upiId: e.target.value })}
                    placeholder="avstudio.shoot@oksbi"
                    style={{ marginTop: '6px' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginTop: '6px' }}>
                    When clients scan the QR code in the booking flow, funds will be directed to this UPI handle.
                  </span>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '10px', padding: '12px' }}>
                  <Save size={18} />
                  Save Contact, Map & UPI Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB: CLIENT INQUIRIES & EMAIL SETUP */}
          {activeTab === 'inquiries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    Client Inquiries & <span className="gradient-pink">Email Notifications</span>
                  </h2>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: '4px' }}>
                    Messages submitted through the public contact form are saved here and dispatched via email.
                  </p>
                </div>
                <button
                  onClick={fetchInquiries}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <RefreshCw size={15} />
                  Refresh Messages
                </button>
              </div>

              {/* Grid: Left Column Inquiries Inbox, Right Column Email/SMTP Settings */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '30px' }}>
                {/* Left: Inquiries Inbox */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 42, 133, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Mail size={20} color="#ff2a85" />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                        Inquiries Inbox ({inquiries.length})
                      </h3>
                    </div>
                    {/* Status Filters */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['All', 'New', 'Contacted', 'Resolved'].map(f => (
                        <button
                          key={f}
                          onClick={() => setInquiryFilter(f)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            border: '1px solid',
                            borderColor: inquiryFilter === f ? '#ff2a85' : 'rgba(255, 255, 255, 0.1)',
                            background: inquiryFilter === f ? 'rgba(255, 42, 133, 0.2)' : 'transparent',
                            color: inquiryFilter === f ? '#ff2a85' : 'var(--text-muted)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input
                      type="text"
                      placeholder="Search by client name, email, or message..."
                      value={inquirySearchQuery}
                      onChange={(e) => setInquirySearchQuery(e.target.value)}
                      style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Messages List */}
                  {loadingInquiries ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      Loading inquiries...
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
                      <Mail size={32} color="var(--text-dim)" style={{ margin: '0 auto 10px' }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No client messages yet.</p>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>New contact form submissions will appear here automatically.</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
                      {inquiries
                        .filter(m => {
                          if (inquiryFilter !== 'All' && m.status !== inquiryFilter) return false;
                          if (inquirySearchQuery) {
                            const q = inquirySearchQuery.toLowerCase();
                            return m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.message?.toLowerCase().includes(q);
                          }
                          return true;
                        })
                        .map(msg => (
                          <div
                            key={msg._id}
                            style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              background: msg.status === 'New' ? 'rgba(255, 42, 133, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                              border: `1px solid ${msg.status === 'New' ? 'rgba(255, 42, 133, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{msg.name}</span>
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  background: msg.status === 'New' ? '#ff2a85' : msg.status === 'Contacted' ? '#f59e0b' : '#10b981',
                                  color: '#fff'
                                }}>
                                  {msg.status}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                              <a href={`mailto:${msg.email}`} style={{ color: '#ff4d9d', textDecoration: 'none' }}>{msg.email}</a>
                              {msg.phone && <span>📞 {msg.phone}</span>}
                            </div>

                            <p style={{
                              fontSize: '0.84rem',
                              color: 'var(--text-muted)',
                              margin: '2px 0 6px',
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              "{msg.message}"
                            </p>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                              <button
                                onClick={() => setSelectedInquiry(msg)}
                                className="btn-outline"
                                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px' }}
                              >
                                View Details
                              </button>
                              {msg.status === 'New' && (
                                <button
                                  onClick={() => handleUpdateInquiryStatus(msg._id, 'Contacted')}
                                  style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                  Mark Contacted
                                </button>
                              )}
                              {msg.status !== 'Resolved' && (
                                <button
                                  onClick={() => handleUpdateInquiryStatus(msg._id, 'Resolved')}
                                  style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                  Mark Done
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteInquiry(msg._id)}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: 'auto', cursor: 'pointer', padding: '4px' }}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Right: Email Notification & SMTP Setup */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 42, 133, 0.25)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Send size={20} color="#ff2a85" />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                        Email & SMTP Settings
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        Configure the recipient mailbox and delivery server for new inquiry alerts.
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveEmailConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label>Notification Recipient Email *</label>
                      <input
                        type="email"
                        value={cmsEmailConfig.notificationEmail || ''}
                        onChange={(e) => setCmsEmailConfig({ ...cmsEmailConfig, notificationEmail: e.target.value })}
                        placeholder="e.g. director@avstudio.com"
                        required
                        style={{ marginTop: '4px' }}
                      />
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                        All client messages submitted from the contact form will be emailed to this address.
                      </span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff2a85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                        SMTP Server Credentials (Optional / Live Sending)
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label>SMTP Host</label>
                          <input
                            type="text"
                            value={cmsEmailConfig.smtpHost || ''}
                            onChange={(e) => setCmsEmailConfig({ ...cmsEmailConfig, smtpHost: e.target.value })}
                            placeholder="smtp.gmail.com"
                            style={{ marginTop: '4px' }}
                          />
                        </div>
                        <div>
                          <label>Port</label>
                          <input
                            type="number"
                            value={cmsEmailConfig.smtpPort || 587}
                            onChange={(e) => setCmsEmailConfig({ ...cmsEmailConfig, smtpPort: e.target.value })}
                            placeholder="587"
                            style={{ marginTop: '4px' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label>SMTP Username / Sender Email</label>
                        <input
                          type="text"
                          value={cmsEmailConfig.smtpUser || ''}
                          onChange={(e) => setCmsEmailConfig({ ...cmsEmailConfig, smtpUser: e.target.value })}
                          placeholder="your-studio@gmail.com"
                          style={{ marginTop: '4px' }}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label>SMTP Password / App Password</label>
                        <input
                          type="password"
                          value={cmsEmailConfig.smtpPass || ''}
                          onChange={(e) => setCmsEmailConfig({ ...cmsEmailConfig, smtpPass: e.target.value })}
                          placeholder="App password or SMTP password"
                          style={{ marginTop: '4px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          id="smtpSecure"
                          checked={Boolean(cmsEmailConfig.smtpSecure)}
                          onChange={(e) => setCmsEmailConfig({ ...cmsEmailConfig, smtpSecure: e.target.checked })}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <label htmlFor="smtpSecure" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', margin: 0 }}>
                          Use SSL/TLS (Port 465)
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '10px' }}>
                      <Save size={16} />
                      Save Email Configuration
                    </button>
                  </form>

                  {/* Test Email Section */}
                  <div style={{ background: 'rgba(255, 42, 133, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 42, 133, 0.2)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                      Test Email Delivery
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '0 0 10px' }}>
                      Send a verification test message to ensure your email service is working.
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="email"
                        placeholder="Recipient for test email"
                        value={testEmailRecipient}
                        onChange={(e) => setTestEmailRecipient(e.target.value)}
                        style={{ fontSize: '0.82rem', flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        disabled={testEmailLoading}
                        className="btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      >
                        {testEmailLoading ? 'Sending...' : 'Send Test'}
                      </button>
                    </div>

                    {testEmailResult && (
                      <div style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        background: testEmailResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        border: `1px solid ${testEmailResult.success ? '#10b981' : '#ef4444'}`,
                        color: testEmailResult.success ? '#10b981' : '#ef4444'
                      }}>
                        {testEmailResult.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CMS BRANDING & LOGO */}
          {activeTab === 'cms-branding' && (
            <div style={{ maxWidth: '800px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Website Logo & <span className="gradient-pink">Brand Identity</span>
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Upload a custom logo image or change the brand typography shown across the website header and footer.
                </p>
              </div>

              <form onSubmit={handleSaveBranding} className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(255, 42, 133, 0.3)', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Logo Preview & Custom Image Upload */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontWeight: 700, color: '#ff2a85', textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    Website Brand Logo
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '16px',
                      border: '2px solid rgba(255, 42, 133, 0.5)',
                      boxShadow: '0 0 20px rgba(255, 42, 133, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      background: '#0a0b12'
                    }}>
                      {cmsBranding.logoUrl ? (
                        <img src={cmsBranding.logoUrl} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Camera size={34} color="#ff2a85" />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Paste image URL (or upload below)"
                        value={cmsBranding.logoUrl || ''}
                        onChange={(e) => setCmsBranding({ ...cmsBranding, logoUrl: e.target.value })}
                        style={{ fontSize: '0.88rem' }}
                      />
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <label className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                          <Upload size={14} />
                          Upload Logo File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {cmsBranding.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setCmsBranding({ ...cmsBranding, logoUrl: '' })}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Reset to Default Icon
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Studio Name & Tagline */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                  <div>
                    <label>Studio Brand Name *</label>
                    <input
                      type="text"
                      value={cmsBranding.studioName || ''}
                      onChange={(e) => setCmsBranding({ ...cmsBranding, studioName: e.target.value })}
                      placeholder="AV STUDIO"
                      required
                      style={{ marginTop: '4px' }}
                    />
                  </div>

                  <div>
                    <label>Studio Tagline *</label>
                    <input
                      type="text"
                      value={cmsBranding.studioTagline || ''}
                      onChange={(e) => setCmsBranding({ ...cmsBranding, studioTagline: e.target.value })}
                      placeholder="Cinema & Photography"
                      required
                      style={{ marginTop: '4px' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '12px' }}>
                  <Save size={18} />
                  Save Brand & Logo Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB: CMS STUDIO HEADQUARTERS & MAP */}
          {activeTab === 'cms-headquarters' && (
            <div style={{ maxWidth: '850px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Studio Headquarters & <span className="gradient-pink">Chennai Location</span>
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Edit the Studio Headquarters section, full address, phone, email, operating hours, and Google Map.
                </p>
              </div>

              <form onSubmit={handleSaveHeadquarters} className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(255, 42, 133, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label>Section Header Title</label>
                  <input
                    type="text"
                    value={cmsHeadquarters.hqTitle || 'Studio Headquarters'}
                    onChange={(e) => setCmsHeadquarters({ ...cmsHeadquarters, hqTitle: e.target.value })}
                    placeholder="Studio Headquarters"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label>Studio Full Address *</label>
                  <textarea
                    rows={3}
                    value={cmsHeadquarters.address || ''}
                    onChange={(e) => setCmsHeadquarters({ ...cmsHeadquarters, address: e.target.value })}
                    placeholder="123, Creative Street, Anna Nagar, Chennai - 600040, Tamil Nadu"
                    required
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label>Landmark (Displayed on Contact card & Footer)</label>
                  <input
                    type="text"
                    value={cmsHeadquarters.hqLandmark || ''}
                    onChange={(e) => setCmsHeadquarters({ ...cmsHeadquarters, hqLandmark: e.target.value })}
                    placeholder="e.g. Near Roundtana, Anna Nagar"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label>Official Phone Number</label>
                    <input
                      type="text"
                      value={cmsHeadquarters.hqPhone || cmsHeadquarters.phone || ''}
                      onChange={(e) => setCmsHeadquarters({ ...cmsHeadquarters, hqPhone: e.target.value, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      style={{ marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label>Official Studio Email</label>
                    <input
                      type="email"
                      value={cmsHeadquarters.hqEmail || cmsHeadquarters.email || ''}
                      onChange={(e) => setCmsHeadquarters({ ...cmsHeadquarters, hqEmail: e.target.value, email: e.target.value })}
                      placeholder="info@avstudio.com"
                      style={{ marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label>Studio Operating Hours / Timings</label>
                  <input
                    type="text"
                    value={cmsHeadquarters.timings || ''}
                    onChange={(e) => setCmsHeadquarters({ ...cmsHeadquarters, timings: e.target.value })}
                    placeholder="9:30 AM – 9:00 PM (Mon – Sun)"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                {/* Google Map Config */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label style={{ fontWeight: 700, color: '#ff2a85', textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    Google Maps Pin Location & Custom Embed
                  </label>
                  <div style={{ marginTop: '10px' }}>
                    <label>Map Pin Label / Query</label>
                    <input
                      type="text"
                      value={cmsHeadquarters.mapLocationName || ''}
                      onChange={(e) => setCmsHeadquarters({ ...cmsHeadquarters, mapLocationName: e.target.value })}
                      placeholder="AV Studio, Anna Nagar, Chennai"
                      style={{ marginTop: '4px' }}
                    />
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <label>Custom Google Maps Embed URL or iframe code</label>
                    <input
                      type="text"
                      value={cmsHeadquarters.mapEmbedUrl || ''}
                      onChange={(e) => setCmsHeadquarters({ ...cmsHeadquarters, mapEmbedUrl: e.target.value })}
                      placeholder="Paste embed iframe src or leave empty for auto location query"
                      style={{ marginTop: '4px' }}
                    />
                  </div>

                  {/* Live Map Preview */}
                  <div style={{ marginTop: '14px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', display: 'block' }}>
                      Live Map Preview:
                    </span>
                    <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
                      <iframe
                        title="Headquarters Map Preview"
                        src={(() => {
                          const url = cmsHeadquarters.mapEmbedUrl?.trim();
                          if (url) {
                            const match = url.match(/src=["']([^"']+)["']/i);
                            if (match) return match[1];
                            return url;
                          }
                          const query = encodeURIComponent(cmsHeadquarters.mapLocationName || cmsHeadquarters.address || 'AV Studio, Anna Nagar, Chennai');
                          return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                        })()}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '12px' }}>
                  <Save size={18} />
                  Save Studio Headquarters Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB: CMS SOCIAL MEDIA PROFILES */}
          {activeTab === 'cms-socials' && (
            <div style={{ maxWidth: '800px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Social Media <span className="gradient-pink">Profiles</span>
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Manage links to your official Instagram, Facebook, YouTube, and WhatsApp accounts.
                </p>
              </div>

              <form onSubmit={handleSaveSocials} className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(255, 42, 133, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <InstagramIcon size={18} color="#ff2a85" />
                    <label style={{ margin: 0, fontWeight: 700 }}>Instagram Profile URL</label>
                  </div>
                  <input
                    type="url"
                    value={cmsSocials.instagramUrl || ''}
                    onChange={(e) => setCmsSocials({ ...cmsSocials, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/avstudio"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <FacebookIcon size={18} color="#3b82f6" />
                    <label style={{ margin: 0, fontWeight: 700 }}>Facebook Page URL</label>
                  </div>
                  <input
                    type="url"
                    value={cmsSocials.facebookUrl || ''}
                    onChange={(e) => setCmsSocials({ ...cmsSocials, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/avstudio"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <YoutubeIcon size={18} color="#ef4444" />
                    <label style={{ margin: 0, fontWeight: 700 }}>YouTube Channel URL</label>
                  </div>
                  <input
                    type="url"
                    value={cmsSocials.youtubeUrl || ''}
                    onChange={(e) => setCmsSocials({ ...cmsSocials, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@avstudio"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <MessageSquare size={18} color="#25D366" />
                    <label style={{ margin: 0, fontWeight: 700 }}>WhatsApp Business Contact</label>
                  </div>
                  <input
                    type="text"
                    value={cmsSocials.whatsapp || ''}
                    onChange={(e) => setCmsSocials({ ...cmsSocials, whatsapp: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Share2 size={18} color="#38bdf8" />
                    <label style={{ margin: 0, fontWeight: 700 }}>Twitter / X Profile URL</label>
                  </div>
                  <input
                    type="url"
                    value={cmsSocials.twitterUrl || ''}
                    onChange={(e) => setCmsSocials({ ...cmsSocials, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/avstudio"
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '12px' }}>
                  <Save size={18} />
                  Save Social Profiles
                </button>
              </form>
            </div>
          )}

          {/* TAB: CMS FOOTER CUSTOMIZER */}
          {activeTab === 'cms-footer' && (
            <div style={{ maxWidth: '850px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Footer <span className="gradient-pink">Customizer</span>
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Edit every single text line, copyright notice, services list, and navigation link in the website footer.
                </p>
              </div>

              <form onSubmit={handleSaveFooter} className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(255, 42, 133, 0.3)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label>Footer About Studio Paragraph *</label>
                  <textarea
                    rows={3}
                    value={cmsFooter.footerAbout || ''}
                    onChange={(e) => setCmsFooter({ ...cmsFooter, footerAbout: e.target.value })}
                    placeholder="Premier Photography & Cinematic Videography studio based in Chennai..."
                    required
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label>Copyright Notice Text *</label>
                  <input
                    type="text"
                    value={cmsFooter.footerCopyright || ''}
                    onChange={(e) => setCmsFooter({ ...cmsFooter, footerCopyright: e.target.value })}
                    placeholder="© 2026 AV STUDIO. All rights reserved. Designed for excellence."
                    required
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label>Studio Services Tags in Footer (Comma-separated)</label>
                  <textarea
                    rows={2}
                    value={Array.isArray(cmsFooter.footerServices) ? cmsFooter.footerServices.join(', ') : (cmsFooter.footerServices || '')}
                    onChange={(e) => setCmsFooter({ ...cmsFooter, footerServices: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Destination Weddings, Pre-Wedding Cinema, Drone Aerial, Archival Albums, Photo Framing"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label>Quick Navigation Links in Footer (Comma-separated)</label>
                  <textarea
                    rows={2}
                    value={Array.isArray(cmsFooter.footerQuickLinks) ? cmsFooter.footerQuickLinks.join(', ') : (cmsFooter.footerQuickLinks || '')}
                    onChange={(e) => setCmsFooter({ ...cmsFooter, footerQuickLinks: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Home, About Us & Gear, Events & Portfolio, Event Booking & Packages, Frame Catalog, Date Availability, Contact Studio"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '12px' }}>
                  <Save size={18} />
                  Save Footer Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB: CMS EVENT PACKAGES */}
          {activeTab === 'cms-packages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    Event Packages & <span className="gradient-pink">Pricing</span>
                  </h2>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: '4px' }}>
                    Add, customize or remove photography & videography packages shown in the booking section.
                  </p>
                </div>
              </div>

              {/* Add New Package Card */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 42, 133, 0.3)', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={18} color="#ff2a85" />
                  Add New Event Package
                </h3>

                <form onSubmit={handleAddPackage} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <label>Event Category *</label>
                      <select
                        value={newPackage.eventType}
                        onChange={(e) => setNewPackage({ ...newPackage, eventType: e.target.value, category: e.target.value })}
                        style={{ marginTop: '4px' }}
                      >
                        <option value="Wedding">Weddings</option>
                        <option value="Pre-Wedding">Pre-Wedding</option>
                        <option value="Birthday">Birthday & Celebrations</option>
                        <option value="Corporate">Corporate Events</option>
                        <option value="Baby Shower">Baby Shower & Tradition</option>
                        <option value="Drone Shoots">Drone Aerial Cinema</option>
                        <option value="Fashion">Fashion & Portraits</option>
                      </select>
                    </div>

                    <div>
                      <label>Package Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Wedding Cinema"
                        value={newPackage.title}
                        onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                        required
                        style={{ marginTop: '4px' }}
                      />
                    </div>

                    <div>
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 50000"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                        required
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <label>Subtitle / One-line Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Full two-day muhurtham & reception grand coverage"
                        value={newPackage.subtitle}
                        onChange={(e) => setNewPackage({ ...newPackage, subtitle: e.target.value })}
                        style={{ marginTop: '4px' }}
                      />
                    </div>

                    <div>
                      <label>Badge Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Most Popular / Best Value"
                        value={newPackage.badge}
                        onChange={(e) => setNewPackage({ ...newPackage, badge: e.target.value })}
                        style={{ marginTop: '4px' }}
                      />
                    </div>

                    <div>
                      <label>Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. Full Day Coverage"
                        value={newPackage.duration}
                        onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <label style={{ margin: 0, fontWeight: 700 }}>Cover Photo / Image *</label>
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#ff2a85',
                        background: 'rgba(255, 42, 133, 0.12)',
                        border: '1px solid rgba(255, 42, 133, 0.4)',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 0 10px rgba(255, 42, 133, 0.15)'
                      }}>
                        <FolderOpen size={15} />
                        Choose from Device / Gallery
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleLocalImageSelect(e, (base64) => setNewPackage({ ...newPackage, image: base64 }))}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Select image from device above, or enter image URL"
                      value={newPackage.image}
                      onChange={(e) => setNewPackage({ ...newPackage, image: e.target.value })}
                      style={{ marginTop: '4px' }}
                    />
                    {newPackage.image && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 42, 133, 0.3)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <img
                          src={newPackage.image}
                          alt="Package preview"
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                            border: '2px solid #ff2a85',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Check size={14} /> Photo Selected from {newPackage.image.startsWith('data:') ? 'Device' : 'Web URL'}
                          </span>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Ready to save with new package
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewPackage({ ...newPackage, image: '' })}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#ef4444',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label>Package Inclusions / Features (One per line)</label>
                    <textarea
                      rows={3}
                      placeholder="2 Candid Photographers&#10;2 Cinematic 4K Videographers&#10;Drone Aerial Coverage&#10;Luxury Silk Album"
                      value={newPackage.featuresText}
                      onChange={(e) => setNewPackage({ ...newPackage, featuresText: e.target.value })}
                      style={{ marginTop: '4px' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '10px' }}>
                    <Plus size={16} />
                    Add Package
                  </button>
                </form>
              </div>

              {/* Live Packages List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {cmsPackages.map(pkg => (
                  <div key={pkg.id || pkg.title} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                      <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {pkg.badge && (
                        <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff2a85', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                          {pkg.badge}
                        </span>
                      )}
                      <label
                        title="Change cover photo from your device"
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          background: 'rgba(10, 12, 22, 0.85)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 42, 133, 0.6)',
                          color: '#fff',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Camera size={13} color="#ff2a85" /> Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleLocalImageSelect(e, (base64) => handleUpdatePackageImage(pkg.id, base64))}
                        />
                      </label>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>{pkg.eventType}</div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{pkg.title}</h4>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ff2a85' }}>
                        ₹{pkg.price?.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '16px', margin: '4px 0', lineHeight: 1.5 }}>
                      {(pkg.features || []).slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      style={{ marginTop: 'auto', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Trash2 size={13} /> Delete Package
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Profile & Credentials Management */}
          {activeTab === 'admin-profile' && (
            <div style={{ maxWidth: '840px' }}>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff2a85', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  <ShieldCheck size={18} />
                  Admin Account & Security
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Manage Admin Profile & Credentials
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
                  Change your login username, password, display name, and upload your profile avatar photo directly from your device.
                </p>
              </div>

              {profileSuccess && (
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle size={18} />
                  {profileSuccess}
                </div>
              )}

              {profileError && (
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <AlertCircle size={18} />
                  {profileError}
                </div>
              )}

              <form onSubmit={handleUpdateAdminProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Profile Picture Card */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={18} color="#ff2a85" />
                    Admin Profile Photo
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Avatar Preview */}
                    <div style={{ position: 'relative' }}>
                      {profileForm.avatar ? (
                        <img
                          src={profileForm.avatar}
                          alt="Admin Avatar"
                          style={{
                            width: '96px',
                            height: '96px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #ff2a85',
                            boxShadow: '0 0 25px rgba(255, 42, 133, 0.4)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '96px',
                          height: '96px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ff2a85 0%, #8a2be2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '2rem',
                          color: '#fff',
                          boxShadow: '0 0 25px rgba(255, 42, 133, 0.35)',
                          border: '2px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {(profileForm.name || 'AP').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
                        Select Avatar from Device
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0 }}>
                        Upload a personal picture from your computer, phone gallery, or storage.
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'linear-gradient(135deg, #ff2a85 0%, #d81b60 100%)',
                          color: '#fff',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 0 16px rgba(255, 42, 133, 0.35)',
                          transition: 'all 0.2s ease'
                        }}>
                          <FolderOpen size={16} />
                          Choose Photo from Device
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleLocalImageSelect(e, (base64) => setProfileForm({ ...profileForm, avatar: base64 }))}
                          />
                        </label>

                        {profileForm.avatar && (
                          <button
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, avatar: '' })}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              color: '#ef4444',
                              borderRadius: '10px',
                              padding: '8px 14px',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Basic Info & Username */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} color="#ff2a85" />
                    Username & Display Information
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                    <div>
                      <label style={{ fontWeight: 700 }}>Admin Login Username *</label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        placeholder="e.g. admin or arjun_studio"
                        required
                        style={{ marginTop: '6px' }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                        This is the username you type when logging into Admin Dashboard.
                      </span>
                    </div>

                    <div>
                      <label style={{ fontWeight: 700 }}>Admin Display Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="e.g. Arjun Prakash"
                        style={{ marginTop: '6px' }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                        Shown in the header greeting and activity logs.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Password Security */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={18} color="#ff2a85" />
                    Change Admin Password
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 0, marginBottom: '16px' }}>
                    Leave password fields blank if you only wish to update username or photo.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontWeight: 700 }}>Current Password</label>
                      <input
                        type="password"
                        value={profileForm.currentPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                        placeholder="Enter current password (required only if setting new password)"
                        style={{ marginTop: '6px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                      <div>
                        <label style={{ fontWeight: 700 }}>New Password</label>
                        <input
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                          placeholder="Min. 4 characters"
                          style={{ marginTop: '6px' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontWeight: 700 }}>Confirm New Password</label>
                        <input
                          type="password"
                          value={profileForm.confirmPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          style={{ marginTop: '6px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '6px' }}>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {profileLoading ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                    {profileLoading ? 'Saving Changes...' : 'Save Profile & Credentials'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Inquiry View Detail Modal */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#0e101d',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255, 42, 133, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#ff2a85', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Client Message
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '2px 0 0' }}>
                  {selectedInquiry.name}
                </h3>
              </div>
              <button onClick={() => setSelectedInquiry(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div><strong>Email:</strong> <a href={`mailto:${selectedInquiry.email}`} style={{ color: '#ff2a85', textDecoration: 'none' }}>{selectedInquiry.email}</a></div>
              <div><strong>Phone:</strong> {selectedInquiry.phone || 'Not provided'}</div>
              <div><strong>Received:</strong> {new Date(selectedInquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</div>
              <div><strong>Status:</strong> <span style={{ color: selectedInquiry.status === 'New' ? '#ff2a85' : '#10b981', fontWeight: 700 }}>{selectedInquiry.status}</span></div>

              <div>
                <strong>Message:</strong>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '10px', marginTop: '6px', color: '#e2e8f0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
              <a
                href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent('AV STUDIO Response to your inquiry')}`}
                className="btn-primary"
                style={{ flex: 1, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px' }}
              >
                <Mail size={16} /> Reply via Email
              </a>
              {selectedInquiry.phone && (
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ flex: 1, background: '#25D366', color: '#fff', textDecoration: 'none', borderRadius: '9999px', padding: '10px', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <MessageSquare size={16} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking View Detail Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#0e101d',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255, 42, 133, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div><strong>ID:</strong> {selectedBooking.bookingId}</div>
              <div><strong>Client:</strong> {selectedBooking.clientName}</div>
              <div><strong>Contact:</strong> {selectedBooking.phone} | {selectedBooking.email}</div>
              <div><strong>Event:</strong> {selectedBooking.eventType} on {selectedBooking.eventDate}</div>
              <div><strong>Venue:</strong> {selectedBooking.venue}</div>
              <div><strong>Amount:</strong> ₹{selectedBooking.totalAmount?.toLocaleString('en-IN')}</div>
              <div><strong>UTR / Transaction ID:</strong> <code>{selectedBooking.transactionId || 'N/A'}</code></div>
              <div><strong>Status:</strong> {selectedBooking.status}</div>

              {selectedBooking.notes && (
                <div><strong>Notes:</strong> {selectedBooking.notes}</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleUpdateBookingStatus(selectedBooking._id, 'Verified')}
                className="btn-primary"
                style={{ flex: 1, background: '#10b981' }}
              >
                Mark Verified
              </button>
              <button
                onClick={() => handleUpdateBookingStatus(selectedBooking._id, 'Cancelled')}
                style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', padding: '10px' }}
              >
                Cancel Booking
              </button>
              <button
                onClick={() => handleDeleteBooking(selectedBooking._id)}
                style={{
                  width: '100%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  borderRadius: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <Trash2 size={15} />
                Delete Booking Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Frame Order Detail & Photo View Modal */}
      {selectedFrameOrder && (
        <div className="modal-overlay" onClick={() => setSelectedFrameOrder(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '720px',
              background: '#0e101d',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid rgba(255, 42, 133, 0.4)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ff2a85', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Frame Order Details
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '2px 0 0' }}>
                  {selectedFrameOrder.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFrameOrder(null)}
                style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* Left Column: Order & Customer Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                    Customer & Shipping
                  </div>
                  <div><strong>Name:</strong> {selectedFrameOrder.clientName || selectedFrameOrder.customerName}</div>
                  <div><strong>Phone:</strong> {selectedFrameOrder.phone}</div>
                  <div><strong>Email:</strong> {selectedFrameOrder.email}</div>
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <strong>Delivery Address:</strong>
                    <div style={{ color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      {selectedFrameOrder.shippingAddress?.streetAddress || selectedFrameOrder.shippingAddress?.addressLine},<br />
                      {selectedFrameOrder.shippingAddress?.city}, {selectedFrameOrder.shippingAddress?.state} - {selectedFrameOrder.shippingAddress?.pincode}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                    Item & Payment
                  </div>
                  <div><strong>Frame:</strong> {selectedFrameOrder.frameTitle}</div>
                  <div><strong>Dimensions:</strong> {selectedFrameOrder.dimensions}</div>
                  <div><strong>Material:</strong> {selectedFrameOrder.material || 'Natural Wood'}</div>
                  <div><strong>Quantity:</strong> {selectedFrameOrder.quantity}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff4d9d', marginTop: '6px' }}>
                    Total: ₹{selectedFrameOrder.totalAmount?.toLocaleString('en-IN')}
                  </div>
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div><strong>UPI UTR / Txn:</strong> <code>{selectedFrameOrder.transactionId || 'Pending'}</code></div>
                    <div><strong>Payment Status:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>{selectedFrameOrder.paymentStatus}</span></div>
                    <div><strong>Current Order Status:</strong> <span style={{ color: '#ff2a85', fontWeight: 700 }}>{selectedFrameOrder.status}</span></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Photo for Frame */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                  Customer's Photo to Frame
                </div>
                {(selectedFrameOrder.customerPhoto || selectedFrameOrder.photoToFrame) ? (
                  <div style={{
                    background: '#07080d',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '2px dashed rgba(255, 42, 133, 0.4)',
                    textAlign: 'center'
                  }}>
                    <img
                      src={selectedFrameOrder.customerPhoto || selectedFrameOrder.photoToFrame}
                      alt="Customer to frame"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '260px',
                        objectFit: 'contain',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                      }}
                    />
                    <div style={{ marginTop: '12px' }}>
                      <a
                        href={selectedFrameOrder.customerPhoto || selectedFrameOrder.photoToFrame}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.8rem',
                          padding: '8px 16px',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={14} />
                        Open High-Res Photo for Printing
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '40px 20px',
                    borderRadius: '16px',
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    color: 'var(--text-dim)'
                  }}>
                    No custom photo uploaded by customer.
                  </div>
                )}
              </div>
            </div>

            {/* Status Update Buttons */}
            <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px', fontWeight: 600 }}>
                Update Order Status:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleUpdateFrameOrderStatus(selectedFrameOrder._id, 'Confirmed')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #3b82f6',
                    background: selectedFrameOrder.status === 'Confirmed' ? '#3b82f6' : 'rgba(59, 130, 246, 0.15)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✓ Confirm Order
                </button>

                <button
                  onClick={() => handleUpdateFrameOrderStatus(selectedFrameOrder._id, 'In Production')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #8b5cf6',
                    background: selectedFrameOrder.status === 'In Production' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.15)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚙ In Production
                </button>

                <button
                  onClick={() => handleUpdateFrameOrderStatus(selectedFrameOrder._id, 'Dispatched')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #f59e0b',
                    background: selectedFrameOrder.status === 'Dispatched' ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🚚 Dispatched
                </button>

                <button
                  onClick={() => handleUpdateFrameOrderStatus(selectedFrameOrder._id, 'Delivered')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #10b981',
                    background: selectedFrameOrder.status === 'Delivered' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ★ Delivered
                </button>

                <button
                  onClick={() => handleUpdateFrameOrderStatus(selectedFrameOrder._id, 'Cancelled')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #ef4444',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  }}
                >
                  Cancel Order
                </button>

                <button
                  onClick={() => handleDeleteFrameOrder(selectedFrameOrder._id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #ef4444',
                    background: 'rgba(239, 68, 68, 0.28)',
                    color: '#ef4444',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} />
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
