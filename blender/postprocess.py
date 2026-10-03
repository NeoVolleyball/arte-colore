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

# Social sharing image (1200x630): terracotta colour card + hero render
if hero:
    og = Image.new("RGB", (1200, 630), "#8E4A31")
    d = ImageDraw.Draw(og)
    d.rectangle((0, 548, 1200, 630), fill="#F7F3EB")
    h = hero.resize((round(hero.width * 570 / hero.height), 570), Image.LANCZOS)
    og.paste(h, (1200 - h.width - 40, -22), h)
    disp = ImageFont.truetype(os.path.join(HERE, "fonts", "InstrumentSerif-Regular.ttf"), 124)
    sans = ImageFont.truetype(os.path.join(HERE, "fonts", "HankenGrotesk-SemiBold.ttf"), 26)
    small = ImageFont.truetype(os.path.join(HERE, "fonts", "HankenGrotesk-SemiBold.ttf"), 22)
    d.text((70, 150), "Arte Colore", font=disp, fill="#F7F3EB")
    d.text((74, 300), "Pitture, smalti e decorazione", font=sans, fill="#F7F3EB")
    d.text((70, 575), "Via Roma 175 · 30038 Spinea (VE)", font=small, fill="#222420")
    d.text((860, 575), "Tel. 041 990950", font=small, fill="#222420")
    path = os.path.join(DST, "og-arte-colore.jpg")
    og.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(path)
