import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AiSearchArticle from "@/components/article/AiSearchArticle";
import { getAiPage, getAiPages } from "@/lib/ai-search-pages";

export function generateStaticParams() {
  return getAiPages()
    .filter((p) => p.kind === "compare")
    .map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getAiPage("compare", params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: { type: "article", url: p.path, title: p.title, description: p.description, modifiedTime: p.updated },
  };
}

export default function ComparePage({ params }: { params: { slug: string } }) {
  const p = getAiPage("compare", params.slug);
  if (!p) notFound();
  return <AiSearchArticle page={p} />;
}
