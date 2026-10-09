import { notFound } from "next/navigation";
import SaloDirectory from "@/components/SaloDirectory";
import { saloCategories } from "@/lib/salo-directory";
export function generateStaticParams() { return saloCategories.map(({ slug }) => ({ category: slug })); }
export default async function FinnishSaloCategoryPage({ params }: { params: Promise<{ category: string }> }) {
 const { category } = await params; if (!saloCategories.some((entry) => entry.slug === category)) notFound();
 return <SaloDirectory locale="fi" categorySlug={category} />;
}
