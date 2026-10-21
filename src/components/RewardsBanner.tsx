"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Sparkles, X, Gift, CheckCircle2 } from "lucide-react";
import { Language, UI_TRANSLATIONS } from "@/data/menu";

interface RewardsBannerProps {
  currentLanguage: Language;
}

export const RewardsBanner: React.FC<RewardsBannerProps> = ({ currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const t = UI_TRANSLATIONS[currentLanguage];

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsJoined(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsJoined(false);
      setPhone("");
    }, 2000);
  };

  return (
    <>
      {/* Rewards Card Banner (Directly styled like Image 1 Tortilla Rewards) */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            {/* Glowing Star Icon in soft round container */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--brand-subtle-bg)] border border-[var(--brand-subtle-border)] flex items-center justify-center text-[var(--brand-primary)] shrink-0 shadow-inner">
              <Award className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-black tracking-wider uppercase text-[var(--brand-primary)]">
                  {t.rewards}
                </h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30">
                  VIP Club
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium mt-0.5 max-w-md">
                {t.rewardsSub}
              </p>
            </div>
          </div>

          {/* Join Now Terracotta Pill Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all text-center shrink-0"
          >
            {t.joinNow}
          </motion.button>
        </div>
      </div>

      {/* Rewards Join Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow-hover p-6 overflow-hidden text-center"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-subtle)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] border border-[var(--brand-subtle-border)] flex items-center justify-center mx-auto mb-3">
                <Gift className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">
                {t.rewards}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {currentLanguage === "am"
                  ? "ስልክ ቁጥርዎን በማስገባት የኩኩ ቪአይፒ ክለብ አባል ይሁኑ እና ነጻ የድንች ጥብስ እንዲሁም 10% የልደት ቅናሽ ያግኙ!"
                  : currentLanguage === "om"
                  ? "Lakkoofsa bilbilaa galchuun miseensa VIP KUKU ta'aa, chiipsii bilisaa fi guyyaa dhalootaa keessanitti hir'ifama %10 argadhaa!"
                  : "Join KUKU VIP Club today to receive free crispy fries on your next order, earn points, and get 10% birthday discount!"}
              </p>

              {isJoined ? (
                <div className="mt-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-600 flex items-center justify-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Welcome to KUKU Club! Your rewards card is ready.</span>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="mt-5 flex flex-col gap-3">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0911 234 567"
                    className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--brand-primary)] text-center font-bold tracking-wider"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white font-extrabold text-sm shadow-md shadow-orange-600/25 transition-all"
                  >
                    {t.joinNow}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
