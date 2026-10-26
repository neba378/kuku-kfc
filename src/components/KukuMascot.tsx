"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KukuCharacter } from "./KukuCharacter";
import { Language, MenuCategoryId } from "@/data/menu";
import { X, Flame, Volume2, VolumeX } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

interface KukuMascotProps {
  currentLanguage: Language;
  activeCategory: MenuCategoryId;
}

export const KukuMascot: React.FC<KukuMascotProps> = ({
  currentLanguage,
  activeCategory,
}) => {
  const [mood, setMood] = useState<"cool" | "happy" | "curious" | "proud" | "sleepy">("cool");
  const [bubbleText, setBubbleText] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [tapCount, setTapCount] = useState<number>(0);
  const [showEggEasterEgg, setShowEggEasterEgg] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.isMuted);

  const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dismiss quote early if user clicks elsewhere
  useEffect(() => {
    if (!bubbleText) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setBubbleText("");
        if (bubbleTimeoutRef.current) {
          clearTimeout(bubbleTimeoutRef.current);
        }
      }
    };

    // Small delay so the click that opened the quote doesn't instantly dismiss it
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 60);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [bubbleText]);

  // Category reactions
  useEffect(() => {
    let message = "";
    let newMood: "cool" | "happy" | "curious" | "proud" = "happy";

    switch (activeCategory) {
      case "pizza":
        newMood = "happy";
        message =
          currentLanguage === "am"
            ? "በሞዛሬላ አይብ የተሞላ ትኩስ ፒዛ! 🍕"
            : "Look at that cheese pull! Stone-baked perfection! 🍕";
        break;
      case "shawarma":
        newMood = "proud";
        message =
          currentLanguage === "am"
            ? "ልዩ የተጠቀለለ የዶሮ ሻዋርማ! 🌯"
            : "Secret garlic sauce + loaded chicken = Shawarma Heaven! 🌯";
        break;
      case "roasted-chicken":
        newMood = "proud";
        message =
          currentLanguage === "am"
            ? "ፍም ላይ በእርጋታ የተጠበሰ ሙሉ ዶሮ! 🍗"
            : "Slow-roasted on the spit until golden tender! 🍗";
        break;
      case "chicken":
        newMood = "cool";
        message =
          currentLanguage === "am"
            ? "ቁርጥምጥም የሚል ክሪስፒ ዶሮ! 🍗🔥"
            : "Hear that crunch? That's the sound of happiness! 🍗🔥";
        break;
      case "burger":
        newMood = "curious";
        message =
          currentLanguage === "am"
            ? "ድርብ ስጋ፣ አይብ እና ድንች ጥብስ! 🍔"
            : "Warning: Extra napkin alert for this juicy burger! 🍔";
        break;
      case "fish":
        newMood = "cool";
        message =
          currentLanguage === "am"
            ? "ትኩስ የዓሳ ፊሌ በቅመም! 🐟"
            : "Fresh catch paired with seasoned rice! 🐟";
        break;
      case "drinks":
        newMood = "happy";
        message =
          currentLanguage === "am"
            ? "ቀዝቃዛ ለስላሳ መጠጦች እና ተጨማሪዎች! 🥤"
            : "Thirsty? Ice-cold shakes & drinks ready! 🥤";
        break;
      default:
        newMood = "cool";
        message = "";
    }

    setMood(newMood);
    if (message) {
      setBubbleText(message);
      const timer = setTimeout(() => setBubbleText(""), 4200);
      return () => clearTimeout(timer);
    }
  }, [activeCategory, currentLanguage]);

  // Handle Tap for hilarious interaction
  const handleTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    soundFx.playCluck();

    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);

    // Easter Egg: Tap 5 times and Kuku lays a golden egg!
    if (nextCount % 5 === 0) {
      setShowEggEasterEgg(true);
      soundFx.playFanfare();
      setMood("proud");
      setBubbleText("🥚 BOOM! Golden Egg Unlocked! 100% Luck Guaranteed! 🔥");
      setTimeout(() => setShowEggEasterEgg(false), 3000);
      bubbleTimeoutRef.current = setTimeout(() => setBubbleText(""), 4500);
      return;
    }

    setMood(nextCount % 2 === 0 ? "proud" : "happy");

    const funnyJokes =
      currentLanguage === "am"
        ? [
            "ለምን መንገዱን አቋረጥኩ? ወደዚህ ሻዋርማ ለመድረስ ነዋ! 🌯",
            "100% ክሪስፒ፣ 0% ላባ! በልዩ ቅመም የተዘጋጀ! 😎🍗",
            "ጥሬ እውነታ: ድንች ጥብስ ፈጽሞ ወደ ቤት አይደርስም በመንገድ ያልቃል! 🍟",
            "የኩኩ ሚስጥር ቅመም ዛሬም ያልተፈታ ምስጢር ነው! 🤫",
            "በጣም ምርጥ ምርጫ! ምላስዎ ዛሬ ያመሰግንዎታል! 🤤",
          ]
        : [
            "Why did I cross the road? To get to this Shawarma! 🌯",
            "100% Crispy, 0% feathers! Secret spice approved! 😎",
            "Fun Fact: French fries never make it home alive! 🍟😋",
            "My rooster senses say you're about to order something incredible! 🍗",
            "Rocking sunglasses because the flavor is too bright! 😎🔥",
            "I didn't choose the nugget life, the nugget life chose me! 🐔",
          ];

    const randomJoke = funnyJokes[nextCount % funnyJokes.length];
    setBubbleText(randomJoke);
    bubbleTimeoutRef.current = setTimeout(() => setBubbleText(""), 4500);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold border border-amber-300/40 cursor-pointer"
        title="Show Kuku Mascot"
      >
        <span className="text-base">🐔</span>
        <span className="text-xs">Kuku</span>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end pointer-events-none select-none"
    >
      {/* Easter Egg Golden Egg */}
      <AnimatePresence>
        {showEggEasterEgg && (
          <motion.div
            initial={{ scale: 0, y: -40, rotate: -20 }}
            animate={{ scale: 1.4, y: -70, rotate: [0, -15, 15, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-4xl pointer-events-none drop-shadow-xl"
          >
            🥚🔥
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speech Bubble */}
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 6 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="mb-1 pointer-events-auto max-w-[210px] sm:max-w-[260px] px-4 py-2.5 rounded-2xl bg-[var(--bg-card)] text-[var(--text-main)] border-2 border-[var(--brand-primary)]/40 food-card-shadow-hover text-xs font-bold leading-snug flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{bubbleText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Card Badge */}
      <div className="relative pointer-events-auto flex items-center group">
        {/* Sound Toggle Button */}
        <button
          onClick={handleToggleSound}
          className="absolute -top-1.5 -left-8 z-10 w-6 h-6 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity food-card-shadow cursor-pointer"
          title={isMuted ? "Unmute Cartoon Sounds" : "Mute Sounds"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
        </button>

        {/* Minimize Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(true);
          }}
          className="absolute -top-1.5 -left-1.5 z-10 w-5 h-5 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity food-card-shadow cursor-pointer"
          title="Minimize mascot"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Mascot Avatar that can be clicked */}
        <motion.div
          onClick={handleTap}
          whileHover={{ scale: 1.1, rotate: [-2, 2, -2] }}
          whileTap={{ scale: 0.9, rotate: [-8, 8, 0] }}
          className="cursor-pointer relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--brand-primary)]/30 p-1 food-card-shadow-hover flex items-center justify-center hover:border-[var(--brand-primary)] transition-all"
          title="Tap Kuku for a joke!"
        >
          <KukuCharacter mood={mood} size={70} animate={true} />

          {/* Activity / Online Dot */}
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};
