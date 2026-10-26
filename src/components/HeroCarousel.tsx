"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Language, UI_TRANSLATIONS } from "@/data/menu";
import { soundFx } from "@/utils/soundEffects";

interface HeroCarouselProps {
  currentLanguage: Language;
  onExploreCategory?: (categoryId: string) => void;
  onOpenOrderNow?: () => void;
}

interface SlideItem {
  id: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaCategory?: string;
  image: string;
  imageAlt: string;
  bgGradient: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  currentLanguage,
  onExploreCategory,
  onOpenOrderNow,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const slides: SlideItem[] = [
    {
      id: "slide-shawarma",
      headline:
        currentLanguage === "am"
          ? "ትኩስ። ክሪስፒ። ልዩ ጣዕም።"
          : currentLanguage === "om"
          ? "HO'AA & KURKURAA. MI'AAWAA ADDAA."
          : "HOT & FRESH. DELIVERED FAST.",
      subtitle:
        currentLanguage === "am"
          ? "በልዩ ዳቦ የተጠቀለለ ሻዋርማ፣ ክሪስፒ ፍራይድ ዶሮ እና ትኩስ ፒዛ በእርስዎ ምርጫ።"
          : currentLanguage === "om"
          ? "Shawaarmaa lukkuu addaa, lukkuu kurkuraa fi pizaa haaraa filannoo keessaniin."
          : "Flame-grilled double chicken shawarma, crispy fried chicken and stone-baked pizza made fresh.",
      ctaText:
        currentLanguage === "am"
          ? "ሻዋርማዎችን እይ"
          : currentLanguage === "om"
          ? "Shawaarmaa Ilaali"
          : "Explore Shawarma",
      ctaCategory: "shawarma",
      image: "/images/real/real-special-shawarma.jpg",
      imageAlt: "KUKU Special Double Chicken Shawarma",
      bgGradient: "from-amber-600/35 via-orange-600/20 to-transparent",
    },
    {
      id: "slide-crispy",
      headline:
        currentLanguage === "am"
          ? "የኩኩ ክሪስፒ ዶሮ ድግስ"
          : currentLanguage === "om"
          ? "LUKKUU KURKURAA MI'AAWAA"
          : "CRISPY FRIED TO PERFECTION",
      subtitle:
        currentLanguage === "am"
          ? "ወርቃማ ክሪስፒ የዶሮ ቁራጮች ከድንች ጥብስ እና ከማዮኔዝ ሶስ ጋር።"
          : currentLanguage === "om"
          ? "Lukkuu kurkuraa warqee fakkaatu chiipsii dinichaa fi soosii addaatiin dhihaatu."
          : "Golden secret-recipe fried chicken served with seasoned crispy fries and signature dips.",
      ctaText:
        currentLanguage === "am"
          ? "ክሪስፒ እይ"
          : currentLanguage === "om"
          ? "Kurkuraa Ilaali"
          : "Explore Crispy",
      ctaCategory: "chicken",
      image: "/images/real/real-crispy-chicken.jpg",
      imageAlt: "KUKU Crispy Chicken",
      bgGradient: "from-orange-600/35 via-red-600/20 to-transparent",
    },
    {
      id: "slide-pizza",
      headline:
        currentLanguage === "am"
          ? "ትኩስ የኩኩ ልዩ ፒዛ"
          : currentLanguage === "om"
          ? "PIZAA AYIBII MI'AAWAA"
          : "CHEESY STONE-BAKED PIZZA",
      subtitle:
        currentLanguage === "am"
          ? "በብዙ ሞዛሬላ አይብ፣ የተመረጡ ቅመሞች እና ትኩስ የዶሮ ስጋ የተጋገረ።"
          : currentLanguage === "om"
          ? "Ayibii mozaarellaa baqfame, qoricha aadaa fi foon lukkuutiin kan qophaa'e."
          : "Loaded with melted mozzarella, aromatic secret herbs, and tender seasoned chicken.",
      ctaText:
        currentLanguage === "am"
          ? "ፒዛዎችን እይ"
          : currentLanguage === "om"
          ? "Pizaa Ilaali"
          : "View Pizzas",
      ctaCategory: "pizza",
      image: "/images/real/real-chicken-pizza.jpg",
      imageAlt: "KUKU Special Cheesy Pizza",
      bgGradient: "from-yellow-600/35 via-amber-600/20 to-transparent",
    },
  ];

