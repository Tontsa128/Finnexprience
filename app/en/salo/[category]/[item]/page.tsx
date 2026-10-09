import { notFound } from "next/navigation";
import SaloDirectory from "@/components/SaloDirectory";
import { saloAreas, saloCategories } from "@/lib/salo-directory";
export function generateStaticParams() { return saloCategories.flatMap(({ slug: category }) => saloAreas.map(({ slug: item }) => ({ category, item }))); }
export default async function EnglishSaloItemPage({ params }: { params: Promise<{ category: string; item: string }> }) {
 const { category, item } = await params; if (!saloCategories.some((entry) => entry.slug === category) || !saloAreas.some((entry) => entry.slug === item)) notFound();
 return <SaloDirectory locale="en" categorySlug={category} itemSlug={item} />;
}
