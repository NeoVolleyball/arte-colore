"""Procedural props: paint tin, lid, colour-card fan, roller, brush, trowel
and the simple furniture used in the interior concepts. All geometry is
built from primitives, lathe profiles and curves."""
import json
import math
import os

import bmesh
import bpy

from lib import (FONT_DISPLAY, FONT_SANS, ROOT, assign, box, cylinder, empty, hex_rgb,
                 lathe, material, mesh_from_bmesh, parent, smooth, text_mesh,
                 tube_from_points, wrap_on_cylinder)

with open(os.path.join(ROOT, "src", "data", "palette.json"), encoding="utf-8") as fh:
    PALETTE = {c["id"]: c["hex"] for c in json.load(fh)["colours"]}

IVORY = "#F5F1E9"
CHARCOAL = "#222420"
SAGE = "#879480"
TERRACOTTA = "#BE7156"
OCHRE = "#C7A35D"


def mix(hex_a, hex_b, t):
    a = [int(hex_a.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)]
    b = [int(hex_b.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)]
    return "#" + "".join(f"{round(x + (y - x) * t):02X}" for x, y in zip(a, b))


# ---------------------------------------------------------------- tin

def paint_tin(name="Tin", radius=0.0845, height=0.19, paint=TERRACOTTA, open_top=True,
              label=True, label_color=IVORY, stripe=TERRACOTTA, handle=True, metal="#C9C6BF",
              wordmark=True, loc=(0, 0, 0)):
    """An original, unbranded-generic paint tin with a minimal Arte Colore
    label. Returns the root empty; children are named for runtime lookup."""
    root = empty(name, loc)
    r, h = radius, height
    tin_mat = material("TinMetal", metal, roughness=0.3, metallic=1.0)
    body = lathe(f"{name}Body", [
        (0.0, 0.0025), (r - 0.004, 0.0025), (r - 0.0015, 0.0), (r + 0.0018, 0.0012),
        (r + 0.0022, 0.0055), (r, 0.0095), (r, 0.038), (r + 0.0011, 0.0405), (r, 0.043),
        (r, h - 0.03), (r + 0.0011, h - 0.0275), (r, h - 0.025), (r, h - 0.009),
        (r + 0.0028, h - 0.0055), (r + 0.003, h - 0.0015), (r + 0.0012, h),
        (r - 0.0018, h - 0.0012), (r - 0.0028, h - 0.006), (r - 0.0028, h - 0.024),
    ], mat=tin_mat)
    parent(body, root, keep=False)
    if open_top:
        inner = lathe(f"{name}Inner", [(r - 0.0028, h - 0.024), (r - 0.0028, 0.01), (0.0, 0.01)], mat=tin_mat)
        parent(inner, root, keep=False)
        surface = lathe(f"{name}Paint", [
            (0.0, h - 0.0225), (r * 0.6, h - 0.0222), (r - 0.0045, h - 0.0212),
            (r - 0.0026, h - 0.0195), (r - 0.0026, h - 0.026),
        ], mat=material(f"Paint_{paint}", paint, roughness=0.16, coat=0.25))
        parent(surface, root, keep=False)
    else:
        lid = paint_lid(f"{name}Cap", radius=r + 0.003, paint=None)
        lid.location = (0, 0, h - 0.004)
        parent(lid, root, keep=False)
    if label:
        lab_mat = material(f"Label_{label_color}", label_color, roughness=0.55)
        band_lo, band_hi = 0.047, h - 0.034
        band = lathe(f"{name}Label", [(r + 0.0002, band_lo), (r + 0.0006, band_lo + 0.0004),
                                      (r + 0.0006, band_hi - 0.0004), (r + 0.0002, band_hi)],
                     mat=lab_mat, segments=128)
        parent(band, root, keep=False)
        if stripe:
            st = lathe(f"{name}Stripe", [(r + 0.0007, band_lo + 0.006), (r + 0.0009, band_lo + 0.0062),
                                         (r + 0.0009, band_lo + 0.017), (r + 0.0007, band_lo + 0.0172)],
                       mat=material(f"Stripe_{stripe}", stripe, roughness=0.5), segments=128)
            parent(st, root, keep=False)
        if wordmark:
            ink = material("LabelInk", CHARCOAL, roughness=0.5)
            mid = (band_lo + 0.017 + band_hi) / 2 + 0.004
            parts = []
            t1 = text_mesh(f"{name}Word1", "Arte", FONT_DISPLAY, 0.031)
            t1.data.transform(__import__("mathutils").Matrix.Translation((0, mid + 0.016, 0)))
            t2 = text_mesh(f"{name}Word2", "Colore", FONT_DISPLAY, 0.031)
            t2.data.transform(__import__("mathutils").Matrix.Translation((0, mid - 0.011, 0)))
            t3 = text_mesh(f"{name}Word3", "S P I N E A", FONT_SANS, 0.0062)
            t3.data.transform(__import__("mathutils").Matrix.Translation((0, mid - 0.036, 0)))
            parts = [t1, t2, t3]
            for t in parts:
                t.data.transform(__import__("mathutils").Matrix.Translation((0, 0, 0.0011)))
                wrap_on_cylinder(t, r + 0.0006)
            bpy.ops.object.select_all(action="DESELECT")
            for t in parts:
                t.select_set(True)
            bpy.context.view_layer.objects.active = t1
            bpy.ops.object.join()
            t1.name = f"{name}Wordmark"
            assign(t1, ink)
            parent(t1, root, keep=False)
    if handle:
        ear_mat = tin_mat
        for sx in (-1, 1):
            ear = box(f"{name}Ear{'L' if sx < 0 else 'R'}", (0.004, 0.016, 0.02),
                      loc=(sx * (r + 0.0015), 0, h - 0.04), mat=ear_mat, bevel=0.0015)
            parent(ear, root, keep=False)
        pts = []
        for i in range(41):
            t = math.pi * i / 40
            pts.append(((r + 0.006) * math.cos(t), (r + 0.006) * math.sin(t) * 1.02,
                        h - 0.04 - 0.07 * math.sin(t) ** 1.2))
        pts[0] = (r + 0.0035, 0, h - 0.04)
        pts[-1] = (-(r + 0.0035), 0, h - 0.04)
        wire = tube_from_points(f"{name}Handle", pts, 0.0016, mat=material("Wire", "#8D8A84", 0.35, 1.0))
        parent(wire, root, keep=False)
    return root


