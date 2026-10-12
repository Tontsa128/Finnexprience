import CmsPage from "@/components/CmsPage";
import { getCmsPageMetadata } from "@/lib/cms-page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getCmsPageMetadata(slug, "fi");
}

export default async function FinnishCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPage locale="fi" slug={slug} />;
}
