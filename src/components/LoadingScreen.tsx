"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export function LoadingScreen({
  onComplete,
  durationMs = 1300,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Lock scroll during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / durationMs) * 100), 100);
      setProgress(pct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setProgress(100);
        setIsOpening(true);

        // Allow the sliding window animation to complete before unlocking and unmounting
        setTimeout(() => {
          document.body.style.overflow = originalOverflow;
          onComplete();
        }, 850);
      }
    }, 20);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = originalOverflow;
    };
  }, [durationMs, onComplete]);

  const handleInstantOpen = () => {
    if (isOpening) return;
    setProgress(100);
    setIsOpening(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      onClick={handleInstantOpen}
      className="fixed inset-0 z-[9999] overflow-hidden cursor-pointer select-none"
      aria-label="Ahsan Hussain Portfolio Introduction"
    >
      {/* LEFT SLIDING WINDOW PANEL */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: isOpening ? "-100%" : "0%" }}
        transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#070507] border-r border-white/5 z-20 shadow-[20px_0_50px_rgba(0,0,0,0.9)]"
      >
        {/* Subtle ambient gradient aura on the left panel */}
        <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-red-600/[0.08] blur-[120px]" />
      </motion.div>

      {/* RIGHT SLIDING WINDOW PANEL */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: isOpening ? "100%" : "0%" }}
        transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#070507] border-l border-white/5 z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.9)]"
      >
        {/* Subtle ambient gradient aura on the right panel */}
        <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-red-600/[0.08] blur-[120px]" />
      </motion.div>

      {/* CENTER SEAM ACCENT LINE (SPLITS OPEN LIKE A WINDOW) */}
      <motion.div
        initial={{ opacity: 0.8, scaleY: 0 }}
        animate={{
          opacity: isOpening ? 0 : 0.8,
          scaleY: isOpening ? 0 : 1,
        }}
        transition={{ duration: 0.4 }}
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-transparent via-red-500 to-transparent z-30 pointer-events-none"
      />

      {/* CENTER BRANDING: SIMPLE NAME & MINIMAL PROGRESS BAR */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 0.94 : 1,
        }}
        transition={{ duration: 0.45 }}
        className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none"
      >
        {/* Radial ambient red light behind name */}
        <div className="pointer-events-none absolute w-[420px] h-[420px] rounded-full bg-red-600/[0.14] blur-[140px] -z-10" />

        {/* Clean, Simple, Bold Name */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider text-white leading-none">
          AHSAN <span className="text-red-500">HUSSAIN</span>
        </h1>

        {/* Clean Subtitle */}
        <p className="font-condensed text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase text-steel-400 font-bold mt-3">
          PERSONAL FITNESS TRAINER · UK LEVEL 1 &amp; 2
        </p>

        {/* Minimalist Progress Line */}
        <div className="w-48 sm:w-64 mt-8 flex flex-col items-center gap-2">
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 rounded-full shadow-[0_0_10px_#ef4444]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <span className="font-display text-sm tracking-widest text-steel-400 tabular-nums">
            {progress}%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
