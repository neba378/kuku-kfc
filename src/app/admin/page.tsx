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
} from "lucide-react";

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

  // IF LOCKED / NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col items-center justify-center p-4 bg-ember-pattern">
        <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            KUKU Admin Portal
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 mb-6">
            Secured product & menu management system. Please authenticate to continue.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 8899)"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500 font-mono text-center tracking-widest text-lg"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-600/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] w-full flex items-center justify-between text-xs text-[var(--text-subtle)]">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
            </Link>
            <span className="font-mono bg-[var(--bg-muted)] px-2 py-0.5 rounded">
              Default: 8899
            </span>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-main)] py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-amber-500/40 text-[var(--text-muted)] hover:text-white transition-colors"
              title="Go to customer menu"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">
                  KUKU Product Manager
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Locked Session
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {items.length} total products loaded
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-red-400 text-xs font-semibold"
              title="Lock Admin"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6 flex flex-col gap-6">
        {/* Database Ready Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                Database Connection Ready
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Currently running in active local cache. Provide your DB connection link to synchronize automatically with PostgreSQL / Supabase / Neon!
              </p>
            </div>
          </div>
          <button
            onClick={handleResetToDefault}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-subtle)] hover:text-white flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Table / Cards */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-muted)] text-[var(--text-subtle)] uppercase text-[11px] tracking-wider border-b border-[var(--border-main)]">
                <tr>
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Amharic / Oromo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-900 overflow-hidden relative shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-main)]">
                            {item.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[var(--bg-muted)] text-[var(--text-subtle)] uppercase">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-amber-400">
                        {item.price.toLocaleString()} {item.currency}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">
                      <p className="font-medium text-[var(--text-main)]">
                        {item.nameAm || "-"}
                      </p>
                      <p className="text-[var(--text-subtle)]">
                        {item.nameOm || "-"}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          item.isAvailable !== false
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/15 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {item.isAvailable !== false ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Available
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Sold Out
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-lg bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteItem(item.id, item.name)
                          }
                          className="p-2 rounded-lg bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit or Add Modal */}
      {(editingItem || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div
            className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-5">
              <h3 className="text-lg font-black tracking-tight">
                {editingItem ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className="p-2 rounded-full text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
                    Item Name (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500 font-bold text-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category || "chicken"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as MenuCategoryId,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="/images/... or https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
                    Amharic Name (አማርኛ)
                  </label>
                  <input
                    type="text"
                    value={formData.nameAm || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nameAm: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
                    Afaan Oromoo Name
                  </label>
                  <input
                    type="text"
                    value={formData.nameOm || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nameOm: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
                  Description (EN)
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
                    Amharic Description
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
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-subtle)] uppercase block mb-1">
                    Oromo Description
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
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-main)] text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable !== false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAvailable: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-orange-500"
                  />
                  Item is currently in stock & available
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-muted)] text-sm font-semibold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
