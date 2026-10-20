import type { Metadata } from "next";
import AiSearchArticle from "@/components/article/AiSearchArticle";
import { getAiPage } from "@/lib/ai-search-pages";

// The page copy lives in content/ai-search/divorce-lending-rewrite.md and is used word for word.
// The earlier template version of this page is in git history (ServicePageLayout + services.ts).
const page = getAiPage("service", "divorce-lending")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/services/divorce-lending" },
  openGraph: { type: "article", url: "/services/divorce-lending", title: page.title, description: page.description, modifiedTime: page.updated },
};

export default function ServicePage() {
  return <AiSearchArticle page={page} />;
}
