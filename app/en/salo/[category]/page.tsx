import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SaloDirectory from "@/components/SaloDirectory";
import { saloAreas, saloCategories } from "@/lib/salo-directory";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = saloCategories.find((entry) => entry.slug === slug);
  const area = saloAreas.find((entry) => entry.slug === slug);
  const title = category ? category.title.en : area ? area.name.en : "Salo";
  const description = category ? category.description.en : area ? area.description.en : "";
  const canonical = `/en/salo/${slug}`;
  return {
    title: `${title} | Finnexprience`,
    description,
    alternates: {
      canonical,
      languages: {
        es: `/salo/${slug}`,
        fi: `/fi/salo/${slug}`,
        en: `/en/salo/${slug}`,
      },
    },
    openGraph: { title: `${title} | Finnexprience`, description, type: "website", url: canonical },
  };
}

export function generateStaticParams() {
  return [...saloCategories, ...saloAreas].map(({ slug }) => ({ category: slug }));
}

export default async function EnglishSaloCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categoryExists = saloCategories.some((entry) => entry.slug === slug);
  const areaExists = saloAreas.some((entry) => entry.slug === slug);
  if (!categoryExists && !areaExists) notFound();

  return <SaloDirectory locale="en" categorySlug={categoryExists ? slug : undefined} areaSlug={areaExists ? slug : undefined} />;
}
