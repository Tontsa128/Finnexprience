import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SaloDirectory from "@/components/SaloDirectory";
import { saloAreas, saloCategories } from "@/lib/salo-directory";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = saloCategories.find((entry) => entry.slug === slug);
  const area = saloAreas.find((entry) => entry.slug === slug);
  const title = category ? category.title.fi : area ? area.name.fi : "Salo";
  const description = category ? category.description.fi : area ? area.description.fi : "";
  const canonical = `/fi/salo/${slug}`;
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

export default async function FinnishSaloCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const categoryExists = saloCategories.some((entry) => entry.slug === slug);
  const areaExists = saloAreas.some((entry) => entry.slug === slug);
  if (!categoryExists && !areaExists) notFound();

  return <SaloDirectory locale="fi" categorySlug={categoryExists ? slug : undefined} areaSlug={areaExists ? slug : undefined} />;
}
