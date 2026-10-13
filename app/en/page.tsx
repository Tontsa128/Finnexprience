import type { Metadata } from "next";
import Home from "../page";

export default function EnglishHome() {
  return <Home locale="en" />;
}


export const metadata: Metadata = {
  title: "Finnexprience | Discover authentic Finland",
  description: "Discover cottages, saunas, archipelago, nature and local experiences around Salo and Finland's southwest coast.",
  alternates: {
    canonical: "/en",
    languages: { es: "/", fi: "/fi", en: "/en" },
  },
  openGraph: {
    title: "Finnexprience | Discover authentic Finland",
    description: "Cottages, saunas, archipelago and local experiences in Southwest Finland.",
    url: "/en",
    siteName: "Finnexprience",
    locale: "en_GB",
    type: "website",
  },
};
