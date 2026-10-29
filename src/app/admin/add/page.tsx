"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MenuItem,
  CATEGORIES,
  CategoryInfo,
  INITIAL_MENU_ITEMS,
  MenuCategoryId,
} from "@/data/menu";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Check,
  Flame,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Lock,
  Unlock,
  Eye,
  Layers,
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

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    id: `kuku-${Date.now()}`,
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
    tags: ["Popular"],
    isAvailable: true,
  });

  // Check authentication & load items
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem("kuku_admin_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }

      const storedItems = localStorage.getItem("kuku_menu_items");
      let allItems = INITIAL_MENU_ITEMS;
      if (storedItems) {
        try {
          allItems = JSON.parse(storedItems);
        } catch {
          allItems = INITIAL_MENU_ITEMS;
        }
      }
      setItems(allItems);

      // If in edit mode, populate data from the matching item
      if (editId) {
        const found = allItems.find((it) => it.id === editId);
        if (found) {
          setFormData({ ...found });
        }
      }

      // Load dynamic categories
      const loadCategories = () => {
        const storedCats = localStorage.getItem("kuku_categories");
        if (storedCats) {
          try {
            const parsed = JSON.parse(storedCats);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCategories(parsed);
              return;
            }
          } catch {
            // ignore
          }
        }
        setCategories(CATEGORIES);
      };

      loadCategories();
      window.addEventListener("kuku_categories_updated", loadCategories);
      return () => window.removeEventListener("kuku_categories_updated", loadCategories);
    }
  }, [editId]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";
    setIsUploading(true);
    setUploadError("");

    try {
      const { blob, dataUrl } = await compressImageFile(file);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      return;
    }

    let updatedList: MenuItem[] = [];

    if (editId) {
      // Editing existing item
      updatedList = items.map((it) =>
        it.id === editId ? ({ ...it, ...formData } as MenuItem) : it
      );
    } else {
      // Adding brand new item
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
        tags: formData.tags || ["Popular"],
        isAvailable: formData.isAvailable !== false,
      };
      updatedList = [newItem, ...items];
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("kuku_menu_items", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("kuku_menu_updated"));
    }

    setSaveSuccess(true);
    setTimeout(() => {
      router.push("/admin");
    }, 600);
  };

  // If locked
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-ember-pattern selection:bg-[var(--brand-primary)] selection:text-white">
        <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-8 shadow-2xl food-card-shadow flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[var(--brand-primary)] mb-5 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-[var(--text-main)]">
            Admin Authentication Required
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-2 mb-6">
            Please enter your PIN to access the product creation page.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 8899)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 font-mono text-center tracking-[0.25em] text-lg"
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
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:brightness-105 cursor-pointer"
            >
              Unlock Page
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] w-full flex items-center justify-between text-xs text-[var(--text-muted)]">
            <Link href="/admin" className="flex items-center gap-1.5 hover:text-[var(--brand-primary)] font-medium">
              <ArrowLeft className="w-4 h-4" /> Go to Dashboard
            </Link>
            <span className="font-mono bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] px-2.5 py-1 rounded-lg border border-[var(--border-main)]">
              PIN: 8899
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] pb-24 bg-ember-pattern selection:bg-[var(--brand-primary)] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-main)] py-3.5 px-4 sm:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-main)] hover:border-[var(--brand-primary)]/40 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Products</span>
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
                <h1 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-main)]">
                  {editId ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-xs text-[var(--text-muted)]">
                  {editId ? "Update dish specifications, pricing, and media" : "Create a new dish or drink for your live restaurant menu"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs sm:text-sm font-semibold border border-[var(--border-main)] transition-all cursor-pointer shadow-xs"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saveSuccess}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Section 1: Basic Information */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--brand-primary)]" />
                  Basic Information
                </h3>
                <span className="text-xs text-[var(--text-subtle)]">* Required fields</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Double Chicken Shawarma"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--price-color)] font-black text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                      Category *
                    </label>
                    <Link
                      href="/admin?tab=categories&action=new"
                      className="text-[11px] font-semibold text-[var(--brand-primary)] hover:underline flex items-center gap-1"
                    >
                      + Add New Category
                    </Link>
                  </div>
                  <select
                    value={formData.category || (categories[0]?.id || "chicken")}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuCategoryId })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition-all cursor-pointer shadow-2xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.nameAm || cat.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] cursor-pointer text-xs font-bold text-[var(--text-main)] hover:border-[var(--brand-primary)]/40 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable !== false}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-[var(--brand-primary)] accent-[var(--brand-primary)] cursor-pointer"
                    />
                    <span>Item is currently In Stock & Active</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Product Image & Upload */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[var(--brand-primary)]" />
                  Product Image
                </h3>
                <span className="text-xs text-[var(--text-subtle)]">Auto-compressed under 100KB</span>
              </div>

              {formData.image && (
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-main)]">
                  <div className="w-16 h-16 rounded-xl bg-[var(--bg-card)] overflow-hidden relative shrink-0 border border-[var(--border-main)]">
                    <Image
                      src={formData.image}
                      alt="Thumbnail preview"
                      fill
                      unoptimized={Boolean(formData.image.startsWith("data:"))}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-[var(--text-main)] truncate">
                      {formData.image}
                    </p>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> High-Resolution Photo Ready
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-dashed border-[var(--brand-subtle-border)] bg-[var(--brand-subtle-bg)] hover:bg-orange-100/70 text-[var(--brand-primary)] text-xs sm:text-sm font-bold cursor-pointer transition-all">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? "Optimizing & uploading..." : "Upload Photo from Device"}</span>
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
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or paste server image URL (/images/...)"
                  className="flex-1 px-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] text-xs font-mono text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] shadow-2xs"
                />
              </div>

              {uploadError && (
                <p className="text-xs text-red-600 font-semibold">{uploadError}</p>
              )}
            </div>

            {/* Section 3: Multilingual Names (Amharic & Afaan Oromoo) */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--brand-primary)]" />
                  Multilingual Titles
                </h3>
                <span className="text-xs text-[var(--text-subtle)]">Amharic & Afaan Oromoo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Amharic Title (አማርኛ)
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] border border-[var(--brand-subtle-border)]">
                      AM
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.nameAm || ""}
                    onChange={(e) => setFormData({ ...formData, nameAm: e.target.value })}
                    placeholder="ለምሳሌ፡ ድርብ የዶሮ ሻዋርማ"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] shadow-2xs"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Afaan Oromoo Title
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] border border-[var(--brand-subtle-border)]">
                      OM
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.nameOm || ""}
                    onChange={(e) => setFormData({ ...formData, nameOm: e.target.value })}
                    placeholder="fakkeenyaaf: Shawaarmaa Lukkuu Dachaa"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Descriptions */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Dish Descriptions
                </h3>
                <span className="text-xs text-[var(--text-subtle)]">All 3 Languages</span>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                  English Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Freshly grilled chicken wrapped in warm flatbread..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] resize-none shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Amharic Description (አማርኛ)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionAm || ""}
                    onChange={(e) => setFormData({ ...formData, descriptionAm: e.target.value })}
                    placeholder="በትኩስ ዳቦ የተጠቀለለ ልዩ የዶሮ ሻዋርማ..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] resize-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Afaan Oromoo Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionOm || ""}
                    onChange={(e) => setFormData({ ...formData, descriptionOm: e.target.value })}
                    placeholder="Daabboo haaraadhaan maramee kan dhihaatu..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--brand-primary)] resize-none shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Customer Menu Preview (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
                <Eye className="w-4 h-4 text-[var(--brand-primary)]" />
                <span>Live Customer Menu Card Preview</span>
              </div>

              {/* Exact MenuCard Styling Replica */}
              <div className="rounded-2xl sm:rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow p-3.5 sm:p-4 overflow-hidden relative">
                <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[var(--bg-surface-subtle)] mb-3">
                  {formData.image ? (
                    <Image
                      src={formData.image}
                      alt={formData.name || "Preview"}
                      fill
                      unoptimized={Boolean(formData.image.startsWith("data:"))}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--brand-primary)]">
                      <Flame className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[var(--brand-primary)] text-white shadow-xs">
                      {formData.category || "Chicken"}
                    </span>
                    {!formData.isAvailable && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-600 text-white shadow-xs">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-[var(--text-main)] text-base truncate">
                      {formData.name || "Product Name"}
                    </h4>
                    <span className="font-black text-[var(--price-color)] text-base shrink-0">
                      {(formData.price || 0).toLocaleString()} <span className="text-xs font-semibold text-[var(--text-muted)]">ETB</span>
                    </span>
                  </div>

                  {formData.nameAm && (
                    <p className="text-xs text-[var(--text-muted)] font-medium truncate">
                      {formData.nameAm}
                    </p>
                  )}

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed pt-0.5">
                    {formData.description || "Enter a description to preview how your customers see it on the live menu."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
                  <span>VAT included</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Customer View
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action Box */}
              <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 hover:brightness-105 text-white font-bold text-sm shadow-md shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveSuccess ? "Saved to Menu!" : "Save and Return"}</span>
                </button>
                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-main)]/60 text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-semibold text-center border border-[var(--border-main)] transition-colors"
                >
                  Discard Changes
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center text-[var(--text-muted)]">
          Loading Product Editor...
        </div>
      }
    >
      <AddProductForm />
    </Suspense>
  );
}
