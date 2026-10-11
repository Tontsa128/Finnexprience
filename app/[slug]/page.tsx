import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsPage from "@/components/CmsPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | Finnexprience`, description: "Descubre Finlandia con Finnexprience." };
}

export default async function SpanishCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (["admin", "api", "fi", "en"].includes(slug)) notFound();
  return <CmsPage locale="es" slug={slug} />;
}
