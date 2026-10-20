"use client";

import React from "react";
import { motion } from "framer-motion";
import { KukuCharacter } from "./KukuCharacter";
import { Language, UI_TRANSLATIONS } from "@/data/menu";
import { SearchX, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  currentLanguage: Language;
  onClear: () => void;
  query: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentLanguage,
  onClear,
  query,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="py-14 sm:py-20 text-center flex flex-col items-center justify-center max-w-sm mx-auto px-4"
    >
      {/* Animated Searching Mascot */}
      <div className="relative mb-3">
        <KukuCharacter mood="searching" size={130} />
      </div>

      <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
        <SearchX className="w-4 h-4" />
        <span>No Dishes Found</span>
      </div>

      <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">
        {t.noResults}
      </h3>

      <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-xs leading-relaxed">
        {t.noResultsSub} &quot;{query}&quot;
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClear}
        className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t.clearSearch}</span>
      </motion.button>
    </motion.div>
  );
};
