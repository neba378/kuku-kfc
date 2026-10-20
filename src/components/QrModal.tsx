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
        <div className="p-3 bg-white rounded-2xl shadow-inner border-4 border-amber-500/20 mb-6">
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="Kuku Menu QR Code"
              className="w-56 h-56 rounded-lg"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadQr}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-[var(--bg-muted)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-orange-500/40 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-orange-400" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
