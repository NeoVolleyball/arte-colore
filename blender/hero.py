"""Hero composition: plaster arch + plinth, open paint tin, lifted lid and a
fan of colour cards. Exports public/models/hero.glb (for Three.js) and
renders the static fallback used on mobile / without WebGL.

blender -b --python blender/hero.py -- [--preview] [--no-render] [--no-glb]
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bpy  # noqa: E402

from lib import (OUT_PUBLIC, OUT_RENDERS, area_light, box, camera, material, plane,  # noqa: E402
                 render, reset, setup_render, world)
from props import IVORY, SAGE, TERRACOTTA, arch_slab, brush, colour_fan, paint_lid, paint_tin  # noqa: E402

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIEW = "--preview" in args

reset()

plaster_ivory = material("PlasterIvory", "#E9E2D4", roughness=0.92, bump=0.18, bump_scale=90)
plaster_sage = material("PlasterSage", SAGE, roughness=0.95, bump=0.12, bump_scale=55)

# Architecture --------------------------------------------------------------
plinth = box("Plinth", (0.58, 0.36, 0.12), loc=(0.0, 0.03, -0.06), mat=plaster_ivory, bevel=0.006)
arch = arch_slab("Arch", 0.44, 0.62, 0.035, plaster_sage, loc=(-0.08, 0.17, 0.0))
step = box("Step", (0.15, 0.15, 0.085), loc=(0.205, 0.125, 0.0425), mat=plaster_ivory, bevel=0.004)

# Objects -------------------------------------------------------------------
tin = paint_tin("Tin", paint=TERRACOTTA, loc=(-0.025, 0.045, 0.0))
tin.rotation_euler = (0, 0, math.radians(-4))

lid = paint_lid("Lid", paint=TERRACOTTA)
lid.location = (-0.19, 0.11, 0.084)
lid.rotation_euler = (math.radians(-72), math.radians(0), math.radians(14))

fan = colour_fan("Fan", loc=(0.015, -0.085, 0.0012), rot_z=math.radians(-92))

brush("Brush", loc=(0.2, 0.105, 0.0935), rot=(math.radians(90), 0, math.radians(68)), paint=TERRACOTTA)

# Camera & light ------------------------------------------------------------
cam = camera((0.14, -1.95, 0.62), (0.01, 0.05, 0.205), lens=54)
cam.data.sensor_fit = "VERTICAL"

world(IVORY, strength=0.55)
area_light("Key", (-1.1, -0.55, 0.95), (0, 0.1, 0.15), size=0.9, energy=105, color="#FFF0DD")
area_light("Fill", (1.1, -0.9, 0.35), (0, 0, 0.12), size=1.6, energy=32, color="#F2F0EA")
area_light("Rim", (0.5, 0.9, 1.0), (0, 0, 0.2), size=0.6, energy=40, color="#FFE7CF")

# GLB export ----------------------------------------------------------------
if "--no-glb" not in args:
    os.makedirs(os.path.join(OUT_PUBLIC, "models"), exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for ob in bpy.data.objects:
        if ob.type in {"MESH", "EMPTY", "CAMERA"}:
            ob.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(OUT_PUBLIC, "models", "hero.glb"),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_cameras=True,
        export_lights=False,
        export_yup=True,
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7,
    )

# Static fallback render ----------------------------------------------------
if "--no-render" not in args:
    catcher = plane("ShadowCatcher", (6, 6), loc=(0, 0, -0.12))
    catcher.is_shadow_catcher = True
    if PREVIEW:
        setup_render(480, 600, samples=48, transparent=True)
    else:
        setup_render(1200, 1500, samples=320, transparent=True)
    render(os.path.join(OUT_RENDERS, "hero-still.png"))
