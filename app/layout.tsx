import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Finnexprience — Vive la Finlandia auténtica",
  description: "Descubre la Finlandia auténtica: cabañas, sauna, naturaleza, archipiélago y experiencias locales.",
  metadataBase: new URL("https://finnexprience.vercel.app")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body className={`${manrope.variable} ${playfair.variable}`}>{children}</body></html>;
}