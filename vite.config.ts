import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { pages, seo, type PageId } from './src/content/business';

const entries: Record<PageId, string> = {
  home: 'index.html',
};

function pageFor(htmlPath: string): PageId {
  const p = htmlPath.replace(/^\//, '');
  return ((Object.keys(entries) as PageId[]).find((id) => entries[id] === p) ?? 'home') as PageId;
}

/**
 * Injects per-page SEO metadata from src/content/business.ts. Canonical
 * URLs, og:url, og:image, robots.txt and sitemap.xml are only produced when
 * the real production origin is known (VITE_SITE_URL).
 */
function seoPlugin(siteUrl: string, base: string): Plugin {
  const origin = siteUrl.replace(/\/$/, '');
  return {
    name: 'arte-colore-seo',
    transformIndexHtml(html, ctx) {
      const id = pageFor(ctx.path);
      const page = pages[id];
      const head = origin
        ? [
            `<link rel="canonical" href="${origin}${page.path}" />`,
            `<meta property="og:url" content="${origin}${page.path}" />`,
            `<meta property="og:image" content="${origin}${seo.ogImage}" />`,
            `<meta property="og:image:width" content="1200" />`,
            `<meta property="og:image:height" content="630" />`,
            `<meta name="twitter:card" content="summary_large_image" />`,
          ].join('\n    ')
        : '';
      const pageHead =
        id === 'home'
          ? // same srcset/sizes as the <img> in HeroVisual.tsx, so the browser preloads the candidate it will use
            `<link rel="preload" as="image" href="${base}images/hero-still-1200.webp" imagesrcset="${base}images/hero-still-720.webp 720w, ${base}images/hero-still-1200.webp 1200w" imagesizes="(min-width: 960px) 44vw, 90vw" media="(max-width: 959px)" fetchpriority="high" />`
          : '';
      return html
        .replaceAll('%SEO_TITLE%', page.title)
        .replaceAll('%SEO_DESCRIPTION%', page.description)
        .replace('<!--seo-head-->', head)
        .replace('<!--page-head-->', pageHead);
    },
    generateBundle() {
      if (!origin) return;
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
      });
      const urls = Object.values(pages)
        .map((p) => `  <url><loc>${origin}${p.path}</loc></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // "/" by default; "/arte-colore/" for GitHub Pages project sites (set in CI)
  const base = env.VITE_BASE || '/';
  return {
    base,
    plugins: [react(), seoPlugin(env.VITE_SITE_URL ?? '', base)],
    build: {
      target: 'es2020',
      assetsInlineLimit: 2048,
      // three.js lives in the lazily imported hero chunk, loaded only on desktop
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        input: Object.fromEntries(
          (Object.keys(entries) as PageId[]).map((id) => [id, resolve(__dirname, entries[id])]),
        ),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      css: { modules: { classNameStrategy: 'non-scoped' } },
    },
  };
});
