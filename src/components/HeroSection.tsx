"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Check, Zap, Flame, ShieldCheck } from "lucide-react";
import { AnimatedCounter } from "./FitnessMotionElements";

interface HeroSectionProps {
  heroPhotoUrl?: string | null;
}

const TAGLINE = {
  white: "CERTIFIED PERSONAL TRAINER",
  separator: " · ",
  red: "UK LEVEL 1 & 2",
};

const ROTATING_TARGETS = [
  "BEST SELF",
  "PEAK PHYSIQUE",
  "MAXIMUM POWER",
  "IRON DISCIPLINE",
];

export function HeroSection({ heroPhotoUrl = "/ahsan-cutout.png" }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const watermarkY = useTransform(scrollY, [0, 600], [0, 110]);
  const trainerY = useTransform(scrollY, [0, 600], [0, 40]);

  const activePhoto = heroPhotoUrl || "/ahsan-cutout.png";

  // Typewriter effect: types ONLY "CERTIFIED PERSONAL TRAINER · UK LEVEL 1 & 2" once, then stays
  const [charCount, setCharCount] = useState(0);

  // Rotating target word index
  const [targetIndex, setTargetIndex] = useState(0);

  const fullLine = useMemo(() => {
    return TAGLINE.white + TAGLINE.separator + TAGLINE.red;
  }, []);

  // Dual White and Red text calculation
  const { whitePart, separatorPart, redPart } = useMemo(() => {
    const whiteLen = TAGLINE.white.length;
    const sepLen = TAGLINE.separator.length;
    const sepEnd = whiteLen + sepLen;

    let w = "";
    let s = "";
    let r = "";

    if (charCount <= whiteLen) {
      w = fullLine.slice(0, charCount);
    } else if (charCount <= sepEnd) {
      w = TAGLINE.white;
      s = fullLine.slice(whiteLen, charCount);
    } else {
      w = TAGLINE.white;
      s = TAGLINE.separator;
      r = fullLine.slice(sepEnd, charCount);
    }

    return { whitePart: w, separatorPart: s, redPart: r };
  }, [charCount, fullLine]);

  // Smooth Typewriter Effect that types once and stays
  useEffect(() => {
    if (charCount < fullLine.length) {
      const timer = setTimeout(() => {
        setCharCount((prev) => prev + 1);
      }, 45);
      return () => clearTimeout(timer);
    }
  }, [charCount, fullLine]);

  // Rotate headline dynamic word
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetIndex((prev) => (prev + 1) % ROTATING_TARGETS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-20 sm:pt-28 pb-14 sm:pb-20 overflow-hidden bg-[#070507]"
    >
      {/* Intense Crimson / Fiery Red Atmospheric Aura */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 lg:left-[60%] -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[850px] h-[550px] sm:h-[850px] rounded-full bg-gradient-to-tr from-red-600/35 via-rose-700/25 to-transparent blur-[160px] z-0" />
      <div className="pointer-events-none absolute top-12 right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-red-500/20 blur-[130px] z-0" />

      {/* Massive Background Watermark Typography */}
      <motion.div
        style={{ y: watermarkY }}
        className="pointer-events-none select-none absolute inset-x-0 top-[26%] -translate-y-1/2 text-center font-display text-[18vw] leading-none tracking-wider text-[#3d0b0b]/60 whitespace-nowrap z-0 font-black"
        aria-hidden="true"
      >
        AHSAN HUSSAIN
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[76vh]">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 z-20 pt-2 lg:pt-0">
            {/* 
              CLEAN UNBOXED KINETIC TYPEWRITER TAGLINE:
              - No pill/round shape
              - No start dot
              - White + Vibrant Red combination
              - Blinking Red Cursor
            */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-3 sm:mb-5 flex items-center min-h-[26px] flex-wrap"
            >
              <div className="text-[11px] sm:text-xs md:text-sm font-condensed font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase leading-relaxed inline-flex items-center flex-wrap">
                {/* White Text Part */}
                <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                  {whitePart}
                </span>

                {/* Separator Part */}
                {separatorPart && (
                  <span className="text-red-500 font-bold mx-1">
                    {separatorPart}
                  </span>
                )}

                {/* Red Text Part */}
                {redPart && (
                  <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] font-black">
                    {redPart}
                  </span>
                )}

                {/* Blinking Red Typing Cursor */}
                <span className="w-[2px] h-3.5 sm:h-4 bg-red-500 ml-1.5 inline-block animate-pulse shrink-0 align-middle shadow-[0_0_8px_#ef4444]" />
              </div>
            </motion.div>

            {/* Main Headline with Dynamic Word-Write Rotation */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] uppercase text-white font-black">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="block text-white"
              >
                FORGE YOUR
              </motion.span>
              <div className="h-[1.12em] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={targetIndex}
                    initial={{ y: 35, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -35, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400 drop-shadow-[0_4px_25px_rgba(220,38,38,0.65)]"
                  >
                    {ROTATING_TARGETS[targetIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            {/* Enhanced Authoritative Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 sm:mt-5 text-xs sm:text-base md:text-lg text-steel-200 max-w-xl leading-relaxed"
            >
              Elite personal fitness coaching tailored around your body composition,
              biomechanics, and schedule. Science-backed progressive strength
              programming, form mastery, and bespoke nutrition protocols engineered
              to deliver lasting, measurable transformation.
            </motion.p>

            {/* 3 Value Pillars — Mobile Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-lg"
            >
              {[
                { title: "Form Mastery", sub: "Biomechanics Coaching" },
                { title: "Targeted Macros", sub: "Custom Nutrition Stacks" },
                { title: "Weekly Progress", sub: "Data-Driven Results" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-obsidian-850/80 border border-white/10 text-xs shadow-md"
                >
                  <Check className="w-3.5 h-3.5 text-red-500 shrink-0 stroke-[3]" />
                  <div className="leading-tight">
                    <strong className="block font-condensed uppercase tracking-wider text-white text-[11px]">
                      {item.title}
                    </strong>
                    <span className="text-[10px] text-steel-400">{item.sub}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons — Mobile Responsive Full Width / Desktop Inline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5"
            >
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-condensed font-black text-xs sm:text-sm md:text-base uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-[0_12px_40px_rgba(220,38,38,0.5)] transition-all hover:scale-105"
              >
                <span>BOOK A FREE SESSION</span>
                <ChevronDown className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-y-0.5" />
              </a>

              <a
                href="#nutrition"
                className="inline-flex items-center justify-center gap-2 font-condensed font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider text-steel-200 hover:text-white transition-colors px-5 py-3.5 sm:py-4 rounded-xl border border-white/10 hover:border-red-500/40 bg-obsidian-850"
              >
                <span>NUTRITION STORE</span>
                <ArrowRight className="w-4 h-4 text-red-500" />
              </a>
            </motion.div>
          </div>

          {/* Center-Right: Trainer Cutout + Overlapping Floating Stat Cards */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-end min-h-[400px] sm:min-h-[580px] lg:min-h-[720px] mt-6 lg:mt-0">
            {/* Cutout Portrait Image of Ahsan Hussain */}
            <motion.div
              style={{ y: trainerY }}
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="relative w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[540px] flex justify-center z-10"
            >
              <img
                src={activePhoto}
                alt="Ahsan Hussain — Certified Personal Fitness Trainer"
                className="w-full h-auto max-h-[440px] sm:max-h-[640px] lg:max-h-[740px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
              />

              {/* Bottom fade-out mask to blend seamlessly into background */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#070507] via-[#070507]/60 to-transparent" />
            </motion.div>

            {/* Overlapping Glassmorphism Stat Cards — Responsive 2-column layout */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4 }}
              className="relative sm:absolute sm:bottom-2 sm:right-0 z-20 grid grid-cols-2 gap-2 sm:gap-4 max-w-[460px] w-full px-2 mt-4 sm:mt-0"
            >
              {/* Card 1 */}
              <div className="rounded-xl sm:rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-white/[0.09] via-red-950/40 to-black/85 border border-white/15 p-2.5 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] hover:border-red-500/40 transition-all">
                <div className="font-display text-xl sm:text-4xl text-white font-black leading-none">
                  <AnimatedCounter target={100} suffix="%" />
                </div>
                <strong className="block text-[10px] sm:text-xs font-semibold text-white mt-1 leading-tight">
                  Client Satisfaction
                </strong>
                <p className="text-[9px] sm:text-[11px] text-steel-400 mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                  Guaranteed — every program is built around your goals.
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-xl sm:rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-white/[0.09] via-red-950/40 to-black/85 border border-white/15 p-2.5 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] hover:border-red-500/40 transition-all">
                <div className="font-display text-xl sm:text-4xl text-white font-black leading-none">
                  <AnimatedCounter target={200} suffix="+" />
                </div>
                <strong className="block text-[10px] sm:text-xs font-semibold text-white mt-1 leading-tight">
                  Clients Transformed
                </strong>
                <p className="text-[9px] sm:text-[11px] text-steel-400 mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                  Real results from beginners to advanced athletes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
