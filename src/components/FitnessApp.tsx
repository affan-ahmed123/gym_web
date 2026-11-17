"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReviewItem, WorkoutVideoItem, NutritionProduct } from "@/types/fitness";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import {
  FitnessMarquee,
} from "./FitnessMotionElements";
import { WorkoutVideoSlider } from "./WorkoutVideoSlider";
import { ServicesSection } from "./ServicesSection";
import { NutritionSection } from "./NutritionSection";
import { QualificationsSection } from "./QualificationsSection";
import { MissionSection } from "./MissionSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import { AdminModals } from "./AdminModals";
import { LoadingScreen } from "./LoadingScreen";
import { FitAssistChatbot } from "./FitAssistChatbot";

interface FitnessAppProps {
  initialReviews: ReviewItem[];
  initialPhotoUrl: string | null;
  initialPhotoWidth?: number;
  initialPhotoHeight?: number;
  initialPhotoProvider?: string;
  initialWorkoutVideos?: WorkoutVideoItem[];
}

export function FitnessApp({
  initialReviews,
  initialPhotoUrl = "/ahsan-cutout.png",
  initialPhotoWidth = 800,
  initialPhotoHeight = 1000,
  initialPhotoProvider = "local",
  initialWorkoutVideos = [],
}: FitnessAppProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    initialPhotoUrl || "/ahsan-cutout.png"
  );
  const [photoWidth, setPhotoWidth] = useState(initialPhotoWidth);
  const [photoHeight, setPhotoHeight] = useState(initialPhotoHeight);
  const [photoProvider, setPhotoProvider] = useState(initialPhotoProvider);
  const [workoutVideos, setWorkoutVideos] = useState<WorkoutVideoItem[]>(
    initialWorkoutVideos
  );
  const [nutritionProducts, setNutritionProducts] = useState<NutritionProduct[] | null>(null);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    // Check current admin session
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => {
        if (d?.authenticated) setIsAdmin(true);
      })
      .catch(() => { });

    // Refresh reviews, Cloudinary photo metadata, workout videos, and nutrition
    setReviewsLoading(true);
    Promise.all([
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/profile-photo").then((r) => r.json()),
      fetch("/api/workout-videos").then((r) => r.json()),
      fetch("/api/nutrition").then((r) => r.json()),
    ])
      .then(([revData, photoData, videoData, nutrData]) => {
        if (Array.isArray(revData?.reviews)) {
          setReviews(revData.reviews);
        }
        if (photoData) {
          if (photoData.photoUrl) setPhotoUrl(photoData.photoUrl);
          if (photoData.width) setPhotoWidth(photoData.width);
          if (photoData.height) setPhotoHeight(photoData.height);
          if (photoData.provider) setPhotoProvider(photoData.provider);
        }
        if (Array.isArray(videoData?.videos)) {
          setWorkoutVideos(videoData.videos);
        }
        if (Array.isArray(nutrData?.products)) {
          setNutritionProducts(nutrData.products);
        }
      })
      .catch(() => { })
      .finally(() => setReviewsLoading(false));
  }, []);

  const handleSelectGoalAndScroll = (goalValue: string) => {
    setSelectedGoal(goalValue);
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAdminTrigger = () => {
    if (isAdmin) {
      setPanelOpen(true);
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070507] text-steel-100 selection:bg-red-600 selection:text-white overflow-x-hidden w-full min-w-0">
      {/* Intro Loading Screen Before Opening Portfolio */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <Navbar onSecretAdminTrigger={handleAdminTrigger} />

      <main className="overflow-x-hidden w-full min-w-0">
        {/* Reference Hero Theme with Ahsan Cutout & Crimson Aura */}
        <HeroSection heroPhotoUrl={photoUrl || "/ahsan-cutout.png"} />

        <FitnessMarquee />

        {/* Workout Video Sliding Carousel */}
        <WorkoutVideoSlider videos={workoutVideos} />

        <ServicesSection onSelectService={handleSelectGoalAndScroll} />
        <NutritionSection products={nutritionProducts ?? undefined} />
        <QualificationsSection />
        <MissionSection />
        <TestimonialsSection
          reviews={reviews}
          loading={reviewsLoading}
          onReviewAdded={(review) => setReviews((prev) => [review, ...prev])}
        />
        <ContactSection selectedGoal={selectedGoal} />
      </main>

      {/* FitAssist AI Chatbot Companion */}
      <FitAssistChatbot />

      <Footer onOpenAdmin={handleAdminTrigger} />

      <AdminModals
        isAdmin={isAdmin}
        loginOpen={loginOpen}
        panelOpen={panelOpen}
        onCloseLogin={() => setLoginOpen(false)}
        onClosePanel={() => setPanelOpen(false)}
        onOpenPanel={() => setPanelOpen(true)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setLoginOpen(false);
          setPanelOpen(true);
          showToast("Admin mode activated!");
        }}
        onLogout={() => {
          setIsAdmin(false);
          setPanelOpen(false);
          showToast("Admin mode deactivated.");
        }}
        photoUrl={photoUrl}
        photoWidth={photoWidth}
        photoHeight={photoHeight}
        photoProvider={photoProvider}
        onPhotoUpdated={(meta) => {
          setPhotoUrl(meta.url);
          setPhotoWidth(meta.width);
          setPhotoHeight(meta.height);
          setPhotoProvider(meta.provider);
        }}
        reviews={reviews}
        onReviewDeleted={(id) =>
          setReviews((prev) => prev.filter((r) => r.id !== id))
        }
        workoutVideos={workoutVideos}
        onVideosUpdated={(updated) => setWorkoutVideos(updated)}
        nutritionProducts={nutritionProducts || []}
        onNutritionUpdated={(updated) => setNutritionProducts(updated)}
        showToast={showToast}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-condensed font-black text-sm uppercase tracking-wider shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
