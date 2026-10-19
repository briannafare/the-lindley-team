import { findMd } from "@/lib/llms";

// Served at /services/<slug>.md, /neighborhoods/<slug>.md, /calculators/<slug>.md via rewrites in next.config.mjs.
export async function GET(
  _req: Request,
  { params }: { params: { kind: string; slug: string } }
) {
  const { kind, slug } = params;
  const md = findMd(kind, slug);
  if (!md) return new Response("Not found", { status: 404 });
  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
