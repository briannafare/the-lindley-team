# Sanity blog — setup runbook

Everything in this PR is code-complete and builds. What remains is account setup
that requires a Sanity login, which has to be done by a human once.

**Verified locally:** `tsc --noEmit` clean, `next build` reaches *Compiled
successfully* → lint pass → type pass, then stops at
`Dataset "production" not found for project ID "zzzzzzzz"` — the placeholder
env. Everything upstream of a real Sanity project is green.

---

## What changed

**New:**

```
sanity.config.ts / sanity.cli.ts        Studio + CLI config
src/sanity/env.ts                       Env assertions
src/sanity/lib/{client,fetch,image,queries,types}.ts
src/sanity/schemas/                     post, author, category + 5 objects
src/sanity/structure.ts                 Sidebar; "Needs writing" first
src/app/studio/[[...tool]]/             Studio at /studio (noindex)
src/app/api/revalidate/                 Publish webhook → tag invalidation
src/app/api/draft-mode/{enable,disable} Secret-guarded preview
src/app/feed.xml/                       RSS
src/components/blog/PortableBody.tsx    Portable Text → existing Tailwind tokens
src/components/blog/FaqSection.tsx      FAQ accordion
scripts/sanity-seed.ndjson              30 docs: 23 posts, 2 authors, 5 categories
```

**Modified:**

- `src/app/blog/page.tsx` — +28/−9. Data source only; all markup, `Nav`,
  `Footer`, and `CategoryFilter` untouched.
- `src/app/blog/[slug]/page.tsx` — `marked` + `dangerouslySetInnerHTML`
  replaced with `<PortableBody>`. Adds hero image, FAQ section, author box,
  `FAQPage` schema, richer `Article` schema, OG/Twitter images.
- `src/app/sitemap.ts` — now async, reads slugs from Sanity. Output is
  unchanged in shape.
- `src/lib/blog-posts.ts` — **not deleted**, marked deprecated. It is the only
  record of the WordPress→Next slug mapping behind the 301s hardcoded in
  `next.config.mjs`. Nothing imports it any more.

The GROQ projections deliberately return `date` and `category` (slug string) so
they match the old `BlogPost` interface. That is why the page diffs are small.

---

## Remaining setup — about 20 minutes, needs a Sanity login

### 1. Create the project

```bash
npx sanity@latest login
npx sanity@latest projects create "The Lindley Team"
```

Note the **project ID**.

### 2. Env vars

Create `.env.local` from `.env.example`, then add the same values to Vercel on
the `lindley-preview` project (Production **and** Preview):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | from step 1 |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-02-19` |
| `SANITY_API_READ_TOKEN` | sanity.io/manage → API → Tokens → **Viewer** |
| `SANITY_PREVIEW_SECRET` | `openssl rand -hex 32` |
| `SANITY_REVALIDATE_SECRET` | `openssl rand -hex 32` |
| `SANITY_STUDIO_PREVIEW_ORIGIN` | `https://thelindleyteam.com` |

### 3. Deploy schema, import content

```bash
npx sanity@latest schema deploy
npx sanity@latest dataset import scripts/sanity-seed.ndjson production
```

All 23 posts land with their real titles, excerpts, categories, dates, and
`oldSlug`. **Slugs are byte-identical to the current live URLs — verified 1:1.
No redirects change, no rankings move.** The 2 posts with real bodies come
across as structured Portable Text (32 and 24 blocks). The other 21 are flagged
`needsFullDraft` and appear under **Needs writing** in the Studio.

### 4. CORS

sanity.io/manage → API → CORS origins, **credentials allowed**:

- `https://thelindleyteam.com`
- `http://localhost:3000`

### 5. Publish webhook

sanity.io/manage → API → Webhooks → Create:

| Field | Value |
|---|---|
| URL | `https://thelindleyteam.com/api/revalidate` |
| Dataset | `production` |
| Trigger | Create, Update, Delete |
| Filter | `_type == "post" \|\| _type == "author" \|\| _type == "category"` |
| Projection | `{_type, "slug": slug.current}` |
| Method | POST |
| Secret | `SANITY_REVALIDATE_SECRET` |

This is what makes publish → live ~2 seconds instead of a rebuild.

### 6. Invite the editor

sanity.io/manage → Members → Invite → role **Editor**. Editor can write and
publish but cannot touch schema, datasets, or billing. Send them
`docs/BLOG-PARTNER-SOP.md`.

---

## Verify after setup

- [ ] `/studio` loads, shows 23 articles, **Needs writing** shows 21
- [ ] All 23 `/blog/<slug>` return 200 (slugs unchanged)
- [ ] `curl -s https://thelindleyteam.com/sitemap.xml | grep -c "/blog/"` → 23
- [ ] Edit + publish → live in <5s, webhook logs 200 in Sanity
- [ ] `/feed.xml` valid RSS
- [ ] Rich Results Test passes on `stop-paying-pmi` (Article + Breadcrumb)
- [ ] Add FAQs to one post → FAQPage validates

---

## Findings from the audit

**Corrected:** an earlier note claimed blog posts were missing from the
sitemap. That was wrong — `src/app/sitemap.ts` already included all 23, and the
live sitemap confirms it. No bug there.

Real issues, ranked:

1. **21 of 23 posts are empty.** Every one renders "Full article coming soon."
   The whole blog is ~1,255 words. Only `spousal-identity-theft-divorce` (569
   words) and `financial-fallout-divorce-credit` (251) have bodies. Nothing else
   can rank. The CMS makes this fixable; it does not fix it.

2. **`main` is 6 weeks stale and does not match production.** Production runs
   `design/neighborhood-page` — `main`'s `tailwind.config.ts` has no `paper`,
   `shell`, or `serif` tokens, so a merge to `main` today would ship a broken
   design. **This PR targets `design/neighborhood-page` for that reason.**
   Worth resolving separately: get the design branch merged so `main` is
   trustworthy again.

3. **Two duplicate-content pairs.** `20-percent-down-payment` /
   `-2` have *identical* titles; `government-home-loans-guide` / `-2` are
   near-identical. They cannibalize each other. Merge each pair and 301 the
   `-2`.

4. **Two posts reference images that do not exist.**
   `/images/blog/spousal-identity-theft.png` and one other point at
   `public/images/blog/`, which is not in the repo — those are 404s. Now moot:
   hero images move to Sanity's CDN with required alt text.

5. **Nothing published since March 2024.** For YMYL finance content, visible
   staleness costs trust and rankings. The `updatedAt` / "Last reviewed" field
   exists to fix this as posts get refreshed.
