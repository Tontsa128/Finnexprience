import { notFound } from "next/navigation";
import CmsPage from "@/components/CmsPage";
import { getCmsPageMetadata } from "@/lib/cms-page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getCmsPageMetadata(slug, "es");
}

export default async function SpanishCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (["admin", "api", "fi", "en"].includes(slug)) notFound();
  return <CmsPage locale="es" slug={slug} />;
}
