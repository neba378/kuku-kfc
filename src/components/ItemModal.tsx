"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MenuItem, Language, UI_TRANSLATIONS } from "@/data/menu";
import { X, CheckCircle2, Flame, Utensils } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  currentLanguage: Language;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  item,
  onClose,
  currentLanguage,
}) => {
  if (!item) return null;

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

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  useEffect(() => {
    setSelectedSizeIndex(0);
  }, [item?.id]);

  const currentPrice =
    item.sizes && item.sizes.length > 0
      ? item.sizes[selectedSizeIndex]?.price ?? item.price
      : item.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl overflow-hidden food-card-shadow-hover flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative w-full aspect-[16/10] bg-[var(--bg-surface-subtle)] shrink-0 overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              unoptimized={Boolean(item.image?.startsWith("data:"))}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <Flame className="w-16 h-16 text-[var(--brand-primary)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-black/30" />

          {/* Content Tags (Beef, Chicken, etc. - minimalist, no marketing hype) */}
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
            {item.tags
              ?.filter((tag) =>
                ["Beef", "Chicken", "Fish", "Vegetarian"].includes(tag)
              )
              .map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/30"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Modal Details */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
              {displayName}
            </h2>
            {currentLanguage !== "en" && item.name !== displayName && (
              <p className="text-xs text-[var(--text-subtle)] font-medium mt-0.5">
                Original name: {item.name}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            {displayDescription}
          </p>

          {/* Size Selector if item has multiple sizes */}
          {item.sizes && item.sizes.length >= 2 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold text-[var(--text-subtle)] uppercase tracking-wider block">
                {currentLanguage === "am"
                  ? "መጠን ይምረጡ"
                  : currentLanguage === "om"
                  ? "Hanga Filadhaa"
                  : "Select Size"}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {item.sizes.map((s, idx) => {
                  const sName =
                    currentLanguage === "am"
                      ? s.nameAm
                      : currentLanguage === "om"
                      ? s.nameOm
                      : s.name;
                  const isSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setSelectedSizeIndex(idx);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-md"
                          : "bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] text-[var(--text-main)] hover:border-[var(--brand-primary)]/50"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-black">
                        {sName}
                      </span>
                      <span
                        className={`text-xs font-black tabular-nums ${
                          isSelected ? "text-white" : "text-[var(--brand-primary)]"
                        }`}
                      >
                        {s.price} {item.currency}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price & Tax Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider font-semibold block">
                Price
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-[var(--brand-primary)] tabular-nums">
                  {currentPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[var(--brand-primary)]/80 uppercase">
                  {item.currency}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-xl bg-emerald-700 text-white dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-500/40 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200 dark:text-emerald-400 shrink-0" />
                15% VAT Included
              </span>
              <p className="text-[10px] text-[var(--text-subtle)] font-medium mt-1">
                No hidden charges
              </p>
            </div>
          </div>

          {/* Funny Kuku Certified Seal */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <span className="text-2xl">🍗</span>
            <div className="text-xs">
              <span className="font-black text-[var(--brand-primary)] block">
                Chef Kuku Approved!
              </span>
              <span className="text-[var(--text-muted)]">
                Hand-marinated in secret spices and prepared fresh on order.
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="w-full py-2.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer text-center"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
