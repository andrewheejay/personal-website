import type { MetadataRoute } from "next";

const BASE_URL = "https://andrewheejay.com";

const ROUTES = [
  "",
  "/built/lime",
  "/built/phishfence",
  "/built/motion-segmentation",
  "/built/authentivox",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
