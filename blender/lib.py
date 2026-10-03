"""Shared helpers for the procedural Arte Colore Blender scenes.

Every asset on the website is generated from these scripts: nothing is
downloaded or traced from third-party sources. Run through `build-all.sh`.
"""
import math
import os

import bmesh
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_RENDERS = os.path.join(HERE, "out")
OUT_PUBLIC = os.path.join(ROOT, "public")
FONT_DISPLAY = os.path.join(HERE, "fonts", "InstrumentSerif-Regular.ttf")
FONT_SANS = os.path.join(HERE, "fonts", "HankenGrotesk-SemiBold.ttf")

os.makedirs(OUT_RENDERS, exist_ok=True)


def hex_rgb(h, alpha=None):
    """sRGB hex -> linear RGB(A) tuple for Blender colour sockets."""
    h = h.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0 if alpha is None else alpha)


# ---------------------------------------------------------------- scene

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    return scene


def setup_render(width, height, samples=160, transparent=False, exposure=0.0):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.02
    scene.cycles.use_denoising = False
    scene.cycles.max_bounces = 6
    scene.cycles.diffuse_bounces = 3
    scene.cycles.glossy_bounces = 3
    scene.cycles.transmission_bounces = 4
    scene.cycles.sample_clamp_indirect = 3.0
    scene.cycles.blur_glossy = 1.0
    scene.cycles.caustics_reflective = False
    scene.cycles.caustics_refractive = False
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = transparent
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA" if transparent else "RGB"
    scene.render.image_settings.color_depth = "8"
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = exposure
    scene.render.threads_mode = "AUTO"
    return scene


def world(color="#F5F1E9", strength=0.35):
    w = bpy.data.worlds.new("World")
    bpy.context.scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = hex_rgb(color)
    bg.inputs["Strength"].default_value = strength
    return w


