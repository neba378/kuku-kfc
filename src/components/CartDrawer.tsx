"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem, Language, UI_TRANSLATIONS } from "@/data/menu";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Check,
  Copy,
  MessageCircle,
  Receipt,
  UtensilsCrossed,
  Package,
  Bike,
} from "lucide-react";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartDrawerProps {
  currentLanguage: Language;
  cart: CartItem[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  orderMode: "dine-in" | "takeaway" | "delivery";
  onOrderModeChange: (mode: "dine-in" | "takeaway" | "delivery") => void;
  tableNumber: string;
  onTableNumberChange: (table: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  currentLanguage,
  cart,
  isOpen,
  onOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderMode,
  onOrderModeChange,
  tableNumber,
  onTableNumberChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [showWaiterReceipt, setShowWaiterReceipt] = useState(false);
  const t = UI_TRANSLATIONS[currentLanguage];

  const totalItems = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const totalPrice = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);

  const formatOrderSummaryText = () => {
    let text = `🍗 *KUKU FRIED CHICKEN ORDER*\n`;
    text += `Mode: ${orderMode.toUpperCase()}${
      orderMode === "dine-in" && tableNumber ? ` (Table #${tableNumber})` : ""
    }\n`;
    text += `---------------------------------\n`;
    cart.forEach((ci) => {
      text += `• ${ci.quantity}x ${ci.item.name} - ${(
        ci.item.price * ci.quantity
      ).toLocaleString()} ETB\n`;
    });
    text += `---------------------------------\n`;
    text += `*Total: ${totalPrice.toLocaleString()} ETB* (15% VAT Inc.)\n`;
    return text;
  };

  const handleCopy = () => {
    const text = formatOrderSummaryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(formatOrderSummaryText());
    // Direct link to WhatsApp
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <>
      {/* Floating Bottom Pill Bar (matches Tortilla & Domino's cart cue) */}
      <AnimatePresence>
        {totalItems > 0 && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <button
              type="button"
              onClick={onOpen}
              className="pointer-events-auto flex items-center justify-between gap-4 px-5 py-3.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white shadow-2xl shadow-orange-950/30 max-w-md w-full transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                  {totalItems}
                </div>
                <div className="text-left">
                  <span className="block text-[11px] uppercase tracking-wider font-bold text-white/80">
                    {t.myOrder}
                  </span>
                  <span className="text-sm font-black tracking-tight tabular-nums">
                    {totalPrice.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-xs bg-white text-[var(--brand-primary)] px-3.5 py-1.5 rounded-full shadow-sm">
                <span>{t.viewOrder}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Cart Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
            {/* Backdrop click */}
            <div className="absolute inset-0" onClick={onClose} />

            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow-hover overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[var(--text-main)] tracking-tight">
                      {t.myOrder}
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {totalItems} {totalItems === 1 ? "item" : "items"} selected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="p-2 rounded-full text-neutral-400 hover:text-red-500 hover:bg-[var(--bg-surface-subtle)] transition-colors text-xs"
                      title="Clear Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-full text-[var(--text-subtle)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Order Mode Switcher */}
              <div className="px-4 py-3 bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOrderModeChange("dine-in")}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    orderMode === "dine-in"
                      ? "bg-[var(--bg-card)] text-[var(--brand-primary)] food-card-shadow border border-[var(--brand-subtle-border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>{t.dineIn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOrderModeChange("takeaway")}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    orderMode === "takeaway"
                      ? "bg-[var(--bg-card)] text-[var(--brand-primary)] food-card-shadow border border-[var(--brand-subtle-border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{t.takeaway}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOrderModeChange("delivery")}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    orderMode === "delivery"
                      ? "bg-[var(--bg-card)] text-[var(--brand-primary)] food-card-shadow border border-[var(--brand-subtle-border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                </button>
              </div>

              {/* Optional Table Number Input if Dine-in */}
              {orderMode === "dine-in" && (
                <div className="px-4 py-2 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--text-muted)]">
                    Table Number:
                  </span>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => onTableNumberChange(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-20 px-2 py-1 text-center font-black rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-main)] text-xs text-[var(--text-main)]"
                  />
                  <span className="text-[11px] text-[var(--text-subtle)]">
                    (Staff will bring order to your table)
                  </span>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[45vh]">
                {cart.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-surface-subtle)] flex items-center justify-center mx-auto mb-3 text-[var(--text-subtle)]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-main)]">
                      {t.emptyOrder}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {t.addSomeDishes}
                    </p>
                  </div>
                ) : (
                  cart.map(({ item, quantity }) => {
                    const displayName =
                      currentLanguage === "am"
                        ? item.nameAm || item.name
                        : currentLanguage === "om"
                        ? item.nameOm || item.name
                        : item.name;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]"
                      >
                        {/* Food Image */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[var(--border-main)]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized={Boolean(item.image?.startsWith("data:"))}
                            className="object-cover"
                          />
                        </div>

                        {/* Title & Price */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate">
                            {displayName}
                          </h5>
                          <span className="text-xs font-black text-[var(--brand-primary)]">
                            {(item.price * quantity).toLocaleString()} {item.currency}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full p-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-black tabular-nums text-[var(--text-main)]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove item button */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer Actions */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Subtotal (15% VAT included):</span>
                    <span className="font-bold tabular-nums">
                      {totalPrice.toLocaleString()} ETB
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-base font-black text-[var(--text-main)]">
                    <span>{t.total}:</span>
                    <span className="text-xl text-[var(--brand-primary)] tabular-nums">
                      {totalPrice.toLocaleString()} ETB
                    </span>
                  </div>

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="py-2.5 px-3 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{t.orderViaWhatsApp}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowWaiterReceipt(true)}
                      className="py-2.5 px-3 rounded-2xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-main)] text-[var(--text-main)] font-extrabold text-xs flex items-center justify-center gap-1.5 border border-[var(--border-main)] transition-all"
                    >
                      <Receipt className="w-4 h-4 text-[var(--brand-primary)]" />
                      <span>{t.showToWaiter}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full py-2 rounded-xl text-xs font-bold text-[var(--brand-primary)] hover:bg-[var(--brand-subtle-bg)] transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">{t.orderCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyOrder}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Staff / Waiter Receipt Modal */}
      <AnimatePresence>
        {showWaiterReceipt && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl bg-white text-neutral-900 p-6 shadow-2xl font-mono text-xs border border-neutral-200"
            >
              <button
                type="button"
                onClick={() => setShowWaiterReceipt(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pb-3 border-b border-dashed border-neutral-300">
                <h4 className="text-base font-black tracking-widest uppercase">
                  KUKU FRIED CHICKEN
                </h4>
                <p className="text-[10px] text-neutral-600">
                  Customer Order Slip
                </p>
                <p className="text-[11px] font-bold mt-1 text-red-700">
                  {orderMode.toUpperCase()}{" "}
                  {orderMode === "dine-in" && tableNumber ? `• TABLE ${tableNumber}` : ""}
                </p>
              </div>

              <div className="py-3 space-y-2 max-h-60 overflow-y-auto">
                {cart.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <span>
                      {quantity}x {item.name}
                    </span>
                    <span className="font-bold">
                      {(item.price * quantity).toLocaleString()} ETB
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-dashed border-neutral-300 space-y-1">
                <div className="flex justify-between font-black text-sm text-red-700">
                  <span>TOTAL DUE:</span>
                  <span>{totalPrice.toLocaleString()} ETB</span>
                </div>
                <p className="text-[9px] text-neutral-500 text-center pt-2">
                  15% VAT Included • Thank you for dining with KUKU!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
