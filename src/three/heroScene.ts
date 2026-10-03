import {
  ACESFilmicToneMapping,
  Box3,
  AgXToneMapping,
  Color,
  DoubleSide,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShadowMaterial,
  VSMShadowMap,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { COLOUR_EVENT } from '../data/palette';

export interface HeroSceneOptions {
  reducedMotion: boolean;
  onReady: () => void;
  onLost?: () => void;
  modelUrl?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Hero composition modelled procedurally in Blender (blender/hero.py) and
 * exported as public/models/hero.glb, including its camera.
 */
export async function createHeroScene(container: HTMLElement, opts: HeroSceneOptions) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = AgXToneMapping ?? ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = VSMShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.95;

  const gltf = await new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .loadAsync(opts.modelUrl ?? '/models/hero.glb');
  const root = gltf.scene;
  scene.add(root);
  root.updateMatrixWorld(true);

  // ---------------------------------------------------------------- camera
  const src = gltf.cameras[0] as PerspectiveCamera | undefined;
  const camera = new PerspectiveCamera(src?.fov ?? 32, 4 / 5, 0.05, 20);
  const basePos = new Vector3(0.13, 0.6, 1.6);
  if (src) {
    src.updateMatrixWorld(true);
    src.getWorldPosition(basePos);
  }
  const target = new Vector3(0.01, 0.205, -0.05); // matches blender/hero.py look-at
  camera.position.copy(basePos);
  camera.lookAt(target);
  const offset = basePos.clone().sub(target);

  // ---------------------------------------------------------------- lights
  const key = new DirectionalLight(0xfff0dd, 1.9);
  key.position.set(-1.1, 0.95, 0.55);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 9;
  key.shadow.blurSamples = 16;
  key.shadow.bias = -0.0006;
  const sc = key.shadow.camera;
  sc.left = -0.6;
  sc.right = 0.6;
  sc.top = 0.8;
  sc.bottom = -0.4;
  sc.near = 0.1;
  sc.far = 4;
  scene.add(key);
  const fill = new DirectionalLight(0xf2f0ea, 0.55);
  fill.position.set(1.1, 0.35, 0.9);
  scene.add(fill);
  const rim = new DirectionalLight(0xffe7cf, 0.8);
  rim.position.set(0.5, 1.0, -0.9);
  scene.add(rim);

  const catcher = new Mesh(new PlaneGeometry(4, 4), new ShadowMaterial({ opacity: 0.1 }));
  catcher.rotation.x = -Math.PI / 2;
  const plinth = root.getObjectByName('Plinth');
  catcher.position.y = plinth ? new Box3().setFromObject(plinth).min.y : -0.12;
  catcher.receiveShadow = true;
  scene.add(catcher);

  // -------------------------------------------------------------- materials
  const paintMats: MeshStandardMaterial[] = [];
  root.traverse((o) => {
    const m = o as Mesh;
    if (!m.isMesh) return;
    m.castShadow = true;
    m.receiveShadow = true;
    const mats = (Array.isArray(m.material) ? m.material : [m.material]) as MeshStandardMaterial[];
    for (const mat of mats) {
      if (!mat || !('roughness' in mat)) continue;
      if (mat.name.startsWith('Paint_') && !paintMats.includes(mat)) paintMats.push(mat);
      if (mat.name.startsWith('Plaster')) mat.envMapIntensity = 0.75;
      if (mat.name.startsWith('Patch_')) mat.side = DoubleSide;
      if (mat.metalness > 0.5) mat.envMapIntensity = 1.25;
    }
  });

  // ------------------------------------------------------------- fan intro
  const cards: { obj: Object3D; target: number }[] = [];
  root.traverse((o) => {
    if (/^Card_\d+$/.test(o.name)) cards.push({ obj: o, target: o.rotation.y });
  });
  cards.sort((a, b) => a.obj.name.localeCompare(b.obj.name));
  const closedAngle = cards.length ? cards[cards.length - 1].target : 0;
  const introStart = performance.now();
  const INTRO = 1600;
  if (!opts.reducedMotion) cards.forEach((c) => (c.obj.rotation.y = closedAngle));

  // ---------------------------------------------------------- colour sync
  const fromColour = new Color();
  const toColour = new Color();
  let colourT = 1;
  let colourStart = 0;
  const onColour = (e: Event) => {
    const hex = (e as CustomEvent<string>).detail;
    if (!paintMats.length || !hex) return;
    fromColour.copy(paintMats[0].color);
    toColour.set(hex);
    colourStart = performance.now();
    colourT = 0;
    if (opts.reducedMotion) {
      paintMats.forEach((m) => m.color.copy(toColour));
      colourT = 1;
    }
    requestFrame();
  };
  window.addEventListener(COLOUR_EVENT, onColour);

  // ------------------------------------------------- scroll (cinematic, no hijack)
  // As the hero scrolls away the camera orbits and dollies in on the tin.
  const section = container.closest('section') ?? container;
  const scroll = { p: 0, sp: 0 };
  const onScroll = () => {
    const r = section.getBoundingClientRect();
    scroll.p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height * 0.85)));
    requestFrame();
  };
  if (!opts.reducedMotion) window.addEventListener('scroll', onScroll, { passive: true });

  // ----------------------------------------------------------- interaction
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointer = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    pointer.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    pointer.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    requestFrame();
  };
  if (!opts.reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

  // ------------------------------------------------------------- rendering
  container.appendChild(renderer.domElement);
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    requestFrame();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  let visible = true;
  let raf = 0;
  let readyFired = false;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestFrame();
  });
  io.observe(container);
  const onVisibility = () => !document.hidden && requestFrame();
  document.addEventListener('visibilitychange', onVisibility);

  const tmp = new Vector3();
  function frame(now: number) {
    raf = 0;
    let animating = false;

    if (!opts.reducedMotion) {
      const p = Math.min(1, (now - introStart) / INTRO);
      cards.forEach((c, i) => {
        const local = Math.min(1, Math.max(0, p * 1.4 - (cards.length - 1 - i) * 0.06));
        c.obj.rotation.y = closedAngle + (c.target - closedAngle) * easeOut(local);
      });
      if (p < 1) animating = true;

      pointer.sx += (pointer.x - pointer.sx) * 0.06;
      pointer.sy += (pointer.y - pointer.sy) * 0.06;
      if (Math.abs(pointer.x - pointer.sx) > 0.001 || Math.abs(pointer.y - pointer.sy) > 0.001) animating = true;

      scroll.sp += (scroll.p - scroll.sp) * 0.1;
      const sc = scroll.sp * scroll.sp * (3 - 2 * scroll.sp); // smoothstep
      const t = now / 1000;
      const yaw = pointer.sx * 0.11 + Math.sin(t * 0.32) * 0.018 - sc * 0.55;
      const pitch = -pointer.sy * 0.05 + Math.sin(t * 0.21) * 0.008 - sc * 0.06;
      tmp.copy(offset).applyAxisAngle(new Vector3(0, 1, 0), -yaw);
      tmp.y += pitch * offset.length();
      tmp.multiplyScalar(1 - sc * 0.28);
      camera.position.copy(target).add(tmp);
      camera.position.y += sc * 0.02;
      camera.lookAt(target.x, target.y - sc * 0.05, target.z);
      animating = true; // slow idle drift
    }

    if (colourT < 1) {
      colourT = Math.min(1, (now - colourStart) / 650);
      const k = easeOut(colourT);
      paintMats.forEach((m) => m.color.copy(fromColour).lerp(toColour, k));
      animating = animating || colourT < 1;
    }

    renderer.render(scene, camera);
    if (!readyFired) {
      readyFired = true;
      opts.onReady();
    }
    if (animating) requestFrame();
  }

  function requestFrame() {
    if (raf || !visible || document.hidden) return;
    raf = requestAnimationFrame(frame);
  }

  const onLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    visible = false;
    opts.onLost?.();
  };
  renderer.domElement.addEventListener('webglcontextlost', onLost);

  resize();
  requestFrame();

  return {
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(COLOUR_EVENT, onColour);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      scene.traverse((o) => {
        const m = o as Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat: Material) => mat.dispose());
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
