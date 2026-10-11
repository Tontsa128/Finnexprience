import type { Metadata } from "next";
import CmsPage from "@/components/CmsPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | Finnexprience`, description: "Tutustu Suomeen Finnexpriencen avulla." };
}

export default async function FinnishCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPage locale="fi" slug={slug} />;
}
