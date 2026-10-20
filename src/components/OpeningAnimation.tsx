"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

    soundFx.playCluck();

    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setShouldRender(false);
        onCompleteRef.current();
      }, 400);
    }, 5000);

    return () => clearTimeout(timer);
  }, [forceShow]);

  const handleSkip = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      onCompleteRef.current();
    }, 150);
  };

  if (!shouldRender || !forceShow) return null;

  const quoteText =
    currentLanguage === "am"
      ? "ውጩ ቆራጣ፤ ውስጡ ጭማቂ!"
      : currentLanguage === "om"
      ? "Alaan kurkuraa, keessaan lallaafaa!"
      : "Crispy on the outside, juicy on the inside!";

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between py-6 sm:py-8 px-4 bg-[#0a0806] text-white overflow-hidden select-none"
        >
          {/* Shining Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner-shining-bg.jpg"
              alt="KUKU Glow"
              fill
              className="object-cover object-center opacity-75"
              priority
            />
          </div>

          {/* Ambient Warm Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,185,25,0.22),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),transparent_45%,rgba(0,0,0,0.85))] pointer-events-none" />

          {/* Skip Button Top Right */}
          <div className="relative z-30 w-full max-w-md flex justify-end">
            <button
              onClick={handleSkip}
              className="px-4 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-xs font-bold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 border border-white/20 shadow-md cursor-pointer"
              aria-label="Skip Intro"
            >
              <span>Skip</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center Stage */}
          <div className="relative z-20 flex flex-col items-center justify-center max-w-sm sm:max-w-md w-full my-auto text-center">
            {/* 1. Official Logo PNG on Top */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 filter drop-shadow-[0_0_20px_rgba(255,200,50,0.35)]"
            >
              <Image
                src="/images/kuku-logo.png"
                alt="KUKU Fried Chicken Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* 2. Welcome Title in Clean, Readable, Premium Typography */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="flex flex-col items-center select-none"
            >
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-amber-400">
                Welcome to
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mt-0.5 leading-tight drop-shadow-md">
                KUKU FRIED CHICKEN
              </h1>
            </motion.div>

            {/* 3. White Rooster Mascot Cutout */}
            <motion.div
              initial={{ scale: 0.82, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 20,
                delay: 0.2,
              }}
              className="relative w-44 h-44 sm:w-56 sm:h-56 my-2 flex items-center justify-center filter drop-shadow-[0_16px_35px_rgba(0,0,0,0.85)]"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full h-full"
              >
                <Image
                  src="/images/kuku-mascot-cool.png"
                  alt="KUKU Rooster Mascot"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* 4. Highly Readable, Beautiful Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="relative w-full max-w-xs sm:max-w-sm rounded-2xl p-4 sm:p-5 backdrop-blur-xl bg-gradient-to-b from-stone-900/90 via-black/85 to-stone-950/95 border border-amber-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex flex-col items-center"
            >
              <p className="text-sm sm:text-base font-extrabold text-[#FFF4D6] tracking-wide leading-snug drop-shadow-sm">
                “{quoteText}”
              </p>
            </motion.div>

            {/* 5. 5-Second Glowing Progress Bar */}
            <div className="w-44 sm:w-52 h-1.5 rounded-full bg-black/50 overflow-hidden mt-5 backdrop-blur-sm border border-white/15">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5.0, ease: "linear" }}
                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 rounded-full shadow-[0_0_10px_rgba(255,180,0,0.7)]"
              />
            </div>
          </div>

          <div className="h-4" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
