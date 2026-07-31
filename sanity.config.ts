import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'

import { schemaTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'

/**
 * This config is consumed by TWO different bundlers:
 *   - Next.js (embedded studio at /studio), which inlines NEXT_PUBLIC_*
 *   - Vite via `sanity build/deploy` (hosted studio), which ONLY inlines
 *     SANITY_STUDIO_* and leaves NEXT_PUBLIC_* undefined.
 * So it cannot import src/sanity/env.ts, whose assertions throw at runtime in
 * the hosted bundle. Resolve from both prefixes with a literal fallback.
 * The project ID and dataset name are public values, not secrets.
 */
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'dqm3yn14'

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production'

const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  '2025-02-19'

const studioUrl = '/studio'

export default defineConfig({
  name: 'lindley',
  title: 'The Lindley Journal',
  basePath: studioUrl,
  projectId,
  dataset,

  schema: { types: schemaTypes },

  plugins: [
    structureTool({ structure }),

    // Click-to-edit live preview of the real site inside the Studio.
    presentationTool({
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000',
        previewMode: { enable: '/api/draft-mode/enable' },
      },
    }),

    // Vision is a GROQ playground - useful for us, noise for the partner.
    ...(process.env.NODE_ENV === 'development'
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
})
