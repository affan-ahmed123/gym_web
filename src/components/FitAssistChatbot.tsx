"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  ChevronDown,
  Dumbbell,
  CalendarCheck,
  Phone,
  ShieldCheck,
  Trash2,
  Flame,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: "scroll" | "whatsapp" | "call";
    target: string;
  }[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Assalam-o-Alaikum! I'm **FitAssist**, Coach Ahsan Hussain's AI fitness guide. 🏋️‍♂️\n\nHow can I help you today? Ask me about **1-on-1 coaching in Malir Cantt**, workout routines, diet & supplements, or booking your **Free Initial Session**!",
    timestamp: "Just now",
    actions: [
      {
        label: "Book Free Session",
        actionType: "scroll",
        target: "contact",
      },
      {
        label: "View Supplements",
        actionType: "scroll",
        target: "nutrition",
      },
      {
        label: "WhatsApp Coach Ahsan",
        actionType: "whatsapp",
        target: "https://wa.me/923262371372?text=Hi%20Coach%20Ahsan,%20I%20have%20an%20inquiry%20regarding%20personal%20training.",
      },
    ],
  },
];

const QUICK_PROMPTS = [
  "Book a Free Session",
  "Home Based & Virtual Training",
  "Recommended Supplements",
  "Coach Ahsan Credentials",
  "Fat Loss vs Muscle Gain",
  "What is TRX Suspension?",
];