def render(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print("RENDERED", path)


def camera(loc, target, lens=50, name="Camera", sensor=36):
    cam_data = bpy.data.cameras.new(name)
    cam_data.lens = lens
    cam_data.sensor_width = sensor
    cam = bpy.data.objects.new(name, cam_data)
    bpy.context.collection.objects.link(cam)
    cam.location = loc
    look_at(cam, target)
    bpy.context.scene.camera = cam
    return cam


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def area_light(name, loc, target, size=1.0, energy=200, color="#FFF4E6", size_y=None):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = hex_rgb(color)[:3]
    if size_y:
        data.shape = "RECTANGLE"
        data.size = size
        data.size_y = size_y
    else:
        data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    look_at(obj, target)
    return obj


def sun(name, rotation_deg, energy=3.0, angle_deg=3.0, color="#FFF1DC"):
    data = bpy.data.lights.new(name, "SUN")
    data.energy = energy
    data.angle = math.radians(angle_deg)
    data.color = hex_rgb(color)[:3]
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.rotation_euler = [math.radians(a) for a in rotation_deg]
    return obj


# ------------------------------------------------------------- materials

def _bsdf(mat):
    return mat.node_tree.nodes["Principled BSDF"]


def _set(node, name, value):
    if name in node.inputs:
        node.inputs[name].default_value = value


def material(name, color, roughness=0.6, metallic=0.0, coat=0.0, sheen=0.0,
             bump=0.0, bump_scale=60.0, subsurface=0.0, specular=0.5):
    """Principled material. `bump` adds a fine procedural plaster/paper tooth
    that only affects the Cycles renders (glTF export ignores it)."""
    mat = bpy.data.materials.get(name)
    if mat:
        return mat
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    b = _bsdf(mat)
    _set(b, "Base Color", hex_rgb(color) if isinstance(color, str) else color)
    _set(b, "Roughness", roughness)
    _set(b, "Metallic", metallic)
    _set(b, "Coat Weight", coat)
    _set(b, "Coat Roughness", 0.08)
    _set(b, "Sheen Weight", sheen)
    _set(b, "Subsurface Weight", subsurface)
    _set(b, "Specular IOR Level", specular)
    mat.diffuse_color = hex_rgb(color) if isinstance(color, str) else color
    if bump > 0:
        nt = mat.node_tree
        noise = nt.nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = bump_scale
        noise.inputs["Detail"].default_value = 8.0
        noise.inputs["Roughness"].default_value = 0.62
        bmp = nt.nodes.new("ShaderNodeBump")
        bmp.inputs["Strength"].default_value = bump
        bmp.inputs["Distance"].default_value = 0.02
        nt.links.new(noise.outputs["Fac"], bmp.inputs["Height"])
        nt.links.new(bmp.outputs["Normal"], b.inputs["Normal"])
    return mat


def emission_material(name, color="#FFFFFF", strength=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = hex_rgb(color)
    em.inputs["Strength"].default_value = strength
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(em.outputs[0], out.inputs[0])
    return mat


def holdout_material(name="Holdout"):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    h = nt.nodes.new("ShaderNodeHoldout")
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(h.outputs[0], out.inputs[0])
    return mat


def assign(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj


# -------------------------------------------------------------- modelling

def _link(obj):
    bpy.context.collection.objects.link(obj)
    return obj


def mesh_from_bmesh(name, bm):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    return _link(bpy.data.objects.new(name, me))


def box(name, size, loc=(0, 0, 0), mat=None, bevel=0.004, segments=3, rot=(0, 0, 0)):
    """Axis-aligned box with soft bevelled edges. size = full dimensions."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
        v.co.z *= size[2]
    obj = mesh_from_bmesh(name, bm)
    obj.location = loc
    obj.rotation_euler = rot
    if bevel > 0:
        m = obj.modifiers.new("Bevel", "BEVEL")
        m.width = bevel
        m.segments = segments
        m.limit_method = "ANGLE"
        m.harden_normals = False
    smooth(obj)
    if mat:
        assign(obj, mat)
    return obj


def lathe(name, profile, segments=96, loc=(0, 0, 0), mat=None, closed=False):
    """Spin a (radius, z) polyline around Z. Produces smooth surfaces of
    revolution: tins, lids, vases, lamp shades."""
    bm = bmesh.new()
    verts = [bm.verts.new((r, 0.0, z)) for r, z in profile]
    edges = [bm.edges.new((verts[i], verts[i + 1])) for i in range(len(verts) - 1)]
    if closed:
        edges.append(bm.edges.new((verts[-1], verts[0])))
    bmesh.ops.spin(bm, geom=verts + edges, cent=(0, 0, 0), axis=(0, 0, 1),
                   angle=math.tau, steps=segments, use_merge=True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    obj = mesh_from_bmesh(name, bm)
    obj.location = loc
    smooth(obj, angle=50)
    if mat:
        assign(obj, mat)
    return obj


def cylinder(name, radius, depth, loc=(0, 0, 0), mat=None, segments=64, bevel=0.0, rot=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius, radius2=radius, depth=depth)
    obj = mesh_from_bmesh(name, bm)
    obj.location = loc
    obj.rotation_euler = rot
    if bevel:
        m = obj.modifiers.new("Bevel", "BEVEL")
        m.width = bevel
        m.segments = 3
        m.limit_method = "ANGLE"
    smooth(obj, angle=40)
    if mat:
        assign(obj, mat)
    return obj


def plane(name, size, loc=(0, 0, 0), rot=(0, 0, 0), mat=None):
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
    obj = mesh_from_bmesh(name, bm)
    obj.location = loc
    obj.rotation_euler = rot
    if mat:
        assign(obj, mat)
    return obj


def smooth(obj, angle=35):
    for p in obj.data.polygons:
        p.use_smooth = True
    if hasattr(obj.data, "set_sharp_from_angle"):  # Blender 4.1+
        obj.data.set_sharp_from_angle(angle=math.radians(angle))
    else:  # Blender 4.0
        obj.data.use_auto_smooth = True
        obj.data.auto_smooth_angle = math.radians(angle)


def tube_from_points(name, points, radius, mat=None, resolution=6):
    """Bevelled curve converted to mesh: wire handles, lamp stems, frames."""
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = resolution
    cu.use_fill_caps = True
    sp = cu.splines.new("POLY")
    sp.points.add(len(points) - 1)
    for p, co in zip(sp.points, points):
        p.co = (*co, 1.0)
    obj = _link(bpy.data.objects.new(name, cu))
    to_mesh(obj)
    smooth(obj, 60)
    if mat:
        assign(obj, mat)
    return obj


def to_mesh(obj):
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    return obj


def apply_modifiers(obj):
    bpy.context.view_layer.objects.active = obj
    for m in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=m.name)


def text_mesh(name, body, font_path, size, align="CENTER", extrude=0.0, spacing=1.0):
    font = bpy.data.fonts.load(font_path, check_existing=True)
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    cu.font = font
    cu.size = size
    cu.align_x = align
    cu.align_y = "CENTER"
    cu.extrude = extrude
    cu.space_character = spacing
    cu.resolution_u = 4
    obj = _link(bpy.data.objects.new(name, cu))
    to_mesh(obj)
    return obj


def wrap_on_cylinder(obj, radius, center_angle=0.0):
    """Bend a flat (XY) text mesh around a vertical cylinder facing -Y.
    x -> arc length, y -> height."""
    me = obj.data
    for v in me.vertices:
        x, y, z = v.co
        a = x / radius + center_angle
        r = radius + z
        v.co = (r * math.sin(a), -r * math.cos(a), y)
    me.update()
    return obj


def parent(child, par, keep=True):
    child.parent = par
    if keep:
        child.matrix_parent_inverse = par.matrix_world.inverted()


def empty(name, loc=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    obj.location = loc
    return _link(obj)


def set_origin(obj, point):
    """Move object origin to world `point` without moving the geometry."""
    bpy.context.view_layer.update()
    mw = obj.matrix_world.copy()
    local = mw.inverted() @ Vector(point)
    obj.data.transform(__import__("mathutils").Matrix.Translation(-local))
    obj.matrix_world = mw @ __import__("mathutils").Matrix.Translation(local)
