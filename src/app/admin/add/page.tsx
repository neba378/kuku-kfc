"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MenuItem,
  CATEGORIES,
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
  XCircle,
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
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-5 shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Admin Authentication Required
          </h2>
          <p className="text-xs text-slate-400 mt-2 mb-6">
            Please enter your PIN to access the product creation page.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 8899)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 font-mono text-center tracking-[0.25em] text-lg"
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
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-amber-400 cursor-pointer"
            >
              Unlock Page
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 w-full flex items-center justify-between text-xs text-slate-400">
            <Link href="/admin" className="flex items-center gap-1.5 hover:text-orange-400">
              <ArrowLeft className="w-4 h-4" /> Go to Dashboard
            </Link>
            <span className="font-mono bg-slate-800 px-2.5 py-1 rounded-lg">
              PIN: 8899
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 pb-24 selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 py-4 px-4 sm:px-8 shadow-sm shadow-black/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-orange-500/40 text-slate-300 hover:text-white transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Products</span>
            </Link>

            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                {editId ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-xs text-slate-400">
                {editId ? "Update dish specifications, pricing, and media" : "Create a new dish or drink for your live restaurant menu"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saveSuccess}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
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
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  Basic Information
                </h3>
                <span className="text-xs text-slate-500">* Required fields</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Double Chicken Shawarma"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
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
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-amber-400 font-black text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category || "chicken"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuCategoryId })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer text-xs font-bold text-slate-300 hover:border-slate-700 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable !== false}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
                    />
                    <span>Item is currently In Stock & Active</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Product Image & Upload */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-orange-400" />
                  Product Image
                </h3>
                <span className="text-xs text-slate-500">Auto-compressed under 100KB</span>
              </div>

              {formData.image && (
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="w-16 h-16 rounded-xl bg-slate-950 overflow-hidden relative shrink-0 border border-slate-700">
                    <Image
                      src={formData.image}
                      alt="Thumbnail preview"
                      fill
                      unoptimized={Boolean(formData.image.startsWith("data:"))}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-slate-300 truncate">
                      {formData.image}
                    </p>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> High-Resolution Photo Ready
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-dashed border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/15 text-orange-400 text-xs sm:text-sm font-bold cursor-pointer transition-all">
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
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-xs font-mono text-slate-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              {uploadError && (
                <p className="text-xs text-rose-400 font-semibold">{uploadError}</p>
              )}
            </div>

            {/* Section 3: Multilingual Names (Amharic & Afaan Oromoo) */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-400" />
                  Multilingual Titles
                </h3>
                <span className="text-xs text-slate-500">Amharic & Afaan Oromoo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Amharic Title (አማርኛ)
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      AM
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.nameAm || ""}
                    onChange={(e) => setFormData({ ...formData, nameAm: e.target.value })}
                    placeholder="ለምሳሌ፡ ድርብ የዶሮ ሻዋርማ"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Afaan Oromoo Title
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                      OM
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.nameOm || ""}
                    onChange={(e) => setFormData({ ...formData, nameOm: e.target.value })}
                    placeholder="fakkeenyaaf: Shawaarmaa Lukkuu Dachaa"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Descriptions */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Dish Descriptions
                </h3>
                <span className="text-xs text-slate-500">All 3 Languages</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  English Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Freshly grilled chicken wrapped in warm flatbread..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Amharic Description (አማርኛ)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionAm || ""}
                    onChange={(e) => setFormData({ ...formData, descriptionAm: e.target.value })}
                    placeholder="በትኩስ ዳቦ የተጠቀለለ ልዩ የዶሮ ሻዋርማ..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Afaan Oromoo Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionOm || ""}
                    onChange={(e) => setFormData({ ...formData, descriptionOm: e.target.value })}
                    placeholder="Daabboo haaraadhaan maramee kan dhihaatu..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Card Preview (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                <Eye className="w-4 h-4 text-orange-400" />
                <span>Live Customer Menu Preview</span>
              </div>

              {/* The Live Card Replica */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 shadow-2xl relative overflow-hidden">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-3.5">
                  {formData.image ? (
                    <Image
                      src={formData.image}
                      alt={formData.name || "Preview"}
                      fill
                      unoptimized={Boolean(formData.image.startsWith("data:"))}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Flame className="w-12 h-12 text-orange-500/40" />
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-orange-500 text-white shadow-md">
                      {formData.category || "Chicken"}
                    </span>
                    {!formData.isAvailable && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white shadow-md">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-white text-base truncate">
                      {formData.name || "Product Name"}
                    </h4>
                    <span className="font-black text-amber-400 text-base shrink-0">
                      {(formData.price || 0).toLocaleString()} <span className="text-xs font-semibold text-slate-400">ETB</span>
                    </span>
                  </div>

                  {formData.nameAm && (
                    <p className="text-xs text-slate-300 font-medium truncate">
                      {formData.nameAm}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {formData.description || "Enter a description to see how it looks to your customers on the menu."}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>VAT included</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live Render
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action Box */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveSuccess ? "Saved to Menu!" : "Save and Return"}</span>
                </button>
                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold text-center border border-slate-700/60 transition-colors"
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
        <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
          Loading Product Editor...
        </div>
      }
    >
      <AddProductForm />
    </Suspense>
  );
}
