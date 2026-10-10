import { notFound } from "next/navigation";
import SaloDirectory from "@/components/SaloDirectory";
import { saloAreas, saloCategories } from "@/lib/salo-directory";

export function generateStaticParams() {
  return [...saloCategories, ...saloAreas].map(({ slug }) => ({ category: slug }));
}

export default async function SaloCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categoryExists = saloCategories.some((entry) => entry.slug === slug);
  const areaExists = saloAreas.some((entry) => entry.slug === slug);
  if (!categoryExists && !areaExists) notFound();

  return <SaloDirectory locale="es" categorySlug={categoryExists ? slug : undefined} areaSlug={areaExists ? slug : undefined} />;
}