// Contextual Knowledge Engine
function generateBotResponse(input: string): {
  text: string;
  actions?: ChatMessage["actions"];
} {
  const query = input.toLowerCase().trim();

  // 1. Booking / Free Session / Trial / Appointment
  if (
    query.includes("book") ||
    query.includes("free") ||
    query.includes("session") ||
    query.includes("trial") ||
    query.includes("appointment") ||
    query.includes("consultation") ||
    query.includes("join") ||
    query.includes("register") ||
    query.includes("admission")
  ) {
    return {
      text: "You can book a **Free Initial Consultation & Assessment Session** with Coach Ahsan! 🎯\n\nDuring this session, Coach Ahsan assesses your current body composition, biomechanics, movement patterns, and sets your customized 12-week roadmap.",
      actions: [
        {
          label: "Fill Booking Form",
          actionType: "scroll",
          target: "contact",
        },
        {
          label: "Book on WhatsApp Directly",
          actionType: "whatsapp",
          target: "https://wa.me/923262371372?text=Hi%20Coach%20Ahsan,%20I%20want%20to%20book%20my%20Free%20Session!",
        },
      ],
    };
  }

  // 2. Location / Home Based / Virtual / Malir Cantt
  if (
    query.includes("location") ||
    query.includes("where") ||
    query.includes("address") ||
    query.includes("studio") ||
    query.includes("gym") ||
    query.includes("malir") ||
    query.includes("cantt") ||
    query.includes("karachi") ||
    query.includes("home") ||
    query.includes("virtual") ||
    query.includes("online") ||
    query.includes("kaha") ||
    query.includes("place")
  ) {
    return {
      text: "📍 **Home Based Training & Virtual Training:**\nCoach Ahsan provides dedicated **Home Based Personal Training** across Karachi and **Virtual 1-on-1 Training** worldwide with personalized programming, form mastery, and nutrition check-ins.\n\nBase Location: **Malir Cantt, Karachi** (Opposite KIMS · Near CMH).",
      actions: [
        {
          label: "Get Details / Contact",
          actionType: "scroll",
          target: "contact",
        },
        {
          label: "Inquire on WhatsApp",
          actionType: "whatsapp",
          target: "https://wa.me/923262371372?text=Hi%20Coach%20Ahsan,%20I%20want%20to%20inquire%20about%20Home%20Based%20and%20Virtual%20Training.",
        },
      ],
    };
  }

  // 3. Supplements / Nutrition / Protein / Creatine / Store
  if (
    query.includes("supplement") ||
    query.includes("protein") ||
    query.includes("creatine") ||
    query.includes("pre workout") ||
    query.includes("preworkout") ||
    query.includes("bcaa") ||
    query.includes("vitamin") ||
    query.includes("gainer") ||
    query.includes("nutrition") ||
    query.includes("diet") ||
    query.includes("price") ||
    query.includes("buy") ||
    query.includes("order") ||
    query.includes("cost")
  ) {
    return {
      text: "⚡ **Authentic Performance Supplements Available:**\n\n• **100% Gold Standard Whey Isolate:** PKR 18,500 (25g pure isolate, 5.5g BCAAs)\n• **Creapure® Micronized Creatine:** PKR 6,800 (Pure ATP power & muscle hydration)\n• **Explosive Pre-Workout Matrix:** PKR 8,500 (6g Citrulline, 3.2g Beta-Alanine)\n• **Essential BCAA Hydration:** PKR 7,200 (Electrolytes + coconut water powder)\n• **Elite Daily Multivitamin & Zinc:** PKR 4,800 (Immune & recovery defense)\n• **Anabolic Mass Gainer Pro:** PKR 14,200 (1,250 clean calories, 50g protein)\n\nYou can tap **Add to Bag** on the website and checkout directly to WhatsApp!",
      actions: [
        {
          label: "Browse Nutrition Store",
          actionType: "scroll",
          target: "nutrition",
        },
        {
          label: "Order via WhatsApp",
          actionType: "whatsapp",
          target: "https://wa.me/923262371372?text=Hi%20Coach%20Ahsan,%20I%20want%20to%20order%20supplements.",
        },
      ],
    };
  }

  // 4. Coach Ahsan Credentials / Qualifications / Certifications
  if (
    query.includes("credential") ||
    query.includes("qualification") ||
    query.includes("certified") ||
    query.includes("certificate") ||
    query.includes("experience") ||
    query.includes("who is") ||
    query.includes("ahsan") ||
    query.includes("degree") ||
    query.includes("uk") ||
    query.includes("level")
  ) {
    return {
      text: "🏆 **Coach Ahsan Hussain's Credentials:**\n\n• **UK Registered Level 1 & 2** Certified Fitness Trainer\n• **Diploma in Fitness Training** (Exercise Physiology & Biomechanics)\n• **TRX Suspension & Kinetic Training** Certified Coach\n• **First Aid with CPR & AED** Certified for maximum safety\n• **9+ Years of Hands-on Coaching** with over 200+ proven transformations!\n\nEvery session is structured around progressive overload, biomechanical safety, and injury prevention.",
      actions: [
        {
          label: "View Credentials",
          actionType: "scroll",
          target: "qualifications",
        },
        {
          label: "Watch Workout Videos",
          actionType: "scroll",
          target: "about",
        },
      ],
    };
  }

  // 5. Fat loss / Weight loss / Cutting
  if (
    query.includes("fat loss") ||
    query.includes("weight loss") ||
    query.includes("cut") ||
    query.includes("cutting") ||
    query.includes("slim") ||
    query.includes("belly") ||
    query.includes("vajan")
  ) {
    return {
      text: "🔥 **Coach Ahsan's Rapid Fat Loss Protocol:**\n\n1. **Metabolic Conditioning:** High-density strength supersets maintaining muscle while accelerating lipolysis.\n2. **Caloric Deficit with High Protein:** Preserves lean mass so your metabolism stays elevated.\n3. **Form & Biomechanics:** Safe cardio-respiratory loading without joint wear.\n\nClients average 6 to 10 kg pure fat loss in 8–12 weeks!",
      actions: [
        {
          label: "Start Fat Loss Program",
          actionType: "scroll",
          target: "contact",
        },
        {
          label: "Read Client Reviews",
          actionType: "scroll",
          target: "testimonials",
        },
      ],
    };
  }

  // 6. Muscle gain / Hypertrophy / Bulk
  if (
    query.includes("muscle") ||
    query.includes("gain") ||
    query.includes("bulk") ||
    query.includes("hypertrophy") ||
    query.includes("biceps") ||
    query.includes("chest") ||
    query.includes("size")
  ) {
    return {
      text: "💪 **Hypertrophy & Muscle Gain Blueprint:**\n\n• **Mechanical Tension & Progressive Overload:** Adding load/reps weekly on compound lifts (Squat, Bench, Row, Overhead Press).\n• **Volume Periodization:** Targeted 10–20 working sets per muscle group weekly.\n• **Macro Stacking:** 1.8–2.2g protein per kg with clean complex carbohydrates and Creapure Creatine.",
      actions: [
        {
          label: "Explore Training Services",
          actionType: "scroll",
          target: "services",
        },
        {
          label: "Inquire Muscle Program",
          actionType: "whatsapp",
          target: "https://wa.me/923262371372?text=Hi%20Coach%20Ahsan,%20I%20want%20to%20build%20muscle%20mass.",
        },
      ],
    };
  }

  // 7. TRX / Rehab / Injury / Pain
  if (
    query.includes("trx") ||
    query.includes("rehab") ||
    query.includes("injury") ||
    query.includes("pain") ||
    query.includes("back") ||
    query.includes("knee") ||
    query.includes("shoulder") ||
    query.includes("posture")
  ) {
    return {
      text: "🛡️ **TRX Suspension & Bulletproof Joint Rehabilitation:**\n\nCoach Ahsan specializes in corrective biomechanics for lower back stiffness, shoulder impingement, and knee instability. TRX leverages your own bodyweight against gravity to build deep core stability and restore functional pain-free movement.",
      actions: [
        {
          label: "Book Rehab Consultation",
          actionType: "scroll",
          target: "contact",
        },
      ],
    };
  }

  // 8. Pricing / Fees / Charges
  if (
    query.includes("price") ||
    query.includes("fee") ||
    query.includes("fees") ||
    query.includes("cost") ||
    query.includes("package") ||
    query.includes("charges") ||
    query.includes("rate") ||
    query.includes("kitne")
  ) {
    return {
      text: "💳 **Coaching Packages & Pricing:**\n\nPackages depend on training frequency (3x or 5x weekly private sessions) and whether you choose **Home Based Training in Karachi** or **Global Virtual Training**.\n\nAll programs include custom workout plans, macro targets, and continuous progress tracking. Contact Coach Ahsan for the exact package tailored to your goals!",
      actions: [
        {
          label: "Get Pricing on WhatsApp",
          actionType: "whatsapp",
          target: "https://wa.me/923262371372?text=Hi%20Coach%20Ahsan,%20please%20share%20your%20personal%20training%20package%20rates.",
        },
        {
          label: "Book Free Session",
          actionType: "scroll",
          target: "contact",
        },
      ],
    };
  }

  // 9. Phone / Contact / WhatsApp / Email
  if (
    query.includes("contact") ||
    query.includes("phone") ||
    query.includes("number") ||
    query.includes("whatsapp") ||
    query.includes("call") ||
    query.includes("email")
  ) {
    return {
      text: "📞 **Direct Contact Details for Coach Ahsan:**\n\n• **WhatsApp & Direct Call:** +92 326 2371372\n• **Email:** 02ahsanhussain@gmail.com\n• **Location:** Malir Cantt, Karachi (Home Based & Virtual Training)\n• **Hours:** 6:00 AM – 10:00 PM (Monday to Saturday)",
      actions: [
        {
          label: "Open WhatsApp Chat",
          actionType: "whatsapp",
          target: "https://wa.me/923262371372",
        },
        {
          label: "Call Now",
          actionType: "call",
          target: "+923262371372",
        },
      ],
    };
  }

  // Default Fallback
  return {
    text: "Thanks for asking! Coach Ahsan is a UK Certified Level 1 & 2 Fitness Coach specializing in **Body Transformation, Hypertrophy, TRX, and Injury Rehab** in Malir Cantt, Karachi.\n\nWould you like to book a **Free Consultation**, explore the **Supplements Store**, or speak with Coach Ahsan directly on WhatsApp?",
    actions: [
      {
        label: "Book Free Session",
        actionType: "scroll",
        target: "contact",
      },
      {
        label: "Chat with Coach Ahsan",
        actionType: "whatsapp",
        target: `https://wa.me/923262371372?text=${encodeURIComponent(
          "Hi Coach Ahsan, I was chatting with FitAssist about: " + input
        )}`,
      },
    ],
  };
}

