"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Repeat,
  Stethoscope,
  Apple,
  Smartphone,
  Check,
  ArrowRight,
} from "lucide-react";

interface ServicesSectionProps {
  onSelectService: (goalValue: string) => void;
}

const SERVICES = [
  {
    num: "01",
    icon: Dumbbell,
    title: "Private Personal Training",
    goalValue: "Strength & Performance",
    desc: "Private one-on-one coaching. Every rep, every set — fully coached with form mastery and technique precision.",
    bullets: [
      "Bespoke strength program",
      "Form & technique mastery",
      "Measurable weekly progress",
    ],
    featured: false,
    iconAccent: "text-red-400 bg-red-950/50 border-red-500/30",
  },
  {
    num: "02",
    icon: Flame,
    title: "Body Transformation",
    goalValue: "Muscle Gain & Body Transformation",
    desc: "Muscle gain, fat loss, physique conditioning — built on progressive overload & precision.",
    bullets: [
      "Body composition analysis",
      "Progressive overload programming",
      "Nutrition & macro targets",
      "Regular milestone reviews",
    ],
    featured: true,
    iconAccent: "text-white bg-gradient-to-r from-red-600 to-rose-600 border-red-500 shadow-lg",
  },
  {
    num: "03",
    icon: Repeat,
    title: "TRX & Suspension Training",
    goalValue: "TRX & Suspension Training",
    desc: "Functional, full-body workouts that build rotational power, core stability, and agility.",
    bullets: [
      "Certified TRX methodology",
      "Full-body functional training",
      "Beginner to athletic elite",
    ],
    featured: false,
    iconAccent: "text-rose-400 bg-rose-950/40 border-rose-500/30",
  },
  {
    num: "04",
    icon: Stethoscope,
    title: "Rehabilitation Training",
    goalValue: "Rehabilitation & Corrective Exercise",
    desc: "Corrective exercise to restore movement, reduce chronic pain, and return to full performance.",
    bullets: [
      "Movement screening",
      "Corrective biomechanics",
      "Safe return-to-training plan",
    ],
    featured: false,
    iconAccent: "text-red-300 bg-red-950/40 border-red-500/30",
  },
  {
    num: "05",
    icon: Apple,
    title: "Nutrition & Lifestyle Coaching",
    goalValue: "Fat Loss & Physique Conditioning",
    desc: "Sustainable nutrition habits that fuel athletic performance and accelerate body recomposition.",
    bullets: [
      "Calorie & macro targets",
      "Lifestyle-friendly meal plans",
      "Long-term habit building",
    ],
    featured: false,
    iconAccent: "text-amber-400 bg-amber-950/40 border-amber-500/30",
  },
  {
    num: "06",
    icon: Smartphone,
    title: "Online Coaching",
    goalValue: "Online Coaching",
    desc: "Train anywhere. Custom training app program, weekly check-ins, and direct WhatsApp feedback.",
    bullets: [
      "Custom training program",
      "Weekly progress check-ins",
      "Direct video form check",
    ],
    featured: false,
    iconAccent: "text-red-400 bg-red-950/40 border-red-500/30",
  },
];

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="py-16 sm:py-24 bg-[#0a070a] relative overflow-hidden border-t border-white/5"
    >
      {/* Background Watermark */}
      <div className="pointer-events-none select-none absolute top-14 inset-x-0 text-center font-display text-[16vw] leading-none text-red-600/[0.03] tracking-widest font-black">
        RESULTS
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block font-condensed text-xs font-bold uppercase tracking-[0.25em] text-red-400 border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 rounded-full mb-3 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            Professional Coaching Services
          </span>
          <h2 className="font-condensed text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            What I Offer
          </h2>
          <p className="mt-2.5 text-steel-300 text-sm sm:text-lg">
            Every program is fully personalized — designed around your body,
            lifestyle, and goals.
          </p>
        </div>

        {/* 2 Cards Per Row on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                whileHover={{ y: -5 }}
                className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border transition-all duration-300 overflow-hidden ${srv.featured
                  ? "bg-gradient-to-b from-[#1b0e12] via-[#140b0e] to-[#0a0507] border-red-500/50 shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(220,38,38,0.2)]"
                  : "bg-[#110c11] border-white/10 hover:border-red-500/40 hover-red-glow"
                  }`}
              >
                {/* Top Crimson Sweep Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-start justify-between mb-3 sm:mb-5">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.2 }}
                      className={`w-9 h-9 sm:w-13 sm:h-13 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center border shrink-0 ${srv.iconAccent}`}
                    >
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </motion.div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {srv.featured && (
                        <span className="font-condensed text-[9px] sm:text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                          Popular
                        </span>
                      )}
                      <span className="font-display text-xl sm:text-3xl text-steel-600 group-hover:text-red-400 transition-colors leading-none font-bold">
                        {srv.num}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-condensed text-base sm:text-2xl font-bold uppercase tracking-wide text-white mb-1.5 sm:mb-2.5 line-clamp-2">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-steel-300 leading-snug sm:leading-relaxed mb-3 sm:mb-5 line-clamp-3 sm:line-clamp-none">
                    {srv.desc}
                  </p>

                  <ul className="space-y-1.5 sm:space-y-2.5 mb-4 sm:mb-7">
                    {srv.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start sm:items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-sm text-steel-200"
                      >
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0 stroke-[3] mt-0.5 sm:mt-0" />
                        <span className="leading-tight sm:leading-normal">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(srv.goalValue)}
                  className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-2.5 sm:px-5 rounded-xl font-condensed text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${srv.featured
                    ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_8px_25px_rgba(220,38,38,0.4)]"
                    : "bg-obsidian-850 hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 text-white border border-white/15 hover:border-red-500"
                    }`}
                >
                  <span>{srv.featured ? "Get Started" : "Enquire"}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
