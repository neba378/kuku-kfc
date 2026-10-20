"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MenuItem, Language, UI_TRANSLATIONS } from "@/data/menu";
import { Heart, ArrowRight, Eye, Flame } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

interface PopularPicksProps {
  items: MenuItem[];
  currentLanguage: Language;
  onSelectItem: (item: MenuItem, e?: React.MouseEvent) => void;
  onViewAll?: () => void;
  favorites: string[];
  onToggleFavorite: (itemId: string, e?: React.MouseEvent) => void;
}

export const PopularPicks: React.FC<PopularPicksProps> = ({
  items,
  currentLanguage,
  onSelectItem,
  onViewAll,
  favorites,
  onToggleFavorite,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  const popularList = items.filter((item) => item.isPopular).slice(0, 6);
  if (popularList.length === 0) return null;

  const handleCardClick = (item: MenuItem, e: React.MouseEvent) => {
    soundFx.playPop();
    onSelectItem(item, e);
  };

  const handleFavClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    soundFx.playCluck();
    onToggleFavorite(itemId, e);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-3.5 sm:px-5 py-3 sm:py-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-[var(--text-main)]">
              {t.popularPicks}
            </h3>
            <span className="text-base animate-bounce">🍗</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-bold">
            {currentLanguage === "am"
              ? "የኩኩ ደንበኞች በብዛት የሚወዷቸው ምርጥ ምግቦች"
              : "Customer favorites & all-time house bestsellers"}
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="group flex items-center gap-1 text-xs sm:text-sm font-black text-[var(--brand-primary)] hover:underline cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {/* Grid of 2 Products per row on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {popularList.map((item, index) => {
          const isFav = favorites.includes(item.id);

          const displayName =
            currentLanguage === "am"
              ? item.nameAm || item.name
              : currentLanguage === "om"
              ? item.nameOm || item.name
              : item.name;

          const displayDesc =
            currentLanguage === "am"
              ? item.descriptionAm || item.description
              : currentLanguage === "om"
              ? item.descriptionOm || item.description
              : item.description;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ y: -3, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleCardClick(item, e)}
              className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[var(--brand-primary)]/40 food-card-shadow hover:food-card-shadow-hover transition-all duration-300 overflow-hidden cursor-pointer p-2.5 sm:p-4"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[var(--bg-surface-subtle)] mb-2 sm:mb-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />



                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleFavClick(e, item.id)}
                    aria-label="Save to favorites"
                    className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isFav
                        ? "bg-red-500 text-white shadow-md scale-110 animate-bounce"
                        : "bg-white/85 dark:bg-black/60 text-neutral-600 dark:text-neutral-300 hover:text-red-500 hover:scale-110 backdrop-blur-md"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Title */}
                <h4 className="text-sm sm:text-base font-black tracking-tight text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-1 leading-snug">
                  {displayName}
                </h4>

                {/* Subtitle / Description */}
                <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed font-medium hidden sm:block">
                  {displayDesc}
                </p>
              </div>

              {/* Price & Action Row */}
              <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-black text-[var(--brand-primary)] tracking-tight tabular-nums">
                      {item.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-[var(--brand-primary)]/80 uppercase">
                      {item.currency}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-subtle)] font-medium">
                    VAT Inc.
                  </span>
                </div>

                {/* Eye / View Icon */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white shadow-xs bg-[var(--brand-primary)] group-hover:bg-[var(--brand-hover)] transition-all shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
