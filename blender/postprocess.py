"""Denoise Cycles renders (this Blender build ships without OIDN), then
export responsive WebP files to public/images and compose the social image.

python3 blender/postprocess.py   (needs: pillow, numpy, opencv-python-headless)
"""
import os

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "out")
DST = os.path.join(os.path.dirname(HERE), "public", "images")
os.makedirs(DST, exist_ok=True)


def denoise(img, strength):
    rgb = np.array(img.convert("RGB"))[:, :, ::-1]
    clean = cv2.fastNlMeansDenoisingColored(rgb, None, strength, strength, 5, 17)
    out = Image.fromarray(clean[:, :, ::-1])
    if img.mode == "RGBA":
        out.putalpha(img.split()[3])
    return out


def save(img, name, widths, quality=82, lossless=False):
    for w in widths:
        im = img if img.width == w else img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
        path = os.path.join(DST, f"{name}-{w}.webp")
        im.save(path, "WEBP", quality=quality, method=6, lossless=lossless)
        print(f"{path}  {im.width}x{im.height}  {os.path.getsize(path) // 1024} KB")


def load(name):
    p = os.path.join(SRC, f"{name}.png")
    return Image.open(p) if os.path.exists(p) else None


hero = load("hero-still")
if hero:
    hero = denoise(hero, 3)
    save(hero, "hero-still", [1200, 720], quality=84)

base = load("explorer-base")
if base:
    save(denoise(base, 4), "explorer-room", [1600, 960], quality=84)
mask = load("explorer-mask")
if mask:
    a = mask.split()[3]
    white = Image.new("RGBA", mask.size, (255, 255, 255, 0))
    white.putalpha(a)
    save(white, "explorer-mask", [1600, 960], quality=90)

for s in ("living", "studio", "terracotta"):
    im = load(f"insp-{s}")
    if im:
        save(denoise(im, 4), f"insp-{s}", [1100, 640], quality=82)

for s in ("pitture", "smalti", "decorazione"):
    im = load(f"product-{s}")
    if im:
        save(denoise(im, 3), f"product-{s}", [900, 540], quality=82)

# Social sharing image (1200x630): hero still on ivory + typographic wordmark
if hero:
    og = Image.new("RGB", (1200, 630), "#F5F1E9")
    h = hero.resize((round(hero.width * 630 / hero.height * 1.0), 630), Image.LANCZOS)
    og.paste(h, (1200 - h.width + 10, 0), h)
    d = ImageDraw.Draw(og)
    disp = ImageFont.truetype(os.path.join(HERE, "fonts", "Fraunces-Display.ttf"), 96)
    sans = ImageFont.truetype(os.path.join(HERE, "fonts", "Manrope-SemiBold.ttf"), 26)
    d.text((72, 170), "Arte Colore", font=disp, fill="#222420")
    d.rectangle((76, 300, 196, 304), fill="#BE7156")
    d.text((76, 330), "Pitture, smalti e decorazione", font=sans, fill="#222420")
    d.text((76, 370), "Via Roma 175 · Spinea (VE)", font=sans, fill="#5A5C55")
    path = os.path.join(DST, "og-arte-colore.jpg")
    og.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(path)
