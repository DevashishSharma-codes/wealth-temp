import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import wealthWisdomLogo from '../assets/wealth-wisdom-logo.png';
import client from '../config/api';
import Navbar from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { getDynamicServices, getDynamicTestimonials } from '../api/publicService';

// Custom SVG Icons for Bento Feature Cards
const ReadinessIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RoadmapIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const CorpusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InvestmentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ProtectionIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PlanningIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 022 2h2a2 2 0 022-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const DEFAULT_ICONS = [ReadinessIcon, RoadmapIcon, InvestmentIcon, ProtectionIcon, CorpusIcon, PlanningIcon];

// Dynamic Morphing Dreams & Goals for Title Animation (No Emojis)
const DREAMS_LIST = [
  {
    text: "Early Retirement",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#BAE0FF] shrink-0 ml-2 drop-shadow-xs" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        {/* Sun & Beach Umbrella / Palm Icon for Retirement */}
        <circle cx="12" cy="7" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v11m-7 0h14M4 17c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0" />
      </svg>
    )
  },
  {
    text: "Child's Higher Education",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#BAE0FF] shrink-0 ml-2 drop-shadow-xs" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        {/* Mortarboard Graduation Cap Icon */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 8l10 5 10-5-10-5zm0 9.5l-6-3V15c0 1.657 2.686 3 6 3s6-1.343 6-3v-5.5l-6 3zM22 10v6" />
      </svg>
    )
  },
  {
    text: "Buying a Dream Home",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#BAE0FF] shrink-0 ml-2 drop-shadow-xs" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        {/* House / Home Icon */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
      </svg>
    )
  },
  {
    text: "World Travel & Vacation",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#BAE0FF] shrink-0 ml-2 drop-shadow-xs" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        {/* Airplane Travel Icon */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7.424M12 21a9 9 0 100-18 9 9 0 000 18z" />
      </svg>
    )
  },
  {
    text: "Wealth & Legacy Creation",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#BAE0FF] shrink-0 ml-2 drop-shadow-xs" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        {/* Trending Growth Chart Icon */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  }
];

const ASSESSMENT_FLOW_STEPS = [
  { step: 1, title: "Family & Profile", desc: "Age, Income & EPF/NPS" },
  { step: 2, title: "Target Milestones", desc: "Set Goals & Timelines" },
  { step: 3, title: "SIP Math Model", desc: "Corpus & Inflation Math" },
  { step: 4, title: "Instant PDF Report", desc: "Line-by-line Action Plan" }
];

// Reusable bento card shadow classes — inset (inner) shadow for the "bubbly" pressed-in neumorphic look.
const bentoCardShadow =
  "bg-white/90 hover:bg-[#F2F7FD] scale-100 hover:scale-[0.985] " +
  "shadow-[2px_2px_8px_rgba(180,205,240,0.35),inset_4px_4px_10px_rgba(180,205,240,0.3),inset_-4px_-4px_10px_rgba(255,255,255,0.95)]";

// Static Bento Column Span calculator for clean, non-animating Bento grid
const computeStaticBentoSpan = (idx, total) => {
  if (total <= 3) return "lg:col-span-4 md:col-span-6";
  const mod = idx % 6;
  if (mod === 0) return "lg:col-span-8 md:col-span-12";
  if (mod === 1) return "lg:col-span-4 md:col-span-6";
  if (mod === 2) return "lg:col-span-4 md:col-span-6";
  if (mod === 3) return "lg:col-span-4 md:col-span-6";
  if (mod === 4) return "lg:col-span-4 md:col-span-6";
  return "lg:col-span-12 md:col-span-12";
};

