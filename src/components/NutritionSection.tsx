"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Sparkles,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Package,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";
import type { NutritionProduct } from "@/types/fitness";

interface NutritionSectionProps {
  products: NutritionProduct[];
}

interface CartItem {
  product: NutritionProduct;
  quantity: number;
}

const CATEGORIES = [
  "All",
  "Whey Protein",
  "Creatine",
  "Pre-Workout",
  "Recovery & Aminos",
  "Vitamins & Health",
];

const FALLBACK_PRODUCTS: NutritionProduct[] = [
  {
    id: "nutr-protein-1",
    title: "100% Gold Standard Whey Isolate",
    category: "Whey Protein",
    price: "PKR 18,500",
    servingSize: "2.27 kg (5 lbs) · 74 Servings",
    description:
      "25g pure micro-filtered whey isolate per scoop with 5.5g BCAAs and 4g Glutamine. Zero sugar, instantized for rapid muscle recovery and lean muscle growth.",
    imageUrl:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1000&q=80",
    badge: "Best Seller",
    featured: true,
  },
  {
    id: "nutr-creatine-2",
    title: "Creapure® Micronized Creatine Monohydrate",
    category: "Creatine",
    price: "PKR 6,800",
    servingSize: "300g · 60 Servings (5g per scoop)",
    description:
      "100% pharmaceutical-grade unflavored micronized creatine monohydrate. Saturates intramuscular phosphocreatine stores for explosive strength, power, and cell hydration.",
    imageUrl:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1000&q=80",
    badge: "Strength Essential",
    featured: true,
  },
  {
    id: "nutr-preworkout-3",
    title: "Explosive Nitric Oxide Pre-Workout Matrix",
    category: "Pre-Workout",
    price: "PKR 8,500",
    servingSize: "390g · 30 Intense Servings",
    description:
      "Loaded with 6g L-Citrulline Malate, 3.2g Beta-Alanine, and 300mg Caffeine Anhydrous for skin-splitting pumps, razor focus, and unmatched muscular endurance.",
    imageUrl:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1000&q=80",
    badge: "High Stimulant",
    featured: true,
  },
  {
    id: "nutr-bcaa-4",
    title: "Essential BCAA + Electrolyte Hydration Fuel",
    category: "Recovery & Aminos",
    price: "PKR 7,200",
    servingSize: "420g · 30 Servings",
    description:
      "Fermented 2:1:1 Leucine, Isoleucine & Valine complex infused with raw coconut water powder and pink Himalayan salt to optimize intra-workout stamina.",
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
    badge: "Intra-Workout",
    featured: true,
  },
  {
    id: "nutr-vitamins-5",
    title: "Elite Athlete Daily Multivitamin & Zinc Matrix",
    category: "Vitamins & Health",
    price: "PKR 4,800",
    servingSize: "90 Tablets · 45 Servings",
    description:
      "Comprehensive micronutrient foundation with high-potency Vitamin D3, Zinc, Magnesium Bisglycinate, and antioxidant botanicals for peak immune defense.",
    imageUrl:
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=1000&q=80",
    badge: "Daily Vitality",
    featured: true,
  },
  {
    id: "nutr-gainer-6",
    title: "Anabolic Mass Gainer Pro Matrix",
    category: "Whey Protein",
    price: "PKR 14,200",
    servingSize: "5.4 kg (12 lbs) · 32 Servings",
    description:
      "1,250 high-quality calories and 50g precision protein blend per serving designed for hardgainers looking to pack on serious, dense muscle mass.",
    imageUrl:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1000&q=80",
    badge: "Mass Fuel",
    featured: true,
  },
];

function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatPrice(amount: number): string {
  return "PKR " + amount.toLocaleString("en-PK");
}

