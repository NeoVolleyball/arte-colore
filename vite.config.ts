import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import QRCode from 'qrcode';
import { pages, seo, type PageId } from './src/content/business';
import { site } from './src/data/site';

const entries: Record<PageId, string> = {
  home: 'index.html',
  prodotti: 'prodotti/index.html',
  negozio: 'negozio/index.html',
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
function seoPlugin(siteUrl: string): Plugin {
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
      const pageHead = '';
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

/** `virtual:site-qr`: QR code for the site URL, rendered at build time (no runtime library). */
function qrPlugin(url: string): Plugin {
  const id = 'virtual:site-qr';
  return {
    name: 'arte-colore-qr',
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    async load(source) {
      if (source !== `\0${id}`) return;
      const svg = await QRCode.toString(url, {
        type: 'svg',
        margin: 0,
        errorCorrectionLevel: 'M',
        color: { dark: '#1f1a17', light: '#ffffff' },
      });
      const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      return `export const qrSvgDataUri = ${JSON.stringify(uri)};\nexport const qrUrl = ${JSON.stringify(url)};`;
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [
      tailwindcss(),
      react(),
      seoPlugin(env.VITE_SITE_URL ?? ''),
      qrPlugin((env.VITE_SITE_URL || site.url).replace(/\/$/, '') + '/'),
    ],
    resolve: { alias: { '@': resolve(__dirname, 'src') } },
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
