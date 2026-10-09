import type { Locale } from "@/lib/content";

export type SaloListing = {
  slug: string;
  category: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  location: Record<Locale, string>;
  address?: string;
  image: string;
  officialUrl: string;
  linkLabel: Record<Locale, string>;
};

export const saloListings: SaloListing[] = [
  {
    slug: "hotel-mathildedal", category: "majoitus",
    title: { fi: "Hotel Mathildedal", es: "Hotel Mathildedal", en: "Hotel Mathildedal" },
    description: {
      fi: "Tunnelmallinen hotelli historiallisessa ruukkikylässä. Tutustu huoneisiin ja tarkista varausvaihtoehdot hotellin omilta sivuilta.",
      es: "Hotel con encanto en un antiguo pueblo industrial. Consulta las habitaciones y las opciones de reserva en la web oficial.",
      en: "A characterful hotel in a historic ironworks village. Explore rooms and check booking options on the official website."
    },
    location: { fi: "Mathildedal, Salo", es: "Mathildedal, Salo", en: "Mathildedal, Salo" },
    address: "Ruukinrannantie 6, 25660 Mathildedal",
    image: "/images/hero-summer.svg", officialUrl: "https://mathildedal.fi/en/hotel-hotelpackages/",
    linkLabel: { fi: "Hotellin sivut ja varaus", es: "Web del hotel y reservas", en: "Hotel website & booking" }
  },
  {
    slug: "mathildan-marina", category: "majoitus",
    title: { fi: "Mathildan Marina", es: "Mathildan Marina", en: "Mathildan Marina" },
    description: {
      fi: "Mathildedalin rannalla toimiva kohde, josta löytyy ravintola-, majoitus- ja tapahtumapalveluja. Tarkista ajantasaiset vaihtoehdot suoraan palveluntarjoajalta.",
      es: "Un destino junto al agua en Mathildedal con servicios de restauración, alojamiento y eventos. Consulta las opciones actuales directamente con el proveedor.",
      en: "A waterfront destination in Mathildedal offering dining, accommodation and event services. Check current options directly with the provider."
    },
    location: { fi: "Mathildedal, Salo", es: "Mathildedal, Salo", en: "Mathildedal, Salo" },
    address: "Ruukinrannantie 4, 25660 Mathildedal",
    image: "/images/hero-archipelago.svg", officialUrl: "https://mathildanmarina.fi/",
    linkLabel: { fi: "Palveluntarjoajan sivut", es: "Web del proveedor", en: "Provider website" }
  },
  {
    slug: "paikallinen-ruoka", category: "ruoka",
    title: { fi: "Paikallinen ruoka ja ravintolat", es: "Gastronomía local y restaurantes", en: "Local food & restaurants" },
    description: {
      fi: "Tutustu Salon seudun ravintoloihin, kahviloihin, lähiruokaan ja paikallisiin makuihin VisitSalon matkailutiedoissa.",
      es: "Descubre restaurantes, cafeterías, productos locales y sabores de la región de Salo en la guía turística oficial.",
      en: "Discover restaurants, cafés, local produce and regional flavours through the official VisitSalo tourism guide."
    },
    location: { fi: "Salon seutu", es: "Región de Salo", en: "Salo region" },
    image: "/images/hero-summer.svg", officialUrl: "https://visitsalo.fi/en/services/",
    linkLabel: { fi: "Tutustu ruokapalveluihin", es: "Ver opciones gastronómicas", en: "Explore food services" }
  },
  {
    slug: "teijon-kansallispuisto", category: "tekemista",
    title: { fi: "Teijon kansallispuisto", es: "Parque nacional de Teijo", en: "Teijo National Park" },
    description: {
      fi: "Järviä, metsiä ja retkeilyreittejä. Tutustu kohteen luontoon, aktiviteetteihin ja luonnonsuojelualueen ohjeisiin ennen vierailua.",
      es: "Lagos, bosques y rutas de senderismo. Consulta la naturaleza, las actividades y las normas del espacio protegido antes de la visita.",
      en: "Lakes, forests and hiking trails. Read about the nature, activities and conservation-area guidance before visiting."
    },
    location: { fi: "Teijo, Salo", es: "Teijo, Salo", en: "Teijo, Salo" },
    address: "Matildanjärventie 84, 25660 Salo",
    image: "/images/hero-sauna.svg", officialUrl: "https://www.visitfinland.com/en/product/4a07b463-4aed-4a37-b8f1-e8aaa494e1c4/teijo-national-park/",
    linkLabel: { fi: "Kohteen viralliset tiedot", es: "Información oficial", en: "Official destination information" }
  },
  {
    slug: "kulttuuri-ja-nahtavyydet", category: "tekemista",
    title: { fi: "Kulttuuri ja nähtävyydet", es: "Cultura y lugares de interés", en: "Culture & attractions" },
    description: {
      fi: "Museoita, taidetta, historiaa ja paikallisia kulttuurikohteita Salossa ja ympäröivissä kylissä.",
      es: "Museos, arte, historia y lugares culturales en Salo y los pueblos de los alrededores.",
      en: "Museums, art, history and cultural places in Salo and the surrounding villages."
    },
    location: { fi: "Salo ja lähikylät", es: "Salo y pueblos cercanos", en: "Salo and nearby villages" },
    image: "/images/hero-summer.svg", officialUrl: "https://visitsalo.fi/en/culture-and-attractions/",
    linkLabel: { fi: "Kulttuurikohteet", es: "Lugares culturales", en: "Cultural attractions" }
  },
  {
    slug: "kylat-ja-maaseutu", category: "kylat",
    title: { fi: "Salon kylät ja maaseutu", es: "Pueblos y campo de Salo", en: "Salo villages & countryside" },
    description: {
      fi: "Löydä ruukkikyliä, kartanoita, maaseutukohteita ja paikallisia reittejä Salon eri alueilla.",
      es: "Descubre pueblos históricos, mansiones, destinos rurales y rutas locales por la región de Salo.",
      en: "Discover historic villages, manor houses, countryside destinations and local routes around Salo."
    },
    location: { fi: "Salon seutu", es: "Región de Salo", en: "Salo region" },
    image: "/images/hero-summer.svg", officialUrl: "https://visitsalo.fi/en/",
    linkLabel: { fi: "Tutustu Salon alueisiin", es: "Explorar la región de Salo", en: "Explore the Salo region" }
  },
  {
    slug: "saaristoreitit", category: "saaristo",
    title: { fi: "Rannikko- ja saaristoreitit", es: "Rutas costeras y del archipiélago", en: "Coastal & archipelago routes" },
    description: {
      fi: "Tutustu reitteihin, joilla Salon rannikkoa ja saaristoa voi kokea kävellen, pyörällä, autolla tai vesiltä käsin.",
      es: "Descubre rutas para explorar la costa y el archipiélago de Salo a pie, en bicicleta, en coche o desde el agua.",
      en: "Explore routes for experiencing Salo's coast and archipelago on foot, by bike, by car or from the water."
    },
    location: { fi: "Salo ja rannikko", es: "Salo y la costa", en: "Salo and the coast" },
    image: "/images/hero-archipelago.svg", officialUrl: "https://visitsalo.fi/en/routes/",
    linkLabel: { fi: "Reitit ja retkiohjeet", es: "Rutas e información", en: "Routes & trip information" }
  },
  {
    slug: "tapahtumat", category: "tapahtumat",
    title: { fi: "Tapahtumat ja sesongit Salossa", es: "Eventos y temporadas en Salo", en: "Events & seasons in Salo" },
    description: {
      fi: "Tarkista Salon tapahtumakalenterista ajankohtaiset tapahtumat, kesän iltatorit, syksyn kurpitsajuhlat ja muut sesongit.",
      es: "Consulta la información turística oficial para conocer eventos actuales, mercados de verano, celebraciones otoñales y otras temporadas.",
      en: "Check official tourism information for current events, summer evening markets, autumn pumpkin celebrations and other seasonal highlights."
    },
    location: { fi: "Salo ja lähialueet", es: "Salo y alrededores", en: "Salo and surrounding areas" },
    image: "/images/hero-summer.svg", officialUrl: "https://visitsalo.fi/en/",
    linkLabel: { fi: "VisitSalo – tapahtumat ja ajankohtaista", es: "VisitSalo – eventos e información", en: "VisitSalo – events & updates" }
  }
];

export const listingsForCategory = (category: string) => saloListings.filter((listing) => listing.category === category);
