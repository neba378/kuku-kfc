"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem, Language, UI_TRANSLATIONS } from "@/data/menu";
import { Flame, X, RefreshCw } from "lucide-react";
import { KukuCharacter } from "./KukuCharacter";
import { soundFx } from "@/utils/soundEffects";

interface FunnyKukuRouletteProps {
  items: MenuItem[];
  currentLanguage: Language;
  onSelectItem: (item: MenuItem) => void;
}

export const FunnyKukuRoulette: React.FC<FunnyKukuRouletteProps> = ({
  items,
  currentLanguage,
  onSelectItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Filter out extras, mayonnaise, drinks, and packaging boxes! ONLY real delicious meals!
  const eligibleMeals = useMemo(() => {
    return items.filter((item) => {
      if (item.category === "drinks") return false;
      if (item.tags?.includes("Extra") || item.tags?.includes("Sauce")) return false;
      const lower = item.name.toLowerCase();
      if (lower.includes("mayo") || lower.includes("bag") || lower.includes("box") || lower.includes("water")) {
        return false;
      }
      return true;
    });
  }, [items]);

  const funnyQuotes = [
    "The Rooster has spoken! Your tastebuds are about to celebrate! 🍗🎉",
    "100% Chef Certified. If you don't love this, I'll eat my sunglasses! 😎",
    "Holy crispy chicken! That is a top-tier legendary feast right there! 🔥",
    "Bawk bawk! My feathers are tingling, this one is extra delicious! 🍗",
    "Scientifically proven to make humans 300% happier on the first bite! 🤤",
    "Bro, the spice and flavor levels on this are off the charts! 🌶️",
  ];

  const handleOpen = () => {
    setIsOpen(true);
    soundFx.playPop();
    handleSpin();
  };

  const handleSpin = () => {
    if (isSpinning || eligibleMeals.length === 0) return;
    setIsSpinning(true);
    setSelectedDish(null);
    soundFx.playCluck();

    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligibleMeals.length);
      setSelectedDish(eligibleMeals[randomIndex]);
      soundFx.playPop();
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        const finalDish = eligibleMeals[Math.floor(Math.random() * eligibleMeals.length)];
        setSelectedDish(finalDish);
        setIsSpinning(false);
        setQuoteIndex((prev) => (prev + 1) % funnyQuotes.length);
        soundFx.playFanfare();
      }
    }, 110);
  };

  return (
    <>
      {/* Clean & Cool Roulette Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2 rounded-full bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-950 text-amber-400 dark:text-amber-300 font-black text-xs sm:text-sm border border-amber-500/30 shadow-md transition-all cursor-pointer"
      >
        <span>
          {currentLanguage === "am"
            ? "መወሰን አቃተዎት? ኩኩ ይምረጥልዎ"
            : "Can't Decide? Let Kuku Pick"}
        </span>
      </motion.button>

      {/* Wheel / Slot Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-[var(--bg-card)] border-2 border-amber-500/40 food-card-shadow-hover p-6 overflow-hidden text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-subtle)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Animated Kuku Rooster on Top */}
              <div className="flex justify-center -mt-2 mb-2">
                <motion.div
                  animate={
                    isSpinning
                      ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.15, 1] }
                      : { y: [0, -6, 0] }
                  }
                  transition={
                    isSpinning
                      ? { repeat: Infinity, duration: 0.4 }
                      : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
                  }
                >
                  <KukuCharacter
                    size={90}
                    mood={isSpinning ? "proud" : "cool"}
                    animate={true}
                  />
                </motion.div>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-[var(--text-main)] tracking-tight">
                {isSpinning
                  ? "🌀 Kuku is Consulting the Secret Spices..."
                  : "🔥 The Rooster has Chosen!"}
              </h3>

              {/* Chosen Dish Card Box */}
              <div className="my-5 p-4 rounded-3xl bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] food-card-shadow relative overflow-hidden">
                {!isSpinning && selectedDish && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="w-48 h-48 rounded-full bg-amber-400/25 blur-xl"
                    />
                  </div>
                )}

                {selectedDish && (
                  <motion.div
                    key={selectedDish.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative w-44 h-32 sm:w-52 sm:h-36 rounded-2xl overflow-hidden shadow-md border-2 border-white/50 mb-3">
                      <Image
                        src={selectedDish.image}
                        alt={selectedDish.name}
                        fill
                        className="object-cover"
                      />
                      {selectedDish.badge && (
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[var(--brand-primary)] text-white shadow-xs">
                          {selectedDish.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-[var(--text-main)]">
                      {currentLanguage === "am"
                        ? selectedDish.nameAm || selectedDish.name
                        : selectedDish.name}
                    </h4>

                    <span className="text-lg font-black text-[var(--brand-primary)] mt-0.5">
                      {selectedDish.price.toLocaleString()} {selectedDish.currency}
                    </span>

                    <p className="mt-2 text-xs text-[var(--text-muted)] line-clamp-2 max-w-xs leading-relaxed font-medium">
                      {currentLanguage === "am"
                        ? selectedDish.descriptionAm || selectedDish.description
                        : selectedDish.description}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Funny Quote Speech Box */}
              {!isSpinning && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold leading-relaxed"
                >
                  &ldquo;{funnyQuotes[quoteIndex]}&rdquo;
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={handleSpin}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-main)] text-[var(--text-main)] font-extrabold text-xs flex items-center justify-center gap-2 border border-[var(--border-main)] transition-all cursor-pointer"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isSpinning ? "animate-spin text-orange-500" : ""}`}
                  />
                  <span>Spin Again</span>
                </button>

                {selectedDish && !isSpinning && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectItem(selectedDish);
                      setIsOpen(false);
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white font-extrabold text-xs shadow-md shadow-orange-600/30 transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
