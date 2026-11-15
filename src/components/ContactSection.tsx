"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Check,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Instagram,
  MessageCircle,
} from "lucide-react";

interface ContactSectionProps {
  selectedGoal: string;
}

const GOALS = [
  "Fat Loss & Physique Conditioning",
  "Muscle Gain & Body Transformation",
  "Strength & Performance",
  "Rehabilitation & Corrective Exercise",
  "TRX & Suspension Training",
  "Online Coaching",
  "General Fitness",
];

export function ContactSection({ selectedGoal }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("Beginner");
  const [trainingType, setTrainingType] = useState("In-Person Training");
  const [preferredTime, setPreferredTime] = useState("Flexible");
  const [healthNotes, setHealthNotes] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (selectedGoal) {
      setGoal(selectedGoal);
    }
  }, [selectedGoal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    if (!name.trim() || !phone.trim() || !email.trim() || !goal) {
      setStatus("error");
      setErrorMsg("Please fill in your Name, Phone/WhatsApp, Email, and Main Goal.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Save directly into MongoDB Atlas for the Admin Panel
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          age: age ? Number(age) : undefined,
          goal,
          fitnessLevel,
          trainingType,
          preferredTime,
          healthNotes: healthNotes.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit request. Please try again.");
      }

      // 2. Format detailed message for WhatsApp
      const waText = `🏋️ *NEW CONSULTATION REQUEST — AHSAN HUSSAIN FITNESS*
━━━━━━━━━━━━━━━━━━━━━
👤 *Full Name:* ${name.trim()}
📱 *Phone / WhatsApp:* ${phone.trim()}
📧 *Email:* ${email.trim()}
🎂 *Age:* ${age || "N/A"}
🎯 *Main Goal:* ${goal}
⚡ *Fitness Level:* ${fitnessLevel}
📍 *Training Preference:* ${trainingType}
⏰ *Preferred Session Time:* ${preferredTime}
🩺 *Health / Injuries:* ${healthNotes.trim() || "None"}
💬 *Message:* ${message.trim() || "Ready to get started!"}
━━━━━━━━━━━━━━━━━━━━━
_Sent via ahsanhussain.fitness Booking Portal_`;

      const waUrl = `https://wa.me/923262371372?text=${encodeURIComponent(
        waText
      )}`;

      // Open WhatsApp in new tab / app
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }

      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setAge("");
      setGoal("");
      setHealthNotes("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please reach out directly on WhatsApp or call."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 bg-[#070507] border-t border-white/10 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute bottom-0 right-10 w-[500px] h-[500px] rounded-full bg-red-600/[0.08] blur-[150px]" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <span className="inline-block font-condensed text-xs font-bold uppercase tracking-[0.25em] text-red-400 border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 rounded-full mb-4 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
                Free Consultation
              </span>
              <h2 className="font-condensed text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
                Book Your Free Session Today
              </h2>
              <p className="mt-3 text-steel-300 text-base">
                Fill in the form — your request will automatically be sent to my{" "}
                <strong className="text-white font-bold">Admin Panel</strong> &amp;{" "}
                <strong className="text-emerald-400 font-bold">WhatsApp</strong> for immediate scheduling.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {["100% Free", "Direct WhatsApp & Admin", "Reply in 24hrs"].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-obsidian-850 border border-white/10 text-xs font-condensed font-bold uppercase tracking-wider text-steel-200"
                >
                  <Check className="w-3.5 h-3.5 text-red-500" />
                  {b}
                </span>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-obsidian-850 border border-white/10 hover-red-glow transition-all">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-sm font-semibold text-white">
                    Private Coaching Studio
                  </strong>
                  <span className="text-sm text-steel-400">
                    Malir Cantt, Karachi
                    <br />
                    Opposite KIMS · Near CMH
                  </span>
                </div>
              </div>

              <a
                href="tel:+923262371372"
                className="flex items-center gap-4 p-4 rounded-2xl bg-obsidian-850 border border-white/10 hover-red-glow transition-all"
              >
                <Phone className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-sm font-semibold text-white">
                  +92 326 2371372
                </span>
              </a>

              <a
                href="mailto:02ahsanhussain@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-obsidian-850 border border-white/10 hover-red-glow transition-all"
              >
                <Mail className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-sm font-semibold text-white">
                  02ahsanhussain@gmail.com
                </span>
              </a>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="https://www.instagram.com/ahsan_hussain02?igsh=MTdqeDBrZ2llcDFjMw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-obsidian-850 border border-white/15 hover:border-pink-500/50 hover:text-pink-400 text-sm font-condensed font-bold uppercase tracking-wider text-white transition-all"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                Instagram
              </a>
              <a
                href="https://wa.me/923262371372"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 text-sm font-condensed font-black uppercase tracking-wider text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                WhatsApp Direct
              </a>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.form
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            onSubmit={handleSubmit}
            className="lg:col-span-7 rounded-3xl bg-obsidian-850 border border-white/10 hover-red-glow p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="border-b border-white/10 pb-4 mb-2">
              <h3 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">
                Consultation Request
              </h3>
              <p className="text-xs text-steel-400">
                Fills will be stored to Admin Panel &amp; forwarded to WhatsApp for instant confirmation.
              </p>
            </div>

            {status === "success" && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl bg-gradient-to-r from-red-950/80 to-emerald-950/80 border border-red-500/40 text-sm text-white shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  ✅ Request saved to Admin Panel &amp; WhatsApp message prepared! Ahsan will reply promptly.
                </span>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-sm text-red-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 000 0000"
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min={10}
                  max={80}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Main Goal *
                </label>
                <select
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white outline-none"
                >
                  <option value="">Select your primary goal...</option>
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Current Fitness Level
                </label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white outline-none"
                >
                  <option value="Beginner">Beginner (0 - 6 months)</option>
                  <option value="Intermediate">
                    Intermediate (6 - 24 months)
                  </option>
                  <option value="Advanced">
                    Advanced (2+ years experience)
                  </option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Training Preference
                </label>
                <select
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white outline-none"
                >
                  <option value="In-Person Training">
                    In-Person Training (Karachi)
                  </option>
                  <option value="Online Coaching">Online Coaching</option>
                  <option value="Both options">Both Options Work</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Preferred Session Time
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white outline-none"
                >
                  <option value="Flexible">Flexible / Any Time</option>
                  <option value="Morning (6am-10am)">
                    Morning (6am – 10am)
                  </option>
                  <option value="Afternoon (10am-2pm)">
                    Afternoon (10am – 2pm)
                  </option>
                  <option value="Evening (4pm-8pm)">
                    Evening (4pm – 8pm)
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                Any Injuries or Health Conditions?{" "}
                <span className="text-steel-600">(optional)</span>
              </label>
              <input
                type="text"
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
                placeholder="e.g. Lower back stiffness, knee issues, or none"
                className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                Additional Details / Goals
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell Ahsan about your current routine and what you want to achieve..."
                className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-condensed font-black text-base uppercase tracking-wider transition-all shadow-[0_12px_40px_rgba(220,38,38,0.5)] hover:scale-[1.01]"
            >
              <span>{submitting ? "Processing..." : "Book Free Consultation & Open WhatsApp"}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
            <p className="text-center text-xs text-steel-400">
              Saves instantly to Admin Panel and opens direct WhatsApp with your details.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
