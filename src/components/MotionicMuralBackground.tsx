"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const MotionicMuralBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Ambient Warm Gradient Wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] via-transparent to-orange-500/[0.04]" />

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
        className="absolute -top-12 -right-16 sm:-right-8 w-64 h-64 sm:w-96 sm:h-96 opacity-[0.09] dark:opacity-[0.14] mix-blend-multiply dark:mix-blend-screen"
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
        className="absolute top-1/3 -left-20 sm:-left-12 w-72 h-72 sm:w-[420px] sm:h-[420px] opacity-[0.08] dark:opacity-[0.13] mix-blend-multiply dark:mix-blend-screen"
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
        className="absolute -bottom-16 -right-16 sm:right-10 w-80 h-80 sm:w-[440px] sm:h-[440px] opacity-[0.08] dark:opacity-[0.13] mix-blend-multiply dark:mix-blend-screen"
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

      {/* Soft warm radial glow blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-400/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-amber-400/[0.04] blur-3xl pointer-events-none" />
    </div>
  );
};
