import { defineCliConfig } from 'sanity/cli'

/**
 * CLI config is loaded outside the Next.js module graph, so it must not rely
 * on the "@/" tsconfig path alias or on src/sanity/env.ts (which throws when
 * env vars are absent). Read process.env directly and fail soft.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
  // Hosted Studio hostname -> https://<studioHost>.sanity.studio
  studioHost: process.env.SANITY_STUDIO_HOST || 'lindleyteam',
  // Pinned: runtime auto-updates would serve Sanity v4 against this v3-authored
  // config. Upgrade deliberately, not silently under the editor.
  autoUpdates: false,
})
