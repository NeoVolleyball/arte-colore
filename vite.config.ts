import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import QRCode from 'qrcode';
import { pages, seo, type PageId } from './src/content/business';
import { localBusinessJsonLd, site } from './src/data/site';

const entries: Record<PageId, string> = {
  home: 'index.html',
  prodotti: 'prodotti/index.html',
  negozio: 'negozio/index.html',
};

function pageFor(htmlPath: string): PageId {
  const p = htmlPath.replace(/^\//, '');
  return ((Object.keys(entries) as PageId[]).find((id) => entries[id] === p) ?? 'home') as PageId;
}

const escapeAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Injects per-page SEO metadata. The home page (new site) reads everything
 * from src/data/site.ts; the legacy pages keep src/content/business.ts.
 * The home page always gets canonical/OG/Twitter tags, JSON-LD, robots.txt
 * and sitemap.xml, using VITE_SITE_URL or the placeholder `site.url`.
 */
function seoPlugin(siteUrl: string): Plugin {
  const origin = (siteUrl || site.url).replace(/\/$/, '');
  const legacyOrigin = siteUrl.replace(/\/$/, '');
  return {
    name: 'arte-colore-seo',
    transformIndexHtml(html, ctx) {
      const id = pageFor(ctx.path);
      if (id === 'home') {
        const t = escapeAttr(site.seo.title);
        const d = escapeAttr(site.seo.description);
        const img = `${origin}${site.seo.ogImage}`;
        const jsonLd = JSON.stringify(localBusinessJsonLd()).replace(/</g, '\\u003c');
        const head = [
          `<link rel="canonical" href="${origin}/" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:locale" content="it_IT" />`,
          `<meta property="og:site_name" content="${escapeAttr(site.brand)}" />`,
          `<meta property="og:title" content="${t}" />`,
          `<meta property="og:description" content="${d}" />`,
          `<meta property="og:url" content="${origin}/" />`,
          `<meta property="og:image" content="${img}" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:image:alt" content="Logo Arte Colore e il titolo: Dai nuova vita ai tuoi spazi" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:title" content="${t}" />`,
          `<meta name="twitter:description" content="${d}" />`,
          `<meta name="twitter:image" content="${img}" />`,
          `<script type="application/ld+json">${jsonLd}</script>`,
        ].join('\n    ');
        // Preload the two Latin variable fonts so text never reflows on swap (CLS).
        const fonts = Object.keys(ctx.bundle ?? {})
          .filter((f) => /(fraunces|dm-sans)-latin-wght-normal-.*\.woff2$/.test(f))
          .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`);
        return html
          .replace('<!--font-preload-->', fonts.join('\n    '))
          .replaceAll('%SITE_TITLE%', t)
          .replaceAll('%SITE_DESCRIPTION%', d)
          .replaceAll('%SITE_THEME%', site.seo.themeColor)
          .replace('<!--seo-head-->', head);
      }
      const page = pages[id];
      const head = legacyOrigin
        ? [
            `<link rel="canonical" href="${legacyOrigin}${page.path}" />`,
            `<meta property="og:url" content="${legacyOrigin}${page.path}" />`,
            `<meta property="og:image" content="${legacyOrigin}${seo.ogImage}" />`,
            `<meta property="og:image:width" content="1200" />`,
            `<meta property="og:image:height" content="630" />`,
            `<meta name="twitter:card" content="summary_large_image" />`,
          ].join('\n    ')
        : '';
      return html
        .replaceAll('%SEO_TITLE%', page.title)
        .replaceAll('%SEO_DESCRIPTION%', page.description)
        .replace('<!--seo-head-->', head)
        .replace('<!--page-head-->', '');
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
      });
      // Only the new single page; the legacy pages are not advertised.
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc></url>\n</urlset>\n`,
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