def paint_lid(name="Lid", radius=0.0875, paint=TERRACOTTA):
    """Stepped press-fit lid. When `paint` is set the underside carries a
    ring of wet paint, as when freshly lifted off the tin."""
    r = radius
    lid = lathe(name, [
        (0.0, 0.0045), (r * 0.55, 0.0045), (r * 0.58, 0.0062), (r * 0.62, 0.0062),
        (r * 0.65, 0.0045), (r - 0.0065, 0.0045), (r - 0.005, 0.0075), (r - 0.0015, 0.0078),
        (r, 0.0062), (r - 0.0006, 0.0018), (r - 0.0035, 0.0), (r - 0.0052, -0.0055),
        (r - 0.0075, -0.0058), (r - 0.0082, -0.001), (r - 0.0095, 0.0005), (0.0, 0.0005),
    ], mat=material("TinMetal", "#C9C6BF", 0.3, 1.0), segments=96)
    if paint:
        ring = lathe(f"{name}Paint", [
            (r - 0.0115, 0.00035), (r - 0.0098, -0.0003), (r - 0.0084, -0.0058),
            (r - 0.0068, -0.0066), (r - 0.0052, -0.006), (r - 0.0040, -0.0012),
        ], mat=material(f"Paint_{paint}", paint, roughness=0.16, coat=0.25), segments=96)
        parent(ring, lid, keep=False)
    return lid


# ------------------------------------------------------------ colour fan

