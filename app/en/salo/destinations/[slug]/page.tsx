import type { Metadata } from "next";
import CmsDestinationPage from "@/components/CmsDestinationPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | Finnexprience`, description: "Explore this destination in the Salo region of Finland." };
}

export default async function EnglishDestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsDestinationPage locale="en" slug={slug} />;
}
