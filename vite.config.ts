import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { pages, seo, type PageId } from './src/content/business';
import { colours } from './src/data/palette';

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

/**
 * Inlines the first-visit intro (src/intro) so it paints before the bundle
 * loads and hydration starts; it lives outside #root, so React never sees it.
 */
function introPlugin(): Plugin {
  const read = (f: string) => readFileSync(resolve(__dirname, 'src/intro', f), 'utf8').trim();
  // fan of the intro: cool colours on the left, warm on the right (offset from the centre card)
  const fan: [string, number][] = [
    ['verde-bottiglia', -5], ['blu-laguna', -4], ['azzurro-burano', -3], ['verde-lichene', -2], ['salvia', -1],
    ['ocra-veneziana', 1], ['giallo-zafferano', 2], ['rosa-intonaco', 3], ['mattone', 4], ['rosso-veneziano', 5],
  ];
  const card = (name: string, hex: string, d: number, extra = '') =>
    `<div class="aci-card${extra}" style="--c:${hex};--d:${d}"><div class="aci-label"><b>${name}</b><i>${hex}</i></div></div>`;
  const cards = () => {
    const by = new Map(colours.map((c) => [c.id, c]));
    // outer cards go underneath, so the fan overlaps symmetrically
    const sorted = [...fan].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || a[1] - b[1]);
    const items = sorted.map(([id, d]) => {
      const c = by.get(id);
      if (!c) throw new Error(`intro: unknown colour "${id}"`);
      return card(c.name, c.hex, d);
    });
    // on top of the closed deck: the hero card's colour and label, it grows into the hero
    return items.join('') + card('Terracotta', '#8E4A31', 0, ' aci-hero');
  };
  return {
    name: 'arte-colore-intro',
    transformIndexHtml(html) {
      return html
        .replace('<!--intro-head-->', `<style>${read('intro.css')}</style>\n    <script>${read('intro-gate.js')}</script>`)
        .replace(
          '<!--intro-body-->',
          `${read('intro.html').replace('<!--intro-cards-->', cards())}\n    <script>${read('intro-player.js')}</script>`,
        );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // "/" by default; "/arte-colore/" for GitHub Pages project sites (set in CI)
  const base = env.VITE_BASE || '/';
  return {
    base,
    plugins: [react(), seoPlugin(env.VITE_SITE_URL ?? '', base), introPlugin()],
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
