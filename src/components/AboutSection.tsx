"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Stethoscope, Target, Dumbbell } from "lucide-react";

interface AboutSectionProps {
  photoUrl: string | null;
  photoWidth?: number;
  photoHeight?: number;
  photoProvider?: string;
}

const SPECIALTIES = [
  {
    icon: Flame,
    title: "Fat Loss & Physique",
    sub: "Conditioning Programs",
    accentColor: "text-athletic-orange",
    bgAccent: "bg-athletic-orange/10 border-athletic-orange/25",
  },
  {
    icon: Zap,
    title: "Muscle Development",
    sub: "Strength & Hypertrophy",
    accentColor: "text-volt-300",
    bgAccent: "bg-volt-400/10 border-volt-400/25",
  },
  {
    icon: Stethoscope,
    title: "Rehabilitation",
    sub: "Corrective Exercise",
    accentColor: "text-athletic-cyan",
    bgAccent: "bg-athletic-cyan/10 border-athletic-cyan/25",
  },
  {
    icon: Target,
    title: "Online Coaching",
    sub: "Remote & In-Person",
    accentColor: "text-athletic-emerald",
    bgAccent: "bg-athletic-emerald/10 border-athletic-emerald/25",
  },
];

export function AboutSection({
  photoUrl,
  photoWidth = 800,
  photoHeight = 1000,
  photoProvider = "cloudinary",
}: AboutSectionProps) {
  return (
    <section id="about" className="py-24 bg-obsidian-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-32 left-10 w-[500px] h-[500px] rounded-full bg-volt-400/[0.04] blur-[150px]" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Portrait Frame */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-[390px]">
              {/* Luminous Animated Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute -inset-4 rounded-3xl border border-dashed border-volt-400/20"
              />

              {/* Picture Container with precise aspect-ratio handling */}
              <div
                className="relative rounded-2xl overflow-hidden bg-obsidian-850 border-2 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] hover-volt-glow group"
                style={{
                  aspectRatio: `${photoWidth} / ${photoHeight}`,
                  maxHeight: "520px",
                }}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Ahsan Hussain — Certified Fitness Trainer"
                    width={photoWidth}
                    height={photoHeight}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full min-h-[440px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-obsidian-800 to-obsidian-950">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-24 h-24 rounded-full bg-volt-400/10 border border-volt-400/30 flex items-center justify-center mb-5 shadow-volt-sm"
                    >
                      <Dumbbell className="w-10 h-10 text-volt-300" />
                    </motion.div>
                    <p className="font-condensed text-2xl font-bold uppercase tracking-wider text-white">
                      Ahsan Hussain
                    </p>
                    <p className="text-xs font-condensed uppercase tracking-[0.2em] text-volt-300 mt-1 font-semibold">
                      Certified Fitness Trainer
                    </p>
                    <span className="mt-4 text-[11px] text-steel-400 border border-white/10 rounded-full px-3.5 py-1 bg-obsidian-800">
                      Upload trainer photo from the Admin Panel
                    </span>
                  </div>
                )}

                {/* Cloudinary CDN indicator badge */}
                {photoUrl && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-obsidian-950/85 backdrop-blur-md border border-white/15 text-[10px] font-condensed uppercase tracking-wider text-volt-300 font-bold flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-volt-400" />
                    <span>
                      {photoProvider === "cloudinary" ? "Cloudinary HD" : "Optimized"}
                    </span>
                    <span className="text-steel-400">
                      ({photoWidth}x{photoHeight})
                    </span>
                  </div>
                )}

                {/* Subtle bottom gradient sweep */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/20 to-transparent" />
              </div>

              {/* Floating 9+ Years Pro Badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-5 -right-3 sm:right-0 bg-gradient-to-br from-volt-300 via-volt-400 to-volt-500 text-obsidian-950 px-6 py-4 rounded-2xl shadow-volt-glow border-2 border-white"
              >
                <span className="block font-display text-4xl leading-none font-bold">
                  9+
                </span>
                <span className="block font-condensed text-[11px] font-black uppercase tracking-[0.2em]">
                  Years Pro
                </span>
              </motion.div>
            </div>

            {/* Cert tags */}
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {[
                "TRX Certified",
                "CPR & AED",
                "Level 1 & 2 UK",
              ].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="px-4 py-1.5 rounded-full bg-obsidian-850 border border-white/15 font-condensed text-xs font-bold uppercase tracking-widest text-steel-200 hover:border-volt-400/40 hover:text-volt-300 transition-colors"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right Bio & Specialties */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-5"
          >
            <span className="inline-block font-condensed text-xs font-bold uppercase tracking-[0.25em] text-volt-300 border border-volt-400/30 bg-obsidian-850 px-3.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(212,255,0,0.12)]">
              About Me
            </span>

            <h2 className="font-condensed text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
              Dedicated to Unlocking Your Full Physical Potential
            </h2>

            <p className="text-base sm:text-lg text-steel-200 leading-relaxed">
              I&apos;m <strong className="text-white font-bold">Ahsan Hussain</strong>, a
              certified fitness professional with over 9 years of experience
              guiding clients toward sustainable body transformation, improved
              athletic performance, and long-term health.
            </p>

            <p className="text-sm sm:text-base text-steel-400 leading-relaxed">
              I hold a Diploma in Fitness Training and am a Certified Fitness
              Trainer Level 1 &amp; 2 (UK Registered), TRX &amp; Suspension
              Training certified, and fully certified in First Aid with CPR
              &amp; AED.
            </p>

            <p className="text-sm sm:text-base text-steel-400 leading-relaxed">
              My expertise covers muscle development, fat loss, strength
              conditioning, and rehabilitation. True fitness goes beyond
              aesthetics — it&apos;s about building strength, resilience, and
              confidence.
            </p>

            <p className="text-sm sm:text-base text-steel-400 leading-relaxed">
              Available for private 1-on-1 coaching in{" "}
              <strong className="text-volt-300 font-semibold">
                Malir Cantt, Karachi
              </strong>{" "}
              as well as online training globally.
            </p>

            <div className="pt-4 grid sm:grid-cols-2 gap-3.5">
              {SPECIALTIES.map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <motion.div
                    key={spec.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -3, borderColor: "rgba(212,255,0,0.4)" }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-obsidian-850 border border-white/10 transition-all hover:bg-obsidian-800"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${spec.bgAccent}`}
                    >
                      <Icon className={`w-6 h-6 ${spec.accentColor}`} />
                    </div>
                    <div>
                      <strong className="block font-condensed text-base uppercase tracking-wide text-white">
                        {spec.title}
                      </strong>
                      <span className="text-xs text-steel-400">{spec.sub}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
