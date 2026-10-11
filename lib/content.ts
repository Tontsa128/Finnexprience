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
    { id: "sauna", image: "https://images.unsplash.com/photo-1758861356142-546a3822ab1a?auto=format&fit=crop&fm=jpg&q=80&w=2200", alt: "Sauna by a lake in Finland at evening", eyebrow: "Sauna & wellbeing" },
    { id: "summer", image: "https://images.unsplash.com/photo-1749069262065-ed7f45b8153c?auto=format&fit=crop&fm=jpg&q=80&w=1800", alt: "Finnish lakeside cottage among trees", eyebrow: "Finnish summer" },
    { id: "archipelago", image: "https://images.unsplash.com/photo-1609114503421-387ba57652b2?auto=format&fit=crop&fm=jpg&q=80&w=2200", alt: "Finnish archipelago and summer sea", eyebrow: "Archipelago life" }
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