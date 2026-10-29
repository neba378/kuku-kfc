"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MenuItem,
  CATEGORIES,
  CategoryInfo,
  INITIAL_MENU_ITEMS,
} from "@/data/menu";
import {
  Lock,
  Unlock,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Database,
  Search,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Layers,
  Sparkles,
  Flame,
  Upload,
  X,
  ImageIcon,
  Utensils,
  Pizza,
  Fish,
  Sandwich,
  Coffee,
  CupSoda,
  Cake,
  IceCream,
  Soup,
  Salad,
  Check,
  FolderPlus,
} from "lucide-react";
import { uploadImageToServer } from "@/utils/imageUpload";

// Available Lucide icons for categories
const ICON_OPTIONS = [
  { name: "Flame", component: Flame, label: "Flame / Grill" },
  { name: "Drumstick", component: Flame, label: "Chicken" },
  { name: "Sandwich", component: Sandwich, label: "Burger / Sandwich" },
  { name: "Pizza", component: Pizza, label: "Pizza" },
  { name: "Fish", component: Fish, label: "Fish / Seafood" },
  { name: "Wrap", component: Utensils, label: "Shawarma / Wrap" },
  { name: "CupSoda", component: CupSoda, label: "Drinks / Soda" },
  { name: "Coffee", component: Coffee, label: "Coffee / Hot Drink" },
  { name: "Cake", component: Cake, label: "Dessert / Cake" },
  { name: "IceCream", component: IceCream, label: "Ice Cream" },
  { name: "Soup", component: Soup, label: "Soup" },
  { name: "Salad", component: Salad, label: "Salad" },
  { name: "Utensils", component: Utensils, label: "General Food" },
  { name: "Sparkles", component: Sparkles, label: "Special / Deal" },
];