export function FitAssistChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Realistic bot response delay
    setTimeout(() => {
      const response = generateBotResponse(text);
      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: response.text,
        timestamp: "Just now",
        actions: response.actions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (!isOpen) setHasUnread(true);
    }, 650);
  };

  const handleActionClick = (action: {
    label: string;
    actionType: "scroll" | "whatsapp" | "call";
    target: string;
  }) => {
    if (action.actionType === "scroll") {
      const el = document.getElementById(action.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.innerWidth < 640) {
          setIsOpen(false);
        }
      }
    } else if (action.actionType === "whatsapp") {
      window.open(action.target, "_blank");
    } else if (action.actionType === "call") {
      window.location.href = `tel:${action.target}`;
    }
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. FLOATING LAUNCHER BUTTON (Bottom-Left to not clash with Bag) */}
      {/* ============================================================== */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close FitAssist AI Chatbot" : "Open FitAssist AI Chatbot"}
          className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-[#170e17] via-[#1f111f] to-[#120a12] border-2 border-red-500/50 hover:border-red-500 text-white font-condensed font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_12px_35px_rgba(220,38,38,0.45)] hover:shadow-[0_16px_45px_rgba(220,38,38,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xl"
        >
          {/* Animated Pulsing Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-red-600/30 blur-sm group-hover:bg-red-600/50 transition-all animate-pulse pointer-events-none" />

          {isOpen ? (
            /* Explicit Cross Icon when Chatbot is open */
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 border border-red-400 flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                <X className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="font-condensed font-black text-white text-xs sm:text-sm tracking-wider">
                CLOSE
              </span>
            </div>
          ) : (
            /* Bot Icon without green sync dot */
            <>
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600/25 border border-red-500/60 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.4)]">
                <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </div>

              <div className="flex flex-col items-start leading-none relative z-10">
                <span className="font-condensed font-black text-white text-xs sm:text-sm tracking-wider flex items-center gap-1">
                  FITASSIST
                  <Sparkles className="w-3 h-3 text-red-400 inline" />
                </span>
                <span className="text-[9px] text-steel-400 font-normal mt-0.5 hidden sm:inline">
                  Coach Ahsan AI
                </span>
              </div>

              {/* Unread indicator */}
              {hasUnread && (
                <span className="ml-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-bounce" />
              )}
            </>
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. CHATBOT WINDOW (Responsive Desktop & Mobile Alignment)      */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop for easy dismissal by tapping outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[255] sm:hidden"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.94 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              className="fixed z-[260] flex flex-col bg-[#0d090d]/98 backdrop-blur-2xl border border-red-500/35 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden
                inset-x-3 bottom-4 top-20 sm:inset-auto sm:bottom-24 sm:left-6 sm:w-[410px] sm:h-[580px] sm:max-h-[82vh] rounded-3xl"
            >
              {/* Ambient Background Glow */}
              <div className="pointer-events-none absolute -top-20 -left-20 w-52 h-52 rounded-full bg-red-600/15 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 w-52 h-52 rounded-full bg-rose-600/15 blur-[90px]" />

              {/* --- Chat Header --- */}
              <div className="relative px-4 py-3.5 sm:px-5 sm:py-4 border-b border-white/10 bg-[#140c14] flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-condensed text-base sm:text-lg font-black uppercase text-white tracking-wider leading-none">
                        FitAssist
                      </h3>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-red-600/30 text-red-400 border border-red-500/40">
                        AI Guide
                      </span>
                    </div>
                    <p className="text-[11px] text-steel-400 mt-0.5">
                      Coach Ahsan Hussain · Fitness AI
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Clear & Prominent Cross Close Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="Clear conversation"
                    aria-label="Clear chat"
                    className="p-2 rounded-xl text-steel-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Close FitAssist"
                    aria-label="Close chat"
                    className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 active:scale-90 border border-red-400 text-white flex items-center justify-center transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] cursor-pointer shrink-0"
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            {/* --- Messages Body (Scrollable) --- */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm no-scrollbar relative z-10">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col ${
                      isBot ? "items-start" : "items-end"
                    }`}
                  >
                    <div
                      className={`max-w-[86%] rounded-2xl p-3.5 sm:p-4 leading-relaxed shadow-lg ${
                        isBot
                          ? "bg-[#181018] border border-white/10 text-steel-100 rounded-tl-sm hover:border-red-500/30 transition-colors"
                          : "bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-sm shadow-[0_6px_20px_rgba(220,38,38,0.35)]"
                      }`}
                    >
                      {/* Formatted Markdown-like Text */}
                      <div className="whitespace-pre-line leading-relaxed space-y-1.5 text-xs sm:text-[13px]">
                        {msg.text.split("\n\n").map((para, pIdx) => (
                          <p key={pIdx}>
                            {para.split("**").map((chunk, cIdx) =>
                              cIdx % 2 === 1 ? (
                                <strong
                                  key={cIdx}
                                  className={
                                    isBot
                                      ? "text-white font-bold"
                                      : "text-white font-black"
                                  }
                                >
                                  {chunk}
                                </strong>
                              ) : (
                                chunk
                              )
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Interactive Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                          {msg.actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              type="button"
                              onClick={() => handleActionClick(act)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-condensed font-bold uppercase tracking-wider bg-obsidian-900/90 border border-red-500/30 text-white hover:border-red-500 hover:bg-red-600/30 transition-all shadow-sm active:scale-95"
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="w-3 h-3 text-red-400" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-steel-500 font-mono mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </motion.div>
                );
              })}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#181018] border border-white/10 text-steel-400 w-fit rounded-tl-sm"
                >
                  <span className="text-[11px] font-mono text-red-400">
                    FitAssist is typing
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* --- Quick Action Prompt Chips --- */}
            <div className="px-3 py-2 border-t border-white/5 bg-[#120a12]/90 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 z-10">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-condensed font-bold tracking-wider uppercase text-steel-300 bg-white/5 hover:bg-red-600/25 border border-white/10 hover:border-red-500/40 hover:text-white transition-all whitespace-nowrap active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* --- Chat Input Footer --- */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-[#140c14] shrink-0 z-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask FitAssist anything..."
                  className="flex-1 rounded-xl bg-obsidian-900 border border-white/10 focus:border-red-500 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-steel-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  aria-label="Send message"
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 text-white flex items-center justify-center transition-all shadow-[0_4px_15px_rgba(220,38,38,0.4)] shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-steel-500 mt-2 px-1">
                <span>Direct Coach WhatsApp: +92 326 2371372</span>
                <span className="text-red-400 font-mono">Malir Cantt, Karachi</span>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
