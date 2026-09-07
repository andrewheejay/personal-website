import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /built/lime was a real page until the project was removed from the log.
  // Anything still linking to it (an old application, a message, a search
  // result) lands here, so send it to the log rather than the 404 page.
  async redirects() {
    return [
      {
        source: "/built/lime",
        destination: "/",
        permanent: true, // 308: tells crawlers the old URL is gone for good
      },
    ];
  },
};

export default nextConfig;
