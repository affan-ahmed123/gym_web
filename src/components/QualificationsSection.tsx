"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Repeat, HeartPulse } from "lucide-react";

const CREDENTIALS = [
  {
    num: "01",
    icon: GraduationCap,
    title: "Diploma in Fitness Training",
    desc: "Comprehensive foundation in exercise science, biomechanics, programming, and client progress management.",
    hasPulse: false,
    accent: "text-red-400 bg-red-950/40 border-red-500/30",
  },
  {
    num: "02",
    icon: Award,
    title: "Certified Fitness Trainer Level 1 & 2",
    desc: "UK Registered dual-level accreditation — bespoke strength & hypertrophy programs for all athletic levels.",
    hasPulse: false,
    accent: "text-rose-400 bg-rose-950/40 border-rose-500/30",
  },
  {
    num: "03",
    icon: Repeat,
    title: "TRX & Suspension Training",
    desc: "Certified in TRX methodology for functional kinetic chain development and advanced core stability.",
    hasPulse: false,
    accent: "text-red-300 bg-red-950/40 border-red-500/30",
  },
  {
    num: "04",
    icon: HeartPulse,
    title: "First Aid · CPR & AED Certified",
    desc: "Emergency first aid, defibrillator protocol, and high-intensity client safety assurance in every session.",
    hasPulse: true,
    accent: "text-red-500 bg-red-950/50 border-red-500/40",
  },
];

export function QualificationsSection() {
  return (
    <section
      id="qualifications"
      className="py-16 sm:py-24 bg-[#070507] border-t border-white/5 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block font-condensed text-xs font-bold uppercase tracking-[0.25em] text-red-400 border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 rounded-full mb-3 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            Credentials
          </span>
          <h2 className="font-condensed text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Qualifications &amp; Certifications
          </h2>
          <p className="mt-2.5 text-steel-300 text-sm sm:text-lg">
            UK-registered and internationally certified — every qualification
            ensures safe, advanced coaching.
          </p>
        </div>

        {/* 2 Cards Per Row on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {CREDENTIALS.map((cred, idx) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={cred.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl sm:rounded-3xl bg-[#110c11] border border-white/10 hover-red-glow p-3.5 sm:p-6 flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-5">
                    <div
                      className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 ${cred.accent}`}
                    >
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <span className="font-display text-xl sm:text-3xl text-steel-600 font-bold leading-none">
                      {cred.num}
                    </span>
                  </div>

                  <h4 className="font-condensed text-sm sm:text-xl font-bold uppercase tracking-wide text-white mb-1.5 sm:mb-2 line-clamp-2">
                    {cred.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-steel-300 leading-snug sm:leading-relaxed">
                    {cred.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
