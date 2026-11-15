"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  animate,
} from "framer-motion";
import { Zap } from "lucide-react";

/**
 * Animated Cardio & CPR Heartbeat waveform with Crimson Red traveling pulse.
 */
export function HeartbeatPulseLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 360 64"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ecgCrimsonPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#f87171" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Baseline */}
        <path
          d="M0 36 H85 L100 36 L112 18 L124 52 L138 10 L152 56 L165 30 L176 36 H250 L262 24 L274 44 L286 36 H360"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Animated Crimson pulse */}
        <motion.path
          d="M0 36 H85 L100 36 L112 18 L124 52 L138 10 L152 56 L165 30 L176 36 H250 L262 24 L274 44 L286 36 H360"
          stroke="url(#ecgCrimsonPulse)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, pathOffset: 0, opacity: 0.4 }}
          animate={{
            pathLength: [0.15, 0.45, 0.15],
            pathOffset: [0, 0.85, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Animated Olympic Barbell Rep-Cadence Lift in Crimson Red & Carbon Obsidian.
 */
export function AnimatedBarbellShowcase() {
  return (
    <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-950 border border-white/10 shadow-2xl overflow-hidden hover-red-glow">
      {/* Crimson aura spotlight */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-red-600/[0.12] blur-3xl" />

      <div className="flex items-center justify-between w-full mb-3 z-10">
        <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-condensed tracking-[0.2em] uppercase text-red-400 font-bold">
          <Zap className="w-3.5 h-3.5 text-red-500" />
          Hypertrophy · Tempo 3-1-1
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-condensed tracking-widest uppercase text-white bg-red-950/60 px-2.5 sm:px-3 py-1 rounded-full border border-red-500/30">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live Coaching
        </span>
      </div>

      {/* Barbell Lifting Rep Motion */}
      <div className="relative w-full h-32 sm:h-36 flex items-center justify-center z-10">
        <div className="absolute bottom-3 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

        <motion.svg
          viewBox="0 0 280 100"
          className="w-full max-w-[260px] sm:max-w-[280px] h-24 sm:h-28 drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
          animate={{ y: [6, -12, 6] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
          }}
        >
          {/* Steel Bar */}
          <rect x="24" y="47" width="232" height="6" rx="3" fill="#d1d1d8" />
          <rect x="92" y="47" width="32" height="6" fill="#71717a" />
          <rect x="156" y="47" width="32" height="6" fill="#71717a" />

          {/* Left Plates */}
          <rect
            x="40"
            y="22"
            width="12"
            height="56"
            rx="3"
            fill="#1b141b"
            stroke="#ef4444"
            strokeWidth="1.5"
          />
          <rect
            x="55"
            y="28"
            width="10"
            height="44"
            rx="2.5"
            fill="#130e13"
            stroke="#dc2626"
            strokeWidth="1.5"
          />
          <rect x="68" y="35" width="7" height="30" rx="2" fill="#f5f5f7" />

          {/* Right Plates */}
          <rect
            x="228"
            y="22"
            width="12"
            height="56"
            rx="3"
            fill="#1b141b"
            stroke="#ef4444"
            strokeWidth="1.5"
          />
          <rect
            x="215"
            y="28"
            width="10"
            height="44"
            rx="2.5"
            fill="#130e13"
            stroke="#dc2626"
            strokeWidth="1.5"
          />
          <rect x="205" y="35" width="7" height="30" rx="2" fill="#f5f5f7" />

          {/* Collars */}
          <rect x="76" y="41" width="5" height="18" rx="1.5" fill="#ef4444" />
          <rect x="199" y="41" width="5" height="18" rx="1.5" fill="#ef4444" />
        </motion.svg>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-3 pt-3 border-t border-white/10 text-center z-10">
        <div>
          <p className="text-[9px] sm:text-[10px] font-condensed uppercase tracking-widest text-steel-400">
            Focus
          </p>
          <p className="text-xs sm:text-sm font-condensed font-bold text-white">
            FORM + LOAD
          </p>
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] font-condensed uppercase tracking-widest text-steel-400">
            Location
          </p>
          <p className="text-xs sm:text-sm font-condensed font-bold text-red-400">
            AHSAN HUSSAIN
          </p>
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] font-condensed uppercase tracking-widest text-steel-400">
            Credentials
          </p>
          <p className="text-xs sm:text-sm font-condensed font-bold text-white">
            UK LVL 1 & 2
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Running Marquee with Crimson Diamonds.
 */
export function FitnessMarquee() {
  const items = [
    "STRENGTH CONDITIONING",
    "BODY TRANSFORMATION",
    "HYPERTROPHY PROGRAMMING",
    "TRX & SUSPENSION",
    "FAT LOSS & PHYSIQUE",
    "REHABILITATION",
    "AHSAN HUSSAIN FITNESS",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#0d090d] border-y border-white/10 py-3 sm:py-4 select-none">
      <motion.div
        className="flex whitespace-nowrap gap-6 sm:gap-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...items, ...items].map((label, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-6 sm:gap-10 font-display text-xl sm:text-3xl tracking-[0.14em] text-steel-400"
          >
            <span className="hover:text-red-400 transition-colors cursor-default">
              {label}
            </span>
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rotate-45 bg-red-600 shadow-[0_0_8px_#ef4444] inline-block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Viewport Triggered Counter.
 */
export function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setVal(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}
