import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { seo } from './src/content/business';

/**
 * Injects SEO metadata from src/content/business.ts. Canonical URL, og:url,
 * og:image, robots.txt and sitemap.xml are only produced when the real
 * production origin is known (VITE_SITE_URL).
 */
function seoPlugin(siteUrl: string): Plugin {
  const origin = siteUrl.replace(/\/$/, '');
  return {
    name: 'arte-colore-seo',
    transformIndexHtml(html) {
      const head = origin
        ? [
            `<link rel="canonical" href="${origin}/" />`,
            `<meta property="og:url" content="${origin}/" />`,
            `<meta property="og:image" content="${origin}${seo.ogImage}" />`,
            `<meta property="og:image:width" content="1200" />`,
            `<meta property="og:image:height" content="630" />`,
            `<meta name="twitter:card" content="summary_large_image" />`,
          ].join('\n    ')
        : '';
      return html
        .replaceAll('%SEO_TITLE%', seo.title)
        .replaceAll('%SEO_DESCRIPTION%', seo.description)
        .replace('<!--seo-head-->', head);
    },
    generateBundle() {
      if (!origin) return;
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc></url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), seoPlugin(env.VITE_SITE_URL ?? '')],
    build: {
      target: 'es2020',
      assetsInlineLimit: 2048,
      // three.js lives in the lazily imported hero chunk, loaded only on desktop
      chunkSizeWarningLimit: 650,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      css: { modules: { classNameStrategy: 'non-scoped' } },
    },
  };
});
