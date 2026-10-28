"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { X, Download, Share2, Copy, Check } from "lucide-react";
import { Language, UI_TRANSLATIONS } from "@/data/menu";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const t = UI_TRANSLATIONS[currentLanguage];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      QRCode.toDataURL(
        currentUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (err, url) => {
          if (!err) setQrDataUrl(url);
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "kuku-fried-chicken-menu-qr.png";
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-[#FFB800] via-[#FF4500] to-[#E52020] mb-3">
          <div className="w-full h-full rounded-full bg-[#FFD200] flex items-center justify-center">
            <Image
              src="/images/kuku-logo.png"
              alt="KUKU Logo"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">
          KUKU Fried Chicken
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-1 mb-5">
          {t.qrScanNotice}
        </p>

        {/* QR Display Frame */}
        <div className="p-3 bg-white rounded-3xl shadow-xl border-4 border-amber-500/20 mb-4 relative group">
          <img
            src="/images/qr/kuku-official-logo-qr.png"
            alt="KUKU Fried Chicken Official QR Code"
            className="w-60 h-60 rounded-2xl object-contain"
          />
          <div className="mt-2 text-center">
            <span className="text-[11px] font-bold text-[var(--brand-primary)] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
              kuku-kfc.vercel.app
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-2.5">
          <a
            href="/images/qr/kuku-official-logo-qr.png"
            download="kuku-official-logo-qr.png"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[var(--brand-primary)] to-amber-600 text-white shadow-md shadow-orange-500/20 hover:brightness-105 active:scale-95 transition-all text-center"
          >
            <Download className="w-4 h-4" />
            Download QR
          </a>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--brand-primary)]/40 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[var(--brand-primary)]" />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Download Table Stand Poster Link */}
        <a
          href="/images/qr/kuku-menu-table-stand-hd-print.jpg"
          download="kuku-official-table-stand-poster.jpg"
          className="w-full py-2 px-3 rounded-xl bg-[var(--brand-subtle-bg)] text-[var(--brand-primary)] border border-[var(--brand-subtle-border)] hover:bg-orange-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Table Stand Poster (Print-Ready)</span>
        </a>
      </div>
    </div>
  );
};
