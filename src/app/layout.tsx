import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { ThemeToggle } from "./components/ThemeToggle";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

const description =
  "student building machine learning systems — phishing detection, motion segmentation, and an ai wardrobe, with the limitations written down.";

export const metadata: Metadata = {
  metadataBase: new URL("https://andrewheejay.com"),
  title: "andrew heejay lee",
  description,
  openGraph: {
    title: "andrew heejay lee",
    description,
    siteName: "andrew heejay lee",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "andrew heejay lee",
    description,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0C0C" },
  ],
};

// Runs before first paint so a pinned theme never flashes the other one.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plexMono.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased min-h-screen bg-bg font-sans text-fg selection:bg-fg selection:text-bg">
        <main className="max-w-2xl mx-auto px-6 py-16 md:py-20">
          {children}
          <div className="flex justify-end pt-12">
            <ThemeToggle />
          </div>
        </main>
      </body>
    </html>
  );
}
