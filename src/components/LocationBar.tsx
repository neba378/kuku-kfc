"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Search, SlidersHorizontal, Clock } from "lucide-react";
import { Language, UI_TRANSLATIONS } from "@/data/menu";
import { soundFx } from "@/utils/soundEffects";

interface LocationBarProps {
  currentLanguage: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
}

export const LocationBar: React.FC<LocationBarProps> = ({
  currentLanguage,
  searchQuery,
  onSearchChange,
  onOpenFilters,
  activeFilterCount = 0,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 pt-3 pb-1">
      {/* Restaurant Location & Hours info card (Tortilla aesthetic) */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 food-card-shadow flex items-center justify-between gap-3 transition-colors">
        {/* Left: Location Pin & Open Status (Google Maps Link) */}
        <a
          href="https://www.google.com/maps/place/Kuku+Fried+chicken/@9.0217783,38.8769058,17z/data=!4m6!3m5!1s0x164b91003dea4379:0x563d6f25a86038b9!8m2!3d9.021773!4d38.8794807!16s%2Fg%2F11p1byrzq2?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 min-w-0 flex-1 group hover:opacity-95 transition-opacity cursor-pointer"
          title="Open Kuku Fried chicken on Google Maps"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] flex items-center justify-center shrink-0 border border-[var(--brand-subtle-border)] group-hover:scale-105 transition-transform">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 fill-[var(--brand-primary)]/20" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-[var(--text-main)] truncate group-hover:text-[var(--brand-primary)] transition-colors">
                Ayat, Addis Ababa (Kuku Fried chicken)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {currentLanguage === "am"
                    ? "ክፍት ነው"
                    : currentLanguage === "om"
                    ? "Banaa dha"
                    : "Open"}
                </span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[var(--text-subtle)] font-medium flex items-center gap-1 truncate mt-0.5">
              <Clock className="w-3 h-3 text-[var(--brand-primary)] shrink-0" />
              <span>
                {currentLanguage === "am"
                  ? "እዚሁ ለመመገብ እና ይዞ ለመሄድ • ከጠዋቱ 3:00 እስከ ማታ 5:00"
                  : currentLanguage === "om"
                  ? "Mana keessatti & Fudhatanii deemuuf • 3:00 WD - 5:00 WB"
                  : "Dine-in & Takeaway • 9:00 AM to 11:00 PM"}
              </span>
            </p>
          </div>
        </a>

        {/* Right: Quick Search input & Filter trigger */}
        <div className="relative flex items-center gap-1.5 shrink-0">
          <div className="relative hidden md:block w-60 lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          {onOpenFilters && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                soundFx.playPop();
                onOpenFilters();
              }}
              aria-label="Filter Menu"
              className="relative p-2 sm:p-2.5 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
              title="Filter and Sort"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mt-2 md:hidden relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--brand-primary)] food-card-shadow transition-all"
        />
      </div>
    </div>
  );
};
