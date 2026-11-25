"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

/* The animated figure at the top of the homepage: two robot arms hand a bar
   across a table, assemble a wheel and axle, and stack a tower. The scene is
   ray-marched in WebGL by /duet-robots.js and drawn as ASCII on a canvas.
   Click to pause. Reduced-motion users get a still frame. */

type Robots = { toggle: () => boolean; stop: () => void };
type DuetRobotsApi = {
  start: (
    canvas: HTMLCanvasElement,
    options: Record<string, unknown>,
  ) => Robots;
};

declare global {
  interface Window {
    DuetRobots?: DuetRobotsApi;
  }
}

const ARIA =
  "ASCII animation, 10 seconds, looping: two robot arms hand a bar across a table, one arm holds a wheel while the other slides an axle through it, and two arms take turns stacking one tower. Click to pause or play.";

export default function RobotFigure() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robots = useRef<Robots | null>(null);
  const lastLabel = useRef("");
  const [ready, setReady] = useState(false);
  const [state, setState] = useState({ fig: 1, label: "handover" });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ready || !canvasRef.current || !window.DuetRobots) return;
    robots.current = window.DuetRobots.start(canvasRef.current, {
      cols: 132,
      rows: 44,
      zoom: 1.45,
      ramp: " .,-~:;=!*#$@",
      lineHeight: 1.0,
      font: "ui-monospace,SFMono-Regular,Menlo,monospace",
      colors: ["#A0A5A8", "#2A2A2A", "#5E6A72"],
      onFail: () => setFailed(true),
      onTick: (_T: number, _LOOP: number, si: number, label: string) => {
        if (label !== lastLabel.current) {
          lastLabel.current = label;
          setState({ fig: si + 1, label });
        }
      },
    });
    return () => robots.current?.stop();
  }, [ready]);

  return (
    <figure className="m-0 mb-9 flex flex-col gap-1.5">
      <Script src="/duet-robots.js" strategy="afterInteractive" onReady={() => setReady(true)} />
      <button
        type="button"
        aria-label={ARIA}
        onClick={() => robots.current?.toggle()}
        className="block w-full cursor-pointer border-0 bg-transparent p-0"
      >
        <canvas ref={canvasRef} className="block w-full" />
      </button>
      {failed && <p className="my-6 text-sm text-muted">this animation needs webgl.</p>}
      <figcaption
        aria-hidden="true"
        className="truncate whitespace-nowrap font-mono text-xs text-muted"
      >
        fig. {state.fig} — {state.label}
      </figcaption>
    </figure>
  );
}
