import type { MetadataRoute } from "next";
import { saloAreas, saloCategories } from "@/lib/salo-directory";
import { saloListings } from "@/lib/salo-listings";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://finnexprience.vercel.app";
  const staticPaths = ["/", "/experiencias", "/destinos", "/planifica", "/salo"];
  const localizedStaticPaths = ["/fi", "/fi/experiencias", "/fi/destinos", "/fi/planifica", "/fi/salo", "/en", "/en/experiencias", "/en/destinos", "/en/planifica", "/en/salo"];
  const saloPaths = (localePrefix: string) => [
    ...saloCategories.map(({ slug }) => `${localePrefix}/salo/${slug}`),
    ...saloAreas.map(({ slug }) => `${localePrefix}/salo/${slug}`),
    ...saloListings.map(({ category, slug }) => `${localePrefix}/salo/${category}/${slug}`),
  ];
  const paths = [...staticPaths, ...localizedStaticPaths, ...saloPaths(""), ...saloPaths("/fi"), ...saloPaths("/en")];
  return [...new Set(paths)].map((path) => ({
    url: base + path,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.endsWith("/salo") ? 0.9 : 0.7,
  }));
}
