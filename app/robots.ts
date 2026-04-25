import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cajuta-admin-login", "/cajuta-dashboard"],
    },
    sitemap: "https://cajuta.tn/sitemap.xml",
  };
}
