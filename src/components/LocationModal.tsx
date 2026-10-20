"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, UtensilsCrossed, Package, Bike, Check } from "lucide-react";
import { Language, UI_TRANSLATIONS } from "@/data/menu";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  orderMode: "dine-in" | "takeaway" | "delivery";
  onOrderModeChange: (mode: "dine-in" | "takeaway" | "delivery") => void;
  tableNumber: string;
  onTableNumberChange: (table: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  orderMode,
  onOrderModeChange,
  tableNumber,
  onTableNumberChange,
}) => {
  const [localTable, setLocalTable] = useState(tableNumber);
  const t = UI_TRANSLATIONS[currentLanguage];

  const handleSave = () => {
    onTableNumberChange(localTable);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="relative w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow-hover p-6 overflow-hidden"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--text-subtle)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[var(--text-main)]">
                  {currentLanguage === "am" ? "የመመገቢያ ምርጫ" : "Dining & Location"}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {currentLanguage === "am"
                    ? "እባክዎን እንዴት መመገብ እንደሚፈልጉ ይምረጡ"
                    : "Select your dining preference"}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {/* Option 1: Dine-in */}
              <div
                onClick={() => onOrderModeChange("dine-in")}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  orderMode === "dine-in"
                    ? "border-[var(--brand-primary)] bg-[var(--brand-subtle-bg)]"
                    : "border-[var(--border-main)] bg-[var(--bg-surface-subtle)] hover:border-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UtensilsCrossed
                      className={`w-5 h-5 ${
                        orderMode === "dine-in"
                          ? "text-[var(--brand-primary)]"
                          : "text-neutral-500"
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-main)]">
                        {t.dineIn}
                      </h4>
                      <a
                        href="https://maps.app.goo.gl/eLSbmirPZpL5QNUj9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[var(--brand-primary)] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Ayat, Addis Ababa (Kuku Fried chicken)
                      </a>
                    </div>
                  </div>
                  {orderMode === "dine-in" && (
                    <Check className="w-5 h-5 text-[var(--brand-primary)]" />
                  )}
                </div>

                {orderMode === "dine-in" && (
                  <div className="mt-3 pt-3 border-t border-[var(--brand-subtle-border)] flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-main)]">
                      Table #:
                    </span>
                    <input
                      type="text"
                      value={localTable}
                      onChange={(e) => setLocalTable(e.target.value)}
                      placeholder="e.g. 12"
                      className="w-24 px-3 py-1.5 text-center font-bold text-xs rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]"
                    />
                  </div>
                )}
              </div>

              {/* Option 2: Takeaway */}
              <div
                onClick={() => onOrderModeChange("takeaway")}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  orderMode === "takeaway"
                    ? "border-[var(--brand-primary)] bg-[var(--brand-subtle-bg)]"
                    : "border-[var(--border-main)] bg-[var(--bg-surface-subtle)] hover:border-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package
                      className={`w-5 h-5 ${
                        orderMode === "takeaway"
                          ? "text-[var(--brand-primary)]"
                          : "text-neutral-500"
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-main)]">
                        {t.takeaway}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Pickup from kitchen counter
                      </p>
                    </div>
                  </div>
                  {orderMode === "takeaway" && (
                    <Check className="w-5 h-5 text-[var(--brand-primary)]" />
                  )}
                </div>
              </div>

              {/* Option 3: Delivery */}
              <div
                onClick={() => onOrderModeChange("delivery")}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  orderMode === "delivery"
                    ? "border-[var(--brand-primary)] bg-[var(--brand-subtle-bg)]"
                    : "border-[var(--border-main)] bg-[var(--bg-surface-subtle)] hover:border-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bike
                      className={`w-5 h-5 ${
                        orderMode === "delivery"
                          ? "text-[var(--brand-primary)]"
                          : "text-neutral-500"
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-main)]">
                        Delivery (Order via WhatsApp)
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Delivered fresh to your doorstep
                      </p>
                    </div>
                  </div>
                  {orderMode === "delivery" && (
                    <Check className="w-5 h-5 text-[var(--brand-primary)]" />
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="mt-5 w-full py-3 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white font-extrabold text-sm shadow-md transition-all"
            >
              Confirm
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