FAN_CARDS = [
    ["calce-antica", "lino-grezzo", "sabbia-del-lido"],
    ["ocra-veneziana", "giallo-zafferano"],
    ["rosa-intonaco", "terracotta", "mattone"],
    ["verde-lichene", "salvia", "verde-bottiglia"],
    ["azzurro-burano", "blu-laguna"],
    ["grigio-laguna", "antracite"],
    ["rosa-intonaco", "rosso-veneziano"],
]


def card_shades(ids):
    """Five stripes per card, light to deep, derived from palette colours."""
    base = [PALETTE[i] for i in ids]
    deep = base[-1]
    light = mix(base[0], "#FFFFFF", 0.55)
    stops = [light] + base
    out = []
    for k in range(5):
        t = k / 4 * (len(stops) - 1)
        i = min(int(t), len(stops) - 2)
        out.append(mix(stops[i], stops[i + 1], t - i))
    out[-1] = deep
    return out


def card_mesh(name, length=0.2, width=0.046, thick=0.0012, stripes=5, label_len=0.036):
    """Rounded-corner card subdivided into colour stripes (one material slot
    each). Card points along +Y from a pivot hole at the origin."""
    bm = bmesh.new()
    corner = 0.004
    segs = 4
    outline = []

    def arc(cx, cy, a0):
        for s in range(segs + 1):
            a = math.radians(a0 + 90 * s / segs)
            outline.append((cx + corner * math.cos(a), cy + corner * math.sin(a)))

    y0, y1 = -0.012, length - 0.012
    hw = width / 2
    arc(hw - corner, y0 + corner, -90)
    arc(hw - corner, y1 - corner, 0)
    arc(-hw + corner, y1 - corner, 90)
    arc(-hw + corner, y0 + corner, 180)
    verts = [bm.verts.new((x, y, 0)) for x, y in outline]
    face = bm.faces.new(verts)
    ext = bmesh.ops.extrude_face_region(bm, geom=[face])
    for v in [e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)]:
        v.co.z += thick
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    # cut stripes along Y
    cuts = [y0 + label_len + (y1 - y0 - label_len) * k / stripes for k in range(stripes)]
    for y in cuts:
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:],
                               plane_co=(0, y, 0), plane_no=(0, 1, 0))
    bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 4 and abs(f.normal.z) > 0.5])
    obj = mesh_from_bmesh(name, bm)
    for p in obj.data.polygons:
        cy = p.center.y
        idx = 0
        for k, y in enumerate(cuts):
            if cy > y:
                idx = k + 1
        p.material_index = idx
    return obj


def colour_fan(name="Fan", angles=None, loc=(0, 0, 0), rot_z=0.0):
    angles = angles or [-58, -42, -27, -12, 3, 18, 33]
    root = empty(name, loc)
    root.rotation_euler = (0, 0, rot_z)
    paper = material("CardPaper", "#FBF8F2", roughness=0.75)
    for i, ids in enumerate(FAN_CARDS[:len(angles)]):
        card = card_mesh(f"Card_{i}")
        card.data.materials.append(paper)
        for k, hx in enumerate(card_shades(ids)):
            card.data.materials.append(material(f"Swatch_{hx}", hx, roughness=0.62))
        card.location = (0, 0, i * 0.00125)
        card.rotation_euler = (0, 0, math.radians(angles[i]))
        parent(card, root, keep=False)
    rivet = lathe(f"{name}Rivet", [(0.0, 0.0115), (0.0032, 0.0113), (0.0042, 0.0098), (0.0042, -0.001), (0.0, -0.001)],
                  mat=material("Brass", "#B8955A", roughness=0.28, metallic=1.0), segments=32)
    parent(rivet, root, keep=False)
    return root


# ------------------------------------------------------------ tools

