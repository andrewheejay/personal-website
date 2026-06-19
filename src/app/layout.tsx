import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// The razor-sharp, elegant display font
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

// Clean sans-serif for tiny utility text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Display font for section headings
const ogg = localFont({
  src: [
    { path: "./fonts/Ogg-Regular.woff", weight: "400", style: "normal" },
    { path: "./fonts/Ogg-RegularItalic.woff", weight: "400", style: "italic" },
  ],
  variable: "--font-ogg-local",
});

export const metadata: Metadata = {
  title: "Andrew Heejay Lee",
  description: "Engineering log and journal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} ${ogg.variable} antialiased min-h-screen font-serif text-[#F4F1EB] selection:bg-[#F4F1EB] selection:text-black relative`}
        style={{
          // The dark radial gradient
          background: "radial-gradient(ellipse at top left, #253629 0%, #0A0D0B 50%, #050505 100%)"
        }}
      >
        {/* The Balanced Film Grain Overlay */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.25] mix-blend-overlay z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>

        {/* Content Wrapper ensures text sits above the grain */}
        <main className="max-w-3xl mx-auto px-6 py-20 md:py-32 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}