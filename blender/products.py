"""Still-life vignettes for the Prodotti section, each on a coloured paper
cyclorama. Tins carry blank labels on purpose: they illustrate a category,
not a specific product sold in the shop.

blender -b --python blender/products.py -- <pitture|smalti|decorazione> [--preview]
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bmesh  # noqa: E402

from lib import (OUT_RENDERS, area_light, assign, box, camera, material, mesh_from_bmesh,  # noqa: E402
                 render, reset, setup_render, smooth, world)
from props import (OCHRE, SAGE, TERRACOTTA, brush, colour_fan, paint_lid, paint_tin,  # noqa: E402
                   roller, trowel)

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SCENE = args[0] if args else "pitture"
PREVIEW = "--preview" in args


def cyclorama(color, width=3.0, radius=0.35, wall=1.6, floor=1.6):
    """Seamless paper sweep: floor (-y) curving up into a wall (+y)."""
    prof = [(-floor, 0.0), (0.0, 0.0)]
    for i in range(1, 17):
        a = math.pi / 2 * i / 16
        prof.append((radius * math.sin(a), radius * (1 - math.cos(a))))
    prof.append((radius, wall))
    bm = bmesh.new()
    rows = []
    for x in (-width / 2, width / 2):
        rows.append([bm.verts.new((x, y, z)) for y, z in prof])
    for i in range(len(prof) - 1):
        bm.faces.new((rows[0][i], rows[1][i], rows[1][i + 1], rows[0][i + 1]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    obj = mesh_from_bmesh("Cyc", bm)
    for p in obj.data.polygons:
        if p.normal.z < 0 and p.normal.y > -0.01:
            pass
    smooth(obj, 80)
    assign(obj, material(f"Paper_{color}", color, 0.9, bump=0.05, bump_scale=120))
    obj.location = (0, 0.25, 0)
    return obj


def studio_light():
    world("#F5F1E9", 0.4)
    area_light("Key", (-0.8, -0.7, 0.9), (0, 0.1, 0.1), size=0.9, energy=70, color="#FFF0DD")
    area_light("Fill", (0.9, -0.8, 0.4), (0, 0.1, 0.1), size=1.2, energy=22)
    area_light("Top", (0.2, 0.1, 1.2), (0, 0.1, 0), size=0.8, energy=30)


def scene_pitture():
    cyclorama("#8D9A85")
    paint_tin("TinA", paint="#EDE6D8", wordmark=False, stripe=SAGE, loc=(-0.06, 0.06, 0))
    t2 = paint_tin("TinB", paint=None, open_top=False, wordmark=False, stripe=OCHRE, handle=True,
                   loc=(0.14, 0.13, 0))
    t2.rotation_euler = (0, 0, math.radians(30))
    roller("Roller", paint="#EDE6D8", loc=(0.06, -0.12, 0.026), rot=(math.radians(-90), 0, math.radians(-25)))
    # stirring stick resting across the open tin
    box("Stick", (0.012, 0.3, 0.004), loc=(-0.06, 0.06, 0.192), mat=material("Stick", "#D8BE95", 0.7),
        rot=(math.radians(4), 0, math.radians(-35)), bevel=0.001)
    camera((0.08, -0.95, 0.42), (0.03, 0.05, 0.1), lens=55)
    studio_light()


def small_tin(name, loc, stripe, lid_paint=None):
    t = paint_tin(name, radius=0.05, height=0.085, paint=None, open_top=False, wordmark=False,
                  stripe=stripe, handle=False, loc=loc)
    return t


def scene_smalti():
    cyclorama("#C27C62")
    small_tin("S1", (-0.09, 0.08, 0), "#2F4A3E")
    small_tin("S2", (0.03, 0.12, 0), "#C7A35D")
    s3 = small_tin("S3", (0.0, 0.0, 0.086), "#8E3B32")
    s3.location = (-0.03, 0.08, 0.087)
    # an opened tin with glossy enamel
    paint_tin("S4", radius=0.05, height=0.085, paint="#2F4A3E", wordmark=False, stripe="#2F4A3E",
              handle=False, loc=(0.1, -0.03, 0))
    lid = paint_lid("S4Lid", radius=0.053, paint="#2F4A3E")
    lid.location = (0.19, 0.07, 0.003)
    lid.rotation_euler = (math.radians(180), 0, 0)
    lid.location.z = 0.0062
    brush("Brush", loc=(-0.06, -0.09, 0.008), rot=(math.radians(90), 0, math.radians(-70)), paint="#2F4A3E")
    camera((0.05, -0.72, 0.46), (0.02, 0.03, 0.06), lens=60)
    studio_light()


def scene_decorazione():
    cyclorama("#CFAE6C")
    board = box("Board", (0.34, 0.26, 0.016), loc=(-0.02, 0.1, 0.008),
                mat=material("Stucco", "#E7DCC7", 0.6, bump=0.9, bump_scale=9), bevel=0.003)
    board.rotation_euler = (0, 0, math.radians(-6))
    swatch = box("BoardPaint", (0.16, 0.26, 0.0012), loc=(0.055, 0.105, 0.0166),
                 mat=material("StuccoTerra", TERRACOTTA, 0.55, bump=0.7, bump_scale=8), bevel=0.0)
    swatch.rotation_euler = (0, 0, math.radians(-6))
    trowel("Trowel", loc=(0.07, -0.08, 0.002), rot=(0, 0, math.radians(20)))
    colour_fan("Fan", loc=(-0.15, -0.09, 0.0008), rot_z=math.radians(-60))
    roller("Roller", cover="#EFE9DD", loc=(0.18, 0.12, 0.026), rot=(math.radians(-90), 0, math.radians(70)))
    camera((0.02, -0.75, 0.62), (0.01, 0.03, 0.0), lens=55)
    studio_light()


SCENES = {"pitture": scene_pitture, "smalti": scene_smalti, "decorazione": scene_decorazione}

reset()
SCENES[SCENE]()
w, h = (360, 450) if PREVIEW else (900, 1125)
setup_render(w, h, samples=48 if PREVIEW else 256, exposure=-0.6)
render(os.path.join(OUT_RENDERS, f"product-{SCENE}.png"))