def roller(name="Roller", cover="#EFE9DD", paint=None, loc=(0, 0, 0), rot=(0, 0, 0)):
    root = empty(name, loc)
    root.rotation_euler = rot
    nap = material(f"RollerNap_{paint or cover}", paint or cover, roughness=0.95, sheen=0.6,
                   bump=0.6, bump_scale=900)
    sleeve = cylinder(f"{name}Sleeve", 0.026, 0.18, rot=(0, math.pi / 2, 0), mat=nap, bevel=0.006)
    parent(sleeve, root, keep=False)
    metal = material("Chrome", "#BFBDB8", 0.22, 1.0)
    frame = tube_from_points(f"{name}Frame", [
        (0.094, 0, 0), (0.104, 0, 0), (0.112, 0, 0.008), (0.112, 0, 0.05),
        (0.10, 0, 0.065), (0.02, 0, 0.078), (0.005, 0, 0.09), (0.0, 0, 0.11)], 0.0028, mat=metal)
    parent(frame, root, keep=False)
    grip = lathe(f"{name}Grip", [(0.0, 0.0), (0.012, 0.004), (0.0135, 0.04), (0.012, 0.10),
                                 (0.014, 0.125), (0.0, 0.13)],
                 mat=material("GripWood", "#B98E5F", 0.45), segments=48)
    grip.location = (0, 0, 0.105)
    parent(grip, root, keep=False)
    return root


def brush(name="Brush", loc=(0, 0, 0), rot=(0, 0, 0), paint=None):
    root = empty(name, loc)
    root.rotation_euler = rot
    handle = lathe(f"{name}Handle", [(0.0, 0.0), (0.006, 0.002), (0.009, 0.03), (0.0075, 0.10),
                                     (0.0105, 0.135), (0.0, 0.142)],
                   mat=material("BrushWood", "#C49A6C", 0.42), segments=40)
    handle.scale = (1.0, 0.55, 1.0)
    parent(handle, root, keep=False)
    ferrule = box(f"{name}Ferrule", (0.05, 0.013, 0.03), loc=(0, 0, -0.012),
                  mat=material("Chrome", "#BFBDB8", 0.22, 1.0), bevel=0.004)
    parent(ferrule, root, keep=False)
    bristle = box(f"{name}Bristles", (0.047, 0.011, 0.05), loc=(0, 0, -0.05),
                  mat=material(f"Bristle_{paint or 'raw'}", paint or "#E2D3B4", 0.85, bump=0.4, bump_scale=400),
                  bevel=0.003)
    parent(bristle, root, keep=False)
    return root


def trowel(name="Trowel", loc=(0, 0, 0), rot=(0, 0, 0)):
    root = empty(name, loc)
    root.rotation_euler = rot
    blade = box(f"{name}Blade", (0.24, 0.10, 0.0016), mat=material("Steel", "#C8C7C2", 0.26, 1.0), bevel=0.0007)
    parent(blade, root, keep=False)
    post = box(f"{name}Post", (0.012, 0.012, 0.03), loc=(0.02, 0, 0.016), mat=material("Steel", "#C8C7C2"), bevel=0.002)
    parent(post, root, keep=False)
    grip = lathe(f"{name}Grip", [(0.0, -0.06), (0.012, -0.056), (0.015, 0.0), (0.012, 0.056), (0.0, 0.06)],
                 mat=material("GripWood", "#B98E5F", 0.45), segments=40)
    grip.rotation_euler = (0, math.pi / 2, 0)
    grip.location = (0.0, 0, 0.042)
    parent(grip, root, keep=False)
    return root


# ------------------------------------------------------------ architecture

def arch_slab(name, width, height, depth, mat, loc=(0, 0, 0), segments=48):
    """Rectangle topped by a semicircle, extruded along Y."""
    bm = bmesh.new()
    rad = width / 2
    pts = [(-rad, 0), (rad, 0)]
    for i in range(segments + 1):
        a = math.pi * i / segments
        pts.append((rad * math.cos(a), height - rad + rad * math.sin(a)))
    verts = [bm.verts.new((x, 0, z)) for x, z in pts]
    face = bm.faces.new(verts)
    ext = bmesh.ops.extrude_face_region(bm, geom=[face])
    for v in [e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)]:
        v.co.y += depth
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    obj = mesh_from_bmesh(name, bm)
    obj.location = loc
    m = obj.modifiers.new("Bevel", "BEVEL")
    m.width = 0.004
    m.segments = 3
    m.limit_method = "ANGLE"
    smooth(obj, 40)
    assign(obj, mat)
    return obj


