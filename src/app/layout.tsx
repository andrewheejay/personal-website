import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* Only the mono face is downloaded; body text is the system Times stack. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

/* No openGraph or twitter blocks and no og:image on purpose. With none of
   them present, link previews fall back to the title, the description and the
   domain, three plain lines. Adding any og:* tag back changes the card. */
export const metadata: Metadata = {
  metadataBase: new URL("https://andrewheejay.com"),
  title: "Andrew Lee",
  description: "the personal website of Andrew Lee",
};

/* themeColor belongs to the viewport export, not metadata. One value: the
   site has a single light theme, the paper color from globals.css. */
export const viewport: Viewport = {
  themeColor: "#FAFCFC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plexMono.variable}>
      <body className="antialiased min-h-screen">
        {/* 672px column (idhant's), 68ch prose measure inside it (allen's).
            Padding steps down under 640px the way both siblings' does. */}
        <main className="max-w-2xl mx-auto px-5 pt-8 pb-12 sm:px-6 sm:pt-16 sm:pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
