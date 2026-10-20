"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { CATEGORIES, CategoryInfo, MenuCategoryId, Language } from "@/data/menu";
import { Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

interface CategoryNavProps {
  activeCategory: MenuCategoryId;
  onSelectCategory: (id: MenuCategoryId) => void;
  currentLanguage: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  currentLanguage,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryName = (cat: CategoryInfo) => {
    if (currentLanguage === "am") return cat.nameAm;
    if (currentLanguage === "om") return cat.nameOm;
    return cat.name;
  };

  const allLabel =
    currentLanguage === "am"
      ? "ሁሉም"
      : currentLanguage === "om"
      ? "Hunda"
      : "All Items";

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[56px] sm:top-[68px] z-30 bg-[var(--bg-app)]/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-[var(--border-subtle)] w-full transition-colors">
      <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-5 relative flex items-center">
        {/* Left Arrow Button for Desktop */}
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            scroll("left");
          }}
          aria-label="Scroll left"
          className="hidden md:flex absolute -left-2 z-10 w-7 h-7 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] items-center justify-center shadow-md hover:text-[var(--brand-primary)] cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Horizontal Scroll Row */}
        <div
          ref={scrollContainerRef}
          className="w-full flex items-center gap-2 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
        >
          {/* "All" Category Pill */}
          <button
            type="button"
            onClick={() => {
              soundFx.playPop();
              onSelectCategory("all");
            }}
            className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl min-w-[68px] sm:min-w-[80px] shrink-0 transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-[var(--bg-card)] border-2 border-[var(--brand-primary)] food-card-shadow scale-[1.03]"
                : "bg-transparent border border-transparent hover:bg-[var(--bg-card)]/70"
            }`}
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-gold)] text-white shadow-md shadow-orange-500/20 ring-2 ring-[var(--brand-primary)]/30"
                  : "bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] group-hover:scale-105"
              }`}
            >
              <Utensils
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  activeCategory === "all" ? "text-white" : "text-[var(--brand-primary)]"
                }`}
              />
            </div>
            <span
              className={`mt-1.5 text-xs font-black tracking-tight text-center whitespace-nowrap ${
                activeCategory === "all"
                  ? "text-[var(--brand-primary)]"
                  : "text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
              }`}
            >
              {allLabel}
            </span>
          </button>

          {/* Individual Category Avatars with Circular Food Photos */}
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const displayName = getCategoryName(cat);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  onSelectCategory(cat.id);
                }}
                className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl min-w-[68px] sm:min-w-[80px] shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--bg-card)] border-2 border-[var(--brand-primary)] food-card-shadow scale-[1.03]"
                    : "bg-transparent border border-transparent hover:bg-[var(--bg-card)]/70"
                }`}
              >
                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-[var(--brand-primary)] ring-offset-2 ring-offset-[var(--bg-app)] shadow-md shadow-orange-500/20"
                      : "border border-[var(--border-main)] group-hover:scale-105"
                  }`}
                >
                  <Image
                    src={cat.image}
                    alt={displayName}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </div>
                <span
                  className={`mt-1.5 text-xs font-black tracking-tight text-center whitespace-nowrap ${
                    isActive
                      ? "text-[var(--brand-primary)]"
                      : "text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
                  }`}
                >
                  {displayName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button for Desktop */}
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            scroll("right");
          }}
          aria-label="Scroll right"
          className="hidden md:flex absolute -right-2 z-10 w-7 h-7 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] items-center justify-center shadow-md hover:text-[var(--brand-primary)] cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
