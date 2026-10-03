#!/usr/bin/env bash
# Regenerates every procedural visual asset. Requires Blender 4.x (Cycles)
# and python3 with pillow, numpy, opencv-python-headless.
# Full quality takes ~1-2 hours on a 4-core CPU; add --preview for a quick pass.
set -euo pipefail
cd "$(dirname "$0")/.."
EXTRA="${1:-}"
blender -b --python blender/hero.py -- $EXTRA
for s in explorer living studio terracotta; do
  blender -b --python blender/rooms.py -- "$s" $EXTRA
done
for s in pitture smalti decorazione; do
  blender -b --python blender/products.py -- "$s" $EXTRA
done
python3 blender/postprocess.py
