import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://andrewheejay.com"),
  title: "andrew heejay lee",
  description: "Building machine learning systems on solid ground.",
  openGraph: {
    title: "andrew heejay lee",
    description: "Building machine learning systems on solid ground.",
    siteName: "andrew heejay lee",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "andrew heejay lee",
    description: "Building machine learning systems on solid ground.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-ink font-sans text-ivory selection:bg-ivory selection:text-black">
        <main className="max-w-2xl mx-auto px-6 py-16 md:py-20">
          {children}
        </main>
      </body>
    </html>
  );
}