def room_shell(name, width, depth, height, wall_mat, floor_mat, side_mat=None, ceiling=True,
               skirting_mat=None, left_window=None):
    """Back wall (y=depth), left/right walls and floor. Walls are thick boxes
    so the lighting has convincing occlusion. `left_window` = (y0,y1,z0,z1)
    leaves an opening in the left wall."""
    side_mat = side_mat or wall_mat
    objs = {}
    t = 0.12
    objs["floor"] = box(f"{name}Floor", (width + 2, depth + 2, t), loc=(0, depth / 2 - 0.5, -t / 2),
                        mat=floor_mat, bevel=0)
    objs["back"] = box(f"{name}BackWall", (width + 2 * t, t, height), loc=(0, depth + t / 2, height / 2),
                       mat=wall_mat, bevel=0)
    if left_window:
        y0, y1, z0, z1 = left_window
        x = -width / 2 - t / 2
        parts = [
            ((t, y0 + 1.0, height), (x, (y0 - 1.0) / 2, height / 2)),
            ((t, depth - y1, height), (x, (y1 + depth) / 2, height / 2)),
            ((t, y1 - y0, z0), (x, (y0 + y1) / 2, z0 / 2)),
            ((t, y1 - y0, height - z1), (x, (y0 + y1) / 2, (z1 + height) / 2)),
        ]
        for i, (s, loc) in enumerate(parts):
            box(f"{name}LeftWall{i}", s, loc=loc, mat=side_mat, bevel=0)
        # mullions
        mull = material("WindowFrame", "#E9E4DA", 0.5)
        for k in range(1, 3):
            yy = y0 + (y1 - y0) * k / 3
            box(f"{name}Mullion{k}", (0.03, 0.03, z1 - z0), loc=(x, yy, (z0 + z1) / 2), mat=mull, bevel=0)
        box(f"{name}Transom", (0.03, y1 - y0, 0.03), loc=(x, (y0 + y1) / 2, z0 + (z1 - z0) * 0.68), mat=mull, bevel=0)
    else:
        objs["left"] = box(f"{name}LeftWall", (t, depth + 1, height), loc=(-width / 2 - t / 2, depth / 2 - 0.5, height / 2),
                           mat=side_mat, bevel=0)
    objs["right"] = box(f"{name}RightWall", (t, depth + 1, height), loc=(width / 2 + t / 2, depth / 2 - 0.5, height / 2),
                        mat=side_mat, bevel=0)
    if ceiling:
        objs["ceiling"] = box(f"{name}Ceiling", (width + 2, depth + 2, t), loc=(0, depth / 2 - 0.5, height + t / 2),
                              mat=material("Ceiling", "#F3EFE7", 0.9), bevel=0)
    if skirting_mat:
        objs["skirting"] = box(f"{name}Skirting", (width, 0.018, 0.09), loc=(0, depth - 0.009, 0.045),
                               mat=skirting_mat, bevel=0.002)
    return objs


