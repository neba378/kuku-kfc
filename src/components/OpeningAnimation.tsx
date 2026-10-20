"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Flame } from "lucide-react";
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

    // Play subtle friendly sound
    soundFx.playCluck();

    // Stays on screen for ~2.6s, then fades out smoothly
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setShouldRender(false);
        onCompleteRef.current();
      }, 450);
    }, 2600);

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

  const welcomeHeadline =
    currentLanguage === "am"
      ? "እንኳን ወደ ኩኩ ፍራይድ ቺከን በደህና መጡ!"
      : currentLanguage === "om"
      ? "Baga gara KUKU Fried Chicken nagaan dhuftan!"
      : "Welcome to KUKU Fried Chicken!";

  const welcomeSub =
    currentLanguage === "am"
      ? "ትኩስ ክሪስፒ ዶሮ፣ ሻዋርማ እና ልዩ ፒዛ"
      : currentLanguage === "om"
      ? "Kurkuraa · Shawaarmaa · Pitsaa Haaraa"
      : "Crispy · Flame-Grilled · Authentic Taste";

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0a09] text-white overflow-hidden select-none"
        >
          {/* Shining Background Layer matching menu cover */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner-shining-bg.jpg"
              alt="KUKU Flame Glow"
              fill
              className="object-cover object-center opacity-70"
              priority
            />
          </div>

          {/* Ambient Warm Golden Flare & Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.22),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),transparent_40%,rgba(0,0,0,0.8))] pointer-events-none" />

          {/* Steam particles rising from the roasted platter */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 35 + (i % 3) * 15,
                  y: 40,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  y: -120 - i * 18,
                  x: 30 + (i % 3) * 15 + Math.sin(i) * 20,
                  opacity: [0, 0.7, 0],
                  scale: [0.5, 1.3, 2.0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.22,
                  ease: "easeOut",
                }}
                className="absolute top-[35%] left-[54%] w-3 h-3 rounded-full bg-white/25 blur-sm"
              />
            ))}
          </div>

          {/* Central Character & Intro Stage */}
          <div className="relative z-20 flex flex-col items-center max-w-sm sm:max-w-md px-4 text-center">
            {/* White Rooster Mascot Cutout from Restaurant Mural */}
            <motion.div
              initial={{ scale: 0.8, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6,
              }}
              className="relative w-56 h-56 sm:w-68 sm:h-68 flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
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

            {/* Speech Bubble / Intro Message from Rooster */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="relative mt-2 bg-gradient-to-b from-[#FFFDF5] to-[#FFF4D6] text-stone-900 px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 max-w-xs sm:max-w-sm"
            >
              {/* Pointer triangle toward rooster beak */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFFDF5] border-t-2 border-l-2 border-amber-400 rotate-45" />

              <div className="relative z-10 flex flex-col items-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                  KUKU Fried Chicken
                </span>

                <h3 className="text-sm sm:text-base font-black text-stone-900 mt-1 leading-snug">
                  {welcomeHeadline}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-stone-600 mt-0.5">
                  {welcomeSub}
                </p>
              </div>
            </motion.div>

            {/* 2.6-second Loading / Intro Progress Bar */}
            <div className="w-40 sm:w-48 h-1.5 rounded-full bg-white/15 overflow-hidden mt-6 backdrop-blur-sm border border-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 rounded-full"
              />
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-5 right-5 z-30 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-xs font-bold text-neutral-300 hover:text-white transition-all flex items-center gap-1 border border-white/15 cursor-pointer"
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
