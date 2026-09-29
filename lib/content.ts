export type Locale = "es" | "en" | "fi";

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
};

export type SiteContent = {
  brand: string;
  tagline: Record<Locale,string>;
  heroTitle: Record<Locale,string>;
  heroText: Record<Locale,string>;
  ctaPrimary: Record<Locale,string>;
  ctaSecondary: Record<Locale,string>;
  slides: HeroSlide[];
};

export const defaultContent: SiteContent = {
  brand: "Finnexprience",
  tagline: {
    es: "No solo visites Finlandia. Vívela.",
    en: "Don’t just visit Finland. Live it.",
    fi: "Älä vain vieraile Suomessa. Koe se."
  },
  heroTitle: {
    es: "Descubre la Finlandia auténtica.",
    en: "Discover authentic Finland.",
    fi: "Löydä aito Suomi."
  },
  heroText: {
    es: "Saunas junto al lago, cabañas, archipiélago, naturaleza y pequeños lugares que convierten un viaje en un recuerdo.",
    en: "Lake saunas, cottages, archipelago, nature and small places that turn a trip into a lasting memory.",
    fi: "Järvisaunat, mökit, saaristo, luonto ja pienet paikat, jotka tekevät matkasta muiston."
  },
  ctaPrimary: { es: "Planifica mi viaje", en: "Plan my trip", fi: "Suunnittele matkani" },
  ctaSecondary: { es: "Explorar experiencias", en: "Explore experiences", fi: "Tutustu elämyksiin" },
  slides: [
    { id: "summer", image: "/images/hero-summer.svg", alt: "Finnish summer cottage by a lake", eyebrow: "Finnish summer" },
    { id: "sauna", image: "/images/hero-sauna.svg", alt: "Finnish lakeside sauna at sunset", eyebrow: "Sauna & wellbeing" },
    { id: "archipelago", image: "/images/hero-archipelago.svg", alt: "Finnish archipelago in summer", eyebrow: "Archipelago life" }
  ]
};

export const categories = [
  { key: "cottages", icon: "⌂", es: "Cabañas", en: "Cottages", fi: "Mökit" },
  { key: "sauna", icon: "♨", es: "Sauna", en: "Sauna", fi: "Sauna" },
  { key: "nature", icon: "⌁", es: "Naturaleza", en: "Nature", fi: "Luonto" },
  { key: "archipelago", icon: "◒", es: "Archipiélago", en: "Archipelago", fi: "Saaristo" },
  { key: "food", icon: "✦", es: "Gastronomía", en: "Food", fi: "Ruoka" },
  { key: "romantic", icon: "♡", es: "Romántico", en: "Romantic", fi: "Romantiikka" }
];