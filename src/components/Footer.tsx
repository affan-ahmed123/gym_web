"use client";

import React from "react";
import { MapPin, Lock } from "lucide-react";

interface FooterProps {
  onOpenAdmin: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-[#070507] border-t border-white/10 py-8 sm:py-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-steel-400">
            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
            <span>Home Based Training &amp; Virtual Training · Malir Cantt, Karachi</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-condensed uppercase tracking-[0.16em] text-steel-400">
            <a href="#about" className="hover:text-red-400 transition-colors">
              About
            </a>
            <a href="#services" className="hover:text-red-400 transition-colors">
              Services
            </a>
            <a href="#nutrition" className="hover:text-red-400 transition-colors">
              Nutrition
            </a>
            <a
              href="#qualifications"
              className="hover:text-red-400 transition-colors"
            >
              Credentials
            </a>
            <a href="#contact" className="hover:text-red-400 transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-steel-500">
          <p>© 2026 Ahsan Hussain · Certified Fitness Coach</p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-steel-400 hover:text-red-400 transition-colors"
          >
            <Lock className="w-3 h-3 text-red-500" />
            <span>Trainer Admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
