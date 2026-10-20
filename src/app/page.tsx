"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MenuItem,
  CATEGORIES,
  INITIAL_MENU_ITEMS,
  MenuCategoryId,
  Language,
  UI_TRANSLATIONS,
} from "@/data/menu";
import { Header } from "@/components/Header";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryNav } from "@/components/CategoryNav";
import { PopularPicks } from "@/components/PopularPicks";
import { MenuCard } from "@/components/MenuCard";
import { ItemModal } from "@/components/ItemModal";
import { OpeningAnimation } from "@/components/OpeningAnimation";
import { KukuMascot } from "@/components/KukuMascot";
import { EmptyState } from "@/components/EmptyState";
import { FunnyKukuRoulette } from "@/components/FunnyKukuRoulette";
import { MotionicMuralBackground } from "@/components/MotionicMuralBackground";
import { soundFx } from "@/utils/soundEffects";
import { Flame } from "lucide-react";

export default function HomePage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [themeMode, setThemeMode] = useState<"auto" | "light" | "dark">("auto");
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  // Search, Price Filter & Sort state
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [priceFilter, setPriceFilter] = useState<"all" | "under600" | "600to1000" | "above1000">("all");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");



  // Load stored state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Sync menu items from localStorage (if updated in admin)
      const stored = localStorage.getItem("kuku_menu_items");
      if (stored) {
        try {
          const parsed: MenuItem[] = JSON.parse(stored);
          const merged = INITIAL_MENU_ITEMS.map((initItem) => {
            const found = parsed.find((p) => p.id === initItem.id);
            if (!found) return initItem;
            const isCustomAdminImage = found.image?.startsWith("data:image") || found.image?.startsWith("blob:");
            return {
              ...initItem,
              ...found,
              image: isCustomAdminImage ? found.image : initItem.image,
            };
          });
          const customItems = parsed.filter(
            (p) => !INITIAL_MENU_ITEMS.some((init) => init.id === p.id)
          );
          setItems([...merged, ...customItems]);
        } catch {
          setItems(INITIAL_MENU_ITEMS);
        }
      }

      // Load favorites
      const storedFavs = localStorage.getItem("kuku_favorites");
      if (storedFavs) {
        try {
          setFavorites(JSON.parse(storedFavs));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Device Theme Auto-Detection & Persistent Preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("kuku_theme_mode") as "auto" | "light" | "dark" | null;
    const currentMode = saved || "auto";
    setThemeMode(currentMode);

    const applyTheme = (mode: "auto" | "light" | "dark") => {
      let isDark = false;
      if (mode === "auto") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        isDark = mode === "dark";
      }

      if (isDark) {
        document.documentElement.classList.add("dark");
        setIsLightMode(false);
      } else {
        document.documentElement.classList.remove("dark");
        setIsLightMode(true);
      }
    };

    applyTheme(currentMode);

    // Listen to device system theme changes in real-time
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const activeSaved = localStorage.getItem("kuku_theme_mode") as "auto" | "light" | "dark" | null;
      if (!activeSaved || activeSaved === "auto") {
        if (e.matches) {
          document.documentElement.classList.add("dark");
          setIsLightMode(false);
        } else {
          document.documentElement.classList.remove("dark");
          setIsLightMode(true);
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  // Save favorites
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kuku_favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  // Listen for admin custom events
  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem("kuku_menu_items");
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          setItems(INITIAL_MENU_ITEMS);
        }
      }
    };
    window.addEventListener("kuku_menu_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("kuku_menu_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleToggleTheme = () => {
    // 2 options only: toggles between light and dark
    const nextMode: "light" | "dark" = isLightMode ? "dark" : "light";
    setThemeMode(nextMode);
    localStorage.setItem("kuku_theme_mode", nextMode);

    if (nextMode === "dark") {
      document.documentElement.classList.add("dark");
      setIsLightMode(false);
    } else {
      document.documentElement.classList.remove("dark");
      setIsLightMode(true);
    }
  };

  const handleToggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const t = UI_TRANSLATIONS[currentLanguage];

  // Filtering & Sorting
  let processedItems = items.filter((item) => {
    // Category match
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    // Price range match (excludes extras so prices filter actual food dishes)
    const matchesPrice =
      priceFilter === "all"
        ? true
        : item.category !== "extra" &&
          ((priceFilter === "under600" && item.price < 600) ||
           (priceFilter === "600to1000" && item.price >= 600 && item.price <= 1000) ||
           (priceFilter === "above1000" && item.price > 1000));

    // Tag match
    const matchesTagFilter =
      !activeTagFilter ||
      (activeTagFilter === "favorites"
        ? favorites.includes(item.id)
        : activeTagFilter === "under700"
        ? item.price <= 700
        : item.tags?.includes(activeTagFilter) || item.badge?.includes(activeTagFilter));

    // Search query match
    if (!searchQuery.trim()) return matchesCategory && matchesPrice && matchesTagFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesName = item.name.toLowerCase().includes(q);
    const matchesNameAm = item.nameAm?.toLowerCase().includes(q);
    const matchesNameOm = item.nameOm?.toLowerCase().includes(q);
    const matchesDesc = item.description?.toLowerCase().includes(q);
    const matchesDescAm = item.descriptionAm?.toLowerCase().includes(q);
    const matchesDescOm = item.descriptionOm?.toLowerCase().includes(q);
    const matchesTag = item.tags?.some((tag) => tag.toLowerCase().includes(q));

    return (
      matchesCategory &&
      matchesPrice &&
      matchesTagFilter &&
      (matchesName ||
        matchesNameAm ||
        matchesNameOm ||
        matchesDesc ||
        matchesDescAm ||
        matchesDescOm ||
        matchesTag)
    );
  });

  // Sorting logic
  if (sortBy === "price-asc") {
    processedItems = [...processedItems].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    processedItems = [...processedItems].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      {/* Motionic Artistic Murals Background */}
      <MotionicMuralBackground />



      {/* Cinematic Opening Animation (played on page load / reload, stays 2-3s) */}
      {showIntro && (
        <OpeningAnimation
          forceShow={showIntro}
          currentLanguage={currentLanguage}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Top Header - Ultra Clean: No QR, No Lock */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        isLightMode={isLightMode}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Hero Promo Carousel (Banner) */}
      {!searchQuery && !activeTagFilter && priceFilter === "all" && (
        <HeroCarousel
          currentLanguage={currentLanguage}
          onExploreCategory={(catId) => {
            soundFx.playPop();
            setActiveCategory(catId as any);
            const dishesSection = document.getElementById("all-dishes");
            if (dishesSection) dishesSection.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* Category Navigation with Circular Food Avatars */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={(catId) => {
          soundFx.playPop();
          setActiveCategory(catId);
        }}
        currentLanguage={currentLanguage}
      />

      {/* Integrated Search and Price Filter Bar (Below banner & categories) */}
      <SearchFilterBar
        currentLanguage={currentLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priceFilter={priceFilter}
        onPriceFilterChange={setPriceFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isFilterOpen={isFilterOpen}
        onToggleFilterOpen={() => setIsFilterOpen(!isFilterOpen)}
        activeTagFilter={activeTagFilter}
        onTagFilterChange={setActiveTagFilter}
        favoriteCount={favorites.length}
      />

      {/* Funny Kuku Food Roulette Trigger (excludes mayonnaise & extras!) */}
      {!searchQuery && !activeTagFilter && priceFilter === "all" && activeCategory === "all" && (
        <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-5 pt-3 sm:pt-4 flex items-center justify-between">
          <FunnyKukuRoulette
            items={items}
            currentLanguage={currentLanguage}
            onSelectItem={handleSelectItem}
          />
        </div>
      )}

      {/* Popular Picks (2 products per row on mobile!) */}
      {!searchQuery && !activeTagFilter && priceFilter === "all" && activeCategory === "all" && (
        <PopularPicks
          items={items}
          currentLanguage={currentLanguage}
          onSelectItem={handleSelectItem}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onViewAll={() => {
            const dishesSection = document.getElementById("all-dishes");
            if (dishesSection) dishesSection.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* Main Dishes Listing - 2 products per row on mobile! */}
      <main
        id="all-dishes"
        className="w-full max-w-6xl mx-auto px-3.5 sm:px-5 py-4 sm:py-6 flex-1 scroll-mt-24 z-10"
      >
        {/* Active Search / Filter Indicator */}
        {(searchQuery || activeTagFilter || priceFilter !== "all" || sortBy !== "default") && (
          <div className="mb-4 flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-bold">
              Showing{" "}
              <strong className="text-[var(--brand-primary)]">
                {processedItems.length}
              </strong>{" "}
              dishes {searchQuery ? `for "${searchQuery}"` : ""}{" "}
              {priceFilter !== "all" ? `(${priceFilter})` : ""}
            </p>
            <button
              onClick={() => {
                soundFx.playPop();
                setSearchQuery("");
                setPriceFilter("all");
                setActiveTagFilter(null);
                setSortBy("default");
                setActiveCategory("all");
              }}
              className="text-xs font-black text-[var(--brand-primary)] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {processedItems.length === 0 ? (
          <EmptyState
            currentLanguage={currentLanguage}
            query={searchQuery}
            onClear={() => {
              setSearchQuery("");
              setPriceFilter("all");
              setActiveTagFilter(null);
              setSortBy("default");
              setActiveCategory("all");
            }}
          />
        ) : activeCategory === "all" && !searchQuery && !activeTagFilter && priceFilter === "all" ? (
          /* Grouped by original Menu Categories - 2 cards per row on mobile! */
          <div className="flex flex-col gap-8 sm:gap-10">
            {CATEGORIES.map((cat) => {
              const catItems = processedItems.filter(
                (item) => item.category === cat.id
              );
              if (catItems.length === 0) return null;

              const catName =
                currentLanguage === "am"
                  ? cat.nameAm
                  : currentLanguage === "om"
                  ? cat.nameOm
                  : cat.name;

              return (
                <section key={cat.id} id={cat.id} className="scroll-mt-36">
                  {/* Category Section Header */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-5 sm:h-6 w-1 rounded-full bg-gradient-to-b from-[var(--brand-primary)] to-[var(--brand-gold)]" />
                      <h3 className="text-base sm:text-xl font-black tracking-tight text-[var(--text-main)] uppercase">
                        {catName}
                      </h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-subtle)] food-card-shadow">
                        {catItems.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setActiveCategory(cat.id);
                      }}
                      className="text-xs font-black text-[var(--brand-primary)] hover:underline cursor-pointer"
                    >
                      {t.viewAll} →
                    </button>
                  </div>

                  {/* 2 Products per row on mobile (grid-cols-2), 3 on tablet, 4 on desktop */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                    {catItems.map((item, idx) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        currentLanguage={currentLanguage}
                        onSelect={handleSelectItem}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                        index={idx}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Filtered Cards Grid - 2 Products per row on mobile! */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {processedItems.map((item, idx) => (
              <MenuCard
                key={item.id}
                item={item}
                currentLanguage={currentLanguage}
                onSelect={handleSelectItem}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                index={idx}
              />
            ))}
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-[var(--border-main)] bg-[var(--bg-card)]/80 backdrop-blur-md py-6 px-4 text-center z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[var(--brand-gold)] to-[var(--brand-primary)]">
            <Image
              src="/images/kuku-logo.png"
              alt="KUKU"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md font-bold">
            {t.footerText}
          </p>

          <p className="text-xs text-[var(--brand-primary)] font-black">
            {t.vatNotice}
          </p>

          <div className="pt-1 flex items-center justify-center gap-3 text-xs text-[var(--text-subtle)] font-medium">
            <a
              href="https://www.google.com/maps/place/Kuku+Fried+chicken/@9.0217783,38.8769058,17z/data=!4m6!3m5!1s0x164b91003dea4379:0x563d6f25a86038b9!8m2!3d9.021773!4d38.8794807!16s%2Fg%2F11p1byrzq2?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--brand-primary)] flex items-center gap-1 font-semibold transition-colors underline underline-offset-4"
            >
              📍 Ayat, Addis Ababa (Kuku Fried chicken)
            </a>
          </div>
        </div>
      </footer>

      {/* Funny Interactive Kuku Mascot Companion */}
      <KukuMascot
        currentLanguage={currentLanguage}
        activeCategory={activeCategory}
      />

      {/* Detailed Food Item Modal */}
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
