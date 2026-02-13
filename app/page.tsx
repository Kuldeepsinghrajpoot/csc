'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Landmark,
  FileText,
  Smartphone,
  Plane,
  Sprout,
  GraduationCap,
  ChevronRight,
  ArrowRight,
  IndianRupee,
  QrCode,
  Globe,
  ExternalLink,
  Home,
  Printer,
  Upload,
  Download
} from 'lucide-react';
import PendingPaymentDialog from './payment/page';

// --- Data Configuration ---
const centerInfo = {
  name: "Pradeep Singh Rajpoot",
  centerName: "Pradeep CSC & Digital Seva Kendra",
  cscId: "CSC-ID-XXXX-XXXX",
  location: "Main Market, Dharampura, Madhya Pradesh",
  phone: "+91 98765 43210",
  email: "pradeep.csc@example.com",
  workingHours: "Mon - Sat: 09:00 AM - 07:00 PM",
  sunday: "Closed",
  upiId: "pradeep@upi"
};

const services = [
  {
    title: "Aadhaar Services",
    description: "New enrollment, biometric updates, PVC card printing, and address changes.",
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600",
    badge: "Most Popular"
  },
  {
    title: "Banking (AEPS)",
    description: "Cash withdrawal, money transfer, balance enquiry, and zero balance account opening.",
    icon: Landmark,
    color: "bg-green-100 text-green-600",
    badge: "Instant"
  },
  {
    title: "Government IDs",
    description: "PAN Card (New/Correction), Voter ID, Passport Seva, and Ration Card.",
    icon: FileText,
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Utility Payments",
    description: "Electricity bills, water bills, mobile recharges, DTH, and FASTag.",
    icon: Smartphone,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Travel Booking",
    description: "IRCTC authorized train ticket booking, bus tickets, and flight reservations.",
    icon: Plane,
    color: "bg-red-100 text-red-600"
  },
  {
    title: "Insurance & Health",
    description: "Vehicle insurance (Bike/Car), Life Insurance, and Ayushman Bharat Card.",
    icon: Sprout,
    color: "bg-teal-100 text-teal-600"
  },
  {
    title: "Education & Skilling",
    description: "PMGDisha, computer course certifications, and university admission forms.",
    icon: GraduationCap,
    color: "bg-yellow-100 text-yellow-600"
  }
];

const upPortals = [
  { name: "e-District UP", url: "https://edistrict.up.gov.in", desc: "Caste, Income, Domicile Certs" },
  { name: "Bhulekh UP", url: "https://upbhulekh.gov.in", desc: "Land Records (Khatauni)" },
  { name: "Jansunwai (IGRS)", url: "https://jansunwai.up.nic.in", desc: "Register Grievance/Complaint" },
  { name: "UPPCL Electricity", url: "https://www.upenergy.in", desc: "Bill Pay & New Connection" },
  { name: "Ration Card UP", url: "https://fcs.up.gov.in", desc: "Ration Card List & Status" },
  { name: "Manav Sampada", url: "http://ehrms.upsdc.gov.in", desc: "Govt Employee Service Book" },
  { name: "UP Agriculture", url: "http://upagriculture.com", desc: "Farmer Registration & PM Kisan" },
  { name: "Bhu Naksha", url: "http://upbhunaksha.gov.in", desc: "View Land Maps Online" },
  { name: "Voter Service", url: "https://voters.eci.gov.in", desc: "Voter ID Apply & Download" },
  { name: "Labour Card", url: "https://uplabour.gov.in", desc: "Labour Registration & Schemes" },
  { name: "UP Scholarship", url: "https://scholarship.up.gov.in", desc: "Student Scholarship Status" },
  { name: "Parivahan UP", url: "https://parivahan.gov.in", desc: "Driving License & Vehicle Reg" },
];

const banks = {
  airtel: { name: "Airtel Payments Bank", color: "bg-red-600", text: "text-white", logoText: "airtel" },
  paytm: { name: "Paytm Payments Bank", color: "bg-blue-900", text: "text-white", logoText: "Paytm" },
  fino: { name: "Fino Payments Bank", color: "bg-purple-700", text: "text-white", logoText: "Fino" },
  ippb: { name: "India Post Payments Bank", color: "bg-slate-800", text: "text-white", logoText: "IPPB" },
  sbi: { name: "State Bank of India", color: "bg-blue-600", text: "text-white", logoText: "SBI" },
  bob: { name: "Bank of Baroda", color: "bg-orange-600", text: "text-white", logoText: "BoB" }
};

