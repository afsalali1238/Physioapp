// @ts-check
import { defineConfig } from 'astro/config';
// @astrojs/vercel v11 merged the /static and /serverless subpaths into the root
// export; `output: 'static'` below is what selects the static build.
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

/**
 * Deliberately written fresh rather than recovered from git.
 *
 * The config at `patient-library`'s HEAD carries `webAnalytics: { enabled: true }`,
 * which is a direct D-007 violation (no analytics, accounts or tracking), and
 * `site: 'https://example.com'`. Neither comes across. See PORT-CHECKLIST
 * "Do not port".
 *
 * `SITE_URL` lets a preview deployment set its own origin without editing this
 * file; the fallback is the production domain patients already have.
 */
const SITE = process.env.SITE_URL ?? 'https://physioapp-nine.vercel.app';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: vercel({
    // D-007. This flag is not coming back — see AGENTS.md non-negotiable #6.
    webAnalytics: { enabled: false },
    imageService: true,
  }),
  integrations: [
    sitemap({
      // The clinician's draft-review route must never be indexed.
      filter: (page) => !page.includes('/preview'),
    }),
  ],
  build: {
    // Patients are sent deep links; trailing-slash consistency keeps a shared
    // URL from 404ing on a different host config.
    format: 'directory',
  },
  compressHTML: true,
});
