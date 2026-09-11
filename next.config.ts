import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /built/lime was a real, public page before lime was folded into the 2026
  // chapter. Anything still linking to it (an old application, a message, a
  // search result) should land on the page that now carries lime, not on a
  // 404 and not on the homepage. /built/dnk needs no entry — it only ever
  // existed on a branch and was never deployed.
  async redirects() {
    return [
      {
        source: "/built/lime",
        destination: "/built/2026",
        permanent: true, // 308: the old URL is gone for good
      },
    ];
  },
};

export default nextConfig;
