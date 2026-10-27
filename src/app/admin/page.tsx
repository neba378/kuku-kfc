"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MenuItem,
  CATEGORIES,
  INITIAL_MENU_ITEMS,
  MenuCategoryId,
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
  Save,
  X,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Upload,
  Layers,
  Sparkles,
  Globe,
  Tag,
  Check,
  Flame,
} from "lucide-react";

// Client-side image optimizer to keep uploads lightweight, fast, and resilient across all platforms
const compressImageFile = (
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Failed to decode image"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          const rawUrl = (e.target?.result as string) || "";
          resolve({ blob: file, dataUrl: rawUrl });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              resolve({ blob: file, dataUrl });
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.src = (e.target?.result as string) || "";
    };
    reader.readAsDataURL(file);
  });
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    nameAm: "",
    nameOm: "",
    category: "chicken",
    price: 500,
    currency: "ETB",
    description: "",
    descriptionAm: "",
    descriptionOm: "",
    image: "/images/crispy-chicken.jpg",
    vatIncluded: true,
    tags: ["Chicken"],
    isAvailable: true,
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so selecting the same file again still fires event
    e.target.value = "";

    setIsUploading(true);
    setUploadError("");

    try {
      // 1. Optimize & resize client-side first (fast, reliable, ensures under ~100KB)
      const { blob, dataUrl } = await compressImageFile(file);

      // 2. Try uploading to server
      try {
        const body = new FormData();
        body.append("file", blob, file.name || "menu-item.jpg");

        const res = await fetch("/api/upload", {
          method: "POST",
          body,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            setFormData((prev) => ({ ...prev, image: data.url }));
            setIsUploading(false);
            return;
          }
        }
      } catch (serverErr) {
        console.warn("Server filesystem upload unavailable, using optimized local storage:", serverErr);
      }

      // 3. Fallback to client-side data URL (works everywhere: Vercel, offline, localhost)
      setFormData((prev) => ({ ...prev, image: dataUrl }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process image";
      console.error("Upload error:", msg);
      setUploadError("Could not process this image. Please select a valid PNG or JPG file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!formData.image) return;
    const currentUrl = formData.image;

    if (currentUrl.startsWith("/uploads/")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: currentUrl }),
        });
      } catch (err) {
        console.error("Failed to delete from server:", err);
      }
    }
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  // Load items from localStorage or fallback to INITIAL_MENU_ITEMS
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem("kuku_admin_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }

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
    }
  }, []);

  // Save changes to localStorage and dispatch custom event
  const saveItems = (updated: MenuItem[]) => {
    setItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kuku_menu_items", JSON.stringify(updated));
      window.dispatchEvent(new Event("kuku_menu_updated"));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 8899 or custom password 'kuku2026'
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

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setFormData({
      id: `kuku-${Date.now()}`,
      name: "",
      nameAm: "",
      nameOm: "",
      category: "chicken",
      price: 600,
      currency: "ETB",
      description: "",
      descriptionAm: "",
      descriptionOm: "",
      image: "/images/crispy-chicken.jpg",
      vatIncluded: true,
      tags: ["Popular"],
      isAvailable: true,
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      return;
    }

    if (editingItem) {
      const updated = items.map((it) =>
        it.id === editingItem.id ? ({ ...it, ...formData } as MenuItem) : it
      );
      saveItems(updated);
      setEditingItem(null);
    } else if (isAddingNew) {
      const newItem: MenuItem = {
        id: formData.id || `kuku-${Date.now()}`,
        name: formData.name || "",
        nameAm: formData.nameAm || formData.name || "",
        nameOm: formData.nameOm || formData.name || "",
        category: (formData.category as MenuCategoryId) || "chicken",
        price: Number(formData.price),
        currency: "ETB",
        description: formData.description || "",
        descriptionAm: formData.descriptionAm || "",
        descriptionOm: formData.descriptionOm || "",
        image: formData.image || "/images/crispy-chicken.jpg",
        vatIncluded: true,
        tags: formData.tags || [],
        isAvailable: formData.isAvailable !== false,
      };
      saveItems([newItem, ...items]);
      setIsAddingNew(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Reset menu back to the original verified menu items?")) {
      saveItems(INITIAL_MENU_ITEMS);
    }
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
  const categoriesCount = new Set(items.map((it) => it.category)).size;

  // IF LOCKED / NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-orange-500 selection:text-white">
        {/* Ambient Warm Glow Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-orange-600/20 to-amber-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-5 shadow-lg shadow-orange-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            KUKU Admin Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 mb-8 leading-relaxed">
            Secured product & menu management system. Please authenticate with your PIN to continue.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 8899)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono text-center tracking-[0.25em] text-lg transition-all"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-xl">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-amber-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Menu
            </Link>
            <span className="font-mono bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/50">
              PIN: 8899
            </span>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 pb-24 selection:bg-orange-500 selection:text-white">
      {/* Top Sleek Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 py-3.5 px-4 sm:px-6 shadow-sm shadow-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-orange-500/40 text-slate-300 hover:text-white transition-all shadow-xs"
              title="Go to customer menu"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                  KUKU Product Manager
                </h1>
                <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live menu catalogue & realtime pricing control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/15 border border-slate-700/80 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 transition-all text-xs font-semibold cursor-pointer"
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
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Items</p>
              <p className="text-xl sm:text-2xl font-black text-white">{totalCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Stock</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-400">{inStockCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sold Out</p>
              <p className="text-xl sm:text-2xl font-black text-rose-400">{soldOutCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</p>
              <p className="text-xl sm:text-2xl font-black text-amber-400">{categoriesCount}</p>
            </div>
          </div>
        </div>

        {/* Database Sync Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800/90 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Real-Time Menu Sync
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Active
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Changes saved here reflect instantly on the customer-facing menu. Use reset if you wish to restore original verified items.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetToDefault}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by English, Amharic or Afaan Oromoo name..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Categories ({totalCount})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Table */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Dish Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Amharic / Oromo</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No products found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-13 h-13 rounded-xl bg-slate-950 overflow-hidden relative shrink-0 border border-slate-800 shadow-xs">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                unoptimized={Boolean(item.image?.startsWith("data:"))}
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <Flame className="w-6 h-6 text-orange-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm sm:text-base">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-400 line-clamp-1 max-w-xs sm:max-w-md mt-0.5">
                              {item.description || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 uppercase tracking-wide">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-black text-amber-400 text-base">
                          {item.price.toLocaleString()} <span className="text-xs font-semibold text-slate-400">{item.currency}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <p className="font-semibold text-slate-200">
                          {item.nameAm || "-"}
                        </p>
                        <p className="text-slate-400 mt-0.5">
                          {item.nameOm || "-"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(item.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            item.isAvailable !== false
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
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
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/15 border border-slate-700/80 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/15 border border-slate-700/80 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 transition-all cursor-pointer"
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
      </main>

      {/* Edit or Add Modal */}
      {(editingItem || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/90 my-8 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  {editingItem ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update item details, translations, pricing, and high-res photography
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex flex-col gap-5">
              {/* Row 1: English Name & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Double Chicken Shawarma"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-amber-400 font-black text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Category & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category || "chicken"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as MenuCategoryId,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer text-xs font-bold text-slate-300 hover:border-slate-700 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable !== false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
                    />
                    <span>Item is currently In Stock & Active</span>
                  </label>
                </div>
              </div>

              {/* Row 3: Product Image Upload & Link */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Product Image
                </label>

                {formData.image && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-14 h-14 rounded-xl bg-slate-950 overflow-hidden relative shrink-0 border border-slate-700">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        unoptimized={Boolean(formData.image.startsWith("data:"))}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-slate-300 truncate">
                        {formData.image}
                      </p>
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3.5 h-3.5" /> Image attached
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/15 text-orange-400 text-xs font-bold cursor-pointer transition-all">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? "Optimizing & uploading..." : "Upload New Image from Device"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={formData.image || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Or enter path / URL (/images/...)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-400 font-semibold">{uploadError}</p>
                )}
              </div>

              {/* Row 4: Multilingual Names (Amharic & Afaan Oromoo) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Name in Amharic (አማርኛ)
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">AM</span>
                  </div>
                  <input
                    type="text"
                    value={formData.nameAm || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nameAm: e.target.value })
                    }
                    placeholder="ለምሳሌ፡ ድርብ የዶሮ ሻዋርማ"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Name in Afaan Oromoo
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">OM</span>
                  </div>
                  <input
                    type="text"
                    value={formData.nameOm || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nameOm: e.target.value })
                    }
                    placeholder="fakkeenyaaf: Shawaarmaa Lukkuu Dachaa"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Row 5: English Description */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Freshly grilled chicken wrapped in warm flatbread..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                />
              </div>

              {/* Row 6: Multilingual Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Description (አማርኛ)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionAm || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionAm: e.target.value,
                      })
                    }
                    placeholder="በትኩስ ዳቦ የተጠቀለለ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Description (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionOm || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionOm: e.target.value,
                      })
                    }
                    placeholder="Daabboo haaraadhaan maramee..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingNew(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-sm font-bold shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
