import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andrew Heejay Lee",
  description: "Building machine learning systems on solid ground.",
  openGraph: {
    title: "Andrew Heejay Lee",
    description: "Building machine learning systems on solid ground.",
    type: "website",
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
