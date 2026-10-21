"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MenuItem, Language, UI_TRANSLATIONS } from "@/data/menu";
import { Flame, Eye } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

interface MenuCardProps {
  item: MenuItem;
  currentLanguage: Language;
  onSelect: (item: MenuItem, e?: React.MouseEvent) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (itemId: string, e?: React.MouseEvent) => void;
  index?: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  currentLanguage,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  index = 0,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  const displayName =
    currentLanguage === "am"
      ? item.nameAm || item.name
      : currentLanguage === "om"
      ? item.nameOm || item.name
      : item.name;

  const displayDescription =
    currentLanguage === "am"
      ? item.descriptionAm || item.description
      : currentLanguage === "om"
      ? item.descriptionOm || item.description
      : item.description;

  const isAvailable = item.isAvailable !== false;

  const handleCardClick = (e: React.MouseEvent) => {
    soundFx.playPop();
    onSelect(item, e);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playCluck();
    if (onToggleFavorite) {
      onToggleFavorite(item.id, e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{
        duration: 0.3,
        delay: Math.min((index % 6) * 0.04, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[var(--brand-primary)]/40 food-card-shadow hover:food-card-shadow-hover transition-all duration-300 overflow-hidden cursor-pointer p-2.5 sm:p-4 ${
        !isAvailable ? "opacity-60 grayscale-[40%]" : ""
      }`}
    >
      <div>
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[var(--bg-surface-subtle)] mb-2 sm:mb-3">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <Flame className="w-10 h-10 text-[var(--brand-primary)]" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

          {/* Status Badges (Minimalist: only out of stock if unavailable) */}
          {!isAvailable && (
            <div className="absolute top-2 left-2 z-10">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-red-600 text-white shadow-sm">
                {t.outOfStock}
              </span>
            </div>
          )}
        </div>

        {/* Item Title - consistent bold font on mobile and desktop */}
        <h4 className="text-sm sm:text-base font-black tracking-tight text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-1 leading-snug">
          {displayName}
        </h4>

        {/* Secondary Title if Amharic or Oromo */}
        {currentLanguage !== "en" && item.name !== displayName && (
          <p className="text-[11px] text-[var(--text-subtle)] font-semibold -mt-0.5 mb-1 truncate">
            {item.name}
          </p>
        )}

        {/* Short Description */}
        <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed font-medium hidden sm:block">
          {displayDescription}
        </p>
      </div>

      {/* Price & View Button */}
      <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <div>
          {item.sizes && item.sizes.length >= 2 ? (
            <div>
              <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[var(--text-subtle)]">
                <span>
                  {currentLanguage === "am"
                    ? item.sizes[0].nameAm
                    : currentLanguage === "om"
                    ? item.sizes[0].nameOm
                    : item.sizes[0].name}
                </span>
                <span>/</span>
                <span>
                  {currentLanguage === "am"
                    ? item.sizes[1].nameAm
                    : currentLanguage === "om"
                    ? item.sizes[1].nameOm
                    : item.sizes[1].name}
                </span>
              </div>
              <div className="flex items-baseline gap-1 text-[var(--brand-primary)]">
                <span className="text-sm sm:text-base font-black tabular-nums">
                  {item.sizes[0].price}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[var(--brand-primary)]/70">/</span>
                <span className="text-sm sm:text-base font-black tabular-nums">
                  {item.sizes[1].price}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase ml-0.5">
                  {item.currency}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-[var(--brand-primary)] tracking-tight tabular-nums">
                {item.price.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-[var(--brand-primary)]/80 uppercase">
                {item.currency}
              </span>
            </div>
          )}
          <span className="text-[10px] text-[var(--text-subtle)] font-medium">
            VAT Inc.
          </span>
        </div>

        {/* Clean Eye / View Button */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white shadow-xs bg-[var(--brand-primary)] group-hover:bg-[var(--brand-hover)] transition-all shrink-0">
          <Eye className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};
