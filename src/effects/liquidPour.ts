/**
 * "Wet paint" pour: a WebGL2 fragment shader that floods a colour from a
 * point with a wobbling liquid edge, drips running down from the blob and
 * a glossy wet rim that dries to a flat colour as the pour completes (so the
 * hand-off to the CSS background is seamless).
 *
 * Created lazily on the first pour, renders only while pouring. Returns null
 * when WebGL2 is unavailable so callers can fall back to a CSS clip-path.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;      // canvas size in CSS px
uniform float uScale;   // device px per CSS px
uniform vec2 uOrigin;   // CSS px, top-left origin
uniform float uT;       // eased progress 0..1
uniform float uTime;    // seconds
uniform float uMaxR;    // radius that covers the canvas
uniform vec3 uColour;   // sRGB 0..1
out vec4 outColour;

float hash(float n) { return fract(sin(n) * 43758.5453123); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2(1, 0)), u.x),
             mix(hash2(i + vec2(0, 1)), hash2(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// signed distance (CSS px) to the paint surface: negative = inside
float field(vec2 p) {
  vec2 d = p - uOrigin;
  float grow = smoothstep(0.0, 0.35, uT);
  float R = uT * uMaxR * 1.12;
  float wob = (fbm(p * 0.0065 + vec2(uTime * 0.18, -uTime * 0.11)) - 0.5);
  float blob = length(d) - (R + wob * min(R, 260.0) * 0.55 * grow);

  // drips hanging from the lower half of the blob
  float colW = 34.0;
  float col = floor(p.x / colW);
  float r1 = hash(col * 1.37 + 3.1);
  float r2 = hash(col * 7.11 + 1.7);
  float cx = (col + 0.3 + 0.4 * r2) * colW;
  float dx = cx - uOrigin.x;
  float rr = R * 0.96;
  float yb = uOrigin.y + sqrt(max(rr * rr - dx * dx, 0.0));
  float on = step(0.42, r1) * step(abs(dx), rr * 0.97);
  float len = (18.0 + r2 * 120.0) * smoothstep(0.08, 0.7, uT) * on;
  float w = 3.5 + r1 * 6.0;
  float drip = sdCapsule(p, vec2(cx, yb - 12.0), vec2(cx, yb + len), w * (1.0 - 0.25 * r2));
  float bead = length(p - vec2(cx, yb + len)) - w * 1.35;
  drip = min(drip, mix(1e4, bead, on));
  return smin(blob, mix(1e4, drip, on), 14.0);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uScale - gl_FragCoord.y) / uScale;
  float s = field(p);
  float aa = 1.0 / uScale;
  float alpha = 1.0 - smoothstep(-aa, aa, s);
  if (alpha <= 0.0) { outColour = vec4(0.0); return; }

  // wet surface: a rounded bevel near the edge lit from the top-left
  float wet = 1.0 - smoothstep(0.72, 1.0, uT);
  float e = 2.0;
  vec2 g = vec2(field(p + vec2(e, 0.0)) - field(p - vec2(e, 0.0)),
                field(p + vec2(0.0, e)) - field(p - vec2(0.0, e)));
  vec2 nrm = length(g) > 0.0 ? normalize(g) : vec2(0.0);
  float rim = smoothstep(0.0, 3.0, -s) * (1.0 - smoothstep(4.0, 26.0, -s));
  vec2 light = normalize(vec2(0.6, 0.8));      // highlight on edges facing up-left
  float facing = dot(-nrm, -light);
  float hl = pow(max(facing, 0.0), 3.0) * rim;
  float shade = max(-facing, 0.0) * rim;
  // faint streaky gloss across the surface
  float streak = fbm(vec2(p.x * 0.004, p.y * 0.02) + uTime * 0.05);
  vec3 c = uColour;
  c *= 1.0 - 0.16 * shade * wet;
  c = mix(c, vec3(1.0), (0.42 * hl + 0.06 * smoothstep(0.55, 0.9, streak)) * wet);
  outColour = vec4(c * alpha, alpha);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log ?? 'shader compile failed');
  }
  return sh;
}

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255) as [number, number, number];
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export interface PourOptions {
  x: number;
  y: number;
  hex: string;
  duration?: number;
  /** fraction of the pour after which onMid fires (e.g. swap text ink) */
  midAt?: number;
  onMid?: () => void;
  onDone?: () => void;
}

export interface LiquidPour {
  pour(opts: PourOptions): void;
  finish(): void;
  dispose(): void;
}

export function createLiquidPour(host: HTMLElement): LiquidPour | null {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return null;

  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link failed');
  } catch {
    return null;
  }

  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  host.prepend(canvas);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);
  const u = (n: string) => gl.getUniformLocation(program, n);
  const U = {
    res: u('uRes'),
    scale: u('uScale'),
    origin: u('uOrigin'),
    t: u('uT'),
    time: u('uTime'),
    maxR: u('uMaxR'),
    colour: u('uColour'),
  };

  let raf = 0;
  let clearRaf = 0;
  let dims = { w: 0, h: 0, scale: 0 };
  let current: (PourOptions & { start: number; midFired: boolean }) | null = null;

  const clear = () => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const size = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    // the effect is soft: render below device resolution to stay cheap
    const scale = Math.min(window.devicePixelRatio || 1, 1) * (w * h > 1.6e6 ? 0.6 : 0.8);
    if (w !== dims.w || h !== dims.h || scale !== dims.scale) {
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      dims = { w, h, scale };
    }
    return dims;
  };

  const end = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    const done = current;
    current = null;
    if (done) {
      if (!done.midFired) done.onMid?.();
      done.onDone?.();
    }
    // the CSS background now matches: clear on the next frame (no flash)
    cancelAnimationFrame(clearRaf);
    clearRaf = requestAnimationFrame(() => !current && clear());
  };

  const frame = (now: number) => {
    if (!current) return;
    const dur = current.duration ?? 1300;
    const raw = Math.min(1, (now - current.start) / dur);
    const t = easeInOut(raw);
    const { w, h, scale } = size();
    const maxR = Math.hypot(Math.max(current.x, w - current.x), Math.max(current.y, h - current.y));
    gl.uniform2f(U.res, w, h);
    gl.uniform1f(U.scale, scale);
    gl.uniform2f(U.origin, current.x, current.y);
    gl.uniform1f(U.t, t);
    gl.uniform1f(U.time, now / 1000);
    gl.uniform1f(U.maxR, maxR);
    gl.uniform3f(U.colour, ...hexToRgb(current.hex));
    clear();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!current.midFired && raw >= (current.midAt ?? 0.6)) {
      current.midFired = true;
      current.onMid?.();
    }
    if (raw >= 1) end();
    else raf = requestAnimationFrame(frame);
  };

  return {
    pour(opts) {
      if (current) end();
      current = { ...opts, start: performance.now(), midFired: false };
      raf = requestAnimationFrame(frame);
    },
    finish() {
      if (current) end();
    },
    dispose() {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(clearRaf);
      current = null;
      gl.deleteProgram(program);
      gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
