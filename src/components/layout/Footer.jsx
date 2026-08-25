import React, { useState, useEffect } from "react";

const WEALTH_GOALS = [
  {
    name: "Child Education",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2459D2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    name: "Retirement",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2459D2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: "Foreign Tour",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2459D2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7.5A2.5 2.5 0 0016.5 5h-.293a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 0012.379 2H12a10 10 0 00-8.945 1.935z" />
      </svg>
    ),
  },
  {
    name: "Dream Home",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2459D2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 011-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Child Marriage",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2459D2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    name: "Wealth Creation",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2459D2]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  }
];

export function Footer() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % WEALTH_GOALS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const currentGoal = WEALTH_GOALS[index];

  return (
    <footer className="w-full pt-10 sm:pt-14 pb-0 mt-auto overflow-hidden select-none bg-transparent flex flex-col items-center relative z-10">
      <div className="max-w-7xl mx-auto px-4 w-full text-center flex flex-col items-center gap-6">
        
        {/* Dynamic Goal Sentence Heading */}
        <h2 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#183B91] leading-tight tracking-tight flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-2">
          <span>Plan your</span>
          
          {/* Goal Pill Container */}
          <span className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-2xl sm:rounded-3xl bg-white/85 border border-[#D5E5FA] shadow-[inset_2px_2px_4px_rgba(180,205,240,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.95)] transition-all duration-500 shrink-0 h-10 sm:h-14 min-w-[160px] sm:min-w-[220px] justify-center align-middle relative overflow-hidden">
            <span 
              key={currentGoal.name} 
              className="inline-flex items-center gap-2 sm:gap-2.5 animate-fade-in-up transition-all duration-300"
            >
              {currentGoal.icon}
              <span className="text-sm sm:text-xl font-extrabold text-[#183B91] font-sans whitespace-nowrap">
                {currentGoal.name}
              </span>
            </span>
          </span>

          <span>with total confidence.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-medium text-[#64748B] max-w-lg mx-auto leading-relaxed -mt-2">
          Customized milestone assessment, inflation-adjusted projections, and expert guidance tailored to your life.
        </p>

        {/* GIANT STATEMENT BRANDING WITH FLOATING AVATARS & SHADCNBLOCKS FOOTER50 VERTICAL FADE */}
        <div className="w-full relative my-2 py-4 sm:py-8 flex items-center justify-center overflow-visible">
          
          {/* Avatar Badge 1 - Top Left */}
          <div className="absolute top-0 left-[2%] sm:left-[8%] z-20 hidden sm:flex items-center gap-2.5 bg-white/90 border border-[#D5E5FA] px-3.5 py-2 rounded-2xl shadow-[2px_2px_8px_rgba(180,205,240,0.35),inset_3px_3px_8px_rgba(180,205,240,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.95)]">
            <div className="relative">
              <svg className="w-8 h-8 rounded-xl bg-[#EBF4FE] border border-[#D5E5FA] p-1 shadow-[inset_2px_2px_4px_rgba(180,205,240,0.25),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#EBF4FE" />
                <circle cx="18" cy="13" r="5.5" fill="#2459D2" />
                <path d="M9 28C9 23.58 13.03 20 18 20C22.97 20 27 23.58 27 28" stroke="#183B91" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="13" y="11" width="4" height="3" rx="1" fill="#183B91" />
                <rect x="19" y="11" width="4" height="3" rx="1" fill="#183B91" />
                <line x1="17" y1="12" x2="19" y2="12" stroke="#183B91" strokeWidth="1.5" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-extrabold text-[#183B91] block leading-tight">Certified Advisor</span>
              <span className="text-[9px] font-semibold text-[#64748B] block">Online Guidance</span>
            </div>
          </div>

          {/* Avatar Badge 2 - Center Top Rating Stack */}
          <div className="absolute -top-3 sm:-top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#EBF4FE] border border-[#C3DAFE] px-4 py-1.5 rounded-full shadow-[2px_2px_8px_rgba(36,89,210,0.15),inset_3px_3px_8px_rgba(180,205,240,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.95)]">
            <div className="flex -space-x-2 overflow-hidden">
              <svg className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#6EACFF] p-0.5 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="4" fill="#183B91" />
                <path d="M5 19C5 15.68 8.13 13 12 13C15.87 13 19 15.68 19 19" fill="#183B91" />
              </svg>
              <svg className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#2459D2] p-0.5 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="4" fill="#FFFFFF" />
                <path d="M5 19C5 15.68 8.13 13 12 13C15.87 13 19 15.68 19 19" fill="#FFFFFF" />
              </svg>
              <svg className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#183B91] p-0.5 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="4" fill="#6EACFF" />
                <path d="M5 19C5 15.68 8.13 13 12 13C15.87 13 19 15.68 19 19" fill="#6EACFF" />
              </svg>
            </div>
            <span className="text-xs font-black text-[#2459D2] font-sans flex items-center gap-1">
              <span>★ 5.0</span>
              <span className="text-[#64748B] font-medium text-[10px]">(10k+ Families)</span>
            </span>
          </div>

          {/* Avatar Badge 3 - Top Right */}
          <div className="absolute top-2 right-[2%] sm:right-[8%] z-20 hidden sm:flex items-center gap-2.5 bg-white/90 border border-[#D5E5FA] px-3.5 py-2 rounded-2xl shadow-[2px_2px_8px_rgba(180,205,240,0.35),inset_3px_3px_8px_rgba(180,205,240,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.95)]">
            <svg className="w-8 h-8 rounded-xl bg-[#EBF4FE] border border-[#D5E5FA] p-1 shadow-[inset_2px_2px_4px_rgba(180,205,240,0.25),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#EBF4FE" />
              <circle cx="18" cy="13" r="5" fill="#183B91" />
              <path d="M8 29C8 23.5 12.5 20 18 20C23.5 20 28 23.5 28 29" fill="#2459D2" />
              <path d="M14 10L18 7L22 10" stroke="#6EACFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-left">
              <span className="text-[10px] font-extrabold text-[#183B91] block leading-tight">Certified MFD</span>
              <span className="text-[9px] font-semibold text-emerald-600 block">✓ Verified Partner</span>
            </div>
          </div>

          {/* MASSIVE STATEMENT TYPOGRAPHY WITH SHADCNBLOCKS FOOTER50 VERTICAL FADE */}
          <div className="w-full text-center pointer-events-none select-none overflow-hidden leading-none px-2">
            <h1 className="font-heading text-[12.5vw] sm:text-[13.5vw] font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-[#2459D2] via-[#6EACFF]/65 to-transparent text-transparent bg-clip-text inline-block transform translate-y-3 sm:translate-y-6 font-sans max-w-full">
              wealth wisdom
            </h1>
          </div>

        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm font-bold text-[#334155] pt-1">
          <a href="/" className="hover:text-[#2459D2] transition-colors">Home</a>
          <a href="/#about" className="hover:text-[#2459D2] transition-colors">About Us</a>
          <a href="/#services" className="hover:text-[#2459D2] transition-colors">Services</a>
          <a href="#privacy" className="hover:text-[#2459D2] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#2459D2] transition-colors">Terms of Service</a>
          <a href="#contact" className="hover:text-[#2459D2] transition-colors">Contact Support</a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] sm:text-xs text-[#64748B] font-semibold pb-4">
          © 2026 Wealth Wisdom Financial Services. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
