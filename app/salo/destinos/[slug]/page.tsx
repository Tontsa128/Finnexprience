import type { Metadata } from "next";
import CmsDestinationPage from "@/components/CmsDestinationPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | Finnexprience`, description: "Descubre este destino en la región de Salo, Finlandia." };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsDestinationPage locale="es" slug={slug} />;
}
