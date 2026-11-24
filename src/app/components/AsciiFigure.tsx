"use client";

import { useEffect, useRef, useState } from "react";
import { YEOUIDO_CHARS, YEOUIDO_LEVELS } from "./yeouido";

/* The animated figure at the top of the homepage. Each scene is drawn into an
   88 x 26 grid of characters every frame. A refresh picks a scene you haven't
   seen yet (like a shuffled deck), and #rings, #galaxy, #waves or #yeouido in
   the URL opens that one directly. */

const W = 88;
const H = 26;
const RAMP = " .,-~:;=!*#$@";
const KEYS = ["rings", "galaxy", "waves", "yeouido"] as const;
const NAMES = [
  "two rings, interlocked",
  "a spiral galaxy",
  "two sources, interfering",
  "yeouido, from the han river",
];
const HISTORY_KEY = "asciiSceneHistory";
const YEOUIDO_ROWS = YEOUIDO_CHARS.split("\n");

type Mouse = { x: number; y: number; on: boolean };

function remember(scene: number) {
  try {
    const seen: number[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]").filter(
      (i: number) => i !== scene,
    );
    seen.push(scene);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(seen.slice(-(NAMES.length - 1))));
  } catch {
    /* storage can be blocked; the rotation just becomes random */
  }
}

function pickScene(): number {
  const fromHash = KEYS.indexOf(window.location.hash.replace("#", "") as (typeof KEYS)[number]);
  if (fromHash >= 0) return fromHash;
  let seen: number[] = [];
  try {
    seen = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {}
  const all = NAMES.map((_, i) => i);
  const fresh = all.filter((i) => !seen.includes(i));
  const pool = fresh.length ? fresh : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

function frame(s: number, t: number, m: Mouse, sinceStart: number, reduce: boolean): string {
  const out: string[] = new Array(W * H).fill(" ");
  const z = new Float32Array(W * H);
  const put = (x: number, y: number, depth: number, l: number) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const i = (y | 0) * W + (x | 0);
    if (depth > z[i]) {
      z[i] = depth;
      out[i] = RAMP[Math.max(1, Math.min(RAMP.length - 1, Math.round(l * (RAMP.length - 1))))];
    }
  };

  if (s === 0) {
    const A = t * 0.7 + (m.on ? m.y * 1.5 : 0);
    const B = t * 0.45 + (m.on ? m.x * 2 : 0);
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
    const R1 = 0.26, R2 = 1, K2 = 4, K1 = 36;
    for (let ring = 0; ring < 2; ring++) {
      for (let th = 0; th < 6.283; th += 0.12) {
        const ct = Math.cos(th), st = Math.sin(th);
        for (let ph = 0; ph < 6.283; ph += 0.02) {
          const cp = Math.cos(ph), sp = Math.sin(ph);
          const cx = R2 + R1 * ct;
          let x = cx * cp, y = cx * sp, zz = R1 * st;
          const nx = ct * cp;
          let ny = ct * sp, nz = st;
          if (ring === 1) {
            [y, zz] = [zz, y];
            [ny, nz] = [nz, ny];
            x += R2 / 2;
          } else x -= R2 / 2;
          const y1 = y * cA - zz * sA, z1 = y * sA + zz * cA;
          const x2 = x * cB + z1 * sB, z2 = -x * sB + z1 * cB;
          const ny1 = ny * cA - nz * sA, nz1 = ny * sA + nz * cA;
          const nx2 = nx * cB + nz1 * sB, nz2 = -nx * sB + nz1 * cB;
          const ooz = 1 / (z2 + K2);
          const px = W / 2 + K1 * 2 * ooz * x2, py = H / 2 - K1 * ooz * y1;
          const L = nx2 * 0.3 + ny1 * 0.7 - nz2 * 0.65;
          put(px, py, ooz, Math.max(0.05, L * 0.9 + 0.1));
        }
      }
    }
  } else if (s === 1) {
    const rot = t * 0.25 + (m.on ? m.x : 0), tilt = 0.42 + (m.on ? m.y * 0.25 : 0);
    for (let i = 0; i < 2600; i++) {
      const r = Math.pow((i * 0.6180339) % 1, 0.7);
      const arm = i % 2 ? Math.PI : 0;
      const a = arm + r * 7.5 + Math.sin(i * 12.9898) * 0.35 + rot;
      const x = Math.cos(a) * r, y = Math.sin(a) * r * tilt;
      const l = Math.max(0.1, 1 - r * 0.9) * (0.6 + 0.4 * Math.abs(Math.sin(i * 78.233)));
      put(W / 2 + x * W * 0.45, H / 2 + y * H * 0.95, 1.001 - r, l);
    }
    for (let i = 0; i < 70; i++) {
      const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * W, y = (Math.sin(i * 37.3) * 0.5 + 0.5) * H;
      put(x, y, 0.001, 0.12 + (0.5 + 0.5 * Math.sin(t * 2 + i)) * 0.12);
    }
  } else if (s === 3) {
    /* drawn in left to right like a pencil sweep, then the river shimmers */
    const drawn = reduce ? 1 : Math.min(1, sinceStart / 2200);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (x > drawn * (W + 20) - 12 + Math.sin(y * 1.7) * 6) continue;
        let c = YEOUIDO_ROWS[y][x];
        const L = parseInt(YEOUIDO_LEVELS[y * W + x], 36);
        if (y >= 18 && RAMP.includes(c) && L < 11) {
          let dl = Math.sin(x * 0.45 - t * 2.2 + y * 1.3) * 1.3;
          if (m.on) {
            const dx = (x / W) * 2 - 1 - m.x, dy = (y / H) * 2 - 1 - m.y;
            const d = Math.hypot(dx * 2, dy);
            dl += Math.sin(d * 18 - t * 6) * 2.2 * Math.max(0, 1 - d * 1.6);
          }
          c = RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(L + dl)))];
        }
        out[y * W + x] = c;
      }
    }
  } else {
    const s1 = { x: 0.32, y: 0.5 };
    const s2 = m.on ? { x: m.x * 0.5 + 0.5, y: m.y * 0.5 + 0.5 } : { x: 0.68, y: 0.5 };
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const u = x / W, v = y / H;
        const d1 = Math.hypot((u - s1.x) * 2, v - s1.y), d2 = Math.hypot((u - s2.x) * 2, v - s2.y);
        const w = Math.sin(d1 * 38 - t * 3) + Math.sin(d2 * 38 - t * 3);
        const fade = Math.max(0, 1 - Math.min(d1, d2) * 0.9);
        put(x, y, 1, ((w + 2) / 4) * (0.35 + 0.65 * fade));
      }
    }
  }

  let str = "";
  for (let y = 0; y < H; y++) str += out.slice(y * W, y * W + W).join("") + "\n";
  return str;
}

