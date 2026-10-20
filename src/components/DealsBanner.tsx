"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Percent } from "lucide-react";
import { Language, UI_TRANSLATIONS } from "@/data/menu";

interface DealsBannerProps {
  currentLanguage: Language;
  onSelectCategory?: (categoryId: string) => void;
}

export const DealsBanner: React.FC<DealsBannerProps> = ({
  currentLanguage,
  onSelectCategory,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172238] via-[#0D1829] to-[#0A121F] border border-blue-900/30 text-white food-card-shadow p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/25 border border-red-500/40 text-red-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVE DEAL</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            UP TO <span className="text-red-500">25% OFF</span> ON CHICKEN & SHAWARMA COMBOS
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {currentLanguage === "am"
              ? "የሙሉ የተጠበሰ ዶሮ ወይም የሻዋርማ ፓኮች ከትልቅ ድንች ጥብስ እና ለስላሳ መጠጥ ጋር በተመጣጣኝ ዋጋ!"
              : "Grab a full roasted chicken or twin shawarma combo with seasoned golden fries and cold drinks."}
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onSelectCategory && onSelectCategory("chicken")}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all"
          >
            <span>{t.orderNow}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Right Graphic Preview */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
            <Image
              src="/images/real/real-crispy-chicken.jpg"
              alt="Combo chicken"
              fill
              className="object-cover"
            />
          </div>

          {/* 25% Off badge stamp */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600 text-white flex flex-col items-center justify-center font-black p-2 shadow-2xl rotate-6 shrink-0 border-2 border-white/30">
            <span className="text-lg sm:text-2xl leading-none">25%</span>
            <span className="text-[10px] tracking-widest uppercase">OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
};