// --- Utilities ---

const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
  e.preventDefault();
  const element = document.getElementById(targetId.replace('#', ''));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const RevealOnScroll = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        } ${className}`}
    >
      {children}
    </div>
  );
};

// --- New Component: Next.js Style Loader ---
const NextLoader = ({ isLoading }: { isLoading: boolean }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setProgress(0);
      // Start fast
      timer = setTimeout(() => {
        setProgress(30);
        // Then slow down to simulate loading
        setTimeout(() => setProgress(70), 200);
        setTimeout(() => setProgress(85), 500);
      }, 50);
    } else {
      // Complete the bar
      setProgress(100);
      // Reset after animation
      timer = setTimeout(() => setProgress(0), 400);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="fixed top-0 left-0 w-full z-100">
      <div
        className="h-1 bg-blue-600 shadow-[0_0_10px_#2563eb,0_0_5px_#2563eb] transition-all ease-out duration-300"
        style={{
          width: `${progress}%`,
          opacity: progress > 0 ? 1 : 0
        }}
      />
    </div>
  );
};

// --- Components ---

const PaymentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
 

  return (
   <PendingPaymentDialog/>
  );
};

const Navbar = ({ onOpenPayment, currentPage, onNavigate }: { onOpenPayment: () => void; currentPage: string; onNavigate: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string): void => {
    e.preventDefault();
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(targetId.replace('#', ''));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    } else {
      handleScroll(e, targetId);
    }
  };

  return (
    <nav className="bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm sticky top-0 z-50 supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              CSC
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-none">Digital Seva</span>
              <span className="text-xs text-blue-600 font-bold tracking-wider mt-1">COMMON SERVICE CENTER</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className={`${currentPage === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} font-medium transition`}>Home</button>
            <a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="text-gray-600 hover:text-blue-600 font-medium transition">Services</a>
            <button onClick={() => onNavigate('portals')} className={`${currentPage === 'portals' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} font-medium transition flex items-center gap-1`}>
              <Globe size={18} /> Govt Portals
            </button>
            <button onClick={() => onNavigate('passbook')} className={`${currentPage === 'passbook' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'} font-medium transition flex items-center gap-1`}>
              <Printer size={18} /> Passbook
            </button>

            <div className="h-6 w-px bg-gray-300/50 mx-2"></div>

            <button
              onClick={onOpenPayment}
              className="flex items-center gap-2 text-green-700 font-bold hover:bg-green-50/80 px-3 py-2 rounded-lg transition"
            >
              <IndianRupee size={18} /> Pay Online
            </button>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30">
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => { setIsOpen(false); onNavigate('home'); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Home</button>
            <button onClick={() => { setIsOpen(false); onNavigate('portals'); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Govt Portals (UP)</button>
            <button onClick={() => { setIsOpen(false); onNavigate('passbook'); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Passbook Generator</button>
            <button
              onClick={() => { setIsOpen(false); onOpenPayment(); }}
              className="w-full text-left flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-green-700 hover:bg-green-50"
            >
              <IndianRupee size={18} /> Pay Online
            </button>
            <a href="#contact" onClick={(e) => { setIsOpen(false); handleNavClick(e, '#contact'); }} className="block px-3 py-3 rounded-md text-base font-medium bg-blue-50 text-blue-700 mt-4">Contact Now</a>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Views ---

const HomeView = ({ onOpenPayment }: { onOpenPayment: () => void }) => (
  <>
    <section id="home" className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-blue-100">Authorized Digital Seva Kendra</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Government Services <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Made Simple
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <p className="text-lg text-blue-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong>{centerInfo.centerName}</strong>. Your trusted local partner for Aadhaar, Banking, Pan Cards, and over 100+ digital services right in your neighborhood.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={onOpenPayment} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                  <IndianRupee size={20} /> Pay Online
                </button>
                <a href="#services" onClick={(e) => handleScroll(e, '#services')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-lg font-bold transition backdrop-blur-sm">
                  Our Services
                </a>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div className="pt-8 border-t border-white/10 flex flex-wrap gap-8 justify-center lg:justify-start text-sm font-medium text-blue-200">
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Licensed VLE</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Secure & Fast</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Trusted by 1000+ Locals</div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:block relative">
            <RevealOnScroll delay={500} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-30 blur-2xl animate-pulse"></div>
              <div className="relative bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-slate-400 text-sm">csc.gov.in Portal Access</div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-slate-700/50 p-4 rounded-lg h-32"></div>
                    <div className="bg-slate-700/50 p-4 rounded-lg h-32"></div>
                    <div className="bg-slate-700/50 p-4 rounded-lg h-32"></div>
                    <div className="bg-slate-700/50 p-4 rounded-lg h-32"></div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>

    {/* Services Grid Section */}
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg">
              We provide a comprehensive range of G2C (Government to Citizen) and B2C services.
              Get your work done quickly, securely, and correctly.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <RevealOnScroll key={index} delay={index * 100}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden h-full">
                {service.badge && (
                  <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {service.badge}
                  </div>
                )}
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}>
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">{service.description}</p>
                <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition text-sm mt-auto">
                  Enquire Now <ChevronRight size={16} />
                </a>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>

    {/* About VLE Brief */}
    <section id="about" className="py-20 bg-blue-50 border-y border-blue-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <RevealOnScroll>
          <h2 className="text-3xl font-bold mb-8">Why Choose Pradeep CSC?</h2>
        </RevealOnScroll>
        <div className="grid md:grid-cols-3 gap-8">
          <RevealOnScroll delay={100} className="h-full">
            <div className="bg-white p-8 rounded-xl shadow-sm h-full">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Authorized VLE</h3>
              <p className="text-gray-600">Officially registered Village Level Entrepreneur with valid CSC ID.</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200} className="h-full">
            <div className="bg-white p-8 rounded-xl shadow-sm h-full">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Smartphone size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Digital Payments</h3>
              <p className="text-gray-600">We accept UPI, AEPS, and Cards. Fully digital and transparent receipts.</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300} className="h-full">
            <div className="bg-white p-8 rounded-xl shadow-sm h-full">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Quick Service</h3>
              <p className="text-gray-600">Minimal waiting time. We value your time and ensure fast processing.</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  </>
);

const PortalsPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-slate-50 animate-in slide-in-from-right duration-300">
    {/* Page Header with UP Banner */}
    <div className="relative bg-blue-900 text-white py-16 overflow-hidden">
      {/* Background Image - Vidhan Bhavan Lucknow (Iconic UP Govt Building) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Vidhan_Bhavan_Lucknow_1.jpg"
          alt="Uttar Pradesh Vidhan Bhavan"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center text-blue-100 hover:text-white mb-6 transition group">
          <ArrowRight className="rotate-180 mr-2 group-hover:-translate-x-1 transition" size={20} /> Back to Home
        </button>
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Seal_of_Uttar_Pradesh.svg"
            alt="UP Seal"
            className="w-16 h-16 drop-shadow-lg"
          />
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white tracking-tight">Uttar Pradesh</h1>
            <p className="text-xl text-blue-100 font-medium">Government Services Portal</p>
          </div>
        </div>
        <p className="text-blue-100 max-w-2xl text-lg">
          One-stop access to e-District, Bhulekh, Ration Card, and other essential citizen services.
        </p>
      </div>
    </div>

    {/* Portals Grid */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {upPortals.map((portal, index) => (
          <a
            key={index}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Globe size={20} />
              </div>
              <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500 transition" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition">{portal.name}</h3>
            <p className="text-gray-600 text-sm mb-4 flex-grow">{portal.desc}</p>
            <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded truncate">
              {portal.url.replace('https://', '')}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-xl p-8 border border-gray-200 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Need help with these portals?</h3>
        <p className="text-gray-600 mb-6">
          Most of these services require technical knowledge, Hindi typing, or biometric authentication.
          Visit our center for hassle-free processing.
        </p>
        <button onClick={onBack} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Visit {centerInfo.centerName}
        </button>
      </div>
    </div>
  </div>
);

const PassbookGenerator = ({ onBack }: { onBack: () => void }) => {
  const [selectedBank, setSelectedBank] = useState<keyof typeof banks>('airtel');
  const [details, setDetails] = useState({
    name: 'Pradeep Singh',
    fatherName: 'Rajendra Singh',
    accountNo: '9876543210',
    ifsc: 'AIRP0000001',
    mobile: '9876543210',
    address: 'Dharampura, Madhya Pradesh',
    cif: '12345678',
    dob: '01/01/1990'
  });
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentBank = banks[selectedBank];

  return (
    <div className="min-h-screen bg-slate-100 pb-12 animate-in slide-in-from-right duration-300">
      {/* Header - Hidden on Print */}
      <div className="bg-blue-700 text-white py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="hover:bg-blue-600 p-2 rounded-full transition"><ArrowRight className="rotate-180" /></button>
            <div>
              <h1 className="text-2xl font-bold">Passbook Generator</h1>
              <p className="text-blue-200 text-sm">Create printable passbooks for customers</p>
            </div>
          </div>
          <button onClick={handlePrint} className="bg-white text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-50 transition">
            <Printer size={18} /> Print Passbook
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Editor Form - Hidden on Print */}
        <div className="bg-white p-6 rounded-xl shadow-sm h-fit print:hidden">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Customer Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value as keyof typeof banks)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(banks).map(([key, bank]) => (
                  <option key={key} value={key}>{bank.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name</label>
                <input type="text" value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Father's Name</label>
                <input type="text" value={details.fatherName} onChange={e => setDetails({ ...details, fatherName: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Account No.</label>
                <input type="text" value={details.accountNo} onChange={e => setDetails({ ...details, accountNo: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">IFSC Code</label>
                <input type="text" value={details.ifsc} onChange={e => setDetails({ ...details, ifsc: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Mobile No.</label>
                <input type="text" value={details.mobile} onChange={e => setDetails({ ...details, mobile: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CIF / Cust ID</label>
                <input type="text" value={details.cif} onChange={e => setDetails({ ...details, cif: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
              <textarea value={details.address} onChange={e => setDetails({ ...details, address: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm h-16"></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Customer Photo</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition">
                  <Upload size={16} /> Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {image && <span className="text-xs text-green-600 font-bold">Photo Uploaded</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Area - Visible on Print */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="mb-4 text-sm text-gray-500 print:hidden flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" /> Live Preview (Standardized Format)
          </div>

          {/* THE PASSBOOK CARD */}
          <div className="w-[800px] h-[480px] bg-white border-2 border-gray-300 shadow-xl print:shadow-none print:border-0 print:w-full print:h-auto overflow-hidden relative">

            {/* Header */}
            <div className={`${currentBank.color} ${currentBank.text} p-6 flex justify-between items-center h-24`}>
              <div className="flex items-center gap-4">
                {/* Fallback Logo Placeholder */}
                <div className="bg-white/20 p-2 rounded-lg">
                  <Landmark size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold uppercase tracking-wide">{currentBank.logoText}</h1>
                  <p className="text-sm opacity-90 uppercase tracking-widest text-xs">Payments Bank</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">CSP Code: {centerInfo.cscId}</p>
                <p className="text-xs opacity-70">{centerInfo.location}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 flex gap-8">
              {/* Photo Section */}
              <div className="w-32 flex flex-col items-center gap-2">
                <div className="w-32 h-40 border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {image ? (
                    <img src={image} alt="Customer" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center px-2">Paste Photo Here</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 text-center">Authorized Signatory</p>
              </div>

              {/* Details Table */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 uppercase">Identity Card / Mini Passbook</h2>

                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 w-1/3 font-medium">Account Holder Name</td>
                      <td className="py-2 text-gray-900 font-bold uppercase">{details.name || "_________________"}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 font-medium">Account Number</td>
                      <td className="py-2 text-gray-900 font-bold tracking-wider text-lg">{details.accountNo || "_________________"}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 font-medium">IFSC Code</td>
                      <td className="py-2 text-gray-900 font-bold">{details.ifsc || "_________________"}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 font-medium">Mobile Number</td>
                      <td className="py-2 text-gray-900 font-bold">{details.mobile || "_________________"}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 font-medium">Customer ID (CIF)</td>
                      <td className="py-2 text-gray-900 font-bold">{details.cif || "_________________"}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 font-medium">Address</td>
                      <td className="py-2 text-gray-900 text-xs max-w-xs">{details.address || "_________________"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 w-full bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-end">
              <div className="text-xs text-gray-400">
                <p>Generated at: {centerInfo.centerName}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-32 border-b border-gray-400 mb-1"></div>
                <p className="text-xs font-bold text-gray-600 uppercase">Bank Official Seal & Sign</p>
              </div>
            </div>

            {/* Decorative Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <Landmark size={300} />
            </div>
          </div>

          <p className="mt-8 text-xs text-gray-400 text-center max-w-lg print:hidden">
            Note: This is a generated mini-passbook for CSP reference. Ensure all details match official bank records before issuing to customer.
          </p>
        </div>
      </div>

      {/* Print Styles Injection */}
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .w-\\[800px\\] { 
             visibility: visible; 
             position: absolute; 
             left: 0; 
             top: 0; 
             width: 100%; 
             border: none; 
             box-shadow: none;
             -webkit-print-color-adjust: exact; 
             print-color-adjust: exact;
          }
          .w-\\[800px\\] * { visibility: visible; }
        }
      `}</style>
    </div>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', service: 'Aadhaar' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate submission
    setTimeout(() => {
      alert("Thank you! Pradeep will contact you shortly.");
      setSubmitted(false);
      setFormData({ name: '', phone: '', service: 'Aadhaar' });
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Center</h2>
            <p className="text-gray-600">We are here to help you with all your digital needs</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-2">
              {/* Contact Info */}
              <div className="bg-blue-600 p-10 lg:p-16 text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  <p className="text-blue-100 mb-12">
                    Have a question about a government scheme or need urgent service?
                    Reach out to us directly or visit our center.
                  </p>

                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-blue-200 text-sm font-medium mb-1">Phone</p>
                        <p className="text-lg font-semibold">{centerInfo.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-blue-200 text-sm font-medium mb-1">Address</p>
                        <p className="text-lg font-semibold max-w-xs">{centerInfo.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-blue-200 text-sm font-medium mb-1">Working Hours</p>
                        <p className="text-lg font-semibold">{centerInfo.workingHours}</p>
                        <p className="text-red-300 text-sm mt-1">{centerInfo.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/20">
                  <p className="text-sm text-blue-200">Managed by: <span className="text-white font-bold text-lg block">{centerInfo.name}</span></p>
                </div>
              </div>

              {/* Form */}
              <div className="p-10 lg:p-16 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send an Inquiry</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Required</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                      <option>Aadhaar Service</option>
                      <option>Banking / AEPS</option>
                      <option>PAN Card Application</option>
                      <option>Rail/Flight Booking</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitted}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitted ? 'Sending...' : 'Request Call Back'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

// --- Main App Component ---

export default function App() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'portals', 'passbook'
  const [isLoading, setIsLoading] = useState(false);

  // New navigation handler that triggers loader
  const handleNavigation = (page: string): void => {
    if (page === currentPage) return;

    setIsLoading(true);

    // Simulate network latency (0.8s) typical of SPA transitions
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
      <NextLoader isLoading={isLoading} />
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />

      <Navbar
        onOpenPayment={() => setIsPaymentOpen(true)}
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />

      {currentPage === 'home' ? (
        <>
          <HomeView onOpenPayment={() => setIsPaymentOpen(true)} />
          <ContactSection />
        </>
      ) : currentPage === 'portals' ? (
        <PortalsPage onBack={() => handleNavigation('home')} />
      ) : (
        <PassbookGenerator onBack={() => handleNavigation('home')} />
      )}

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">CSC</div>
              <span className="text-white font-bold text-lg">Pradeep CSC</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Empowering rural citizens with digital services. We are committed to bringing government schemes to your doorstep.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleNavigation('home')} className="hover:text-blue-400 transition text-left">Home</button></li>
              <li><button onClick={() => handleNavigation('portals')} className="hover:text-blue-400 transition text-left">Govt Portals</button></li>
              <li><a href="#contact" onClick={(e) => { handleNavigation('home'); setTimeout(() => { const element = document.getElementById('contact'); if (element) element.scrollIntoView(); }, 900); }} className="hover:text-blue-400 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center text-sm">
          <p>© {new Date().getFullYear()} {centerInfo.centerName}. All rights reserved.</p>
          <p className="mt-2 text-slate-600">Designed for Digital India Initiative</p>
        </div>
      </footer>
    </div>
  );
}