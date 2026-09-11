import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { ThemeToggle } from "./components/ThemeToggle";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

/* No openGraph or twitter blocks and no og:image on purpose. With none of
   them present, link previews fall back to the title, the description and the
   domain — the three plain lines justinwang.xyz shows. Adding any og:* tag
   back changes the card's shape. */
export const metadata: Metadata = {
  metadataBase: new URL("https://andrewheejay.com"),
  title: "Andrew Lee",
  description: "the personal website of Andrew Lee",
};

/* themeColor belongs to the viewport export, not metadata — Next silently
   drops it from metadata and only warns at build time. This paints the
   browser chrome to match the active theme. */
export const viewport: Viewport = {
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
  // suppressHydrationWarning: the pre-paint script below stamps data-theme onto
  // <html> before React hydrates, so the client tree legitimately differs from
  // the server's. Without it, every visitor who has ever used the toggle gets a
  // hydration error in the console. It covers this element's attributes only,
  // not its subtree.
  return (
    <html lang="en" className={plexMono.variable} suppressHydrationWarning>
      <head>
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
