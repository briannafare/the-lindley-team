import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId, studioUrl } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'

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