export default function AsciiFigure() {
  const preRef = useRef<HTMLPreElement>(null);
  const mouse = useRef<Mouse>({ x: 0, y: 0, on: false });
  const sceneRef = useRef(0);
  const sceneAt = useRef(0);
  const [scene, setScene] = useState<number | null>(null);

  const goTo = (next: number) => {
    remember(next);
    sceneRef.current = next;
    sceneAt.current = performance.now();
    setScene(next);
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t = reduce ? 1.5 : 0;
    let last = performance.now();
    let raf = 0;
    let started = false;
    const loop = (now: number) => {
      /* pick the scene on the first frame: it needs window and localStorage */
      if (!started) {
        started = true;
        goTo(pickScene());
      }
      if (!reduce) t += Math.min(50, now - last) / 1000;
      last = now;
      if (preRef.current) {
        preRef.current.textContent = frame(sceneRef.current, t, mouse.current, now - sceneAt.current, reduce);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <figure className="m-0 mb-9 flex flex-col gap-1.5">
      <pre
        ref={preRef}
        aria-hidden="true"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mouse.current = {
            x: ((e.clientX - r.left) / r.width) * 2 - 1,
            y: ((e.clientY - r.top) / r.height) * 2 - 1,
            on: true,
          };
        }}
        onPointerLeave={() => {
          mouse.current.on = false;
        }}
        className="ascii-figure"
      />
      <figcaption className="flex justify-between gap-3 font-mono text-xs text-muted">
        <span className="truncate">
          {scene === null ? " " : `fig. ${scene + 1} — ${NAMES[scene]}`}
        </span>
        <button
          type="button"
          onClick={() => goTo(((scene ?? 0) + 1) % NAMES.length)}
          className="cursor-pointer select-none whitespace-nowrap"
        >
          refresh ↻ for another
        </button>
      </figcaption>
    </figure>
  );
}
