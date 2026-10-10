import type { Metadata } from "next";
import CmsDestinationPage from "@/components/CmsDestinationPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | Finnexprience`, description: "Tutustu Salon seudun matkailukohteeseen." };
}

export default async function FinnishDestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsDestinationPage locale="fi" slug={slug} />;
}
