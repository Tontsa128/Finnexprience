import type { Metadata } from "next";
import Home from "../page";

export default function FinnishHome() {
  return <Home locale="fi" />;
}


export const metadata: Metadata = {
  title: "Finnexprience | Löydä aito Suomi",
  description: "Löydä mökkejä, saunoja, saaristoa ja paikallisia elämyksiä Salon seudulla ja Suomen lounaisrannikolla.",
  alternates: {
    canonical: "/fi",
    languages: { es: "/", fi: "/fi", en: "/en" },
  },
  openGraph: {
    title: "Finnexprience | Löydä aito Suomi",
    description: "Mökkejä, saunoja, saaristoa ja paikallisia elämyksiä Lounais-Suomessa.",
    url: "/fi",
    siteName: "Finnexprience",
    locale: "fi_FI",
    type: "website",
  },
};