// Curated preset category food photos for fast selection
const PRESET_CATEGORY_IMAGES = [
  { label: "Shawarma", url: "/images/real/real-special-shawarma.jpg" },
  { label: "Roasted Chicken", url: "/images/real/real-full-roasted-chicken.jpg" },
  { label: "Crispy Chicken", url: "/images/real/real-crispy-chicken.jpg" },
  { label: "Burger", url: "/images/real/real-chicken-burger.jpg" },
  { label: "Fish Platter", url: "/images/real/real-fish-platter.jpg" },
  { label: "Pizza", url: "/images/real/real-chicken-pizza.jpg" },
  { label: "Cold Drinks", url: "/images/kuku-qr-kfc-style.png" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  // Tab State: "products" | "categories"
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  // Items & Categories Data
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [categoryForm, setCategoryForm] = useState<{
    id: string;
    name: string;
    nameAm: string;
    nameOm: string;
    icon: string;
    image: string;
  }>({
    id: "",
    name: "",
    nameAm: "",
    nameOm: "",
    icon: "Utensils",
    image: "/images/real/real-crispy-chicken.jpg",
  });
  const [isUploadingCatImage, setIsUploadingCatImage] = useState<boolean>(false);
  const [catImageError, setCatImageError] = useState<string>("");
  const catFileInputRef = useRef<HTMLInputElement>(null);

  // Load items and categories from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem("kuku_admin_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }

      // Check url tab
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam === "categories") {
        setActiveTab("categories");
      }
      if (urlParams.get("action") === "new") {
        setIsCategoryModalOpen(true);
      }

      // Load items
      const storedItems = localStorage.getItem("kuku_menu_items");
      if (storedItems) {
        try {
          setItems(JSON.parse(storedItems));
        } catch {
          setItems(INITIAL_MENU_ITEMS);
        }
      } else {
        setItems(INITIAL_MENU_ITEMS);
      }

      // Load categories
      const storedCats = localStorage.getItem("kuku_categories");
      if (storedCats) {
        try {
          const parsed = JSON.parse(storedCats);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          } else {
            setCategories(CATEGORIES);
          }
        } catch {
          setCategories(CATEGORIES);
        }
      } else {
        setCategories(CATEGORIES);
      }
    }
  }, []);

  // Save items to localStorage and notify app
  const saveItems = (updated: MenuItem[]) => {
    setItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kuku_menu_items", JSON.stringify(updated));
      window.dispatchEvent(new Event("kuku_menu_updated"));
    }
  };

  // Save categories to localStorage and notify app
  const saveCategories = (updated: CategoryInfo[]) => {
    setCategories(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kuku_categories", JSON.stringify(updated));
      window.dispatchEvent(new Event("kuku_categories_updated"));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "8899" || pinInput === "kuku2026") {
      setIsAuthenticated(true);
      setPinError("");
      sessionStorage.setItem("kuku_admin_auth", "true");
    } else {
      setPinError("Incorrect PIN or Password. (Hint: 8899)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("kuku_admin_auth");
  };

  const handleToggleAvailability = (id: string) => {
    const updated = items.map((it) =>
      it.id === id ? { ...it, isAvailable: !it.isAvailable } : it
    );
    saveItems(updated);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = items.filter((it) => it.id !== id);
      saveItems(updated);
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Reset menu products back to original default list?")) {
      saveItems(INITIAL_MENU_ITEMS);
    }
  };

  const handleResetCategoriesToDefault = () => {
    if (confirm("Reset categories back to original default list?")) {
      saveCategories(CATEGORIES);
    }
  };

  // Category Modal Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: "",
      name: "",
      nameAm: "",
      nameOm: "",
      icon: "Utensils",
      image: "/images/real/real-crispy-chicken.jpg",
    });
    setCatImageError("");
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryInfo) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      nameAm: cat.nameAm || "",
      nameOm: cat.nameOm || "",
      icon: cat.icon || "Utensils",
      image: cat.image || "/images/real/real-crispy-chicken.jpg",
    });
    setCatImageError("");
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    const dishesInCat = items.filter((it) => it.category === catId);
    if (dishesInCat.length > 0) {
      if (
        !confirm(
          `Warning: ${dishesInCat.length} dish(es) currently belong to "${catName}". Are you sure you want to delete this category?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete category "${catName}"?`)) {
        return;
      }
    }

    const updated = categories.filter((c) => c.id !== catId);
    saveCategories(updated);
  };

  // Auto-slugify helper
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleCatNameChange = (name: string) => {
    setCategoryForm((prev) => {
      // only auto-update id if we are adding new and user hasn't explicitly changed it or it's empty
      if (!editingCategory && (!prev.id || prev.id === slugify(prev.name))) {
        return { ...prev, name, id: slugify(name) };
      }
      return { ...prev, name };
    });
  };

  // Image Upload for Category
  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";
    setIsUploadingCatImage(true);
    setCatImageError("");

    try {
      const url = await uploadImageToServer(file);
      setCategoryForm((prev) => ({ ...prev, image: url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process image";
      console.error("Category image upload error:", msg);
      setCatImageError("Could not upload image. Please try a valid JPG or PNG file.");
    } finally {
      setIsUploadingCatImage(false);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      alert("Category name in English is required.");
      return;
    }

    const catId = categoryForm.id.trim() || slugify(categoryForm.name);
    if (!catId) {
      alert("A valid category ID or slug is required.");
      return;
    }

    const newCategory: CategoryInfo = {
      id: catId,
      name: categoryForm.name.trim(),
      nameAm: categoryForm.nameAm.trim() || categoryForm.name.trim(),
      nameOm: categoryForm.nameOm.trim() || categoryForm.name.trim(),
      icon: categoryForm.icon || "Utensils",
      image: categoryForm.image || "/images/real/real-crispy-chicken.jpg",
    };

    let updatedList: CategoryInfo[];
    if (editingCategory) {
      // If ID changed, also update all menu items that reference this category
      if (editingCategory.id !== catId) {
        const updatedItems = items.map((it) =>
          it.category === editingCategory.id ? { ...it, category: catId } : it
        );
        saveItems(updatedItems);
      }

      updatedList = categories.map((c) =>
        c.id === editingCategory.id ? newCategory : c
      );
    } else {
      // Check for duplicate ID
      if (categories.some((c) => c.id === catId)) {
        alert(`A category with ID "${catId}" already exists. Please choose a different slug.`);
        return;
      }
      updatedList = [...categories, newCategory];
    }

    saveCategories(updatedList);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameOm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCount = items.length;
  const inStockCount = items.filter((it) => it.isAvailable !== false).length;
  const soldOutCount = totalCount - inStockCount;
  const categoriesCount = categories.length;

  // IF LOCKED / NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-ember-pattern selection:bg-[var(--brand-primary)] selection:text-white">
        <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-8 sm:p-10 food-card-shadow flex flex-col items-center text-center relative z-10">
          <div className="relative w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[var(--brand-gold)] via-[var(--brand-primary)] to-red-600 shadow-md shadow-orange-500/20 mb-5">
            <div className="w-full h-full rounded-full bg-[#FFD200] flex items-center justify-center overflow-hidden">
              <Image
                src="/images/kuku-logo.png"
                alt="KUKU Logo"
                width={60}
                height={60}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-main)]">
            KUKU Admin Portal
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 mb-8 leading-relaxed">
            Secured product & category management system. Please authenticate with your PIN to continue.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 8899)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 font-mono text-center tracking-[0.25em] text-lg transition-all"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 py-2 px-3 rounded-xl">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] w-full flex items-center justify-between text-xs text-[var(--text-muted)]">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-[var(--brand-primary)] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Menu
            </Link>
            <span className="font-mono bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] px-2.5 py-1 rounded-lg border border-[var(--border-main)]">
              PIN: 8899
            </span>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] pb-24 bg-ember-pattern selection:bg-[var(--brand-primary)] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-main)] py-3 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-main)] hover:border-[var(--brand-primary)]/40 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-all shadow-xs"
              title="Go to customer menu"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[var(--brand-gold)] via-[var(--brand-primary)] to-red-600 shadow-xs shrink-0">
                <div className="w-full h-full rounded-full bg-[#FFD200] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/kuku-logo.png"
                    alt="KUKU Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-main)]">
                    KUKU Menu Manager
                  </h1>
                  <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Dishes, categories & image upload control
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--brand-primary)]/40 text-[var(--brand-primary)] font-bold text-xs sm:text-sm hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="hidden xs:inline">Add Category</span>
            </button>

            <Link
              href="/admin/add"
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-red-50 border border-[var(--border-main)] hover:border-red-200 text-[var(--text-muted)] hover:text-red-600 transition-all text-xs font-semibold cursor-pointer"
              title="Lock and Log out"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col gap-6">
        {/* Metric Cards Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          <div
            onClick={() => setActiveTab("products")}
            className={`p-4 rounded-2xl bg-[var(--bg-card)] border food-card-shadow flex items-center gap-3.5 cursor-pointer transition-all ${
              activeTab === "products"
                ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/15"
                : "border-[var(--border-main)] hover:border-[var(--brand-primary)]/30"
            }`}
          >
            <div className="p-3 rounded-xl bg-orange-50 text-[var(--brand-primary)] border border-orange-100 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">Total Items</p>
              <p className="text-xl sm:text-2xl font-black text-[var(--text-main)]">{totalCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">In Stock</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-600">{inStockCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">Sold Out</p>
              <p className="text-xl sm:text-2xl font-black text-red-600">{soldOutCount}</p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("categories")}
            className={`p-4 rounded-2xl bg-[var(--bg-card)] border food-card-shadow flex items-center gap-3.5 cursor-pointer transition-all ${
              activeTab === "categories"
                ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/15"
                : "border-[var(--border-main)] hover:border-[var(--brand-primary)]/30"
            }`}
          >
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">Categories</p>
              <p className="text-xl sm:text-2xl font-black text-[var(--brand-gold)]">{categoriesCount}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Switcher */}
        <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "products"
                ? "bg-[var(--brand-primary)] text-white shadow-md shadow-orange-500/20"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)]"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Dishes & Products</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "products"
                  ? "bg-white/20 text-white"
                  : "bg-[var(--bg-surface-subtle)] text-[var(--text-subtle)]"
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "categories"
                ? "bg-[var(--brand-primary)] text-white shadow-md shadow-orange-500/20"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "categories"
                  ? "bg-white/20 text-white"
                  : "bg-[var(--bg-surface-subtle)] text-[var(--text-subtle)]"
              }`}
            >
              {categoriesCount}
            </span>
          </button>
        </div>

        {/* TAB 1: CATEGORIES MANAGER */}
        {activeTab === "categories" && (
          <div className="flex flex-col gap-6">
            {/* Category Top Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[var(--brand-subtle-bg)] via-[var(--bg-card)] to-[var(--brand-subtle-bg)] border border-[var(--brand-subtle-border)] food-card-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-orange-100 text-[var(--brand-primary)] shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                    Menu Category Management
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                    Create custom categories with direct image uploads, multilingual labels (Amharic & Afaan Oromoo), and icons. Changes sync immediately to the customer menu navigation.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetCategoriesToDefault}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to default categories"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default Categories</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Category</span>
                </button>
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const dishesCount = items.filter((it) => it.category === cat.id).length;

                return (
                  <div
                    key={cat.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow flex flex-col justify-between gap-4 hover:border-[var(--brand-primary)]/40 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Circular Food Image with Next.js unoptimized for any uploaded source */}
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-[var(--bg-surface-subtle)] border-2 border-[var(--brand-gold)]/40 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={cat.image || "/images/real/real-crispy-chicken.jpg"}
                          alt={cat.name}
                          fill
                          unoptimized
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h4 className="font-black text-base text-[var(--text-main)] truncate">
                            {cat.name}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-surface-subtle)] text-[var(--text-subtle)] border border-[var(--border-main)] shrink-0">
                            #{cat.id}
                          </span>
                        </div>

                        <div className="text-xs text-[var(--text-muted)] space-y-0.5">
                          <p className="truncate">
                            <span className="font-semibold text-[var(--text-subtle)]">Amharic:</span> {cat.nameAm || "-"}
                          </p>
                          <p className="truncate">
                            <span className="font-semibold text-[var(--text-subtle)]">Oromo:</span> {cat.nameOm || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--brand-primary)] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                        {dishesCount} {dishesCount === 1 ? "dish" : "dishes"}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-2 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-amber-50 border border-[var(--border-main)] hover:border-amber-300 text-[var(--text-muted)] hover:text-amber-700 transition-all cursor-pointer inline-flex items-center justify-center shadow-2xs"
                          title="Edit category & upload image"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-2 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-red-50 border border-[var(--border-main)] hover:border-red-300 text-[var(--text-muted)] hover:text-red-600 transition-all cursor-pointer shadow-2xs"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Category Card Action */}
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-main)] hover:border-[var(--brand-primary)] bg-[var(--bg-card)]/50 hover:bg-[var(--brand-subtle-bg)] flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer group min-h-[160px]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--bg-surface-subtle)] group-hover:bg-[var(--brand-primary)] group-hover:text-white text-[var(--brand-primary)] flex items-center justify-center transition-all shadow-xs">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--brand-primary)]">
                    Create New Category
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Upload food picture & set names
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER (Existing Table) */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-6">
            {/* Database Sync Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[var(--brand-subtle-bg)] via-[var(--bg-card)] to-[var(--brand-subtle-bg)] border border-[var(--brand-subtle-border)] food-card-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-orange-100 text-[var(--brand-primary)] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                    Real-Time Menu Synchronization
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                    Changes saved here reflect instantly on the customer-facing menu. Use reset if you wish to restore original verified items.
                  </p>
                </div>
              </div>
              <button
                onClick={handleResetToDefault}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by English, Amharic or Afaan Oromoo name..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all shadow-xs"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all cursor-pointer shadow-xs"
              >
                <option value="all">All Categories ({totalCount})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Table */}
            <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] uppercase text-[11px] font-bold tracking-wider border-b border-[var(--border-main)]">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Dish Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Amharic / Oromo</th>
                      <th className="py-3.5 px-4">Availability</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[var(--text-muted)]">
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-[var(--bg-card-hover)] transition-colors group"
                        >
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3.5">
                              <div className="w-13 h-13 rounded-xl bg-[var(--bg-surface-subtle)] overflow-hidden relative shrink-0 border border-[var(--border-main)] shadow-xs">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    unoptimized={Boolean(item.image?.startsWith("data:") || item.image?.startsWith("/uploads/"))}
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[var(--brand-primary)]">
                                    <Flame className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-[var(--text-main)] text-sm sm:text-base">
                                  {item.name}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-xs sm:max-w-md mt-0.5">
                                  {item.description || "No description provided"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-main)] uppercase tracking-wide">
                              {categories.find((c) => c.id === item.category)?.name || item.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-black text-[var(--price-color)] text-base">
                              {item.price.toLocaleString()} <span className="text-xs font-semibold text-[var(--text-muted)]">{item.currency}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-xs">
                            <p className="font-semibold text-[var(--text-main)]">
                              {item.nameAm || "-"}
                            </p>
                            <p className="text-[var(--text-muted)] mt-0.5">
                              {item.nameOm || "-"}
                            </p>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleAvailability(item.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                item.isAvailable !== false
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                              }`}
                            >
                              {item.isAvailable !== false ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" /> Sold Out
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/add?edit=${item.id}`}
                                className="p-2 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-amber-50 border border-[var(--border-main)] hover:border-amber-300 text-[var(--text-muted)] hover:text-amber-700 transition-all cursor-pointer inline-flex items-center justify-center shadow-2xs"
                                title="Edit product on dedicated page"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="p-2 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-red-50 border border-[var(--border-main)] hover:border-red-300 text-[var(--text-muted)] hover:text-red-600 transition-all cursor-pointer shadow-2xs"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* CATEGORY ADD / EDIT MODAL WITH IMAGE UPLOAD                               */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 sm:p-8 food-card-shadow relative my-8 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100 text-[var(--brand-primary)]">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-main)]">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Configure category photo, multilingual names, and icon
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-5">
              {/* Category Image Upload Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Category Food Image *
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-main)]">
                  {/* Image Preview Box */}
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[var(--bg-card)] border-2 border-[var(--brand-gold)] shadow-md shrink-0">
                    <Image
                      src={categoryForm.image || "/images/real/real-crispy-chicken.jpg"}
                      alt="Category Preview"
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                    {isUploadingCatImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        ref={catFileInputRef}
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleCategoryImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => catFileInputRef.current?.click()}
                        disabled={isUploadingCatImage}
                        className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingCatImage ? "Uploading..." : "Upload New Image"}</span>
                      </button>

                      {categoryForm.image && (
                        <button
                          type="button"
                          onClick={() => setCategoryForm((p) => ({ ...p, image: "/images/real/real-crispy-chicken.jpg" }))}
                          className="px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-red-50 text-[var(--text-muted)] hover:text-red-600 border border-[var(--border-main)] font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)]">
                      PNG, JPG, or WEBP. Uploads are optimized and saved automatically.
                    </p>

                    {catImageError && (
                      <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 py-1.5 px-2.5 rounded-lg">
                        {catImageError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <p className="text-[11px] font-semibold text-[var(--text-subtle)] mb-2">
                    Or choose from fast preset photos:
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {PRESET_CATEGORY_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setCategoryForm((p) => ({ ...p, image: preset.url }))}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          categoryForm.image === preset.url
                            ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/30 scale-105"
                            : "border-[var(--border-main)] hover:border-[var(--brand-primary)]/50 opacity-80 hover:opacity-100"
                        }`}
                        title={preset.label}
                      >
                        <Image
                          src={preset.url}
                          alt={preset.label}
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Name in English & Auto-slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Category Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => handleCatNameChange(e.target.value)}
                    placeholder="e.g. Ice Cream & Desserts"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Category ID / Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, id: slugify(e.target.value) })}
                    placeholder="e.g. ice-cream-desserts"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] font-mono text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Localized Names (Amharic & Afaan Oromoo) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Amharic Name (አማርኛ)
                  </label>
                  <input
                    type="text"
                    value={categoryForm.nameAm}
                    onChange={(e) => setCategoryForm({ ...categoryForm, nameAm: e.target.value })}
                    placeholder="e.g. አይስክሬም እና ጣፋጮች"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Afaan Oromoo Name
                  </label>
                  <input
                    type="text"
                    value={categoryForm.nameOm}
                    onChange={(e) => setCategoryForm({ ...categoryForm, nameOm: e.target.value })}
                    placeholder="e.g. Aayiskiriimii fi Mi'aawaa"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
                  Category Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.component;
                    const isSelected = categoryForm.icon === opt.name;

                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, icon: opt.name })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-sm shadow-orange-500/20 scale-105"
                            : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--brand-primary)]/40"
                        }`}
                        title={opt.label}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[10px] truncate max-w-full font-medium">
                          {opt.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)] font-semibold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
