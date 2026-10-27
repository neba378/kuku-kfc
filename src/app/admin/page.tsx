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
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-ember-pattern selection:bg-[var(--brand-primary)] selection:text-white">
        <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-8 sm:p-10 food-card-shadow flex flex-col items-center text-center relative z-10">
          {/* Brand Logo Avatar */}
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
            Secured product & menu management system. Please authenticate with your PIN to continue.
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
                    KUKU Product Manager
                  </h1>
                  <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Live menu catalogue & realtime pricing control
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/add"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
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
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow flex items-center gap-3.5">
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

          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider">Categories</p>
              <p className="text-xl sm:text-2xl font-black text-[var(--brand-gold)]">{categoriesCount}</p>
            </div>
          </div>
        </div>

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
            {CATEGORIES.map((cat) => (
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
                                unoptimized={Boolean(item.image?.startsWith("data:"))}
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
                          {item.category}
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
      </main>
    </div>
  );
}
