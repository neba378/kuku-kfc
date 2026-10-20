"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const MotionicMuralBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Subtle Restaurant Chalk & Texture Layer (Visible on Light & Dark) */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] mix-blend-multiply dark:mix-blend-screen">
        <Image
          src="/images/banner-shining-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority={false}
        />
      </div>

      {/* Ambient Warm Gradient Wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.06] via-transparent to-orange-500/[0.07]" />

      {/* Floating Mural 1: The Cool Rooster Mascot (Floating on top-right) */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [-1, 2, -1],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-8 -right-12 sm:-right-4 w-72 h-72 sm:w-[420px] sm:h-[420px] opacity-[0.22] sm:opacity-[0.26] dark:opacity-[0.15] mix-blend-multiply dark:mix-blend-screen"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden mask-radial-faded">
          <Image
            src="/images/murals/mural-cool-rooster-chicken.png"
            alt=""
            fill
            className="object-cover rounded-full"
            priority={false}
          />
        </div>
      </motion.div>

      {/* Floating Mural 2: The Shawarma Master (Floating on mid-left) */}
      <motion.div
        animate={{
          y: [0, 22, 0],
          rotate: [1, -2, 1],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/3 -left-16 sm:-left-8 w-80 h-80 sm:w-[460px] sm:h-[460px] opacity-[0.20] sm:opacity-[0.24] dark:opacity-[0.14] mix-blend-multiply dark:mix-blend-screen"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src="/images/murals/mural-shawarma-chef.png"
            alt=""
            fill
            className="object-cover rounded-full"
            priority={false}
          />
        </div>
      </motion.div>

      {/* Floating Mural 3: Fish & Rooster Hen Platter (Floating on bottom-right) */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, -8, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute -bottom-12 -right-12 sm:right-12 w-88 h-88 sm:w-[480px] sm:h-[480px] opacity-[0.19] sm:opacity-[0.23] dark:opacity-[0.14] mix-blend-multiply dark:mix-blend-screen"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src="/images/murals/mural-rooster-hen-fish.jpg"
            alt=""
            fill
            className="object-cover rounded-full"
            priority={false}
          />
        </div>
      </motion.div>

      {/* Soft warm radiant highlights */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-400/[0.08] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-amber-400/[0.08] blur-3xl pointer-events-none" />
    </div>
  );
};
