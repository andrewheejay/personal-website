import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The /built pages were taken down; each entry on the homepage now links
  // straight to its repo or site. They were public (/built/lime too), so
  // old links land on the homepage instead of a 404.
  async redirects() {
    return [
      {
        source: "/built/:path*",
        destination: "/",
        permanent: true, // 308: the old URLs are gone for good
      },
    ];
  },
};

export default nextConfig;
