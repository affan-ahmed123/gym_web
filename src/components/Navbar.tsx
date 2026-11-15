"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onSecretAdminTrigger: () => void;
}

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#nutrition", label: "Nutrition" },
  { href: "#qualifications", label: "Credentials" },
  { href: "#testimonials", label: "Reviews" },
];

export function Navbar({ onSecretAdminTrigger }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const logoClicksRef = useRef(0);
  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((sec) => {
        const el = sec as HTMLElement;
        if (window.scrollY >= el.offsetTop - 140) {
          current = el.id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    logoClicksRef.current += 1;
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    logoTimerRef.current = setTimeout(() => {
      logoClicksRef.current = 0;
    }, 2000);
    if (logoClicksRef.current >= 5) {
      e.preventDefault();
      logoClicksRef.current = 0;
      onSecretAdminTrigger();
    }
  };

  return (
    <>
      {/* Top Crimson Red Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-800 via-red-500 to-rose-400 origin-left z-[120] shadow-[0_0_10px_#ef4444]"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
            ? "bg-[#070507]/92 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl"
            : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <a
            href="#hero"
            onClick={handleLogoClick}
            className="font-display text-2xl sm:text-3xl tracking-wider text-white leading-none select-none hover:text-red-400 transition-colors"
          >
            AHSAN HUSSAIN<span className="text-red-500">.</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative font-condensed text-sm font-bold uppercase tracking-[0.14em] transition-colors ${isActive
                      ? "text-red-400"
                      : "text-steel-300 hover:text-white"
                    }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveUnderline"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"
                    />
                  )}
                </a>
              );
            })}
            <a
              href="#contact"
              className="font-condensed text-sm font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-2.5 rounded-xl transition-all hover:scale-105 shadow-[0_8px_25px_rgba(220,38,38,0.45)]"
            >
              Book Free Session
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-obsidian-800 border border-white/10 text-steel-100 hover:text-red-400"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-[#0d090d]/98 backdrop-blur-xl border-b border-white/10"
            >
              <div className="px-6 py-5 flex flex-col gap-3">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-condensed text-lg font-bold uppercase tracking-widest text-steel-300 hover:text-red-400 py-2 border-b border-white/5"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 text-center font-condensed text-base font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-xl shadow-lg"
                >
                  Book Free Session
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
