"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Flame, Sparkles, Tag, Clock } from "lucide-react";
import { Language } from "@/data/menu";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
}) => {
  const notifications = [
    {
      id: "notif-1",
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      title:
        currentLanguage === "am"
          ? "ትኩስ የሻዋርማ ቅናሽ!"
          : "Free Fries with Special Shawarma!",
      description:
        currentLanguage === "am"
          ? "ዛሬ ልዩ ሻዋርማ ሲያዙ ተጨማሪ ነጻ ድንች ጥብስ በስጦታ ያገኛሉ።"
          : "Order our signature Special Double Shawarma today and get a complimentary side of crispy seasoned fries.",
      time: "Just now",
      badge: "HOT DEAL",
    },
    {
      id: "notif-2",
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      title:
        currentLanguage === "am"
          ? "የቤተሰብ ክሪስፒ ዶሮ ኮምቦ"
          : "Family Crispy Feast 20% OFF",
      description:
        currentLanguage === "am"
          ? "ሙሉ የተጠበሰ ዶሮ ወይም የክሪስፒ ቁራጮች በልዩ ቅናሽ ተዘጋጅቷል።"
          : "Save 20% on any full roasted chicken platter with large fries and drinks for the whole table.",
      time: "2 hours ago",
      badge: "LIMITED",
    },
    {
      id: "notif-3",
      icon: <Tag className="w-4 h-4 text-emerald-500" />,
      title:
        currentLanguage === "am"
          ? "አዲስ የድንጋይ ምድጃ ፒዛዎች ደርሰዋል"
          : "Stone-Baked Pizzas are Hot & Ready",
      description:
        currentLanguage === "am"
          ? "በሞዛሬላ አይብ የተሞሉ አዳዲስ የኩኩ ልዩ ፒዛዎችን ዛሬውኑ ይሞክሩ።"
          : "Check out our hand-tossed Margherita, Chicken and Tuna stone-baked pizzas freshly made to order.",
      time: "Today",
      badge: "NEW",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="relative w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] food-card-shadow-hover overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--text-main)]">
                    {currentLanguage === "am" ? "ማሳወቂያዎች እና ቅናሾች" : "Deals & Alerts"}
                  </h3>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    3 active announcements
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-[var(--text-subtle)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] hover:border-[var(--brand-subtle-border)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--bg-card)] flex items-center justify-center shadow-xs">
                        {item.icon}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                        {item.title}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider bg-[var(--brand-primary)] text-white">
                      {item.badge}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-[10px] text-[var(--text-subtle)] font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[var(--bg-surface-subtle)] border-t border-[var(--border-subtle)] text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-[var(--brand-primary)] hover:underline"
              >
                {currentLanguage === "am" ? "ዝጋ" : "Close"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
