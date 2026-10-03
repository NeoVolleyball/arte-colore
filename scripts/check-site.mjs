// Browser checks for the built site. Usage:
//   npm run build && npx vite preview --port 4173 &   then   node scripts/check-site.mjs
// Env: SITE (default http://localhost:4173), SHOTS (screenshot dir, optional)
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const SITE = process.env.SITE ?? 'http://localhost:4173';
const SHOTS = process.env.SHOTS;
const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const executablePath = process.env.CHROMIUM ?? undefined;
if (SHOTS) await mkdir(SHOTS, { recursive: true });

async function openPage(browser, viewport, opts = {}, path = '/') {
  const context = await browser.newContext({ viewport, reducedMotion: opts.reducedMotion ?? 'no-preference', ...opts.ctx });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith(SITE)) errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(SITE + path, { waitUntil: 'networkidle' });
  return { page, context, errors };
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
}

const until = (page, fn, arg) =>
  page.waitForFunction(fn, arg, { timeout: 10000 }).then(() => true, () => false);

async function overflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

const gl = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const browser = await chromium.launch({ executablePath, args: gl });

// ------------------------------------------------------------- viewports
for (const path of ['/', '/prodotti/', '/negozio/']) {
  for (const [label0, viewport] of [
    ['mobile-360', { width: 360, height: 740 }],
    ['mobile-390', { width: 390, height: 844 }],
    ['tablet-820', { width: 820, height: 1180 }],
    ['desktop-1440', { width: 1440, height: 900 }],
  ]) {
    const label = `${path} ${label0}`;
    const { page, context, errors } = await openPage(browser, viewport, {}, path);
    await scrollThrough(page);
    const ox = await overflow(page);
    ok(`${label}: no horizontal overflow`, ox <= 0, `${ox}px`);
    const broken = await page.evaluate(() =>
      [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
    );
    ok(`${label}: all images load`, broken.length === 0, broken.join(', '));
    const h1 = await page.$$eval('h1', (h) => h.length);
    ok(`${label}: exactly one h1`, h1 === 1);
    if (path === '/') {
      if (label0.startsWith('desktop')) {
        const live = await until(page, () => !!document.querySelector('figure[class*="live"] canvas'));
        ok(`${label}: 3D hero scene active`, live);
      } else {
        const canvas = await page.evaluate(() => !!document.querySelector('canvas'));
        ok(`${label}: no WebGL on small screens (static render)`, !canvas);
      }
    }
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${path.replaceAll('/', '') || 'home'}-${label0}.png`, fullPage: true });
    ok(`${label}: no console errors / 404s`, errors.length === 0, errors.join(' | '));
    await context.close();
  }
}

// ------------------------------------------------------------ links + SEO
{
  const { page, context } = await openPage(browser, { width: 1280, height: 900 });
  const tels = await page.$$eval('a[href^="tel:"]', (a) => [...new Set(a.map((x) => x.getAttribute('href')))]);
  ok('phone links all use tel:+39041990950', tels.length === 1 && tels[0] === 'tel:+39041990950', tels.join(','));
  const dir = await page.$eval('a[href*="maps/dir"]', (a) => a.href);
  ok('directions link targets Via Roma 175, Spinea', /destination=Arte%20Colore%2C%20Via%20Roma%20175%2C%2030038%20Spinea/.test(dir), dir);
  const lang = await page.getAttribute('html', 'lang');
  ok('document language is Italian', lang === 'it');
  const ld = JSON.parse(await page.$eval('script[type="application/ld+json"]', (s) => s.textContent));
  ok('structured data has verified NAP only', ld.name === 'Arte Colore' && ld.telephone === '+39041990950' &&
    ld.address.streetAddress === 'Via Roma 175' && !ld.openingHours && !ld.geo && !ld.aggregateRating);
  // nav anchor on the homepage
  await page.click('header nav >> text=Esplora i colori');
  const inView = await page
    .waitForFunction(() => Math.abs(document.getElementById('colori').getBoundingClientRect().top) < 200, null, { timeout: 6000 })
    .then(() => true, () => false);
  ok('desktop nav anchor scrolls to the explorer', inView);
  // hero CTA to the visit card
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('text=Vieni in negozio');
  const atVisit = await page
    .waitForFunction(() => Math.abs(document.getElementById('visita').getBoundingClientRect().top) < 200, null, { timeout: 6000 })
    .then(() => true, () => false);
  ok('hero "Vieni in negozio" scrolls to the visit card', atVisit);
  // inspiration gallery controls
  await page.locator('#insp-track').scrollIntoViewIfNeeded();
  const next = page.getByRole('button', { name: 'Ispirazione successiva' });
  await next.click();
  const scrolledOk = await until(page, () => document.getElementById('insp-track').scrollLeft > 100);
  const scrolled = await page.$eval('#insp-track', (t) => t.scrollLeft);
  ok('inspiration gallery next button scrolls', scrolledOk, String(scrolled));
  // cross-page navigation
  await page.click('header nav >> text=Dove siamo');
  await page.waitForLoadState('networkidle');
  ok('"Dove siamo" opens the shop page location', page.url().endsWith('/negozio/#dove-siamo'), page.url());
  const current = await page.$eval('header nav a[aria-current="page"]', (a) => a.textContent);
  ok('current page marked in nav', current === 'Il negozio', current);
  const iframeBefore = await page.$$eval('iframe', (f) => f.length);
  await page.click('text=Mostra la mappa');
  const iframeAfter = await page.$$eval('iframe', (f) => f.length);
  ok('map iframe loads only on request', iframeBefore === 0 && iframeAfter === 1);
  const sm = await page.$eval('a[href="https://san-marco.com/store-locator"]', (a) => a.target);
  ok('San Marco directory link present', sm === '_blank');
  const scrolledHeader = await page.$eval('header', (h) => h.className);
  ok('sticky header changes after scroll', /scrolled/.test(scrolledHeader));
  await context.close();
}

// ------------------------------------------------------------ mobile menu
{
  const { page, context, errors } = await openPage(browser, { width: 390, height: 844 });
  const toggle = page.locator('button[aria-controls="menu-mobile"]');
  ok('menu toggle starts collapsed', (await toggle.getAttribute('aria-expanded')) === 'false');
  await toggle.click();
  ok('menu toggle expanded after click', (await toggle.getAttribute('aria-expanded')) === 'true');
  const focused = await page.evaluate(() => document.activeElement?.closest('#menu-mobile') !== null);
  ok('focus moves into the open menu', focused);
  // tab cycling stays inside header
  for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
  const inside = await page.evaluate(() => !!document.activeElement?.closest('header'));
  ok('Tab keeps focus within open menu', inside);
  await page.keyboard.press('Escape');
  ok('Escape closes menu', (await toggle.getAttribute('aria-expanded')) === 'false');
  const back = await page.evaluate(() => document.activeElement?.getAttribute('aria-controls'));
  ok('focus returns to toggle', back === 'menu-mobile');
  await toggle.click();
  await page.click('#menu-mobile >> text=Esplora i colori');
  const arrived = await page
    .waitForFunction(() => Math.abs(document.getElementById('colori').getBoundingClientRect().top) < 300, null, { timeout: 6000 })
    .then(() => true, () => false);
  ok('menu link closes menu and navigates', (await toggle.getAttribute('aria-expanded')) === 'false' && arrived);
  if (SHOTS) {
    await toggle.click();
    await page.screenshot({ path: `${SHOTS}/mobile-menu.png` });
    await page.keyboard.press('Escape');
  }
  ok('mobile menu: no console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}

// ------------------------------------------------------- colour explorer
for (const viewport of [{ width: 375, height: 812 }, { width: 1280, height: 900 }]) {
  const { page, context, errors } = await openPage(browser, viewport);
  const tag = `explorer@${viewport.width}`;
  await page.locator('#colori').scrollIntoViewIfNeeded();
  const counts = {};
  for (const f of ['Neutri', 'Caldi', 'Freddi', 'Accenti', 'Tutti']) {
    await page.click(`#colori [role=group] >> text=${f}`);
    counts[f] = await page.$$eval('#colori [role=radio]', (r) => r.length);
    const pressed = await page.getAttribute(`#colori [role=group] >> text=${f}`, 'aria-pressed');
    if (pressed !== 'true') counts[f] = -1;
  }
  ok(`${tag}: filters (4 per family, 16 total)`, counts.Neutri === 4 && counts.Caldi === 4 && counts.Freddi === 4 &&
    counts.Accenti === 4 && counts.Tutti === 16, JSON.stringify(counts));

  const paint = () => page.$eval('#colori [class*="paint"]', (el) => getComputedStyle(el).backgroundColor);
  const radios = page.locator('#colori [role=radio]');
  let allOk = true;
  for (let i = 0; i < (await radios.count()); i++) {
    const r = radios.nth(i);
    await r.click();
    const checked = await r.getAttribute('aria-checked');
    const name = (await r.innerText()).split('\n')[0].trim();
    const shown = await page.$eval('#colori [class*="nowName"]', (el) => el.textContent);
    if (checked !== 'true' || shown !== name) allOk = false;
  }
  ok(`${tag}: every swatch selects and updates name`, allOk);
  await until(page, () => getComputedStyle(document.querySelector('#colori [class*="paint"]')).backgroundColor === 'rgb(58, 60, 56)' && getComputedStyle(document.getElementById('colori')).backgroundColor === 'rgb(58, 60, 56)');
  ok(`${tag}: wall colour follows selection`, (await paint()) === 'rgb(58, 60, 56)', await paint());
  const cardBg = await page.$eval('#colori', (el) => getComputedStyle(el).backgroundColor);
  ok(`${tag}: whole card floods with the chosen colour`, cardBg === 'rgb(58, 60, 56)', cardBg);
  // keyboard
  await radios.nth(0).click();
  await page.keyboard.press('ArrowRight');
  const second = await radios.nth(1).getAttribute('aria-checked');
  const focusedIdx = await page.evaluate(() => [...document.querySelectorAll('#colori [role=radio]')].indexOf(document.activeElement));
  ok(`${tag}: arrow keys move selection and focus`, second === 'true' && focusedIdx === 1);
  await page.keyboard.press('End');
  ok(`${tag}: End selects last`, (await radios.nth(15).getAttribute('aria-checked')) === 'true');
  const tabStops = await page.$$eval('#colori [role=radio]', (r) => r.filter((x) => x.tabIndex === 0).length);
  ok(`${tag}: single roving tab stop`, tabStops === 1);
  await page.click('#colori >> text=Accenti');
  await page.getByRole('button', { name: 'Ripristina il colore iniziale' }).click();
  await until(page, () => getComputedStyle(document.querySelector('#colori [class*="paint"]')).backgroundColor === 'rgb(220, 208, 188)');
  const after = await page.$eval('#colori [class*="nowName"]', (el) => el.textContent);
  const filterReset = await page.getAttribute('#colori [role=group] >> text=Tutti', 'aria-pressed');
  ok(`${tag}: reset restores Lino grezzo and all colours`, after === 'Lino grezzo' && filterReset === 'true' &&
    (await paint()) === 'rgb(220, 208, 188)', `${after} ${await paint()}`);
  const disclaimer = await page.getByText('Colori illustrativi: la resa sullo schermo può differire dal colore reale. Verifica la tonalità in negozio.').count();
  ok(`${tag}: disclaimer present`, disclaimer === 1);
  const masked = await page.$eval('#colori [class*="paint"]', (el) => {
    const s = getComputedStyle(el);
    return (s.maskImage || s.webkitMaskImage || '').includes('explorer-mask');
  });
  ok(`${tag}: wall mask applied`, masked);
  if (SHOTS) {
    await radios.nth(6).click();
    await page.waitForTimeout(800);
    await page.locator('#colori').screenshot({ path: `${SHOTS}/${tag}.png` });
  }
  ok(`${tag}: no console errors`, errors.length === 0, errors.join(' | '));
  await context.close();
}

// ---------------------------------------------------------- reduced motion
{
  const { page, context, errors } = await openPage(browser, { width: 1440, height: 900 }, { reducedMotion: 'reduce' });
  const live = await until(page, () => !!document.querySelector('figure[class*="live"] canvas'));
  const running = await page.evaluate(() =>
    document.getAnimations().filter((a) => a.playState === 'running' && (a.effect?.getTiming().duration ?? 0) > 1).length,
  );
  ok('reduced motion: no running CSS animations', running === 0, String(running));
  const smooth = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  ok('reduced motion: no smooth scrolling', smooth === 'auto', smooth);
  ok('reduced motion: 3D scene still renders (static, no idle motion)', live);
  ok('reduced motion: no console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}
await browser.close();

// ------------------------------------------------------- WebGL unavailable
{
  const noGl = await chromium.launch({ executablePath, args: ['--disable-webgl', '--disable-3d-apis', '--disable-gpu'] });
  const { page, context, errors } = await openPage(noGl, { width: 1440, height: 900 });
  await page.waitForTimeout(2500);
  const state = await page.evaluate(() => {
    const img = document.querySelector('figure img');
    return { canvas: !!document.querySelector('canvas'), still: img && getComputedStyle(img).opacity === '1' && img.naturalWidth > 0 };
  });
  ok('no WebGL: static hero render shown, no canvas', !state.canvas && state.still, JSON.stringify(state));
  ok('no WebGL: no console errors', errors.length === 0, errors.join(' | '));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/desktop-nowebgl.png` });
  await context.close();
  await noGl.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
