"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Language, UI_TRANSLATIONS } from "@/data/menu";
import { soundFx } from "@/utils/soundEffects";

interface SearchFilterBarProps {
  currentLanguage: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priceFilter: "all" | "under600" | "600to1000" | "above1000";
  onPriceFilterChange: (filter: "all" | "under600" | "600to1000" | "above1000") => void;
  sortBy: "default" | "price-asc" | "price-desc";
  onSortByChange: (sort: "default" | "price-asc" | "price-desc") => void;
  isFilterOpen: boolean;
  onToggleFilterOpen: () => void;
  activeTagFilter: string | null;
  onTagFilterChange: (tag: string | null) => void;
  favoriteCount: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  currentLanguage,
  searchQuery,
  onSearchChange,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortByChange,
  isFilterOpen,
  onToggleFilterOpen,
  activeTagFilter,
  onTagFilterChange,
  favoriteCount,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage];

  const priceOptions = [
    { id: "all", label: "All Prices" },
    { id: "under600", label: "< 600 ETB" },
    { id: "600to1000", label: "600 to 1,000 ETB" },
    { id: "above1000", label: "1,000+ ETB" },
  ] as const;

  const tagOptions = [
    { id: "all", label: "All" },
    { id: "favorites", label: `❤️ Favorites (${favoriteCount})` },
    { id: "Beef", label: "Beef" },
    { id: "Chicken", label: "Chicken" },
    { id: "Fish", label: "Fish" },
    { id: "Vegetarian", label: "Vegetarian" },
  ];

  const activeFiltersCount =
    (priceFilter !== "all" ? 1 : 0) +
    (activeTagFilter ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-5 pt-3 pb-1">
      {/* Search Input seamlessly combined with Filter Toggle button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] text-sm font-semibold text-[var(--text-main)] placeholder:text-[var(--text-subtle)] placeholder:font-normal focus:outline-none focus:border-[var(--brand-primary)] food-card-shadow transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                soundFx.playPop();
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--text-subtle)] hover:text-[var(--text-main)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => {
            soundFx.playPop();
            onToggleFilterOpen();
          }}
          aria-label="Toggle price and sort filters"
          className={`relative p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            isFilterOpen || activeFiltersCount > 0
              ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-md shadow-orange-600/25"
              : "bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--brand-primary)] food-card-shadow"
          }`}
          title="Filter and Sort"
        >
          <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs font-black hidden sm:inline">Filter</span>
          {activeFiltersCount > 0 && (
            <span
              className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                isFilterOpen
                  ? "bg-white text-[var(--brand-primary)]"
                  : "bg-[var(--brand-primary)] text-white"
              }`}
            >
              {activeFiltersCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Expandable Price & Filter Drawer */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-2.5 p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow space-y-3"
        >
          {/* Price Range Filter Row */}
          <div>
            <span className="text-xs font-black text-[var(--text-subtle)] uppercase tracking-wider block mb-1.5">
              Filter by Price:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {priceOptions.map((opt) => {
                const isActive = priceFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      onPriceFilterChange(opt.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--brand-primary)] text-white shadow-xs"
                        : "bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Tag & Sort Row */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
            {/* Tag Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {tagOptions.map((opt) => {
                const isActive =
                  (opt.id === "all" && !activeTagFilter) ||
                  activeTagFilter === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      onTagFilterChange(opt.id === "all" ? null : opt.id);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--brand-primary)] text-white shadow-xs"
                        : "bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
              <select
                value={sortBy}
                onChange={(e) => {
                  soundFx.playPop();
                  onSortByChange(e.target.value as any);
                }}
                className="bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl px-2.5 py-1 text-xs font-bold text-[var(--text-main)] focus:outline-none cursor-pointer"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    onPriceFilterChange("all");
                    onTagFilterChange(null);
                    onSortByChange("default");
                  }}
                  className="px-2 py-0.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
