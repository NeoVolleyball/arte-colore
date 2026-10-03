"""Interior scenes rendered with Cycles.

  explorer      -> neutral room + wall mask for the CSS colour explorer
  living        -> Ispirazione: warm neutral living room
  studio        -> Ispirazione: sage workspace
  terracotta    -> Ispirazione: terracotta accent interior

blender -b --python blender/rooms.py -- <scene> [--preview]
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bpy  # noqa: E402

from lib import (OUT_RENDERS, area_light, box, camera, cylinder, emission_material,  # noqa: E402
                 holdout_material, lathe, look_at, material, render, reset, setup_render, sun, world)
from props import (OCHRE, TERRACOTTA, arch_slab, books, coffee_table, floor_lamp,  # noqa: E402
                   frame_art, oak_floor, plant, room_shell, sofa, vase)

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SCENE = args[0] if args else "explorer"
PREVIEW = "--preview" in args

W, D, H = 4.4, 4.6, 2.85
WINDOW = (1.2, 3.6, 0.45, 2.45)


def daylight(strength=1.0, sun_energy=5.0):
    world("#E9EEF2", strength=0.25 * strength)
    s = sun("Sun", (0, 0, 0), energy=sun_energy * strength, angle_deg=1.6, color="#FFEBD2")
    s.location = (-3.9, 1.2, 2.6)
    look_at(s, (0.0, D, 1.35))
    # sky portal in the window opening
    sky = area_light("Sky", (-W / 2 - 0.25, (WINDOW[0] + WINDOW[1]) / 2, (WINDOW[2] + WINDOW[3]) / 2),
                     (0, (WINDOW[0] + WINDOW[1]) / 2, (WINDOW[2] + WINDOW[3]) / 2),
                     size=WINDOW[1] - WINDOW[0], size_y=WINDOW[3] - WINDOW[2], energy=420 * strength,
                     color="#EAF0F6")
    sky.rotation_euler.z += 0  # facing +X
    # soft bounce from behind the camera
    area_light("Bounce", (0.6, -0.4, 1.6), (0, D, 1.2), size=2.5, energy=90 * strength, color="#FFF3E6")


def shell(wall_mat, side_mat=None):
    return room_shell("Room", W, D, H, wall_mat, oak_floor("Oak", "#B48C63"), side_mat=side_mat,
                      skirting_mat=material("Skirting", "#EFEAE0", 0.5), left_window=WINDOW)


def rug(color, loc, size):
    return box("Rug", (size[0], size[1], 0.012), loc=(loc[0], loc[1], 0.006),
               mat=material(f"Rug_{color}", color, 0.97, sheen=0.4, bump=0.35, bump_scale=300), bevel=0.004)


# ---------------------------------------------------------------- scenes

def scene_explorer():
    wall = material("PaintableWall", "#F4F4F2", roughness=0.92, bump=0.06, bump_scale=40)
    shell(wall, material("SideWall", "#EEE9DF", 0.92))
    sofa("Sofa", "#E3DACB", loc=(0.15, D - 0.55, 0), width=2.15)
    coffee_table("Table", (0.05, D - 1.75, 0), top="#B08860", radius=0.4)
    vase("VaseA", (0.12, D - 1.75, 0.38), "#E9E3D8", height=0.26, width=0.07)
    lathe("Bowl", [(0.0, 0.0), (0.06, 0.0), (0.13, 0.06), (0.125, 0.065), (0.055, 0.008), (0.0, 0.008)],
          loc=(-0.15, D - 1.68, 0.38), mat=material("Stoneware", "#3A3C38", 0.6))
    rug("#CFC3AE", (0.1, D - 1.5), (2.6, 1.7))
    plant("Plant", (-1.55, D - 0.45, 0), pot="#C9BBA6", height=1.15, seed=7)
    floor_lamp("Lamp", (1.55, D - 0.45, 0))
    frame_art("Art", (0.15, D - 0.035, 1.6), (0.9, 0.62), [OCHRE, "#E9E2D2", TERRACOTTA])
    # side table + books
    cylinder("SideTable", 0.22, 0.5, loc=(1.6, D - 1.3, 0.25), mat=material("Wood_dark", "#6B4F38", 0.5), bevel=0.01)
    books("Books", (1.48, D - 1.3, 0.5), count=4)
    camera((0.25, 0.25, 1.22), (0.1, D, 1.12), lens=26)
    daylight()


def scene_living():
    wall = material("WallLino", "#D6C6AC", 0.93, bump=0.08, bump_scale=40)
    shell(wall, material("SideCalce", "#EDE6D8", 0.92))
    niche = arch_slab("Niche", 1.0, 2.0, 0.05, material("NicheCalce", "#E8DFCF", 0.93), loc=(-0.95, D - 0.06, 0.0))
    niche.location.y = D - 0.05
    sofa("Sofa", "#EFE8DC", loc=(0.55, D - 0.6, 0), width=2.0)
    coffee_table("Table", (0.4, D - 1.75, 0), top="#C29C70", radius=0.42)
    vase("Vase1", (0.5, D - 1.72, 0.38), "#BE7156", height=0.24, width=0.07, rough=0.6)
    vase("Vase2", (0.28, D - 1.82, 0.38), "#E9E3D8", height=0.32, width=0.06)
    rug("#C9BBA3", (0.4, D - 1.55), (2.4, 1.7))
    vase("Urn", (-0.95, D - 0.3, 0.0), "#C7A35D", height=0.62, width=0.17, rough=0.7)
    plant("Branches", (-0.95, D - 0.3, 0.0), pot="#C7A35D", height=0.9, leaves=14, leaf="#7D8A63", seed=11)
    floor_lamp("Lamp", (1.75, D - 0.45, 0), shade="#F1E8DA")
    frame_art("Art", (0.55, D - 0.035, 1.62), (0.78, 0.56), ["#879480", "#E9E2D2", "#C7A35D"])
    camera((0.55, 0.65, 1.15), (0.2, D, 1.1), lens=28)
    daylight(1.05)


def scene_studio():
    wall = material("WallSalvia", "#7B8B72", 0.93, bump=0.08, bump_scale=40)
    shell(wall, material("SideCalce", "#ECE6DA", 0.92))
    oak = material("Wood_desk", "#C29C70", 0.45)
    box("DeskTop", (1.6, 0.7, 0.035), loc=(0.1, D - 0.45, 0.74), mat=oak, bevel=0.006)
    for sx in (-1, 1):
        box(f"DeskLeg{sx}", (0.035, 0.62, 0.72), loc=(0.1 + sx * 0.76, D - 0.45, 0.36),
            mat=material("SteelBlack", "#2B2C29", 0.5, 0.6), bevel=0.004)
    # chair
    chair = material("ChairWood", "#8C6545", 0.5)
    box("Seat", (0.46, 0.44, 0.04), loc=(0.15, D - 1.15, 0.45), mat=chair, bevel=0.01)
    box("ChairBack", (0.46, 0.035, 0.32), loc=(0.15, D - 1.36, 0.72), mat=chair, bevel=0.01,
        rot=(math.radians(-8), 0, 0))
    for sx in (-1, 1):
        for sy in (-1, 1):
            cylinder("ChairLeg", 0.016, 0.45, loc=(0.15 + sx * 0.19, D - 1.15 + sy * 0.18, 0.225), mat=chair)
    # shelves
    for i, z in enumerate((1.35, 1.75)):
        box(f"Shelf{i}", (1.1, 0.24, 0.03), loc=(0.15, D - 0.12, z), mat=oak, bevel=0.004)
    books("Books1", (-0.3, D - 0.14, 1.365), count=9, seed=4)
    books("Books2", (0.3, D - 0.14, 1.765), count=6, seed=9)
    vase("ShelfVase", (-0.25, D - 0.12, 1.765), "#E9E3D8", height=0.2, width=0.055)
    # desk lamp
    brass = material("Brass", "#B8955A", 0.28, 1.0)
    cylinder("DLampBase", 0.07, 0.02, loc=(0.7, D - 0.35, 0.77), mat=brass)
    cylinder("DLampStem", 0.007, 0.42, loc=(0.7, D - 0.35, 0.98), mat=brass)
    lathe("DLampShade", [(0.0, 0.0), (0.03, 0.0), (0.1, -0.12), (0.095, -0.12), (0.0, -0.005)],
          loc=(0.62, D - 0.35, 1.2), mat=material("ShadeBlack", "#2B2C29", 0.55))
    box("Paper", (0.3, 0.21, 0.004), loc=(-0.1, D - 0.5, 0.76), mat=material("Paper", "#FBF8F2", 0.8),
        rot=(0, 0, math.radians(8)), bevel=0)
    plant("Plant", (-1.35, D - 0.5, 0), pot="#E9E3D8", height=1.2, seed=5)
    rug("#B9AE98", (0.15, D - 1.2), (1.9, 1.4))
    camera((0.85, 0.85, 1.3), (0.05, D, 1.0), lens=30)
    daylight(1.1)


def scene_terracotta():
    calce = material("WallCalce", "#EDE6D8", 0.93, bump=0.08, bump_scale=40)
    shell(calce)
    # painted arch: a thin terracotta paint layer on the back wall
    arch_slab("PaintedArch", 1.7, 2.35, 0.004, material("ArchTerracotta", "#AD5636", 0.93, bump=0.08, bump_scale=40),
              loc=(0.2, D - 0.004, 0.0))
    # lower band (wainscot height) also painted
    box("Band", (W, 0.004, 0.0), loc=(0, D, 0), mat=calce, bevel=0)
    bench = material("Wood_bench", "#7A573C", 0.5)
    box("Bench", (1.3, 0.38, 0.06), loc=(0.2, D - 0.32, 0.44), mat=bench, bevel=0.012)
    for sx in (-1, 1):
        box(f"BenchLeg{sx}", (0.06, 0.32, 0.42), loc=(0.2 + sx * 0.55, D - 0.32, 0.21), mat=bench, bevel=0.01)
    box("Cushion", (0.5, 0.34, 0.07), loc=(-0.1, D - 0.32, 0.505), mat=material("Fabric_ochre", OCHRE, 0.92, sheen=0.5),
        bevel=0.03, segments=4)
    vase("Vase1", (0.6, D - 0.3, 0.47), "#F1EBDF", height=0.36, width=0.08)
    vase("Vase2", (0.78, D - 0.32, 0.47), "#3A3C38", height=0.22, width=0.06, rough=0.7)
    plant("Olive", (-1.4, D - 0.55, 0), pot="#D9CFBF", height=1.4, leaves=34, leaf="#7D8A63", seed=21)
    # pendant
    cylinder("Cord", 0.004, 0.9, loc=(0.2, D - 1.0, H - 0.45), mat=material("Cord", "#2B2C29", 0.6))
    lathe("Pendant", [(0.0, 0.0), (0.02, 0.0), (0.2, -0.16), (0.21, -0.18), (0.0, -0.17)],
          loc=(0.2, D - 1.0, H - 0.9), mat=material("Pendant", "#C7A35D", 0.4, metallic=0.6))
    rug("#B49A7C", (0.2, D - 1.25), (1.7, 1.15))
    camera((0.35, 0.4, 1.25), (0.2, D, 1.15), lens=30)
    daylight(1.0)


SCENES = {"explorer": scene_explorer, "living": scene_living, "studio": scene_studio,
          "terracotta": scene_terracotta}

reset()
SCENES[SCENE]()

if SCENE == "explorer":
    w, h = (640, 400) if PREVIEW else (1600, 1000)
    setup_render(w, h, samples=64 if PREVIEW else 320, exposure=-0.55)
    render(os.path.join(OUT_RENDERS, "explorer-base.png"))
    # wall mask: back wall emits white, everything else held out
    hold = holdout_material()
    white = emission_material("MaskWhite")
    for ob in bpy.data.objects:
        if ob.type == "MESH":
            mat = white if ob.name == "RoomBackWall" else hold
            ob.data.materials.clear()
            ob.data.materials.append(mat)
    setup_render(w, h, samples=32, transparent=True)
    bpy.context.scene.view_settings.view_transform = "Standard"
    bpy.context.scene.view_settings.look = "None"
    render(os.path.join(OUT_RENDERS, "explorer-mask.png"))
else:
    w, h = (400, 500) if PREVIEW else (1100, 1375)
    setup_render(w, h, samples=64 if PREVIEW else 280, exposure=-0.45)
    render(os.path.join(OUT_RENDERS, f"insp-{SCENE}.png"))
