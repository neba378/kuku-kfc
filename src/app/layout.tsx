import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D0D11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "KUKU Fried Chicken | Crispy · Flame Grilled · Shawarma · Burger",
  description:
    "Official digital menu for KUKU Fried Chicken / KFC. Discover our signature Crispy Chicken, Roasted Chicken, flame-grilled wings, authentic shawarma and gourmet burgers.",
  icons: {
    icon: "/images/kuku-logo.svg",
  },
  openGraph: {
    title: "KUKU Fried Chicken | Premium Digital Menu",
    description: "Browse menu items, authentic prices & dietary info in English, Amharic & Afaan Oromoo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${notoEthiopic.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
