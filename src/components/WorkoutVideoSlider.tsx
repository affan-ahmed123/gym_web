"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Stethoscope,
  Target,
  Dumbbell,
  Sparkles,
  Timer,
  CheckCircle2,
} from "lucide-react";
import type { WorkoutVideoItem } from "@/types/fitness";

interface WorkoutVideoSliderProps {
  videos?: WorkoutVideoItem[];
}

const DEFAULT_REAL_VIDEOS: WorkoutVideoItem[] = [
  {
    id: "vid-1",
    title: "Barbell Back Squat & Lower Body Power",
    category: "Strength & Hypertrophy",
    videoUrl: "/videos/1.mp4",
    posterUrl: "",
    tag: "Leg Mastery · 4 Sets × 8 Reps",
    cue: "Drive knees out · Chest proud · Explode through heels",
    durationSeconds: 7,
  },
  {
    id: "vid-2",
    title: "Incline Dumbbell Chest Press & Pec Contraction",
    category: "Chest Hypertrophy",
    videoUrl: "/videos/3.mp4",
    posterUrl: "",
    tag: "Hypertrophy Tempo · 3-1-1 Cadence",
    cue: "Controlled eccentric stretch · Lock elbows at 85%",
    durationSeconds: 7,
  },
  {
    id: "vid-3",
    title: "Overhead Dumbbell Shoulder Press",
    category: "Deltoid Conditioning",
    videoUrl: "/videos/5.mp4",
    posterUrl: "",
    tag: "Shoulder Boulders · 4 Sets × 10 Reps",
    cue: "Engage core · Push vertically · Controlled descent",
    durationSeconds: 7,
  },
  {
    id: "vid-4",
    title: "Bent-Over Barbell Row & Lat Thickness",
    category: "Back & Posterior Chain",
    videoUrl: "/videos/6.mp4",
    posterUrl: "",
    tag: "Lat Hypertrophy · Strict Form",
    cue: "Hinge at hips · Pull elbows behind torso · Squeeze scapula",
    durationSeconds: 7,
  },
  {
    id: "vid-5",
    title: "Strict Standing Bicep Curls & Peak Contraction",
    category: "Arm Sculpting",
    videoUrl: "/videos/10.mp4",
    posterUrl: "",
    tag: "Bicep Peak · Isolated Contraction",
    cue: "Pin elbows to ribs · Supinate pinky at the apex · Zero momentum",
    durationSeconds: 7,
  },
  {
    id: "vid-6",
    title: "Athletic Core Stabilization & Anti-Rotation",
    category: "Core & Kinetic Power",
    videoUrl: "/videos/11.mp4",
    posterUrl: "",
    tag: "Functional Core · Kinetic Stability",
    cue: "Brace deep transverse abdominis · Maintain rigid torso align",
    durationSeconds: 7,
  },
  {
    id: "vid-7",
    title: "Dynamic Kinetic Mobility & Explosive Conditioning",
    category: "Functional Athleticism",
    videoUrl: "/videos/12.mp4",
    posterUrl: "",
    tag: "Athletic Conditioning · Full Agility",
    cue: "Triple extension · Smooth decelerations · Max metabolic output",
    durationSeconds: 7,
  },
];

const SPECIALTIES = [
  {
    icon: Flame,
    title: "Fat Loss & Physique",
    sub: "Metabolic conditioning & hypertrophy",
    accent: "text-red-400 bg-red-500/10 border-red-500/25",
  },
  {
    icon: Zap,
    title: "Muscle Development",
    sub: "Targeted hypertrophy & progressive overload",
    accent: "text-volt-300 bg-volt-400/10 border-volt-400/25",
  },
  {
    icon: Stethoscope,
    title: "Rehabilitation & Posture",
    sub: "Corrective kinematics & mobility restoration",
    accent: "text-athletic-cyan bg-athletic-cyan/10 border-athletic-cyan/25",
  },
  {
    icon: Target,
    title: "1-on-1 & Online Coaching",
    sub: "Personalized programming worldwide",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  },
];