export function NutritionSection({ products }: NutritionSectionProps) {
  const activeProducts = useMemo(() => {
    return products && products.length > 0 ? products : FALLBACK_PRODUCTS;
  }, [products]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Cart / Bag state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Checkout form fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("Karachi");
  const [customerNotes, setCustomerNotes] = useState("");

  const currentShowcase =
    activeProducts[showcaseIndex] || activeProducts[0] || FALLBACK_PRODUCTS[0];

  const filtered = useMemo(() => {
    if (activeCategory === "All") return activeProducts;
    return activeProducts.filter(
      (p) =>
        p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        activeCategory.toLowerCase().includes(p.category.toLowerCase())
    );
  }, [activeCategory, activeProducts]);

  const handleNextShowcase = useCallback(() => {
    setSlideDirection(1);
    setShowcaseIndex((prev) => (prev + 1) % activeProducts.length);
    setProgress(0);
  }, [activeProducts.length]);

  const handlePrevShowcase = useCallback(() => {
    setSlideDirection(-1);
    setShowcaseIndex(
      (prev) => (prev - 1 + activeProducts.length) % activeProducts.length
    );
    setProgress(0);
  }, [activeProducts.length]);

  // Auto-advance showcase every 3 seconds as requested
  useEffect(() => {
    if (isPaused || activeProducts.length <= 1) return;

    const intervalMs = 50;
    const totalMs = 3000; // 3 seconds
    const step = (intervalMs / totalMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextShowcase();
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, activeProducts.length, handleNextShowcase]);

  // Cart management methods
  const addToCart = (product: NutritionProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setToastMsg(`Added "${product.title}" to Bag!`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      const priceNum = parsePrice(item.product.price);
      return sum + priceNum * item.quantity;
    }, 0);
  }, [cart]);

  // Direct single-product WhatsApp order
  const handleOrderWhatsApp = (prod: NutritionProduct) => {
    const waText = `🏋️ *NUTRITION & SUPPLEMENT ORDER — AHSAN HUSSAIN FITNESS*
━━━━━━━━━━━━━━━━━━━━━
💊 *Product:* ${prod.title}
🏷️ *Price:* ${prod.price}
📦 *Serving:* ${prod.servingSize || "Standard Size"}
📂 *Category:* ${prod.category}
━━━━━━━━━━━━━━━━━━━━━
Hi Coach Ahsan, I would like to order this supplement. Please share delivery timeline and payment details!`;

    const waUrl = `https://wa.me/923262371372?text=${encodeURIComponent(
      waText
    )}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  const handleAskDosage = (prod: NutritionProduct) => {
    const waText = `Hi Coach Ahsan, I want advice on how to stack and dose *${prod.title}* (${prod.category}) for my fitness goals.`;
    const waUrl = `https://wa.me/923262371372?text=${encodeURIComponent(
      waText
    )}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  // WhatsApp Checkout with user details
  const handleProceedCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert("Please fill in your Name, Phone Number, and Delivery Address.");
      return;
    }

    const itemsSummary = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product.title}* (x${item.quantity}) — ${formatPrice(
            parsePrice(item.product.price) * item.quantity
          )}`
      )
      .join("\n");

    const waMessage = `🛒 *NEW NUTRITION ORDER — AHSAN HUSSAIN FITNESS*
