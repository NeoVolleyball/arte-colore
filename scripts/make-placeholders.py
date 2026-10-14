"""Generates the PLACEHOLDER photos used until the client sends real ones.

    python3 scripts/make-placeholders.py

Writes procedural textures (wood planks, stone tiles, painted walls,
wallpaper patterns) as WebP into public/images/{portfolio,wallpapers,offers}/.
They are illustrations, not photos of real jobs: the site labels them
"Foto di esempio". Replace them with real photos (same file names, or update
src/data/*.ts). Requires Pillow (pip install pillow).
"""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent / "public" / "images"


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def light(img: Image.Image, strength=0.22) -> Image.Image:
    """Soft window light from the top-left plus a gentle vignette."""
    w, h = img.size
    mask = Image.new("L", (w, h))
    px = mask.load()
    for y in range(0, h, 4):
        for x in range(0, w, 4):
            d = math.hypot(x / w - 0.15, y / h - 0.1)
            v = int(255 * max(0.0, min(1.0, 1 - d * 0.9)))
            for yy in range(y, min(y + 4, h)):
                for xx in range(x, min(x + 4, w)):
                    px[xx, yy] = v
    mask = mask.filter(ImageFilter.GaussianBlur(40))
    bright = Image.new("RGB", (w, h), (255, 246, 232))
    dark = Image.new("RGB", (w, h), (30, 22, 18))
    out = Image.composite(Image.blend(img, bright, strength), Image.blend(img, dark, strength), mask)
    return out


