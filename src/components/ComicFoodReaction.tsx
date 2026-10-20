"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ComicParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  rotation: number;
}

interface ComicFoodReactionProps {
  onTrigger?: () => void;
}

export const useComicReactions = () => {
  const [particles, setParticles] = useState<ComicParticle[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const funnyPraise = [
    "Boom! Flavor Explosion! 💥🍗",
    "Bawk! Elite tastebuds! 🐔✨",
    "That cheese stretch is legendary! 🧀🔥",
    "Warning: Severe drooling ahead! 🤤",
    "Chef Kuku gives two wings up! 🍗🍗",
    "Straight out of the fire grill! 🔥",
    "Mouth is already watering! 😋",
  ];

  const triggerReaction = (e?: React.MouseEvent) => {
    const emojis = ["🍗", "🔥", "✨", "🤤", "🌶️", "🌯", "🍕", "🍔", "😋"];
    const clickX = e ? e.clientX : typeof window !== "undefined" ? window.innerWidth / 2 : 200;
    const clickY = e ? e.clientY : typeof window !== "undefined" ? window.innerHeight / 2 : 300;

    const newParticles: ComicParticle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: clickX + (Math.random() * 80 - 40),
      y: clickY + (Math.random() * 40 - 20),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      rotation: Math.random() * 60 - 30,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    const randomToast = funnyPraise[Math.floor(Math.random() * funnyPraise.length)];
    setToastMessage(randomToast);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1200);

    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  return { particles, toastMessage, triggerReaction };
};

export const ComicReactionCanvas: React.FC<{
  particles: ComicParticle[];
  toastMessage: string | null;
}> = ({ particles, toastMessage }) => {
  return (
    <>
      {/* Floating Animated Comic Particles */}
      <div className="fixed inset-0 pointer-events-none z-60 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.6, x: p.x, y: p.y }}
            animate={{
              opacity: 0,
              scale: 1.6,
              x: p.x + (Math.random() * 120 - 60),
              y: p.y - 120 - Math.random() * 80,
              rotate: p.rotation * 3,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="fixed text-2xl select-none"
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      {/* Floating Funny Praise Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-60 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-orange-950/25 pointer-events-none flex items-center gap-2 border border-amber-300/40"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