export function WorkoutVideoSlider({
  videos = DEFAULT_REAL_VIDEOS,
}: WorkoutVideoSliderProps) {
  const activeVideos =
    videos && videos.length > 0 ? videos : DEFAULT_REAL_VIDEOS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = activeVideos[currentIndex] || activeVideos[0];
  const slideDuration = current?.durationSeconds || 7;

  // Handle slide transitions
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeVideos.length);
    setProgress(0);
    setIsBuffering(true);
  }, [activeVideos.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + activeVideos.length) % activeVideos.length
    );
    setProgress(0);
    setIsBuffering(true);
  }, [activeVideos.length]);

  // Reset video and play when slide changes
  useEffect(() => {
    setProgress(0);
    setIsBuffering(true);
    setHasVideoError(false);
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = isMuted;
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => { });
            }
          });
        }
      }
    }
  }, [currentIndex, isPlaying, isMuted]);

  // Sync progress bar directly to actual video playback
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (dur && dur > 0) {
      setProgress((videoRef.current.currentTime / dur) * 100);
    }
  };

  // Auto-advance smoothly when the reel finishes playing
  const handleVideoEnded = () => {
    handleNext();
  };

  // Fallback watchdog: if video has no duration or network stalls, advance after slideDuration + 3s
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setTimeout(() => {
      handleNext();
    }, (slideDuration + 4) * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, isHovered, slideDuration, handleNext]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="about" className="py-16 sm:py-24 bg-obsidian-950 relative overflow-hidden w-full max-w-full">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-red-600/[0.05] blur-[160px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-volt-400/[0.03] blur-[160px]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-8 relative z-10 w-full overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: Dynamic Workout Reel Showcase */}
          <div className="lg:col-span-6 relative w-full overflow-hidden">
            <div
              className="relative mx-auto w-full max-w-[420px] sm:max-w-[500px]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Outer Glowing Frame */}
              <div className="relative aspect-[9/13.5] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-obsidian-900 border-2 border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.95)] group">
                {/* Active Video Player with Real Playback Event Sync */}
                <video
                  ref={videoRef}
                  key={current.videoUrl}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => setIsBuffering(false)}
                  onCanPlay={() => setIsBuffering(false)}
                  onError={() => {
                    setIsBuffering(false);
                    setHasVideoError(true);
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                >
                  <source src={current.videoUrl} type="video/mp4" />
                  <source
                    src={current.videoUrl.replace(/\.mp4$/i, ".MOV")}
                    type="video/quicktime"
                  />
                </video>

                {/* Sleek Buffering & Loading Indicator */}
                {isBuffering && !hasVideoError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[2px] z-20 pointer-events-none">
                    <div className="w-10 h-10 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin mb-2 shadow-[0_0_15px_#ef4444]" />
                    <span className="text-[10px] font-condensed uppercase tracking-widest text-steel-400">
                      Loading Reel...
                    </span>
                  </div>
                )}

                {/* Top Timing Progress Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-black/60 z-30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-volt-400 shadow-[0_0_10px_#ef4444]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>

                {/* Top Overlay Badge & Controls (Blinking dot removed) */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-[11px] font-condensed font-black uppercase tracking-wider text-red-400 shadow-xl">
                    {current.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Slide Counter Pill */}
                    <span className="px-2.5 py-1 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-[10px] font-mono text-steel-300 font-bold">
                      {String(currentIndex + 1).padStart(2, "0")} /{" "}
                      {String(activeVideos.length).padStart(2, "0")}
                    </span>

                    {/* Sound Toggle */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label="Toggle mute"
                      className="p-2 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-white hover:text-red-400 transition-colors shadow-xl"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-volt-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Play/Pause Center Tap Area */}
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play or pause workout video"
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-obsidian-950/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform">
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </div>
                </button>

                {/* Left / Right Slide Arrow Controls */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous video"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-white hover:text-red-400 hover:border-red-500/50 flex items-center justify-center shadow-2xl transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next video"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-white hover:text-red-400 hover:border-red-500/50 flex items-center justify-center shadow-2xl transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Minimalist Reel Indicator Dots (Clean & Modern) */}
              <div className="mt-3.5 flex items-center justify-center gap-1.5">
                {activeVideos.map((_, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setProgress(0);
                      }}
                      aria-label={`Go to reel ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-8 bg-gradient-to-r from-red-600 via-rose-500 to-red-500 shadow-[0_0_10px_#ef4444]"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Ahsan's Bio & Specialties */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-block font-condensed text-xs font-bold uppercase tracking-[0.25em] text-red-400 border border-red-500/30 bg-obsidian-850 px-3.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.15)] mb-3">
                About Coach Ahsan
              </span>

              <h2 className="font-condensed text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.08] break-words">
                Unlocking Peak Physical Potential Through Proven Science
              </h2>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-steel-200 leading-relaxed">
              I&apos;m <strong className="text-white font-bold">Ahsan Hussain</strong>, a
              certified elite fitness professional with over 9 years of hands-on experience
              guiding clients from complete beginners to competitive athletes toward sustainable
              hypertrophy, rapid fat loss, and bulletproof joint health.
            </p>

            <p className="text-xs sm:text-base text-steel-400 leading-relaxed">
              Holding a Diploma in Fitness Training, UK Registered Level 1 &amp; 2 Certification,
              TRX Suspension Training credentials, and First Aid with CPR &amp; AED, every session
              is engineered around biomechanical safety and progressive overload.
            </p>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm text-steel-300 min-w-0 flex-1 leading-snug">
                <strong className="text-white">In-Person Coaching:</strong> Malir Cantt, Karachi &amp; Global Online Video Coaching.
              </div>
            </div>

            {/* Specialties Grid (Responsive 1-col on mobile, 2-col on sm+) */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 w-full min-w-0">
              {SPECIALTIES.map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <motion.div
                    key={spec.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -3, borderColor: "rgba(239,68,68,0.4)" }}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-obsidian-850 border border-white/10 transition-all hover:bg-obsidian-800 min-w-0 overflow-hidden"
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border ${spec.accent}`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="block font-condensed text-xs sm:text-base uppercase tracking-wide text-white leading-tight truncate">
                        {spec.title}
                      </strong>
                      <span className="text-[10px] sm:text-xs text-steel-400 block truncate">
                        {spec.sub}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