def grain(img: Image.Image, amount=6, seed=0) -> Image.Image:
    rnd = random.Random(seed)
    w, h = img.size
    noise = Image.new("L", (w // 2, h // 2))
    noise.putdata([128 + rnd.randint(-amount, amount) for _ in range((w // 2) * (h // 2))])
    noise = noise.resize((w, h)).convert("RGB")
    return Image.blend(img, Image.merge("RGB", [noise.getchannel(0)] * 3), 0.06)


def planks(size, base, dark, seed, plank_h=150, herringbone=False):
    rnd = random.Random(seed)
    w, h = size
    img = Image.new("RGB", size, base)
    d = ImageDraw.Draw(img)
    if herringbone:
        pw, ph = 70, 280
        for row in range(-2, h // pw + 4):
            for col in range(-2, w // pw + 4):
                x0, y0 = col * pw * 2 - row * pw, row * pw
                tone = lerp(base, dark, rnd.uniform(0.05, 0.45))
                if (col + row) % 2:
                    d.polygon([(x0, y0), (x0 + ph, y0 + ph - pw), (x0 + ph, y0 + ph), (x0, y0 + pw)], fill=tone, outline=dark)
                else:
                    d.polygon([(x0 + pw, y0), (x0 + pw, y0 + pw), (x0 + pw - ph, y0 + ph), (x0 + pw - ph, y0 + ph - pw)], fill=tone, outline=dark)
        return grain(light(img.filter(ImageFilter.GaussianBlur(0.6))), seed=seed)
    y = 0
    while y < h:
        x = -rnd.randint(0, 600)
        while x < w:
            length = rnd.randint(700, 1300)
            tone = lerp(base, dark, rnd.uniform(0.0, 0.4))
            d.rectangle([x, y, x + length, y + plank_h], fill=tone)
            for _ in range(28):
                gy = y + rnd.randint(4, plank_h - 4)
                gtone = lerp(tone, dark, rnd.uniform(0.15, 0.4))
                pts = [(xx, gy + 5 * math.sin(xx / rnd.uniform(60, 140) + rnd.random())) for xx in range(x, x + length, 20)]
                d.line(pts, fill=gtone, width=rnd.choice([1, 1, 2]))
            d.line([(x, y), (x, y + plank_h)], fill=lerp(dark, (0, 0, 0), 0.2), width=3)
            x += length
        d.line([(0, y), (w, y)], fill=lerp(dark, (0, 0, 0), 0.25), width=3)
        y += plank_h
    return grain(light(img.filter(ImageFilter.GaussianBlur(0.8))), seed=seed)


def tiles(size, base, vein, seed, tile=300):
    rnd = random.Random(seed)
    w, h = size
    img = Image.new("RGB", size, base)
    d = ImageDraw.Draw(img)
    for ty in range(0, h, tile):
        for tx in range(0, w, tile * 2):
            tone = lerp(base, vein, rnd.uniform(0.0, 0.25))
            d.rectangle([tx, ty, tx + tile * 2, ty + tile], fill=tone)
            for _ in range(60):
                cx, cy = tx + rnd.randint(0, tile * 2), ty + rnd.randint(0, tile)
                r = rnd.randint(2, 14)
                d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=lerp(tone, vein, rnd.uniform(0.1, 0.35)))
            for _ in range(2):
                x0, y0 = tx + rnd.randint(0, tile * 2), ty
                pts = [(x0 + rnd.randint(-60, 60) + i * rnd.randint(-8, 8), y0 + i * tile / 8) for i in range(9)]
                d.line(pts, fill=lerp(tone, vein, 0.55), width=2)
    img = img.filter(ImageFilter.GaussianBlur(2.2))
    d = ImageDraw.Draw(img)
    for ty in range(0, h, tile):
        d.line([(0, ty), (w, ty)], fill=(235, 230, 222), width=4)
    for ty in range(0, h, tile):
        for tx in range(0, w + tile * 2, tile * 2):
            d.line([(tx, ty), (tx, ty + tile)], fill=(235, 230, 222), width=4)
    return grain(light(img), seed=seed)


def wall(size, paint, floor, seed):
    w, h = size
    img = Image.new("RGB", size, paint)
    d = ImageDraw.Draw(img)
    horizon = int(h * 0.72)
    floor_img = planks((w, h - horizon), floor, lerp(floor, (40, 26, 18), 0.6), seed, plank_h=60)
    img.paste(floor_img, (0, horizon))
    d.rectangle([0, horizon - 26, w, horizon], fill=(246, 242, 236))
    # framed picture + plant silhouette for scale
    d.rectangle([w * 0.58, h * 0.2, w * 0.82, h * 0.48], fill=lerp(paint, (255, 255, 255), 0.75), outline=(60, 48, 40), width=8)
    d.ellipse([w * 0.12, h * 0.42, w * 0.3, h * 0.66], fill=(96, 112, 82))
    d.rectangle([w * 0.17, h * 0.6, w * 0.25, horizon - 26], fill=(170, 120, 88))
    return grain(light(img.filter(ImageFilter.GaussianBlur(1.2)), 0.25), seed=seed)


def pattern(size, bg, ink, kind, seed):
    rnd = random.Random(seed)
    w, h = size
    img = Image.new("RGB", size, bg)
    d = ImageDraw.Draw(img)
    if kind == "botanical":
        for gy in range(-100, h + 100, 160):
            for gx in range(-100, w + 100, 160):
                ox = gx + (80 if (gy // 160) % 2 else 0)
                for k in range(5):
                    a = k * 1.25 + rnd.random() * 0.4
                    x1, y1 = ox + 60 * math.cos(a), gy + 60 * math.sin(a)
                    d.ellipse([min(ox, x1) - 12, min(gy, y1) - 12, max(ox, x1) + 12, max(gy, y1) + 12], fill=lerp(bg, ink, rnd.uniform(0.55, 0.9)))
                d.ellipse([ox - 6, gy - 6, ox + 6, gy + 6], fill=lerp(ink, (0, 0, 0), 0.2))
    elif kind == "deco":
        r = 90
        for row, gy in enumerate(range(0, h + r, r)):
            for gx in range(-r, w + r, r * 2):
                cx = gx + (r if row % 2 else 0)
                for k in range(5, 0, -1):
                    rr = r * k / 5
                    d.pieslice([cx - rr, gy - rr, cx + rr, gy + rr], 180, 360, fill=bg if k % 2 == 0 else ink)
    elif kind == "stripes":
        x, i = 0, 0
        while x < w:
            sw = [70, 14, 22, 14][i % 4]
            d.rectangle([x, 0, x + sw, h], fill=ink if i % 2 else bg)
            x += sw
            i += 1
    elif kind == "dots":
        for gy in range(0, h + 60, 60):
            for gx in range(0, w + 60, 60):
                ox = gx + (30 if (gy // 60) % 2 else 0)
                d.regular_polygon((ox, gy, 14), 4, rotation=45, fill=ink)
    img = img.filter(ImageFilter.GaussianBlur(0.7))
    return grain(light(img, 0.18), seed=seed)


def save(img: Image.Image, rel: str, widths: tuple[int, ...]):
    for w in widths:
        h = round(img.height * w / img.width)
        out = ROOT / rel.replace("{w}", str(w))
        out.parent.mkdir(parents=True, exist_ok=True)
        img.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=72, method=6)
        print(out.relative_to(ROOT.parent.parent), f"{w}x{h}", out.stat().st_size // 1024, "kB")


OAK, OAK_D = hexrgb("#cfa77c"), hexrgb("#7a5233")
WALNUT, WALNUT_D = hexrgb("#7d5638"), hexrgb("#3d281a")
GREY, GREY_V = hexrgb("#bdb4a8"), hexrgb("#7d7368")
WARM, WARM_V = hexrgb("#e3d6c4"), hexrgb("#a69077")

if __name__ == "__main__":
    P = (1200, 900)
    save(planks(P, OAK, OAK_D, 1), "portfolio/lavoro-1-{w}.webp", (640, 1200))
    save(wall(P, hexrgb("#b5654a"), OAK, 2), "portfolio/lavoro-2-{w}.webp", (640, 1200))
    save(tiles(P, GREY, GREY_V, 3), "portfolio/lavoro-3-{w}.webp", (640, 1200))
    save(planks(P, OAK, OAK_D, 4, herringbone=True), "portfolio/lavoro-4-{w}.webp", (640, 1200))
    save(wall(P, hexrgb("#8a9a7b"), WALNUT, 5), "portfolio/lavoro-5-{w}.webp", (640, 1200))
    save(planks(P, WALNUT, WALNUT_D, 6), "portfolio/lavoro-6-{w}.webp", (640, 1200))

    W = (800, 1000)
    save(pattern(W, hexrgb("#e9e4d8"), hexrgb("#6f8463"), "botanical", 7), "wallpapers/carta-1-{w}.webp", (480, 800))
    save(pattern(W, hexrgb("#f1e6cf"), hexrgb("#c58a2c"), "deco", 8), "wallpapers/carta-2-{w}.webp", (480, 800))
    save(pattern(W, hexrgb("#f4ece4"), hexrgb("#b5654a"), "stripes", 9), "wallpapers/carta-3-{w}.webp", (480, 800))
    save(pattern(W, hexrgb("#2b3440"), hexrgb("#c9a86a"), "dots", 10), "wallpapers/carta-4-{w}.webp", (480, 800))

    O = (800, 600)
    save(planks(O, OAK, OAK_D, 11, plank_h=110), "offers/offerta-1.webp", (800,))
    save(tiles(O, WARM, WARM_V, 12, tile=200), "offers/offerta-2.webp", (800,))
    save(pattern(O, hexrgb("#e9e4d8"), hexrgb("#6f8463"), "botanical", 13), "offers/offerta-3.webp", (800,))
