"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crosshair, Flame, TrendingUp, ArrowRight } from "lucide-react";

const PILLARS = [
  {
    icon: Crosshair,
    title: "Precision",
    desc: "Every rep programmed with purpose.",
    bars: [65, 80, 95],
    accent: "text-red-400 bg-red-950/40 border-red-500/30",
  },
  {
    icon: Flame,
    title: "Discipline",
    desc: "Consistency that builds momentum.",
    bars: [70, 85, 100],
    accent: "text-rose-400 bg-rose-950/40 border-rose-500/30",
  },
  {
    icon: TrendingUp,
    title: "Progress",
    desc: "Measurable, trackable results.",
    bars: [50, 75, 100],
    accent: "text-red-300 bg-red-950/40 border-red-500/30",
  },
];

export function MissionSection() {
  return (
    <section
      id="mission"
      className="py-24 bg-[#0a070a] border-y border-white/10 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-5"
          >
            <span className="inline-block font-condensed text-xs font-bold uppercase tracking-[0.25em] text-red-400 border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.15)]">
              My Mission
            </span>
            <h2 className="font-condensed text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
              Train Smarter. Move Better. Achieve Lasting Results.
            </h2>
            <p className="text-base text-steel-300 leading-relaxed">
              Every client receives a fully personalized strategy around their
              body composition, lifestyle, and goals. Built on{" "}
              <strong className="text-red-400 font-bold">
                precision, discipline, and measurable progress.
              </strong>
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-condensed font-black text-sm uppercase tracking-wider px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-[0_12px_35px_rgba(220,38,38,0.5)]"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4 stroke-[3] transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl sm:rounded-3xl bg-[#110c11] border border-white/10 hover-red-glow p-3.5 sm:p-5 flex flex-col justify-between ${
                    idx === 2 ? "col-span-2 sm:col-span-1" : "col-span-1"
                  }`}
                >
                  <div>
                    <div
                      className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center mb-3 sm:mb-4 ${pillar.accent}`}
                    >
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <strong className="block font-condensed text-sm sm:text-xl uppercase tracking-wide text-white mb-1 sm:mb-1.5">
                      {pillar.title}
                    </strong>
                    <p className="text-[11px] sm:text-xs text-steel-400 leading-snug sm:leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Progressive Overload Mini-Bars */}
                  <div className="mt-4 sm:mt-5 pt-2 sm:pt-3 border-t border-white/5 flex items-end gap-1.5 h-10 sm:h-12">
                    {pillar.bars.map((h, bIdx) => (
                      <motion.div
                        key={bIdx}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: false }}
                        transition={{
                          duration: 0.7,
                          delay: 0.25 + bIdx * 0.12,
                          ease: "easeOut",
                        }}
                        className={`flex-1 rounded-sm ${
                          bIdx === 2
                            ? "bg-gradient-to-t from-red-700 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                            : bIdx === 1
                            ? "bg-steel-300"
                            : "bg-steel-600"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
