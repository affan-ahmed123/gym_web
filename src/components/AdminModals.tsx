"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  X,
  Upload,
  Trash2,
  LogOut,
  Database,
  Camera,
  MessageSquare,
  CalendarCheck,
  CloudLightning,
  Sparkles,
  Sliders,
  Video,
  Plus,
  Apple,
} from "lucide-react";
import type {
  ConsultationItem,
  ConsultationStatus,
  HealthStatus,
  NutritionProduct,
  ReviewItem,
  WorkoutVideoItem,
} from "@/types/fitness";

interface AdminModalsProps {
  isAdmin: boolean;
  loginOpen: boolean;
  panelOpen: boolean;
  onCloseLogin: () => void;
  onClosePanel: () => void;
  onOpenPanel: () => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
  photoUrl: string | null;
  photoWidth: number;
  photoHeight: number;
  photoProvider: string;
  onPhotoUpdated: (meta: {
    url: string | null;
    width: number;
    height: number;
    provider: string;
  }) => void;
  reviews: ReviewItem[];
  onReviewDeleted: (id: string) => void;
  workoutVideos: WorkoutVideoItem[];
  onVideosUpdated: (videos: WorkoutVideoItem[]) => void;
  nutritionProducts: NutritionProduct[];
  onNutritionUpdated: (products: NutritionProduct[]) => void;
  showToast: (msg: string) => void;
}

function prepareImage(file: File, targetW: number, targetH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context not available"));

        const imgRatio = img.width / img.height;
        const targetRatio = targetW / targetH;
        let sx = 0,
          sy = 0,
          sw = img.width,
          sh = img.height;

        if (imgRatio > targetRatio) {
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetRatio;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL("image/png", 0.95));
      };
      img.onerror = () => reject(new Error("Invalid image format"));
      img.src = ev.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
}

