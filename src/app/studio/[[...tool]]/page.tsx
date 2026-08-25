'use client'

/**
 * Must be a Client Component. `sanity.config.ts` pulls in the `sanity`
 * package, which calls `React.createContext` at module scope. In the React
 * Server Components layer `react` resolves under the `react-server`
 * condition, where `createContext` does not exist — so importing the config
 * from a Server Component fails the build while collecting page data with
 * "(0 , r.createContext) is not a function".
 *
 * Route config (`dynamic`) and `metadata` therefore live in `layout.tsx`,
 * since a Client Component cannot export either.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
