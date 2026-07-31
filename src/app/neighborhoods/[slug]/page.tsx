import { neighborhoods, getNeighborhoodBySlug } from "@/lib/neighborhoods";
import NeighborhoodPageLayout from "@/components/neighborhoods/NeighborhoodPageLayout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return neighborhoods.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) return {};
  const canonical = `/neighborhoods/${neighborhood.slug}`;
  return {
    title: neighborhood.seo.title,
    description: neighborhood.seo.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: neighborhood.seo.title,
      description: neighborhood.seo.description,
    },
  };
}

export default function NeighborhoodPage({
  params,
}: {
  params: { slug: string };
}) {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) notFound();
  return <NeighborhoodPageLayout neighborhood={neighborhood} />;
}
