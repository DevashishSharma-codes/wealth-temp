import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import wealthWisdomLogo from "../../assets/wealth-wisdom-logo.png";

export function Navbar({ onOpenContact }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const isManualClickRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // If user clicked a nav link, skip ScrollSpy detection during smooth scroll animation
      if (isManualClickRef.current) return;

      // ScrollSpy section detection for active nav highlight
      if (location.pathname === "/") {
        const sectionIds = ["contact", "testimonials", "about", "assessment", "services"];
        const sections = sectionIds
          .map((id) => ({ id, elem: document.getElementById(id) }))
          .filter((s) => s.elem !== null);

        let current = "home";
        const viewportCenter = window.innerHeight * 0.45;

        for (const s of sections) {
          const rect = s.elem.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= 80) {
            current = s.id;
            break;
          }
        }

        if (window.scrollY < 200) {
          current = "home";
        }

        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", href: "/", id: "home" },
    { name: "Services", href: "/#services", id: "services" },
    { name: "DIY Assessment", href: "/#assessment", id: "assessment" },
    { name: "About Us", href: "/#about", id: "about" },
    { name: "Testimonials", href: "/#testimonials", id: "testimonials" },
    { name: "Contact Support", href: "#contact", id: "contact", isAction: true },
  ];

  const handleNavClick = (href, isAction, id) => {
    setIsMobileMenuOpen(false);

    if (id) {
      isManualClickRef.current = true;
      setActiveSection(id);
      // Re-enable ScrollSpy after smooth scroll completes
      setTimeout(() => {
        isManualClickRef.current = false;
      }, 900);
    }

    if (isAction && onOpenContact) {
      onOpenContact();
      return;
    }

    if (id === "assessment" && location.pathname === "/") {
      const elem = document.getElementById("assessment");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 select-none ${
        isScrolled
          ? "bg-white/75 backdrop-blur-2xl border-b border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] py-2.5"
          : "bg-white/55 backdrop-blur-2xl border-b border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 cursor-pointer group">
          <img
            src={wealthWisdomLogo}
            alt="Wealth Wisdom Logo"
            className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav Links with Direct Smooth Sliding Active Pill */}
        <div className="hidden lg:flex items-center gap-1 bg-white/65 backdrop-blur-xl border border-white/80 p-1 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative">
          {navLinks.map((link) => {
            const isActive =
              (link.id && activeSection === link.id && location.pathname === "/") ||
              (link.id === "assessment" && location.pathname === "/assessment");

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.isAction || link.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(link.href, link.isAction, link.id);
                  }
                }}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer select-none ${
                  isActive ? "text-white" : "text-slate-700 hover:text-[#2459D2]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35
                    }}
                    className="absolute inset-0 bg-[#2459D2] rounded-full shadow-[0_2px_10px_rgba(36,89,210,0.35)] -z-0"
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </div>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 bg-white/80 border border-white text-[#2459D2] text-[11px] font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider select-none shadow-2xs backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#2459D2] animate-pulse" />
            <span>DIY Assessment</span>
          </div>
          <Link
            to="/assessment"
            className="glass-morphism-btn !rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-tight flex items-center gap-2 cursor-pointer shadow-md shadow-[#2459D2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start Assessment</span>
            <span className="text-[#BAE0FF] text-base font-bold">&rarr;</span>
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
          <div className="sm:hidden inline-flex items-center gap-1 bg-white/80 border border-white text-[#2459D2] text-[9.5px] xs:text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider select-none shadow-2xs backdrop-blur-sm shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2459D2] animate-pulse" />
            <span>DIY Assessment</span>
          </div>
          <Link
            to="/assessment"
            className="sm:hidden glass-morphism-btn !rounded-full px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            Assessment &rarr;
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-[#334155] hover:bg-white/80 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/85 backdrop-blur-2xl border-b border-white/60 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl rounded-b-3xl">
          {navLinks.map((link) => {
            const isActive =
              (link.id && activeSection === link.id && location.pathname === "/") ||
              (link.href === "/assessment" && location.pathname === "/assessment");

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.isAction || link.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(link.href, link.isAction, link.id);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2459D2] text-white shadow-xs"
                    : "text-[#334155] hover:bg-[#EBF4FE] hover:text-[#2459D2]"
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <div className="pt-3 border-t border-[#D5E5FA]">
            <Link
              to="/assessment"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-[#2459D2] hover:bg-[#183B91] text-white py-3 rounded-xl text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Start DIY Assessment Now</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
