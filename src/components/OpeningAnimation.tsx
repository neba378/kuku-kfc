"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Language } from "@/data/menu";
import { soundFx } from "@/utils/soundEffects";

interface OpeningAnimationProps {
  onComplete: () => void;
  forceShow?: boolean;
  currentLanguage?: Language;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  onComplete,
  forceShow = true,
  currentLanguage = "en",
}) => {
  const [shouldRender, setShouldRender] = useState<boolean>(forceShow);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!forceShow) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
    setIsClosing(false);

    // Play friendly rooster cluck sound
    soundFx.playCluck();

    // Exactly 3.0 seconds on screen, then smooth fade out
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setShouldRender(false);
        onCompleteRef.current();
      }, 400);
    }, 3000);

    return () => clearTimeout(timer);
  }, [forceShow]);

  const handleSkip = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      onCompleteRef.current();
    }, 200);
  };

  if (!shouldRender || !forceShow) return null;

  // Witty, appetizing quote fitting the cool sunglasses chicken mascot
  const quoteText =
    currentLanguage === "am"
      ? "«ውጩ ቆራጣ፣ ውስጡ ጭማቂ — እውነተኛ ዶሮ እዚህ ነው!»"
      : currentLanguage === "om"
      ? "«Alaan kurkuraa, keessaan lallaafaa — Nyaata dhugaa asii!»"
      : "“Craving the crunch? You came to the right place!”";

  const quoteSub =
    currentLanguage === "am"
      ? "ሁልጊዜ ትኩስ · በልዩ ቅመም የተጠበሰ · የማይረሳ ጣዕም"
      : currentLanguage === "om"
      ? "Yeroo hunda haaraa · Qulqullina olaanaa · Mi'aawaa"
      : "Always fresh · Flame-grilled & crispy · Made to order";

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090807] text-white overflow-hidden select-none"
        >
          {/* Shining Charcoal & Amber Background matching the menu cover */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner-shining-bg.jpg"
              alt="KUKU Glowing Ambient"
              fill
              className="object-cover object-center opacity-75"
              priority
            />
          </div>

          {/* Ambient Warm Golden Spotlight & Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,180,20,0.24),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),transparent_40%,rgba(0,0,0,0.85))] pointer-events-none" />

          {/* Steam particles rising from the roasted chicken platter */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 35 + (i % 3) * 16,
                  y: 40,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  y: -130 - i * 16,
                  x: 32 + (i % 3) * 16 + Math.sin(i * 1.5) * 22,
                  opacity: [0, 0.75, 0],
                  scale: [0.5, 1.4, 2.2],
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                className="absolute top-[36%] left-[53%] w-3 h-3 rounded-full bg-amber-100/30 blur-[2px]"
              />
            ))}
          </div>

          {/* Central Stage: Logo + White Rooster Mascot + Quote */}
          <div className="relative z-20 flex flex-col items-center max-w-sm sm:max-w-md px-4 text-center">
            {/* Top Official Logo Emblem Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-amber-500/30 shadow-[0_0_20px_rgba(255,180,0,0.25)] mb-1"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-amber-400/40 bg-[#FFD200]">
                <Image
                  src="/images/kuku-logo.png"
                  alt="KUKU Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex items-center gap-1.5 text-left">
                <span className="text-sm font-black tracking-wider text-white">KUKU</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  KFC
                </span>
              </div>
            </motion.div>

            {/* White Rooster Mascot Cutout from Mural */}
            <motion.div
              initial={{ scale: 0.78, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 20,
                duration: 0.65,
              }}
              className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center filter drop-shadow-[0_18px_35px_rgba(0,0,0,0.8)]"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full h-full"
              >
                <Image
                  src="/images/kuku-mascot-cool.png"
                  alt="KUKU Cool Rooster Mascot"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Premium Quote Card with Elegant Glassmorphism Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="relative -mt-1 bg-gradient-to-b from-stone-900/90 via-black/90 to-stone-950/95 text-white px-5 py-3 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.7)] border border-amber-500/40 backdrop-blur-xl max-w-xs sm:max-w-sm"
            >
              {/* Pointer triangle toward rooster beak */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-stone-900 border-t border-l border-amber-500/40 rotate-45" />

              <div className="relative z-10 flex flex-col items-center">
                <p className="text-xs sm:text-sm font-extrabold text-[#FFF1CC] leading-snug tracking-tight italic font-serif">
                  {quoteText}
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-amber-400/90 mt-1 tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {quoteSub}
                </p>
              </div>
            </motion.div>

            {/* 3-Second Loading / Intro Progress Bar */}
            <div className="w-44 sm:w-52 h-1.5 rounded-full bg-white/10 overflow-hidden mt-5 backdrop-blur-sm border border-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.0, ease: "linear" }}
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 rounded-full shadow-[0_0_10px_rgba(255,180,0,0.6)]"
              />
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-5 right-5 z-30 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-xs font-bold text-neutral-300 hover:text-white transition-all flex items-center gap-1 border border-white/15 cursor-pointer"
            aria-label="Skip Intro"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
