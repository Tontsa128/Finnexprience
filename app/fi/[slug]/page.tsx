import type { Metadata } from "next";
import { getCmsPageMetadata } from "@/lib/cms-metadata";
import CmsPage from "@/components/CmsPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return getCmsPageMetadata(slug, "fi");
}

export default async function FinnishCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPage locale="fi" slug={slug} />;
}
