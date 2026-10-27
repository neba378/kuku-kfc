"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MenuItem,
  CATEGORIES,
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
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
            <Link
              href="/admin/add"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
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
                          <Link
                            href={`/admin/add?edit=${item.id}`}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/15 border border-slate-700/80 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Edit product on dedicated page"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
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
    </div>
  );
}
