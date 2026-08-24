// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [sitemap()],
  site: 'https://example.com' // Required by sitemap
});
