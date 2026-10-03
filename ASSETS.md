# Asset source record

Every visual asset is original and generated from code in this repository.
No third-party photos, models, textures or logos are used.

| Asset | Path | Source | Notes |
| --- | --- | --- | --- |
| Hero 3D model (tin with drips and puddle, lid, colour fan, brush with individual bristles, plaster arch with brushed test patches, plinth, camera) | `public/models/hero.glb` | `blender/hero.py` + `blender/props.py` (Blender 4.0, procedural geometry) | Compressed with `gltfpack` (meshopt + quantisation, ~190 KB); loaded by `src/three/heroScene.ts` on desktop |
| Hero still (mobile / no-WebGL / loading state) | `public/images/hero-still-{720,1200}.webp` | Same scene, Cycles render | Transparent background |
| Colour explorer room + wall mask | `public/images/explorer-room-*.webp`, `explorer-mask-*.webp` | `blender/rooms.py explorer` (Cycles) | The wall is rendered neutral; the mask is a separate holdout render |
| Ispirazioni cromatiche (3 interiors) | `public/images/insp-{living,studio,terracotta}-*.webp` | `blender/rooms.py <scene>` | Illustrative concepts, not real projects or customer work |
| Product vignettes | `public/images/product-{pitture,smalti,decorazione}-*.webp` | `blender/products.py <scene>` | Blank-label tins: illustrate categories, not specific products |
| Social sharing image | `public/images/og-arte-colore.jpg` | `blender/postprocess.py` (terracotta card + hero render + typeset wordmark) | 1200×630 |
| Favicon | `public/favicon.svg` | Hand-written SVG | Fan of three colour chips |
| Typographic wordmark | `src/components/Wordmark.tsx` | CSS/HTML | New design, not an existing logo |
| Paper / plaster textures | inline SVG `feTurbulence` in CSS | Code | |
| Fonts | `@fontsource/instrument-serif`, `@fontsource-variable/hanken-grotesk` | SIL Open Font License 1.1, self-hosted by the build | `blender/fonts/*.ttf` are TTF conversions of the same OFL fonts, used by Blender for the tin label and by `postprocess.py` for the OG image |
| Decorative map placeholder | inline SVG in `src/pages/ShopPage.tsx` | Code | Abstract lines, not a real street map |

The "Arte Colore" label on the hero tin is an invented, illustrative design.
No San Marco or other manufacturer branding appears on any modelled object.

## Regenerating

```bash
pip install pillow numpy opencv-python-headless   # for postprocess.py
# Blender's own Python also needs numpy for the glTF exporter
npm run assets:blender            # full quality (~1–2 h on a 4-core CPU)
bash blender/build-all.sh --preview   # quick low-resolution pass
```

This Blender build has no OpenImageDenoise, so `postprocess.py` denoises with
OpenCV before writing the WebP files.
