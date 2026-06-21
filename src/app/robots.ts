import type { MetadataRoute } from "next";

// TODO: swap for the real production domain once deployed
const BASE_URL = "https://andrewheejaylee.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