const DEFAULT_SERVICES = [
  {
    id: "srv-1",
    title: "Financial Health Check",
    description: "Get a comprehensive assessment of your financial health by analyzing your income, expenses, savings, investments, liabilities, and overall financial preparedness."
  },
  {
    id: "srv-2",
    title: "Goal-Based Financial Planning",
    description: "Plan for your life goals such as buying a home, children's education, travel, retirement, and wealth creation with a personalized financial roadmap."
  },
  {
    id: "srv-3",
    title: "Investment & Portfolio Review",
    description: "Evaluate your existing investments and receive recommendations to build a well-diversified portfolio aligned with your goals and risk profile."
  },
  {
    id: "srv-4",
    title: "Insurance & Risk Management",
    description: "Identify protection gaps and ensure adequate coverage through Term Insurance, Health Insurance, Personal Accident Cover, and Emergency Planning."
  },
  {
    id: "srv-5",
    title: "Retirement Planning",
    description: "Estimate the retirement corpus required, assess your retirement readiness, and create a strategy for a financially independent retirement."
  },
  {
    id: "srv-6",
    title: "Estate Planning (Will & Trust)",
    description: "Secure your family's future with proper estate planning, including Wills, Trusts, nominations, and seamless wealth transfer across generations."
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "t-1",
    name: "Vikram & Sunita Sharma",
    role: "Senior Enterprise Architect, Bengaluru",
    text: "The DIY assessment opened our eyes! Within 10 minutes we had exact SIP requirements for our daughter's overseas education and our early retirement targets.",
    rating: 5
  },
  {
    id: "t-2",
    name: "Rajesh K. Mehta",
    role: "VP of Product Engineering, Mumbai",
    text: "Clear, transparent, and completely conflict-free advice. The structured roadmap helped me streamline my scattered mutual funds and insurance policies effortlessly.",
    rating: 5
  },
  {
    id: "t-3",
    name: "Ananya Roy & Family",
    role: "Medical Practitioner & Clinical Lead, Delhi",
    text: "Outstanding financial clarity. The PDF report provided line-by-line calculations that gave my spouse and me total confidence in our 15-year financial plan.",
    rating: 5
  }
];

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic state for Services & Testimonials (fetched from admin APIs)
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  // Bento Spotlight & Shape-Morphing State
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Animated Cursor Dreams & DIY Assessment Flow State
  const [currentDreamIdx, setCurrentDreamIdx] = useState(0);

  // Cycle morphing title goals
  useEffect(() => {
    const dreamTimer = setInterval(() => {
      setCurrentDreamIdx((prev) => (prev + 1) % DREAMS_LIST.length);
    }, 2800);
    return () => clearInterval(dreamTimer);
  }, []);

  // Automated spotlight cycle every 3.5 seconds
  useEffect(() => {
    if (isPaused || services.length === 0) return;
    const timer = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % services.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, services.length]);

  useEffect(() => {
    let isMounted = true;
    const loadAdminDynamicContent = async () => {
      try {
        const [dynServices, dynTestimonials] = await Promise.all([
          getDynamicServices(),
          getDynamicTestimonials()
        ]);

        if (isMounted) {
          if (Array.isArray(dynServices) && dynServices.length > 0) {
            setServices(dynServices);
          }
          if (Array.isArray(dynTestimonials) && dynTestimonials.length > 0) {
            setTestimonials(dynTestimonials);
          }
        }
      } catch (err) {
        console.warn("[Home] Error loading dynamic content from admin API:", err);
      }
    };

    loadAdminDynamicContent();
    return () => { isMounted = false; };
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await client.post('/contact/get-in-touch', {
        name: contactName,
        mobile: contactMobile,
        email: contactEmail,
        message: contactMessage
      });
      alert("Thank you! Our expert financial advisor will get in touch with you shortly.");
      setContactName('');
      setContactMobile('');
      setContactEmail('');
      setContactMessage('');
      setIsContactModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-[#1C1B1A] selection:bg-[#2459D2]/20 selection:text-[#183B91] relative overflow-x-clip bg-white"
      style={{
        background: 'linear-gradient(180deg, rgba(119, 177, 236, 0.22) 0%, rgba(180, 218, 252, 0.10) 10%, rgba(240, 248, 255, 0.04) 20%, #FFFFFF 32%, #FFFFFF 85%, #F4F8FD 100%)'
      }}
    >
      {/* Soft atmospheric white clouds & subtle sunlight highlights */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-white/70 rounded-full blur-[110px] pointer-events-none -z-0" />
      <div className="absolute top-[80px] left-[-150px] w-[600px] h-[400px] bg-[#77B1EC]/12 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-[120px] right-[-100px] w-[650px] h-[450px] bg-[#77B1EC]/10 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-[50%] right-[10%] w-[700px] h-[450px] bg-[#77B1EC]/8 rounded-full blur-[140px] pointer-events-none -z-0" />

      {/* Sticky Header Container (Banner + Glassmorphic Navbar) */}
      <div className="sticky top-0 z-50 w-full">
        {/* 1. Top Promotional Banner */}
        <div className="bg-white/80 backdrop-blur-md border-b border-blue-100/60 py-1.5 px-4 text-center shadow-2xs">
          <p className="text-xs sm:text-sm text-[#0F3598] font-semibold tracking-wide">
            Take charge of your future with a personalized goal-based financial plan &rarr;{' '}
            <Link to="/assessment" className="underline hover:text-[#2459D2] font-bold transition-colors">
              Start your assessment today!
            </Link>
          </p>
        </div>

        {/* 2. Beautiful Responsive Navbar */}
        <Navbar onOpenContact={() => setIsContactModalOpen(true)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10">

        {/* Hero Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8 sm:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-12 space-y-5">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-bold text-[#0F172A] leading-[1.14] tracking-[-0.035em]">
                Turn Your{" "}
                <span className="relative inline-flex items-center px-4 sm:px-6 py-1 sm:py-1.5 my-1 rounded-full glass-morphism-btn !py-1 sm:!py-1.5 !px-4 sm:!px-6 select-none align-middle shadow-md">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentDreamIdx}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="inline-flex items-center gap-2 sm:gap-3 font-bold text-white tracking-[-0.035em] text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] leading-[1.14]"
                    >
                      <span className="text-white drop-shadow-xs">{DREAMS_LIST[currentDreamIdx].text}</span>
                      {DREAMS_LIST[currentDreamIdx].icon}
                    </motion.span>
                  </AnimatePresence>
                </span>{" "}
                into Achievable Financial Goals
              </h1>

              <p className="text-slate-600 text-base sm:text-lg lg:text-[19px] leading-[1.65] font-normal max-w-3xl tracking-[-0.01em]">
                Achieve your aspirations with a flexible framework built for multiple goals, different timelines, and smarter planning. Discover the steps required to turn your dreams into reality.
              </p>

              {/* Hero CTA Button Container with Apple-Style Pill Button */}
              <div className="pt-3 flex flex-wrap items-center gap-4 relative inline-block">
                <Link
                  to="/assessment"
                  className="glass-morphism-btn !rounded-full px-9 py-4 text-base font-semibold flex items-center gap-3 cursor-pointer z-10 shadow-lg shadow-[#2459D2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span className="tracking-tight">Get Started</span>
                  <span className="text-lg font-bold">&rarr;</span>
                </Link>

                {/* Gliding Mouse Cursor Pointer Arrow hovering & clicking around Start button */}
                <motion.div
                  animate={{
                    x: [35, -15, 10, -5, 35],
                    y: [25, 5, -10, 0, 25],
                    scale: [1, 0.9, 1.1, 1]
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-4 right-2 z-30 pointer-events-none text-[#2459D2]"
                >
                  <svg className="w-7 h-7 drop-shadow-md fill-[#2459D2] stroke-white stroke-2" viewBox="0 0 24 24">
                    <path d="M3 3l7 18 3-7 7-3L3 3z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#6EACFF] animate-ping opacity-85" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 overflow-hidden rounded-3xl glass-morphism-card p-2 group relative shadow-md">
              <img src="/assets/hero_left.png" alt="Advisor with couple" className="w-full h-[260px] sm:h-[300px] lg:h-[340px] xl:h-[370px] object-cover rounded-2xl group-hover:scale-102 transition-transform duration-700 ease-out" />
            </div>
            <div className="md:col-span-5 overflow-hidden rounded-3xl glass-morphism-card p-2 group relative shadow-md">
              <img src="/assets/f0f7eaffd28bff647ab71073c5e804a9bb36aec8.jpg" alt="Couple with laptop" className="w-full h-[260px] sm:h-[300px] lg:h-[340px] xl:h-[370px] object-cover rounded-2xl group-hover:scale-102 transition-transform duration-700 ease-out" />
            </div>
          </div>
        </section>

        {/* Trust Bar / Mini Testimonial Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="glass-morphism-card !rounded-3xl px-6 py-6 sm:px-10 sm:py-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-4 justify-center lg:justify-start text-center lg:text-left">
              <div className="flex -space-x-3 items-center shrink-0">
                <img
                  className="inline-block w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Client Avatar 1"
                />
                <img
                  className="inline-block w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Client Avatar 2"
                />
                <img
                  className="inline-block w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Client Avatar 3"
                />
                <span className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2459D2] ring-2 ring-white text-[11px] sm:text-xs font-bold text-white shadow-sm">
                  +5k
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#2459D2] uppercase tracking-wider block">PROVEN TRACK RECORD</span>
                <p className="font-heading font-semibold text-[#0F172A] text-sm sm:text-[16px] leading-snug">
                  Know exactly where you stand today with 5,000+ satisfied families
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-8 gap-y-3 lg:border-l lg:border-slate-200 lg:pl-8">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2459D2] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>5-7 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2459D2] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2459D2] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Personalized Report</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- STATIC BENTO GRID SERVICES WITH HOVER SPOTLIGHT ---------------- */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 scroll-mt-20">
          
          {/* Section Heading Banner */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#2459D2]/10 border border-[#2459D2]/20 text-[#2459D2] text-[11px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
              <span>✦ Tailored Wealth Solutions</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0F172A] tracking-[-0.03em] leading-tight">
              Our Comprehensive Financial Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Explore our structured wealth management and financial planning disciplines.
            </p>
          </div>

          {/* Static Bento Grid with Fully Glassy Morphism Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            {services.map((srv, idx) => {
              const IconComp = DEFAULT_ICONS[idx % DEFAULT_ICONS.length];
              const spanClass = computeStaticBentoSpan(idx, services.length);

              return (
                <div
                  key={srv.id || idx}
                  onClick={() => setIsContactModalOpen(true)}
                  className={`${spanClass} glass-morphism-card !rounded-3xl p-6 flex flex-col justify-between gap-4 group relative cursor-pointer transform hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200/60`}
                >
                  {/* Glossy Beam Shimmer on Card Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-white text-[#2459D2] border border-slate-200/80 shadow-xs group-hover:bg-[#2459D2] group-hover:text-white group-hover:border-[#2459D2] transition-all duration-300">
                        <IconComp />
                      </div>

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2459D2] bg-slate-100/90 border border-slate-200/80 px-3 py-1 rounded-full shadow-2xs">
                        Advisory
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-lg text-[#0F172A] group-hover:text-[#2459D2] transition-colors leading-snug tracking-tight">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal group-hover:text-slate-900 transition-colors">
                      {srv.description}
                    </p>
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between relative z-10">
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-[#2459D2] transition-colors">
                      Explore Service
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsContactModalOpen(true);
                      }}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 text-[#2459D2] group-hover:bg-[#2459D2] group-hover:text-white group-hover:border-[#2459D2] flex items-center justify-center font-bold text-xs shadow-2xs group-hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Goal Section Banner with Frosted Sky Glass */}
        <section id="assessment" className="bg-white/50 backdrop-blur-xl border-y border-slate-200/70 pt-16 pb-16 sm:pt-20 sm:pb-20 text-center scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#2459D2]/10 border border-[#2459D2]/20 text-[#2459D2] text-[11px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
              <span>Life Milestones</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] leading-tight tracking-[-0.03em]">
              A Financial Plan Built Around Your Life Milestones
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Understand whether you're on track to achieve all of your life goals and the future you envision. Our assessment helps uncover your funding requirements, target timelines, investment needs, and potential planning gaps, all in just a few minutes.
            </p>
            <div className="pt-3 flex flex-col items-center gap-3">
              <Link
                to="/assessment"
                className="glass-morphism-btn !rounded-full px-9 py-4 text-base font-semibold cursor-pointer shadow-lg shadow-[#2459D2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start DIY Assessment &rarr;
              </Link>
              <p className="text-xs font-medium text-slate-500 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2459D2]" />
                100% Self-Guided DIY Financial Assessment • Instant Report
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- ABOUT US SECTION ---------------- */}
        <section id="about" className="bg-white/40 backdrop-blur-md border-y border-slate-200/60 py-16 sm:py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#2459D2]/10 border border-[#2459D2]/20 text-[#2459D2] text-[11px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
                  <span>About Wealth Wisdom</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0F172A] leading-tight tracking-[-0.03em]">
                  Your Trusted Partner in Independent Financial Freedom
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                  Wealth Wisdom was founded with a singular mission: to democratize institutional-grade financial planning for Indian families and working professionals. We blend advanced quantitative models with personalized advisory to deliver clarity, confidence, and real wealth creation.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-3xl glass-morphism-card space-y-1 shadow-sm border border-slate-200/60">
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-[#2459D2] tracking-tight">₹500+ Cr</span>
                    <span className="block text-xs font-medium text-slate-500">Assets Under Guidance</span>
                  </div>
                  <div className="p-5 rounded-3xl glass-morphism-card space-y-1 shadow-sm border border-slate-200/60">
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-[#2459D2] tracking-tight">5,000+</span>
                    <span className="block text-xs font-medium text-slate-500">Satisfied Clients</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 overflow-hidden rounded-3xl glass-morphism-card p-2 shadow-md">
                <img
                  src="/assets/8dba846db002417c3fb9cb45eb6d1f275241dce8.png"
                  alt="Wealth Wisdom Advisors in consultation"
                  className="w-full h-full object-cover rounded-2xl min-h-[320px] hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- DYNAMIC ADMIN TESTIMONIALS (GLASS-MORPHISM CARDS) ---------------- */}
        <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#2459D2]/10 border border-[#2459D2]/20 text-[#2459D2] text-[11px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider select-none">
              <span>Client Voices & Reviews</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0F172A] tracking-[-0.03em] leading-tight">
              Trusted by 5,000+ Families Across India
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Read how Wealth Wisdom helped professionals and families transform financial ambiguity into structured, achievable life goals.
            </p>
          </div>

          <div className={`grid gap-6 ${
            testimonials.length === 1
              ? "grid-cols-1 max-w-xl mx-auto"
              : testimonials.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
              : "grid-cols-1 md:grid-cols-3"
          }`}>
            {testimonials.map((t, idx) => (
              <div
                key={t.id || idx}
                className="glass-morphism-card !rounded-3xl p-7 flex flex-col justify-between cursor-pointer group hover:scale-[0.985] shadow-sm hover:shadow-md border border-slate-200/60 transition-all duration-300"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#2459D2]">
                      {Array.from({ length: t.rating || 5 }).map((_, starIdx) => (
                        <svg key={starIdx} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-2xl font-serif text-[#2459D2]/40 group-hover:text-[#2459D2] transition-colors">“</span>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic font-normal">
                    "{t.text || t.message || t.testimonial}"
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-200/60 flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2459D2] to-[#6EACFF] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs overflow-hidden">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      (t.name || "C").charAt(0)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] leading-snug break-words">
                      {t.name || "Satisfied Client"}
                    </h4>
                    {t.role && t.role !== "Verified Investor" && (
                      <span className="text-[11px] font-normal text-slate-500 block leading-snug break-words">
                        {t.role}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-[#2459D2] block mt-0.5">
                      ✓ Verified Client
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- DARK CONSULTATION BLOCK (DEEP GLASS-MORPHIC NAVY) ---------------- */}
        <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 scroll-mt-20">
          <div className="glass-morphism-card-blue !rounded-3xl p-7 sm:p-11 flex flex-col gap-10 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#6EACFF]/25 rounded-full blur-[90px] pointer-events-none" />
            <div className="w-full overflow-hidden rounded-2xl max-h-[360px] border border-white/20">
              <img src="/assets/8dba846db002417c3fb9cb45eb6d1f275241dce8.png" alt="Office meeting" className="w-full h-full object-cover object-center" />
            </div>
            <div className="flex flex-col gap-8 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-[#6EACFF]/25 text-[#BAE0FF] text-[11px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider select-none border border-[#6EACFF]/40">
                  <span>Advisory Excellence</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-[-0.03em] leading-tight">
                  Why Wealth Wisdom is the Right Choice for You
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="flex flex-col gap-2">
                  <h4 className="font-heading text-base sm:text-lg font-semibold text-white">Personalized to Your Life Goals</h4>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-light">Tailored around your family, lifestyle, milestone goals, and financial priorities.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-heading text-base sm:text-lg font-semibold text-white">Goal Readiness Audit</h4>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-light">Know the exact funding requirements, target timelines, and investments needed to hit every target.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-heading text-base sm:text-lg font-semibold text-white">Actionable Financial Roadmap</h4>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-light">Get clear recommendations to achieve your future goals with confidence.</p>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="glass-morphism-btn !rounded-full px-8 py-4 text-sm font-semibold cursor-pointer shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Book my free consultation &rarr;
                </button>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-4 rounded-full text-sm font-semibold border border-white/30 transition-all cursor-pointer backdrop-blur-md"
                >
                  Start DIY Assessment
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Component */}
      <Footer />

      {/* Get In Touch Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none">
          <div 
            className="absolute inset-0 bg-[#0B1528]/60 backdrop-blur-sm transition-opacity cursor-pointer" 
            onClick={() => setIsContactModalOpen(false)}
          />
          
          <div className="relative w-full max-w-lg glass-morphism-card !bg-white/95 rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden z-10 text-left max-h-[85vh] sm:max-h-[90vh] flex flex-col">
            <button 
              type="button"
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-white border border-blue-100 cursor-pointer z-20 shadow-2xs"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar rounded-2xl sm:rounded-[2rem]">
              <div className="p-6 sm:p-8 space-y-4">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="text-[11px] font-bold text-[#2459D2] tracking-wider uppercase mb-1">
                    GET EXPERT GUIDANCE FOR YOUR FINANCIAL FUTURE
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#0E2C7E] leading-tight mb-2">
                    Book Your Free Consultation
                  </h3>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#334155]">Your Name*</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-[#D5E5FA] bg-white focus:border-[#2459D2] focus:ring-2 focus:ring-[#2459D2]/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#334155]">Email address*</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-[#D5E5FA] bg-white focus:border-[#2459D2] focus:ring-2 focus:ring-[#2459D2]/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#334155]">Mobile Number*</label>
                    <div className="flex gap-2">
                      <div className="border border-[#D5E5FA] bg-white rounded-xl px-3 py-3 text-xs sm:text-sm font-semibold select-none shrink-0 flex items-center justify-center font-sans text-slate-600">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        value={contactMobile}
                        onChange={(e) => setContactMobile(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-[#D5E5FA] bg-white focus:border-[#2459D2] focus:ring-2 focus:ring-[#2459D2]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#334155]">Message</label>
                    <textarea
                      rows="3"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Enter your message (optional)"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl outline-none border border-[#D5E5FA] bg-white focus:border-[#2459D2] focus:ring-2 focus:ring-[#2459D2]/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full glass-morphism-btn py-3.5 font-bold text-xs sm:text-sm cursor-pointer mt-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Get My Complete Financial Roadmap ➔"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}