export function AdminModals({
  isAdmin,
  loginOpen,
  panelOpen,
  onCloseLogin,
  onClosePanel,
  onOpenPanel,
  onLoginSuccess,
  onLogout,
  photoUrl,
  photoWidth,
  photoHeight,
  photoProvider,
  onPhotoUpdated,
  reviews,
  onReviewDeleted,
  workoutVideos,
  onVideosUpdated,
  nutritionProducts,
  onNutritionUpdated,
  showToast,
}: AdminModalsProps) {
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "photo" | "nutrition" | "videos" | "reviews" | "consultations"
  >("photo");

  // Picture Dimension Controls
  const [targetWidth, setTargetWidth] = useState(photoWidth || 800);
  const [targetHeight, setTargetHeight] = useState(photoHeight || 1000);
  const [selectedPreset, setSelectedPreset] = useState<string>("800x1000");

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [directImageUrl, setDirectImageUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(false);

  // Nutrition Product Form States
  const [nutrTitle, setNutrTitle] = useState("");
  const [nutrCategory, setNutrCategory] = useState("Whey Protein");
  const [nutrPrice, setNutrPrice] = useState("");
  const [nutrServing, setNutrServing] = useState("");
  const [nutrDesc, setNutrDesc] = useState("");
  const [nutrBadge, setNutrBadge] = useState("");
  const [nutrImageUrl, setNutrImageUrl] = useState("");
  const [nutrFile, setNutrFile] = useState<File | null>(null);
  const [nutrPreview, setNutrPreview] = useState<string | null>(null);
  const [savingNutr, setSavingNutr] = useState(false);

  // Workout Video Form States
  const [vidTitle, setVidTitle] = useState("");
  const [vidCategory, setVidCategory] = useState("Strength & Power");
  const [vidUrl, setVidUrl] = useState("");
  const [vidTag, setVidTag] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);

  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    if (!panelOpen || !isAdmin) return;

    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setHealth(d))
      .catch(() =>
        setHealth({
          configured: false,
          connected: false,
          message: "Unable to check database",
        })
      );

    fetch("/api/profile-photo")
      .then((r) => r.json())
      .then((d) => {
        if (d?.cloudinaryConfigured !== undefined) {
          setCloudinaryConfigured(Boolean(d.cloudinaryConfigured));
        }
        if (d?.width) setTargetWidth(d.width);
        if (d?.height) setTargetHeight(d.height);
      })
      .catch(() => { });

    setLoadingConsultations(true);
    fetch("/api/consultations")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.consultations)) {
          setConsultations(d.consultations);
        }
      })
      .catch(() => { })
      .finally(() => setLoadingConsultations(false));
  }, [panelOpen, isAdmin]);

  const handlePresetSelect = (presetKey: string, w: number, h: number) => {
    setSelectedPreset(presetKey);
    setTargetWidth(w);
    setTargetHeight(h);
    if (pendingFile) {
      prepareImage(pendingFile, w, h).then(setPendingPreview);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data?.error || "Invalid password. Please try again.");
        setPassword("");
        return;
      }
      setPassword("");
      onLoginSuccess();
    } catch {
      setPwError("Login failed. Try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) {
      showToast("File must be smaller than 12MB.");
      return;
    }

    try {
      setPendingFile(file);
      const processed = await prepareImage(file, targetWidth, targetHeight);
      setPendingPreview(processed);
      showToast(`Selected: ${file.name} (${targetWidth}x${targetHeight})`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Image processing error");
    }
  };

  const handleSavePhoto = async () => {
    const payloadPhoto = pendingPreview || directImageUrl.trim();
    if (!payloadPhoto) {
      showToast("Please select a photo or enter an image URL first.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const res = await fetch("/api/profile-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoUrl: payloadPhoto,
          width: targetWidth,
          height: targetHeight,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");

      onPhotoUpdated({
        url: data.photoUrl,
        width: data.width || targetWidth,
        height: data.height || targetHeight,
        provider: data.provider || "cloudinary",
      });
      setPendingFile(null);
      setPendingPreview(null);
      setDirectImageUrl("");
      showToast("Trainer photo updated successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddWorkoutVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim() || !vidUrl.trim()) {
      showToast("Please enter both video title and URL.");
      return;
    }

    setSavingVideo(true);
    try {
      const res = await fetch("/api/workout-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video: {
            title: vidTitle.trim(),
            category: vidCategory,
            videoUrl: vidUrl.trim(),
            tag: vidTag.trim() || "Workout Clip",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save video");

      onVideosUpdated(data.videos);
      setVidTitle("");
      setVidUrl("");
      setVidTag("");
      showToast("Workout video slide added successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add video");
    } finally {
      setSavingVideo(false);
    }
  };

  const handleDeleteWorkoutVideo = async (id: string) => {
    if (!confirm("Delete this workout video from the slider?")) return;
    try {
      const res = await fetch(`/api/workout-videos?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Delete failed");
      onVideosUpdated(data.videos);
      showToast("Workout video removed successfully.");
    } catch {
      showToast("Failed to delete video");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onReviewDeleted(id);
      showToast("Review deleted successfully.");
    } catch {
      showToast("Failed to delete review.");
    }
  };

  const handleUpdateConsultationStatus = async (
    id: string,
    status: ConsultationStatus
  ) => {
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      showToast("Lead status updated");
    } catch {
      showToast("Status update failed");
    }
  };

  const handleDeleteConsultation = async (id: string) => {
    if (!confirm("Delete this consultation request?")) return;
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setConsultations((prev) => prev.filter((c) => c.id !== id));
      showToast("Consultation request deleted successfully.");
    } catch {
      showToast("Delete failed");
    }
  };

  const handleNutrFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("File size must be under 10MB");
      return;
    }
    try {
      setNutrFile(file);
      const processed = await prepareImage(file, 600, 600);
      setNutrPreview(processed);
      showToast("Image preview ready for product");
    } catch {
      showToast("Failed to process image");
    }
  };

  const handleAddNutritionProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = nutrPreview || nutrImageUrl.trim();
    if (
      !nutrTitle.trim() ||
      !nutrPrice.trim() ||
      !nutrDesc.trim() ||
      !finalImage
    ) {
      showToast("Title, Price, Description, and Image are required.");
      return;
    }

    setSavingNutr(true);
    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: nutrTitle.trim(),
          category: nutrCategory,
          price: nutrPrice.trim(),
          servingSize: nutrServing.trim(),
          description: nutrDesc.trim(),
          badge: nutrBadge.trim(),
          imageUrl: finalImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add product");

      onNutritionUpdated(data.products);
      setNutrTitle("");
      setNutrPrice("");
      setNutrServing("");
      setNutrDesc("");
      setNutrBadge("");
      setNutrImageUrl("");
      setNutrFile(null);
      setNutrPreview(null);
      showToast("Nutrition product added successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setSavingNutr(false);
    }
  };

  const handleDeleteNutritionProduct = async (id: string) => {
    if (!confirm("Delete this nutrition product?")) return;
    try {
      const res = await fetch(`/api/nutrition?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Delete failed");
      onNutritionUpdated(data.products);
      showToast("Nutrition product deleted successfully.");
    } catch {
      showToast("Failed to delete product.");
    }
  };

  return (
    <>
      {/* Persistent Bottom Right Admin Floating Pill */}
      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-[130] flex items-center gap-2 bg-obsidian-900/95 backdrop-blur-md border border-red-500/40 rounded-full px-4 py-2 shadow-2xl text-xs font-condensed uppercase tracking-wider text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>Admin Active</span>
          <button
            type="button"
            onClick={onOpenPanel}
            className="ml-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black hover:brightness-110 transition-all shadow-lg"
          >
            Control Panel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1 text-steel-400 hover:text-white"
            aria-label="Admin Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Admin Login Modal */}
      <AnimatePresence>
        {loginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onCloseLogin();
            }}
            className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-obsidian-850 border border-red-500/30 p-7 shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-condensed text-2xl font-bold uppercase text-white">
                Trainer Control Panel
              </h3>
              <p className="text-xs text-steel-400 mt-1 mb-5">
                Enter master password to access trainer controls
              </p>

              {pwError && (
                <div className="mb-3 text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-xl py-2 px-3">
                  {pwError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full rounded-xl bg-obsidian-900 border border-white/15 focus:border-red-500 px-3.5 py-2.5 text-sm text-white outline-none text-center"
                />
                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-condensed font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:brightness-110"
                >
                  {loggingIn ? "Verifying..." : "Access Control Panel"}
                </button>
                <button
                  type="button"
                  onClick={onCloseLogin}
                  className="w-full py-2 text-xs font-condensed uppercase tracking-widest text-steel-400 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Control Panel Modal */}
      <AnimatePresence>
        {panelOpen && isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onClosePanel();
            }}
            className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-obsidian-850 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-900">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-condensed font-black uppercase tracking-[0.2em] text-white bg-red-600 px-3 py-1 rounded-full shadow-lg">
                    Admin Active
                  </span>
                  <h3 className="font-condensed text-2xl font-bold uppercase text-white">
                    Trainer Control Studio
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClosePanel}
                  className="p-2 rounded-xl bg-obsidian-800 border border-white/10 text-steel-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Bar */}
              <div className="px-6 py-2.5 bg-obsidian-900/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-steel-300">
                  <Database className="w-3.5 h-3.5 text-red-400" />
                  <span>MongoDB Atlas:</span>
                  <span
                    className={`font-semibold ${health?.connected ? "text-emerald-400" : "text-amber-300"
                      }`}
                  >
                    {health?.connected ? "Connected" : health?.message || "Checking..."}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-steel-300">
                  <CloudLightning className="w-3.5 h-3.5 text-volt-400" />
                  <span>Cloudinary CDN:</span>
                  <span
                    className={`font-semibold ${cloudinaryConfigured ? "text-volt-300" : "text-steel-400"
                      }`}
                  >
                    {cloudinaryConfigured ? "Active" : "Direct Atlas Storage (Ready)"}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-3 border-b border-white/10 flex flex-wrap gap-2 bg-obsidian-900/40">
                {(
                  [
                    { id: "photo", label: "Trainer Picture", icon: Camera },
                    {
                      id: "nutrition",
                      label: `Nutrition (${nutritionProducts.length})`,
                      icon: Apple,
                    },
                    {
                      id: "videos",
                      label: `Workout Videos (${workoutVideos.length})`,
                      icon: Video,
                    },
                    {
                      id: "reviews",
                      label: `Reviews (${reviews.length})`,
                      icon: MessageSquare,
                    },
                    {
                      id: "consultations",
                      label: `Leads (${consultations.length})`,
                      icon: CalendarCheck,
                    },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-condensed font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === id
                      ? "border-red-500 text-red-400"
                      : "border-transparent text-steel-400 hover:text-steel-200"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* 1. TRAINER PHOTO STUDIO */}
                {activeTab === "photo" && (
                  <div className="space-y-6">
                    {/* Dimension Controls */}
                    <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-condensed uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          Hero Trainer Cutout Dimensions
                        </span>
                        <span className="text-[11px] text-steel-400">
                          Target: <strong className="text-white">{targetWidth} x {targetHeight}px</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            key: "800x1000",
                            label: "800 x 1000",
                            desc: "4:5 Portrait (Hero Cutout)",
                            w: 800,
                            h: 1000,
                          },
                          {
                            key: "1080x1350",
                            label: "1080 x 1350",
                            desc: "4:5 HD High-Res",
                            w: 1080,
                            h: 1350,
                          },
                          {
                            key: "600x600",
                            label: "600 x 600",
                            desc: "1:1 Square",
                            w: 600,
                            h: 600,
                          },
                        ].map((p) => {
                          const active = selectedPreset === p.key;
                          return (
                            <button
                              key={p.key}
                              type="button"
                              onClick={() => handlePresetSelect(p.key, p.w, p.h)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${active
                                ? "bg-red-500/15 border-red-500 text-white"
                                : "bg-obsidian-800 border-white/10 text-steel-400 hover:border-white/25"
                                }`}
                            >
                              <div className="font-condensed font-bold text-xs text-white">
                                {p.label}
                              </div>
                              <div className="text-[10px] text-steel-400">
                                {p.desc}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preview Box & Upload Action */}
                    <div className="grid sm:grid-cols-12 gap-5 items-start">
                      <div className="sm:col-span-5 flex flex-col items-center">
                        <div
                          className="relative rounded-2xl overflow-hidden bg-obsidian-950 border-2 border-red-500/40 w-full max-w-[210px] shadow-2xl p-2 flex items-center justify-center"
                          style={{
                            aspectRatio: `${targetWidth} / ${targetHeight}`,
                          }}
                        >
                          <img
                            src={pendingPreview || photoUrl || "/ahsan-cutout.png"}
                            alt="Profile preview"
                            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                          />
                        </div>
                        <span className="text-[10px] text-steel-400 mt-2">
                          Cutout Active: {targetWidth} x {targetHeight}
                        </span>
                      </div>

                      <div className="sm:col-span-7 space-y-4">
                        <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 space-y-3">
                          <p className="text-xs font-condensed uppercase tracking-wider text-white font-bold">
                            Update Trainer Cutout Picture
                          </p>

                          <div className="flex flex-wrap gap-2.5">
                            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-condensed font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg">
                              <Upload className="w-4 h-4 stroke-[3]" />
                              Select Photo
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="pt-2">
                            <label className="block text-[10px] font-condensed uppercase tracking-wider text-steel-400 mb-1">
                              Or Paste Cloudinary / Web Image URL
                            </label>
                            <input
                              type="url"
                              value={directImageUrl}
                              onChange={(e) => {
                                setDirectImageUrl(e.target.value);
                                if (e.target.value.startsWith("http")) {
                                  setPendingPreview(e.target.value);
                                }
                              }}
                              placeholder="https://res.cloudinary.com/..."
                              className="w-full rounded-xl bg-obsidian-800 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                            />
                          </div>

                          {(pendingPreview || directImageUrl) && (
                            <button
                              type="button"
                              disabled={uploadingPhoto}
                              onClick={handleSavePhoto}
                              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-condensed font-black text-sm uppercase tracking-wider shadow-lg transition-all hover:brightness-110"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>
                                {uploadingPhoto
                                  ? "Saving..."
                                  : "Save & Publish Hero Cutout"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. NUTRITION & SUPPLEMENTS STUDIO */}
                {activeTab === "nutrition" && (
                  <div className="space-y-6">
                    {/* Add Product Form */}
                    <form
                      onSubmit={handleAddNutritionProduct}
                      className="p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-condensed uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                          <Plus className="w-4 h-4" />
                          Add Nutrition &amp; Supplement Product
                        </span>
                        <span className="text-[11px] text-steel-400">
                          Live in Nutrition Store
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Product Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={nutrTitle}
                            onChange={(e) => setNutrTitle(e.target.value)}
                            placeholder="e.g. 100% Whey Gold Standard"
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Category
                          </label>
                          <select
                            value={nutrCategory}
                            onChange={(e) => setNutrCategory(e.target.value)}
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          >
                            <option value="Whey Protein">Whey Protein</option>
                            <option value="Creatine">Creatine</option>
                            <option value="Pre-Workout">Pre-Workout</option>
                            <option value="Recovery & Aminos">Recovery &amp; Aminos</option>
                            <option value="Vitamins & Health">Vitamins &amp; Health</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Price *
                          </label>
                          <input
                            type="text"
                            required
                            value={nutrPrice}
                            onChange={(e) => setNutrPrice(e.target.value)}
                            placeholder="e.g. PKR 18,500"
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Serving / Size (optional)
                          </label>
                          <input
                            type="text"
                            value={nutrServing}
                            onChange={(e) => setNutrServing(e.target.value)}
                            placeholder="e.g. 2.27kg · 74 Servings"
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Badge / Highlight (optional)
                          </label>
                          <input
                            type="text"
                            value={nutrBadge}
                            onChange={(e) => setNutrBadge(e.target.value)}
                            placeholder="e.g. Best Seller, 100% Authentic"
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                          Product Description *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={nutrDesc}
                          onChange={(e) => setNutrDesc(e.target.value)}
                          placeholder="e.g. 24g pure whey isolate per serving with BCAAs for rapid muscle repair..."
                          className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none resize-none"
                        />
                      </div>

                      {/* Product Image Selection */}
                      <div className="p-3.5 rounded-xl bg-obsidian-800/80 border border-white/10 space-y-3">
                        <label className="block text-xs font-condensed uppercase tracking-wider text-white font-bold">
                          Product Image (Cloudinary / File / Web URL) *
                        </label>

                        <div className="flex flex-wrap items-center gap-3">
                          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-condensed font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg">
                            <Upload className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Select Image File</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleNutrFileSelect}
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-steel-400">or enter direct URL below:</span>
                        </div>

                        <input
                          type="url"
                          value={nutrImageUrl}
                          onChange={(e) => {
                            setNutrImageUrl(e.target.value);
                            if (e.target.value.startsWith("http")) {
                              setNutrPreview(e.target.value);
                            }
                          }}
                          placeholder="https://res.cloudinary.com/... or https://..."
                          className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                        />

                        {nutrPreview && (
                          <div className="flex items-center gap-3 pt-2">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-red-500/40 bg-obsidian-900 shrink-0">
                              <img
                                src={nutrPreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs text-emerald-400 font-condensed uppercase tracking-wider font-semibold">
                              ✓ Image Loaded Ready to Publish
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={savingNutr}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-condensed font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 disabled:opacity-60"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{savingNutr ? "Publishing..." : "Publish Nutrition Product"}</span>
                      </button>
                    </form>

                    {/* Current Nutrition Products List */}
                    <div className="space-y-3">
                      <p className="text-xs font-condensed uppercase tracking-wider text-white font-bold">
                        Active Nutrition Products ({nutritionProducts.length})
                      </p>

                      {nutritionProducts.map((p, idx) => (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-obsidian-800 shrink-0">
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-sm font-semibold text-white truncate">
                                {p.title}
                              </h5>
                              <p className="text-xs text-steel-400 truncate">
                                <span className="text-red-400 font-medium">{p.price}</span> · {p.category}
                                {p.servingSize ? ` · ${p.servingSize}` : ""}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteNutritionProduct(p.id)}
                            className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-950/70 shrink-0"
                            aria-label="Delete nutrition product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. WORKOUT VIDEOS STUDIO */}
                {activeTab === "videos" && (
                  <div className="space-y-6">
                    {/* Add New Video Form */}
                    <form
                      onSubmit={handleAddWorkoutVideo}
                      className="p-5 rounded-2xl bg-obsidian-900 border border-white/10 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-xs font-condensed uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                          <Plus className="w-4 h-4" />
                          Add New Workout Video Slide
                        </span>
                        <span className="text-[11px] text-steel-400">
                          Appears in Sliding Carousel
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Workout Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={vidTitle}
                            onChange={(e) => setVidTitle(e.target.value)}
                            placeholder="e.g. Incline Bench Press & Chest Hypertrophy"
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Category
                          </label>
                          <select
                            value={vidCategory}
                            onChange={(e) => setVidCategory(e.target.value)}
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          >
                            <option value="Strength & Power">Strength & Power</option>
                            <option value="Functional TRX">Functional TRX</option>
                            <option value="Body Transformation">Body Transformation</option>
                            <option value="Conditioning">Conditioning</option>
                            <option value="Rehabilitation">Rehabilitation</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Video URL (MP4 / Cloudinary / Web Link) *
                          </label>
                          <input
                            type="url"
                            required
                            value={vidUrl}
                            onChange={(e) => setVidUrl(e.target.value)}
                            placeholder="https://res.cloudinary.com/... or https://...mp4"
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-condensed uppercase tracking-wider text-steel-400 mb-1">
                            Workout Metric / Tag (optional)
                          </label>
                          <input
                            type="text"
                            value={vidTag}
                            onChange={(e) => setVidTag(e.target.value)}
                            placeholder="e.g. 140kg Clean Reps · 4 Sets"
                            className="w-full rounded-xl bg-obsidian-800 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={savingVideo}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-condensed font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{savingVideo ? "Adding..." : "Add Video to Slider"}</span>
                      </button>
                    </form>

                    {/* Current Videos List */}
                    <div className="space-y-3">
                      <p className="text-xs font-condensed uppercase tracking-wider text-white font-bold">
                        Current Sliding Videos ({workoutVideos.length})
                      </p>
                      {workoutVideos.map((v, i) => (
                        <div
                          key={v.id}
                          className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center text-xs font-bold text-red-400">
                              {i + 1}
                            </span>
                            <div className="min-w-0">
                              <h5 className="text-sm font-semibold text-white truncate">
                                {v.title}
                              </h5>
                              <p className="text-xs text-steel-400 truncate">
                                {v.category} · {v.tag || "Workout Form"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteWorkoutVideo(v.id)}
                            className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-950/70 shrink-0"
                            aria-label="Delete video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. REVIEWS */}
                {activeTab === "reviews" && (
                  <div className="space-y-3">
                    {reviews.length === 0 ? (
                      <p className="text-sm text-steel-500 text-center py-8">
                        No reviews submitted yet.
                      </p>
                    ) : (
                      reviews.map((r) => (
                        <div
                          key={r.id}
                          className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex items-start justify-between gap-4"
                        >
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {r.name}{" "}
                              <span className="text-xs text-red-400 font-normal">
                                · {r.service} · {"★".repeat(r.rating)}
                              </span>
                            </div>
                            <p className="text-xs text-steel-300 mt-1">
                              &ldquo;{r.message}&rdquo;
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(r.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-condensed uppercase tracking-wider hover:bg-red-950/70 shrink-0"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 4. LEADS */}
                {activeTab === "consultations" && (
                  <div className="space-y-3">
                    {loadingConsultations ? (
                      <p className="text-sm text-steel-400 text-center py-8">
                        Loading leads...
                      </p>
                    ) : consultations.length === 0 ? (
                      <p className="text-sm text-steel-500 text-center py-8">
                        No consultation leads received yet.
                      </p>
                    ) : (
                      consultations.map((c) => (
                        <div
                          key={c.id}
                          className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <strong className="text-sm text-white">
                                {c.name}
                              </strong>{" "}
                              <span className="text-xs text-red-400">
                                ({c.phone} · {c.email})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={c.status}
                                onChange={(e) =>
                                  handleUpdateConsultationStatus(
                                    c.id,
                                    e.target.value as ConsultationStatus
                                  )
                                }
                                className="rounded-lg bg-obsidian-800 border border-white/15 px-2.5 py-1 text-xs text-steel-100 outline-none focus:border-red-500"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="scheduled">Scheduled</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleDeleteConsultation(c.id)}
                                className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-950/70"
                                aria-label="Delete consultation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-steel-400">
                            Goal: <span className="text-white font-medium">{c.goal}</span>{" "}
                            · {c.trainingType} · {c.preferredTime}
                          </div>
                          {c.healthNotes && (
                            <div className="text-xs text-steel-400">
                              Health: {c.healthNotes}
                            </div>
                          )}
                          {c.message && (
                            <p className="text-xs text-steel-300 italic">
                              &ldquo;{c.message}&rdquo;
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-white/10 bg-obsidian-900 flex items-center justify-between">
                <span className="text-xs text-steel-400">
                  Ahsan Hussain · Certified Fitness Trainer
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-obsidian-800 border border-white/15 text-xs font-condensed font-bold uppercase tracking-wider text-steel-200 hover:text-white hover:border-red-500/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
