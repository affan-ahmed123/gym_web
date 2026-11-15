"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, CheckCircle2, AlertCircle, Quote } from "lucide-react";
import type { ReviewItem } from "@/types/fitness";

interface TestimonialsSectionProps {
  reviews: ReviewItem[];
  loading: boolean;
  onReviewAdded: (review: ReviewItem) => void;
}

const SERVICE_OPTIONS = [
  "Body Transformation",
  "Fat Loss",
  "Muscle Gain",
  "TRX Training",
  "Rehabilitation",
  "Online Coaching",
  "Strength Training",
  "Nutrition Coaching",
];

function formatReviewDate(ts: number): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  const h = Math.floor(d / 3600000);
  const dy = Math.floor(d / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (dy < 30) return `${dy}d ago`;
  return formatReviewDate(ts);
}

export function TestimonialsSection({
  reviews,
  loading,
  onReviewAdded,
}: TestimonialsSectionProps) {
  const [name, setName] = useState("");
  const [service, setService] = useState("Body Transformation");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total
      ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
      : "0.0";
    const counts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
    const maxCount = Math.max(...counts.map((c) => c.count), 1);
    return { total, avg, counts, maxCount };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setSubmitStatus("idle");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          service,
          duration: duration.trim(),
          rating,
          message: message.trim(),
        }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          res.ok
            ? "Unexpected response from server."
            : `Server response error (${res.status}). Please try again.`
        );
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save review. Please try again.");
      }

      if (data?.review) {
        onReviewAdded(data.review);
      }
      setSubmitStatus("success");
      setName("");
      setDuration("");
      setRating(5);
      setMessage("");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (err) {
      setSubmitStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Error — try again later"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-[#070507] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block font-condensed text-xs font-bold uppercase tracking-[0.25em] text-red-400 border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 rounded-full mb-4 shadow-[0_0_12px_rgba(239,68,68,0.15)]">
            Client Results
          </span>
          <h2 className="font-condensed text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            What Clients Say
          </h2>
          <p className="mt-3 text-steel-300 text-base sm:text-lg">
            Real feedback from real clients — stored live in MongoDB Atlas.
          </p>
        </div>

        {/* Rating Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="rounded-3xl bg-[#110c11] border border-white/10 hover-red-glow p-6 sm:p-8 mb-10 grid md:grid-cols-12 gap-6 items-center shadow-xl"
        >
          <div className="md:col-span-3 text-center md:border-r border-white/10 md:pr-6">
            <div className="font-display text-5xl text-white leading-none font-bold">
              {stats.total}
            </div>
            <div className="mt-1 font-condensed text-xs uppercase tracking-widest text-steel-400">
              Total Reviews
            </div>
          </div>

          <div className="md:col-span-3 text-center md:border-r border-white/10 md:pr-6">
            <div className="font-display text-5xl crimson-shimmer-text leading-none font-bold">
              {stats.avg}
            </div>
            <div className="mt-1 font-condensed text-xs uppercase tracking-widest text-red-400 font-semibold">
              Avg Rating
            </div>
          </div>

          <div className="md:col-span-6 space-y-2">
            {stats.counts.map((row) => {
              const pct = Math.round((row.count / stats.maxCount) * 100);
              return (
                <div key={row.star} className="flex items-center gap-3 text-xs">
                  <span className="w-10 font-condensed font-bold text-yellow-400 flex items-center gap-0.5">
                    {row.star}<Star className="w-3 h-3 fill-yellow-400 text-yellow-400 inline" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-obsidian-800 overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                    />
                  </div>
                  <span className="w-6 text-right text-steel-400 tabular-nums">
                    {row.count}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Reviews Grid — Compact Landscape Cards (2 per row on Mobile, 4 per row on Desktop) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-10 sm:mb-14">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-32 sm:h-36 rounded-xl sm:rounded-2xl bg-[#110c11] border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl bg-[#110c11]/80 border border-dashed border-white/15 p-8 text-center mb-10 sm:mb-14">
            <Star className="w-7 h-7 text-yellow-400 mx-auto mb-2" />
            <p className="text-steel-400 text-xs sm:text-sm">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-10 sm:mb-14">
            <AnimatePresence>
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.25) }}
                  className="rounded-xl sm:rounded-2xl bg-[#110c11] border border-white/10 hover-red-glow p-3 sm:p-4 flex flex-col justify-between transition-all shadow-md group min-h-[145px] sm:min-h-[160px]"
                >
                  <div>
                    {/* Top Row: 5 Glowing Yellow Stars & Quote Mark */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                              idx < r.rating
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.85)]"
                                : "text-steel-700"
                            }`}
                          />
                        ))}
                      </div>
                      <Quote className="w-3.5 h-3.5 text-steel-700 group-hover:text-yellow-400/40 transition-colors rotate-180 shrink-0" />
                    </div>

                    {/* Compact Landscape Review Text */}
                    <p className="text-[11px] sm:text-xs text-steel-200 leading-snug italic line-clamp-3 sm:line-clamp-4">
                      &ldquo;{r.message}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Client Metadata Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-auto">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-yellow-400/50 bg-yellow-400/10 flex items-center justify-center font-display font-black text-yellow-300 text-[10px] sm:text-xs shrink-0 shadow-[0_0_8px_rgba(250,204,21,0.15)]">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <strong className="block text-[11px] sm:text-xs font-bold text-white capitalize leading-tight truncate">
                        {r.name}
                      </strong>
                      <span className="block text-[9px] sm:text-[10px] text-steel-400 truncate">
                        {r.service}
                        {r.duration ? ` · ${r.duration}` : ""}
                      </span>
                      <span className="block text-[8px] sm:text-[9px] text-steel-500 font-mono">
                        {formatReviewDate(r.ts)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Submit Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="max-w-2xl mx-auto rounded-3xl bg-[#110c11] border border-white/10 hover-red-glow p-6 sm:p-8 shadow-2xl"
        >
          <div className="mb-6">
            <span className="inline-block font-condensed text-[11px] font-bold uppercase tracking-[0.22em] text-red-400 border border-red-500/30 bg-red-950/40 px-3 py-1 rounded-full mb-2">
              Share Your Experience
            </span>
            <h3 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-white">
              Leave a Review
            </h3>
            <p className="text-sm text-steel-400 mt-1">
              Trained with Ahsan? Share your results.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ali Hassan"
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Training Type
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Duration (optional)
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 3 months"
                  className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5 py-1.5">
                  {[1, 2, 3, 4, 5].map((v) => {
                    const active = (hoveredStar ?? rating) >= v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onMouseEnter={() => setHoveredStar(v)}
                        onMouseLeave={() => setHoveredStar(null)}
                        onClick={() => setRating(v)}
                        className="p-0.5 transition-transform hover:scale-125"
                        aria-label={`Rate ${v} stars`}
                      >
                        <Star
                          className={`w-6 h-6 transition-all ${active
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.85)] scale-110"
                            : "text-steel-600 hover:text-yellow-400/60"
                            }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-condensed uppercase tracking-wider text-steel-400">
                  Your Review *
                </label>
                <span className="text-xs text-steel-500">
                  {message.length} / 500
                </span>
              </div>
              <textarea
                rows={4}
                required
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your experience and results..."
                className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-600 outline-none transition-colors resize-none"
              />
            </div>

            {submitStatus === "success" && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/60 border border-red-500/30 rounded-xl px-4 py-2.5 shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                <span>Review published to MongoDB Atlas!</span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-300 bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-2.5">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-60 text-white font-condensed font-black text-base uppercase tracking-wider transition-all shadow-[0_10px_35px_rgba(220,38,38,0.5)]"
            >
              <span>{submitting ? "Saving..." : "Submit Review"}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
