import CmsPage from "@/components/CmsPage";
import { getCmsPageMetadata } from "@/lib/cms-page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getCmsPageMetadata(slug, "en");
}

export default async function EnglishCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPage locale="en" slug={slug} />;
}