━━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${customerName.trim()}
📞 *Phone / WhatsApp:* ${customerPhone.trim()}
📍 *Delivery Address:* ${customerAddress.trim()}
🏙️ *City:* ${customerCity.trim() || "Karachi"}
${customerNotes.trim() ? `📝 *Special Notes:* ${customerNotes.trim()}\n` : ""}━━━━━━━━━━━━━━━━━━━━━
📦 *ORDERED ITEMS (${totalItems}):*
${itemsSummary}
━━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL AMOUNT:* ${formatPrice(totalPrice)}
━━━━━━━━━━━━━━━━━━━━━
Hi Coach Ahsan! I have submitted this order from your website. Please confirm availability and share bank/Cash on Delivery details. Thank you!`;

    const waUrl = `https://wa.me/923262371372?text=${encodeURIComponent(
      waMessage
    )}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  return (
    <section
      id="nutrition"
      className="py-16 sm:py-24 bg-[#0a070a] relative overflow-hidden border-t border-white/5"
    >
      {/* Background Watermark & Lighting */}
      <div className="pointer-events-none select-none absolute top-14 inset-x-0 text-center font-display text-[15vw] leading-none text-red-600/[0.03] tracking-widest font-black">
        NUTRITION
      </div>
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-red-600/[0.04] blur-[170px]" />

      {/* Floating Add to Bag Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-obsidian-900 border border-emerald-500/40 text-white px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Launcher Button */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        aria-label="Open Cart Bag"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-condensed font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_35px_rgba(220,38,38,0.6)] hover:scale-105 active:scale-95 transition-all border border-red-400/40"
      >
        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>BAG</span>
        {totalItems > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-red-600 text-xs font-mono font-bold shadow-md">
            {totalItems}
          </span>
        )}
      </button>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Heading with Cart Bag Shortcut */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-block font-condensed text-xs font-bold uppercase tracking-[0.25em] text-red-400 border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.15)]">
              Elite Supplements
            </span>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 font-condensed text-xs font-bold uppercase tracking-wider text-steel-200 border border-white/10 bg-obsidian-900 px-3 py-1.5 rounded-full hover:border-red-500/40 hover:text-white transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
              <span>Bag ({totalItems})</span>
            </button>
          </div>

          <h2 className="font-condensed text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Nutrition &amp; Supplements
          </h2>
          <p className="mt-2.5 text-steel-300 text-sm sm:text-lg">
            100% authentic, laboratory-tested performance nutrition to accelerate
            hypertrophy, strength recovery, and vitality.
          </p>
        </div>

        {/* ============================================================== */}
        {/* 1. SLIDING WINDOW PRODUCT SHOWCASE (3-Second Auto-Switch)     */}
        {/* ============================================================== */}
        <div
          className="mb-14 sm:mb-20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#140e14] to-[#0c090c] border-2 border-red-500/25 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            {/* Top Auto-Slide Countdown Bar (3 Seconds) */}
            <div className="h-1.5 bg-black/60 w-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-volt-400 shadow-[0_0_8px_#ef4444]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>

            {/* Sliding Window Content Container */}
            <div className="p-5 sm:p-8 lg:p-10 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentShowcase.id || showcaseIndex}
                  initial={{ opacity: 0, x: slideDirection * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -slideDirection * 60 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  {/* Left Column: Supplement Visual Spotlight */}
                  <div className="lg:col-span-5 relative flex items-center justify-center">
                    <div className="relative w-full max-w-[380px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-obsidian-950 border border-white/10 shadow-2xl group">
                      {/* Product Backdrop Aura */}
                      <div className="absolute inset-0 bg-radial from-red-600/20 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

                      <img
                        src={currentShowcase.imageUrl}
                        alt={currentShowcase.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Floating Badge */}
                      {currentShowcase.badge && (
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-red-600/95 backdrop-blur-md text-white font-condensed font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 fill-white" />
                          <span>{currentShowcase.badge}</span>
                        </div>
                      )}

                      {/* Quality Guarantee Seal */}
                      <div className="absolute bottom-3 left-3 right-3 z-10 p-2 rounded-xl bg-obsidian-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px] font-condensed uppercase tracking-wider text-steel-300">
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          100% Lab Tested
                        </span>
                        <span className="text-volt-300 font-bold">
                          {currentShowcase.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Specifications & Direct Purchase */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                    {/* Category & Slide Tracker */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-condensed font-bold uppercase tracking-wider">
                        {currentShowcase.category}
                      </span>

                      <span className="text-xs font-mono text-steel-400">
                        SHOWCASE {String(showcaseIndex + 1).padStart(2, "0")} /{" "}
                        {String(activeProducts.length).padStart(2, "0")} (3s)
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-condensed text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.08]">
                      {currentShowcase.title}
                    </h3>

                    {/* Serving / Net Size Pill */}
                    {currentShowcase.servingSize && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-steel-300 font-mono">
                        <Package className="w-3.5 h-3.5 text-red-400" />
                        <span>{currentShowcase.servingSize}</span>
                      </div>
                    )}

                    {/* Price Header */}
                    <div className="flex items-baseline gap-3 pt-1">
                      <span className="text-xs font-condensed uppercase tracking-widest text-steel-400">
                        Price:
                      </span>
                      <span className="font-display text-2xl sm:text-4xl font-black text-white crimson-shimmer-text">
                        {currentShowcase.price}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-condensed uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
                        In Stock
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-steel-200 leading-relaxed">
                      {currentShowcase.description}
                    </p>

                    {/* Formula Benefits Checklist */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-xs text-steel-300">
                        <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>Maximum Bioavailability</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-steel-300">
                        <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>Zero Banned Substances</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-steel-300">
                        <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>Coach Ahsan Approved</span>
                      </div>
                    </div>

                    {/* Action Buttons: Add to Bag + WhatsApp */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => addToCart(currentShowcase)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-condensed font-black text-sm uppercase tracking-wider transition-all shadow-[0_6px_20px_rgba(239,68,68,0.4)] active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Bag</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrderWhatsApp(currentShowcase)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-obsidian-900 border border-white/15 hover:border-red-500/50 text-steel-200 hover:text-white font-condensed font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Quick WhatsApp Order</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAskDosage(currentShowcase)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-obsidian-900 border border-white/15 hover:border-red-500/50 text-steel-400 hover:text-white font-condensed font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-volt-300" />
                        <span>Dosage</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Slide Arrow Controls */}
              <button
                type="button"
                onClick={handlePrevShowcase}
                aria-label="Previous product"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-white hover:text-red-400 hover:border-red-500 flex items-center justify-center shadow-2xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextShowcase}
                aria-label="Next product"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-white hover:text-red-400 hover:border-red-500 flex items-center justify-center shadow-2xl transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick-Jump Showcase Pill Selector Tabs */}
            <div className="bg-obsidian-950/80 border-t border-white/10 px-4 py-3 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar">
              {activeProducts.map((p, idx) => {
                const isActive = idx === showcaseIndex;
                const shortTitle = p.title
                  .replace(/100%/, "")
                  .replace(/Creapure®/, "")
                  .replace(/Explosive/, "")
                  .trim();

                return (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => {
                      setSlideDirection(idx > showcaseIndex ? 1 : -1);
                      setShowcaseIndex(idx);
                      setProgress(0);
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-condensed font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${isActive
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                        : "bg-obsidian-900 border-white/10 text-steel-400 hover:text-white hover:border-white/25"
                      }`}
                  >
                    <span className="font-mono text-[9px] opacity-75">
                      0{idx + 1}
                    </span>
                    <span className="truncate max-w-[120px]">
                      {shortTitle || p.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. PRODUCT CATALOG GRID (2-cards on Mobile)                    */}
        {/* ============================================================== */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-condensed text-xl sm:text-2xl font-bold uppercase text-white">
              Full Supplement Catalog
            </h3>
            <p className="text-xs sm:text-sm text-steel-400">
              Browse all authentic supplements, verified by Coach Ahsan Hussain.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar max-w-full">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-condensed font-bold uppercase tracking-wider transition-all border ${active
                      ? "bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                      : "bg-[#110c11] border-white/10 text-steel-400 hover:text-white hover:border-white/25"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid — 2 Cards Per Row on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          <AnimatePresence>
            {filtered.map((prod, idx) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-[#110c11] border border-white/10 hover:border-red-500/40 hover-red-glow p-3 sm:p-5 transition-all overflow-hidden shadow-xl"
              >
                {/* Top Crimson Highlight Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Product Image Frame */}
                  <div
                    onClick={() => {
                      const matchIdx = activeProducts.findIndex(
                        (p) => p.id === prod.id
                      );
                      if (matchIdx !== -1) {
                        setShowcaseIndex(matchIdx);
                        setProgress(0);
                        const el = document.getElementById("nutrition");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                    className="cursor-pointer relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-obsidian-950 border border-white/5 mb-3 sm:mb-4 group-hover:border-red-500/30 transition-colors"
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badge Pill */}
                    {prod.badge && (
                      <span className="absolute top-2 left-2 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white font-condensed font-black text-[9px] sm:text-[10px] uppercase tracking-wider shadow-lg">
                        {prod.badge}
                      </span>
                    )}

                    {/* Category Label */}
                    <span className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-steel-300 text-[9px] sm:text-[10px] font-condensed uppercase tracking-wider border border-white/10">
                      {prod.category}
                    </span>
                  </div>

                  {/* Title & Serving */}
                  <h4 className="font-condensed text-sm sm:text-xl font-bold uppercase tracking-wide text-white mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {prod.title}
                  </h4>

                  {prod.servingSize && (
                    <p className="text-[10px] sm:text-xs text-steel-400 font-condensed tracking-wider uppercase mb-2 line-clamp-1">
                      {prod.servingSize}
                    </p>
                  )}

                  <p className="text-[11px] sm:text-xs text-steel-300 leading-snug line-clamp-2 mb-3">
                    {prod.description}
                  </p>
                </div>

                {/* Price & Order / Add to Bag Actions */}
                <div className="pt-2 sm:pt-3 border-t border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] sm:text-[10px] font-condensed uppercase tracking-widest text-steel-500">
                        Price
                      </span>
                      <span className="font-display text-base sm:text-2xl font-black text-white crimson-shimmer-text">
                        {prod.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOrderWhatsApp(prod)}
                      title="Quick WhatsApp Order"
                      className="p-2 rounded-xl bg-obsidian-900 border border-white/10 text-emerald-400 hover:text-white hover:bg-emerald-600/30 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={() => addToCart(prod)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-condensed font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(220,38,38,0.35)] active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#110c11] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl">
          <div className="space-y-1">
            <h4 className="font-condensed text-lg sm:text-2xl font-bold uppercase text-white">
              Need Personalized Supplement Advice?
            </h4>
            <p className="text-xs sm:text-sm text-steel-400">
              Ahsan prescribes custom supplement stacks tailored to your metabolic rate, training volume, and budget.
            </p>
          </div>
          <a
            href="https://wa.me/923262371372?text=Hi%20Ahsan,%20I%20would%20like%20guidance%20on%20which%20supplements%20suit%20my%20fitness%20goals."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-obsidian-850 border border-red-500/30 hover:border-red-500 text-white font-condensed font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shrink-0 hover-red-glow"
          >
            <span>Ask Trainer Ahsan</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </a>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. SHOPPING BAG DRAWER / MODAL WITH WHATSAPP CHECKOUT           */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Slide-in Cart Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="relative w-full max-w-md bg-[#110c11] border-l border-white/15 h-full flex flex-col z-10 shadow-2xl overflow-hidden"
            >
              {/* Drawer Header with Prominent Top-Corner Mobile Close Button */}
              <div className="relative p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-obsidian-950/90">
                <div className="flex items-center gap-2.5 pr-10 sm:pr-0">
                  <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-condensed text-lg sm:text-xl font-bold uppercase text-white truncate">
                      Your Shopping Bag
                    </h3>
                    <p className="text-[11px] text-steel-400">
                      {totalItems} {totalItems === 1 ? "item" : "items"} selected
                    </p>
                  </div>
                </div>

                {/* Top-Right Corner Touch-Friendly Cross (X) Button */}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close Shopping Bag"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 active:scale-90 border border-white/20 hover:border-red-500 text-white flex items-center justify-center transition-all shadow-lg shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Items List (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-white/5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-steel-500 mb-3">
                      <ShoppingBag className="w-8 h-8 stroke-1" />
                    </div>
                    <h4 className="font-condensed text-lg uppercase text-white font-bold">
                      Your bag is empty
                    </h4>
                    <p className="text-xs text-steel-400 max-w-xs mt-1">
                      Explore authentic whey protein, creatine, and performance stacks above and tap &ldquo;Add to Bag&rdquo;.
                    </p>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => {
                    const unitPrice = parsePrice(product.price);
                    const itemTotal = unitPrice * quantity;

                    return (
                      <div
                        key={product.id}
                        className="pt-3.5 first:pt-0 flex gap-3 items-center"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 bg-obsidian-900"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-condensed text-sm font-bold uppercase text-white truncate">
                            {product.title}
                          </h4>
                          <span className="text-[10px] text-steel-400 block">
                            {product.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-red-400 block mt-0.5">
                            {formatPrice(itemTotal)}
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="inline-flex items-center border border-white/10 rounded-lg bg-obsidian-900">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, -1)}
                                className="p-1 hover:text-red-400 text-steel-300 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-white">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, 1)}
                                className="p-1 hover:text-red-400 text-steel-300 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="text-steel-500 hover:text-rose-400 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer & Checkout Form */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-white/10 bg-obsidian-950/95 space-y-3.5">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-steel-400 font-condensed uppercase tracking-wider">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-display text-2xl font-black text-white crimson-shimmer-text">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {/* Customer Information Form */}
                  <form onSubmit={handleProceedCheckout} className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your Full Name *"
                        className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white placeholder:text-steel-500 outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="WhatsApp / Phone *"
                        className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white placeholder:text-steel-500 outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        placeholder="City (e.g. Karachi)"
                        className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white placeholder:text-steel-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Delivery Address / Gym Pickup *"
                        className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white placeholder:text-steel-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="Notes / Flavor preference (optional)"
                        className="w-full rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3 py-2 text-xs text-white placeholder:text-steel-500 outline-none transition-colors"
                      />
                    </div>

                    {/* Proceed to WhatsApp Button */}
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-600 hover:brightness-110 text-white font-condensed font-black text-sm uppercase tracking-wider transition-all shadow-[0_6px_25px_rgba(16,185,129,0.35)] active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>Proceed to WhatsApp Checkout</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}