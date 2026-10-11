import type { Metadata } from "next";
import CmsPage from "@/components/CmsPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | Finnexprience`, description: "Discover Finland with Finnexprience." };
}

export default async function EnglishCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPage locale="en" slug={slug} />;
}
