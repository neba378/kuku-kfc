"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Language, UI_TRANSLATIONS } from "@/data/menu";
import { Sun, Moon, SunMoon, Volume2, VolumeX } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isLightMode: boolean;
  themeMode?: "auto" | "light" | "dark";
  onToggleTheme: () => void;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isLightMode,
  themeMode = "auto",
  onToggleTheme,
  onReplayIntro,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.isMuted);
  const t = UI_TRANSLATIONS[currentLanguage];

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFx.playPop();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full backdrop-blur-md bg-[var(--bg-header)] border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="w-full max-w-6xl mx-auto px-2.5 sm:px-5 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand identity - consistent bold font on both mobile and desktop */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
            whileTap={{ scale: 0.94 }}
            className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[var(--brand-gold)] via-[var(--brand-primary)] to-red-600 shadow-md shadow-orange-500/20 shrink-0 cursor-pointer"
            onClick={() => {
              soundFx.playCluck();
              if (onReplayIntro) onReplayIntro();
            }}
            title="Watch KUKU Story"
          >
            <div className="w-full h-full rounded-full bg-[#FFD200] flex items-center justify-center overflow-hidden">
              <Image
                src="/images/kuku-logo.svg"
                alt="KUKU Fried Chicken Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[var(--text-main)] leading-none">
                KUKU
              </h1>
              <span className="text-[9px] sm:text-xs uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] border border-[var(--brand-subtle-border)]">
                KFC
              </span>
            </div>
            <p className="hidden md:block text-xs text-[var(--text-muted)] font-bold tracking-tight mt-0.5 truncate">
              {currentLanguage === "am"
                ? "ትኩስ ክሪስፒ ዶሮ፣ ሻዋርማ እና ፒዛ"
                : "Real Crispy Chicken & Shawarma"}
            </p>
          </div>
        </div>

        {/* Clean Controls: Sound, Language, Theme (No QR, No Lock) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleToggleSound}
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
            className="p-1.5 sm:p-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] food-card-shadow transition-colors cursor-pointer"
            title={isMuted ? "Enable sounds" : "Mute sounds"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 animate-pulse" />
            )}
          </motion.button>

          {/* Language Selector Pill */}
          <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full p-0.5 text-[11px] sm:text-xs font-black food-card-shadow">
            {(["en", "am", "om"] as Language[]).map((lang) => {
              const isActive = currentLanguage === lang;
              const label =
                lang === "en" ? "EN" : lang === "am" ? "አማ" : "OR";

              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    onLanguageChange(lang);
                  }}
                  className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--brand-primary)] text-white shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Theme Switcher (Auto/System -> Light -> Dark) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => {
              soundFx.playPop();
              onToggleTheme();
            }}
            aria-label="Toggle Theme"
            className="p-1.5 sm:p-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] food-card-shadow transition-colors cursor-pointer"
            title={
              themeMode === "auto"
                ? `Theme: Auto (${isLightMode ? "Light" : "Dark"}) • Click to switch`
                : themeMode === "light"
                ? "Theme: Light • Click to switch"
                : "Theme: Dark • Click to switch"
            }
          >
            {themeMode === "auto" ? (
              <SunMoon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            ) : isLightMode ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