  // Circular Auto-advance timer (every 5 seconds) unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const slide = slides[currentSlide];

  const handleNext = () => {
    soundFx.playPop();
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    soundFx.playPop();
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCtaClick = () => {
    soundFx.playPop();
    if (slide.ctaCategory && onExploreCategory) {
      onExploreCategory(slide.ctaCategory);
    } else if (onOpenOrderNow) {
      onOpenOrderNow();
    }
  };

  // Touch Swipe Handlers for smooth circular gesture scrolling on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartY.current || 0);

    // If swipe gesture is dominant horizontally
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto px-3.5 sm:px-5 py-2 sm:py-3 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Unified Banner Container matching the authentic shining charcoal & glowing embers menu background */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/50 text-white transition-all duration-700 min-h-[210px] sm:min-h-[260px] md:min-h-[285px] flex items-center cursor-grab active:cursor-grabbing border border-amber-500/25 bg-[#0e0c0b]"
      >
        {/* Authentic Shining Background Texture from KUKU Menu */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner-shining-bg.jpg"
            alt="KUKU Flame & Grill Glow"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Dynamic Subtle Slide Color Accent Glow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} mix-blend-screen pointer-events-none`}
          />
        </AnimatePresence>

        {/* Ambient Warm Golden Vignette & Lens Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(245,158,11,0.18),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),transparent_40%,rgba(0,0,0,0.65))] pointer-events-none" />

        {/* Inner Content Grid */}
        <div className="relative z-10 w-full px-5 py-4 sm:px-8 sm:py-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Left Text Column: Fixed layout heights to guarantee 100% equal title positioning across all slides */}
          <div className="md:col-span-7 flex flex-col justify-center items-start text-left min-h-[145px] sm:min-h-[185px]">
            {/* Headline - min-height ensures equal top & baseline positioning for all 3 titles */}
            <div className="min-h-[56px] sm:min-h-[68px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`head-${slide.id}`}
                  initial={{ opacity: 0, y: direction * 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -direction * 8 }}
                  transition={{ duration: 0.35 }}
                  className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight text-white drop-shadow-md"
                >
                  {slide.headline}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Subtitle - consistent line-clamp and height */}
            <div className="min-h-[36px] sm:min-h-[42px] flex items-start mt-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${slide.id}`}
                  initial={{ opacity: 0, y: direction * 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -direction * 6 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="text-xs sm:text-sm text-white/90 max-w-md line-clamp-2 leading-relaxed font-semibold"
                >
                  {slide.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* CTA Button - exact same vertical position */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCtaClick}
              className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] text-[#3D1000] font-black text-xs sm:text-sm shadow-lg shadow-black/40 hover:brightness-110 hover:shadow-amber-500/30 transition-all cursor-pointer group"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          {/* Right Image Column */}
          <div className="md:col-span-5 relative flex items-center justify-center md:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${slide.id}`}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full p-2 bg-black/40 backdrop-blur-md border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.25)] overflow-hidden shrink-0"
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  sizes="(max-width: 768px) 160px, 220px"
                  className="object-cover rounded-full"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Indicators / Dots (Circular navigation) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
          {slides.map((_, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  setDirection(idx > currentSlide ? 1 : -1);
                  setCurrentSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-6 h-2 bg-white shadow-xs"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>

        {/* Desktop Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-md text-white items-center justify-center transition-colors border border-white/15 cursor-pointer shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-md text-white items-center justify-center transition-colors border border-white/15 cursor-pointer shadow-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