def oak_floor(name="Oak", color="#B38B62"):
    """Plank pattern via a brick texture driving colour + bump (render only)."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = 0.42
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (0.55, 4.2, 1)
    nt.links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    brick = nt.nodes.new("ShaderNodeTexBrick")
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Mortar Size"].default_value = 0.004
    brick.inputs["Color1"].default_value = hex_rgb(color)
    brick.inputs["Color2"].default_value = hex_rgb(mix(color, "#6E4E33", 0.25))
    brick.inputs["Mortar"].default_value = hex_rgb("#5C4430")
    brick.offset = 0.37
    brick.squash = 1.0
    nt.links.new(mapping.outputs["Vector"], brick.inputs["Vector"])
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.inputs["Scale"].default_value = 3.0
    wave.inputs["Distortion"].default_value = 6.0
    wave.inputs["Detail"].default_value = 4.0
    nt.links.new(mapping.outputs["Vector"], wave.inputs["Vector"])
    mixn = nt.nodes.new("ShaderNodeMixRGB")
    mixn.blend_type = "MULTIPLY"
    mixn.inputs["Fac"].default_value = 0.22
    nt.links.new(brick.outputs["Color"], mixn.inputs[1])
    nt.links.new(wave.outputs["Color"], mixn.inputs[2])
    nt.links.new(mixn.outputs["Color"], b.inputs["Base Color"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.25
    nt.links.new(brick.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return mat


# ------------------------------------------------------------ furniture

def sofa(name, fabric, loc=(0, 0, 0), width=2.0, rot_z=0.0, leg="#6B4F38"):
    root = empty(name, loc)
    root.rotation_euler = (0, 0, rot_z)
    fab = material(f"Fabric_{fabric}", fabric, roughness=0.92, sheen=0.5, bump=0.25, bump_scale=500)
    d = 0.9
    parts = [
        ("Base", (width, d, 0.2), (0, 0, 0.2)),
        ("Back", (width, 0.2, 0.42), (0, d / 2 - 0.1, 0.5)),
        ("ArmL", (0.18, d, 0.32), (-width / 2 + 0.09, 0, 0.46)),
        ("ArmR", (0.18, d, 0.32), (width / 2 - 0.09, 0, 0.46)),
    ]
    for n, s, l in parts:
        parent(box(f"{name}{n}", s, loc=l, mat=fab, bevel=0.05, segments=5), root, keep=False)
    cw = (width - 0.36) / 2
    for i in (-1, 1):
        parent(box(f"{name}Seat{i}", (cw - 0.01, d - 0.24, 0.16), loc=(i * cw / 2, -0.08, 0.38),
                   mat=fab, bevel=0.06, segments=6), root, keep=False)
        parent(box(f"{name}Cush{i}", (cw - 0.04, 0.2, 0.42), loc=(i * cw / 2, d / 2 - 0.27, 0.66),
                   mat=fab, bevel=0.08, segments=6, rot=(math.radians(-12), 0, 0)), root, keep=False)
    legm = material(f"Wood_{leg}", leg, 0.5)
    for sx in (-1, 1):
        for sy in (-1, 1):
            parent(cylinder(f"{name}Leg", 0.02, 0.1, loc=(sx * (width / 2 - 0.08), sy * (d / 2 - 0.08), 0.05), mat=legm),
                   root, keep=False)
    return root


def coffee_table(name, loc, top="#B38B62", radius=0.42):
    root = empty(name, loc)
    wood = material(f"Wood_{top}", top, 0.45)
    parent(cylinder(f"{name}Top", radius, 0.04, loc=(0, 0, 0.36), mat=wood, bevel=0.012, segments=96), root, keep=False)
    parent(cylinder(f"{name}Base", radius * 0.45, 0.34, loc=(0, 0, 0.17), mat=wood, bevel=0.01, segments=64), root, keep=False)
    return root


def vase(name, loc, color, height=0.3, width=0.09, rough=0.35):
    prof = [(0.0, 0.0), (width * 0.7, 0.0), (width, height * 0.25), (width * 0.95, height * 0.55),
            (width * 0.45, height * 0.82), (width * 0.38, height * 0.97), (width * 0.42, height),
            (width * 0.34, height), (width * 0.3, height * 0.85)]
    return lathe(name, prof, loc=loc, mat=material(f"Ceramic_{color}", color, rough, coat=0.3))


def floor_lamp(name, loc, shade="#EFE6D6"):
    root = empty(name, loc)
    metal = material("Brass", "#B8955A", 0.28, 1.0)
    parent(cylinder(f"{name}Foot", 0.14, 0.02, loc=(0, 0, 0.01), mat=metal, bevel=0.006), root, keep=False)
    parent(cylinder(f"{name}Stem", 0.01, 1.4, loc=(0, 0, 0.71), mat=metal), root, keep=False)
    sh = lathe(f"{name}Shade", [(0.12, 0.0), (0.2, 0.0), (0.16, 0.28), (0.1, 0.28)],
               loc=(0, 0, 1.3), mat=material(f"Shade_{shade}", shade, 0.9, subsurface=0.0))
    parent(sh, root, keep=False)
    return root


def plant(name, loc, pot="#BE7156", leaf="#5E7354", height=1.1, leaves=26, seed=3):
    import random
    rnd = random.Random(seed)
    root = empty(name, loc)
    parent(lathe(f"{name}Pot", [(0.0, 0.0), (0.13, 0.0), (0.17, 0.32), (0.155, 0.32), (0.0, 0.3)],
                 mat=material(f"Pot_{pot}", pot, 0.8, bump=0.3, bump_scale=120)), root, keep=False)
    leafm = material(f"Leaf_{leaf}", leaf, 0.55, subsurface=0.1)
    stemm = material("Stem", "#4E5E44", 0.6)
    for i in range(leaves):
        ang = rnd.uniform(0, math.tau)
        hgt = rnd.uniform(0.45, 1.0) * height
        lean = rnd.uniform(0.12, 0.45)
        tip = (math.cos(ang) * lean, math.sin(ang) * lean, 0.3 + hgt)
        mid = (tip[0] * 0.4, tip[1] * 0.4, 0.3 + hgt * 0.6)
        tube_from_points(f"{name}Stem{i}", [(0, 0, 0.3), mid, tip], 0.005, mat=stemm, resolution=2).parent = root
        # leaf: flattened ellipse
        bm = bmesh.new()
        bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=8, radius=1.0)
        for v in bm.verts:
            v.co.x *= 0.07
            v.co.y *= 0.16
            v.co.z *= 0.008
        lf = mesh_from_bmesh(f"{name}Leaf{i}", bm)
        smooth(lf, 80)
        assign(lf, leafm)
        lf.location = (tip[0] + math.cos(ang) * 0.12, tip[1] + math.sin(ang) * 0.12, tip[2] + 0.02)
        lf.rotation_euler = (rnd.uniform(-0.6, 0.6), rnd.uniform(-0.5, 0.5), ang - math.pi / 2)
        lf.parent = root
    return root


def frame_art(name, loc, size, colors, rot=(math.pi / 2, 0, 0), frame="#2C2B27"):
    """A simple framed print of flat colour blocks (an abstract composition)."""
    root = empty(name, loc)
    root.rotation_euler = rot
    w, h = size
    parent(box(f"{name}Frame", (w, h, 0.025), mat=material(f"Frame_{frame}", frame, 0.5), bevel=0.003), root, keep=False)
    parent(box(f"{name}Mat", (w - 0.04, h - 0.04, 0.026), mat=material("PaperMat", "#F7F3EA", 0.85), bevel=0.0), root, keep=False)
    n = len(colors)
    for i, c in enumerate(colors):
        cw = (w - 0.16) / n
        parent(box(f"{name}Block{i}", (cw * 0.9, (h - 0.2) * (0.55 + 0.4 * ((i * 7) % 3) / 2), 0.027),
                   loc=(-(w - 0.16) / 2 + cw * (i + 0.5), -0.02 * i, 0.0),
                   mat=material(f"Print_{c}", c, 0.8), bevel=0.0), root, keep=False)
    return root


def books(name, loc, count=8, palette=("#C7A35D", "#879480", "#BE7156", "#E9E2D2", "#4F6E7E", "#3A3C38"), seed=1):
    import random
    rnd = random.Random(seed)
    root = empty(name, loc)
    x = 0.0
    for i in range(count):
        t = rnd.uniform(0.022, 0.045)
        hgt = rnd.uniform(0.19, 0.27)
        c = palette[i % len(palette)]
        parent(box(f"{name}B{i}", (t, 0.16, hgt), loc=(x + t / 2, 0, hgt / 2), mat=material(f"Book_{c}", c, 0.7),
                   bevel=0.002), root, keep=False)
        x += t + 0.002
    return root
