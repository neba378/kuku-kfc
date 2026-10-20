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

    // Play friendly rooster cluck sound
    soundFx.playCluck();

    // Exactly 5.0 seconds on screen, then smooth fade out
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setShouldRender(false);
        onCompleteRef.current();
      }, 450);
    }, 5000);

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

  // Nice short quote in script font matching user mockup
  const quoteText =
    currentLanguage === "am"
      ? "ውጩ ቆራጣ፣ ውስጡ ጭማቂ"
      : currentLanguage === "om"
      ? "Alaan kurkuraa, keessaan lallaafaa"
      : "Crispy outside, juicy inside";

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between py-8 sm:py-12 px-4 bg-[#0a0806] text-white overflow-hidden select-none"
        >
          {/* Shining Charcoal & Amber Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner-shining-bg.jpg"
              alt="KUKU Ambient Glow"
              fill
              className="object-cover object-center opacity-80"
              priority
            />
          </div>

          {/* Ambient Warm Golden Spotlight & Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,185,25,0.25),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),transparent_45%,rgba(0,0,0,0.85))] pointer-events-none" />

          {/* Floating Warm Golden Ember Sparks */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${(i * 19) % 100}vw`,
                  y: "100vh",
                  opacity: 0,
                  scale: 0.6,
                }}
                animate={{
                  y: "-10vh",
                  opacity: [0, 0.8, 0],
                  scale: [0.6, 1.3, 0.3],
                }}
                transition={{
                  duration: 3.5 + (i % 3) * 0.8,
                  repeat: Infinity,
                  delay: (i * 0.35) % 3,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 rounded-full bg-amber-300/70 blur-[1px]"
              />
            ))}

            {/* Steam smoke rising from roasted chicken platter */}
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={`steam-${i}`}
                initial={{
                  x: 35 + (i % 3) * 14,
                  y: 40,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  y: -120 - i * 16,
                  x: 30 + (i % 3) * 14 + Math.sin(i * 1.5) * 18,
                  opacity: [0, 0.65, 0],
                  scale: [0.5, 1.3, 2.0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeOut",
                }}
                className="absolute top-[42%] left-[54%] w-3 h-3 rounded-full bg-white/25 blur-sm"
              />
            ))}
          </div>

          {/* Top Bar with Skip Button */}
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

          {/* Center Stage: Title + White Rooster Mascot + Quote Card */}
          <div className="relative z-20 flex flex-col items-center justify-center max-w-sm sm:max-w-md w-full my-auto text-center">
            {/* Top Cursive Title exactly matching mockup */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center select-none"
            >
              <h2 className="font-script text-3xl sm:text-4xl text-[#FFF7EA] tracking-wide drop-shadow-[0_2px_12px_rgba(255,180,0,0.4)]">
                Welcome to
              </h2>
              <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#FFFBF3] tracking-wide -mt-1 sm:-mt-2 drop-shadow-[0_4px_18px_rgba(255,180,0,0.5)]">
                Kuku Fried Chicken
              </h1>
            </motion.div>

            {/* White Rooster Mascot with sunglasses holding steaming roast platter */}
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 20,
                duration: 0.7,
              }}
              className="relative w-52 h-52 sm:w-64 sm:h-64 my-1 sm:my-2 flex items-center justify-center filter drop-shadow-[0_16px_35px_rgba(0,0,0,0.85)]"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.4,
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

            {/* Glowing Cloud / Parchment Badge with Nice Short Quote matching mockup */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative w-full max-w-xs sm:max-w-sm rounded-[28px] p-5 sm:p-6 backdrop-blur-xl bg-gradient-to-b from-[#FFFDF8]/20 via-[#FFEEC7]/15 to-[#000000]/40 border border-amber-300/35 shadow-[0_0_45px_rgba(255,190,60,0.22),inset_0_1px_1px_rgba(255,255,255,0.4)] flex flex-col items-center"
            >
              <p className="font-script text-2xl sm:text-3xl text-[#FFFBF0] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {quoteText}
              </p>

              {/* Decorative Calligraphy Underline Flourish matching mockup */}
              <div className="flex items-center justify-center gap-1.5 text-amber-300/80 text-lg mt-1 select-none font-bold tracking-widest">
                <span>〰</span>
                <span>〰</span>
                <span>〰</span>
                <span>〰</span>
                <span>〰</span>
              </div>
            </motion.div>

            {/* 5-Second Glowing Golden Progress Bar */}
            <div className="w-48 sm:w-56 h-1.5 rounded-full bg-black/40 overflow-hidden mt-6 backdrop-blur-sm border border-white/15 shadow-inner">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5.0, ease: "linear" }}
                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(255,180,0,0.7)]"
              />
            </div>
          </div>

          {/* Bottom Spacer to balance flex-between */}
          <div className="h-6" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
