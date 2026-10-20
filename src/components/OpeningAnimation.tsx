"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X } from "lucide-react";
import { KukuCharacter } from "./KukuCharacter";

interface OpeningAnimationProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const [step, setStep] = useState<number>(0);
  const [shouldRender, setShouldRender] = useState<boolean>(forceShow);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!forceShow) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
    setStep(0);

    // Sequence timing
    // Step 0: Kuku walks in with cloche (0s)
    // Step 1: Kuku stops, tilts shades (0.8s)
    // Step 2: Cloche lifts, steam & logo reveal (1.6s)
    // Step 3: Fade out to menu (3.0s)
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);
    const t3 = setTimeout(() => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("kuku_intro_seen", "true");
      }
      setStep(3);
      setTimeout(() => {
        setShouldRender(false);
        onCompleteRef.current();
      }, 400);
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [forceShow]);

  const handleSkip = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("kuku_intro_seen", "true");
    }
    setShouldRender(false);
    onCompleteRef.current();
  };

  if (!shouldRender || !forceShow) return null;

  return (
    <AnimatePresence>
      {step < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0E] text-white overflow-hidden select-none"
        >
          {/* Background Radiant Ember Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-amber-600/20 via-orange-950/10 to-transparent pointer-events-none" />
          <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/10 to-orange-600/15 blur-3xl pointer-events-none" />

          {/* Floating Steam/Sparkle Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 400 - 200 + (typeof window !== "undefined" ? window.innerWidth / 2 : 200),
                  y: (typeof window !== "undefined" ? window.innerHeight / 2 : 400) + 100,
                  opacity: 0,
                  scale: 0.6,
                }}
                animate={
                  step >= 2
                    ? {
                        y: (typeof window !== "undefined" ? window.innerHeight / 2 : 400) - 220 - Math.random() * 120,
                        opacity: [0, 0.9, 0],
                        scale: [0.6, 1.4, 0.2],
                      }
                    : {}
                }
                transition={{
                  duration: 1.6 + Math.random(),
                  delay: Math.random() * 0.4,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 rounded-full bg-amber-400/60 blur-[1px]"
              />
            ))}
          </div>

          {/* Center Mascot & Cloche Presentation */}
          <div className="relative flex flex-col items-center z-10">
            {/* Mascot Container */}
            <motion.div
              initial={{ x: -160, opacity: 0, scale: 0.85 }}
              animate={
                step === 0
                  ? { x: 0, opacity: 1, scale: 1 }
                  : step === 1
                  ? { x: 0, opacity: 1, scale: 1.05 }
                  : { x: 0, opacity: 1, scale: 0.95, y: -20 }
              }
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex items-center justify-center"
            >
              <KukuCharacter
                size={140}
                animate={step < 2}
                mood={step >= 1 ? "cool" : "happy"}
              />

              {/* Serving Cloche / Platter */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative -ml-4 mt-8 flex flex-col items-center"
              >
                {/* Silver Tray Base */}
                <div className="w-24 h-3 rounded-full bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-400 shadow-md border-b border-neutral-500" />

                {/* Cloche Dome Lid */}
                <motion.div
                  initial={{ y: 0, x: 0, rotate: 0 }}
                  animate={
                    step >= 2
                      ? {
                          y: -75,
                          x: 25,
                          rotate: 35,
                          opacity: [1, 0.8, 0],
                        }
                      : { y: 0, x: 0, rotate: 0 }
                  }
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-12 rounded-t-full bg-gradient-to-t from-neutral-400 via-neutral-200 to-neutral-100 border border-neutral-300 shadow-lg flex items-center justify-center"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 -top-2 absolute shadow" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Revealed Brand & Welcome Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 30 }}
              animate={
                step >= 2
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.75, y: 30 }
              }
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 140,
                damping: 12,
              }}
              className="flex flex-col items-center gap-2 mt-4"
            >
              {/* Logo Emblem */}
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#FFB800] via-[#FF4500] to-[#E52020] shadow-xl shadow-orange-600/40">
                <div className="w-full h-full rounded-full bg-[#FFD200] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/kuku-logo.png"
                    alt="KUKU"
                    width={72}
                    height={72}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="mt-2 text-center">
                <span className="text-[11px] font-extrabold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  Welcome to KUKU
                </span>
                <h1 className="text-3xl font-black tracking-tight text-white mt-1">
                  KUKU Fried Chicken
                </h1>
                <p className="text-xs text-neutral-400 mt-1 flex items-center justify-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Crispy · Flame-Grilled · Fresh Delights
                </p>
              </div>
            </motion.div>

            {/* Quick Progress Bar */}
            <div className="w-36 h-1 rounded-full bg-neutral-800 overflow-hidden mt-6">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.0, ease: "linear" }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              />
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-neutral-300 hover:text-white transition-all flex items-center gap-1 border border-white/10 cursor-pointer"
            aria-label="Skip Introduction"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
