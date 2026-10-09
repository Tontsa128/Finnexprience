import type { Locale } from "@/lib/content";

export type SaloCategory = {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  image: string;
  icon: string;
};

export const saloCategories: SaloCategory[] = [
  { slug: "majoitus", icon: "⌂", image: "/images/hero-summer.svg", title: { fi: "Majoitus", es: "Alojamiento", en: "Accommodation" }, description: { fi: "Hotellit, mökit, huvilat ja persoonalliset majoituskohteet.", es: "Hoteles, cabañas, villas y alojamientos con personalidad.", en: "Hotels, cottages, villas and distinctive places to stay." } },
  { slug: "ruoka", icon: "✦", image: "/images/hero-summer.svg", title: { fi: "Ruoka ja ravintolat", es: "Comida y restaurantes", en: "Food & restaurants" }, description: { fi: "Ravintolat, kahvilat, paikalliset maut ja lähiruoka.", es: "Restaurantes, cafés, sabores locales y productos de proximidad.", en: "Restaurants, cafés, local flavours and seasonal food." } },
  { slug: "tekemista", icon: "⌁", image: "/images/hero-archipelago.svg", title: { fi: "Tekemistä ja aktiviteetteja", es: "Actividades", en: "Things to do" }, description: { fi: "Luontoa, retkiä, kulttuuria ja tekemistä eri vuodenaikoina.", es: "Naturaleza, excursiones, cultura y actividades durante todo el año.", en: "Nature, excursions, culture and activities throughout the year." } },
  { slug: "kylat", icon: "⌖", image: "/images/hero-summer.svg", title: { fi: "Kylät ja maaseutu", es: "Pueblos y campo", en: "Villages & countryside" }, description: { fi: "Tutustu Salon kyliin, paikalliseen elämään ja rauhallisiin lomapaikkoihin.", es: "Descubre los pueblos de Salo, la vida local y lugares tranquilos.", en: "Discover Salo's villages, local life and peaceful places." } },
  { slug: "saaristo", icon: "◒", image: "/images/hero-archipelago.svg", title: { fi: "Saaristo ja retket", es: "Archipiélago y excursiones", en: "Archipelago & excursions" }, description: { fi: "Rannikkoa, saaristokohteita ja retki-ideoita lähialueille.", es: "Costa, destinos insulares e ideas para excursiones cercanas.", en: "Coastline, island destinations and nearby day-trip ideas." } },
  { slug: "tapahtumat", icon: "✧", image: "/images/hero-sauna.svg", title: { fi: "Tapahtumat ja vuodenajat", es: "Eventos y estaciones", en: "Events & seasons" }, description: { fi: "Kesä, juhannus, markkinat, iltatorit ja paikalliset tapahtumat.", es: "Verano, celebraciones, mercados y eventos locales.", en: "Summer, seasonal celebrations, markets and local events." } },
];

export const saloAreas = [
  { slug: "salo-keskusta", name: { fi: "Salon keskusta", es: "Centro de Salo", en: "Salo centre" }, description: { fi: "Palvelut, ostokset, kahvilat ja kaupungin tapahtumat.", es: "Servicios, tiendas, cafés y eventos de la ciudad.", en: "Services, shops, cafés and city events." }, image: "/images/hero-summer.svg" },
  { slug: "pernio", name: { fi: "Perniö", es: "Perniö", en: "Perniö" }, description: { fi: "Maaseudun rauhaa, paikallista historiaa ja retkikohteita.", es: "Tranquilidad rural, historia local y lugares para explorar.", en: "Rural calm, local history and places to explore." }, image: "/images/hero-summer.svg" },
  { slug: "mathildedal", name: { fi: "Mathildedal", es: "Mathildedal", en: "Mathildedal" }, description: { fi: "Ruukkikylän tunnelmaa, käsityötä ja merellistä lähiluontoa.", es: "Ambiente de pueblo histórico, artesanía y naturaleza costera.", en: "Historic village atmosphere, crafts and coastal nature." }, image: "/images/hero-archipelago.svg" },
  { slug: "teijo", name: { fi: "Teijo ja kansallispuisto", es: "Teijo y su parque nacional", en: "Teijo and its national park" }, description: { fi: "Metsiä, järviä, retkeilyreittejä ja luonnonrauhaa.", es: "Bosques, lagos, rutas y tranquilidad natural.", en: "Forests, lakes, hiking trails and natural quiet." }, image: "/images/hero-sauna.svg" },
];

export const saloCopy = {
  fi: { eyebrow: "VARSINAIS-SUOMI · SUOMI", title: "Salon seudun matkailu", intro: "Löydä majoitus, paikalliset maut, luontoelämykset ja pienet kylät. Finnexprience kokoaa vaihtoehdot yhteen ja ohjaa varaamaan suoraan palveluntarjoajalta.", browse: "Tutustu kategorioihin", areas: "Tutustu Salon seutuun", all: "Kaikki kategoriat", details: "Tutustu kohteeseen", external: "Palveluntarjoajan sivut", back: "Takaisin Salon seudulle", map: "Avaa kartalla", notice: "Tarkista ajantasaiset hinnat, saatavuus ja ehdot suoraan palveluntarjoajalta. Finnexprience esittelee vaihtoehtoja eikä myy matkapaketteja.", providerPending: "Palveluntarjoajien tiedot, oikeat kohdekuvat ja viralliset varauslinkit lisätään, kun ne on tarkistettu." },
  es: { eyebrow: "VARSINAIS-SUOMI · FINLANDIA", title: "Turismo en la región de Salo", intro: "Descubre alojamientos, sabores locales, naturaleza y pequeños pueblos. Finnexprience reúne opciones y te dirige al proveedor para consultar y reservar directamente.", browse: "Explorar categorías", areas: "Descubrir la región de Salo", all: "Todas las categorías", details: "Descubrir lugar", external: "Web del proveedor", back: "Volver a la región de Salo", map: "Ver en el mapa", notice: "Consulta precios, disponibilidad y condiciones actualizados directamente con cada proveedor. Finnexprience presenta opciones y no vende paquetes turísticos.", providerPending: "Los datos de proveedores, las fotos reales y los enlaces oficiales se añadirán después de verificarlos." },
  en: { eyebrow: "SOUTHWEST FINLAND · FINLAND", title: "Explore the Salo region", intro: "Discover places to stay, local food, nature and small villages. Finnexprience brings options together and directs you to providers to enquire and book directly.", browse: "Explore categories", areas: "Discover the Salo region", all: "All categories", details: "Explore place", external: "Provider website", back: "Back to the Salo region", map: "View on map", notice: "Check current prices, availability and terms directly with each provider. Finnexprience showcases options and does not sell travel packages.", providerPending: "Verified provider details, real destination photos and official links will be added after checking them." },
} satisfies Record<Locale, Record<string, string>>;

export function localizedSaloPath(locale: Locale, path: string) {
  return locale === "es" ? path : `/${locale}${path}`;
}
