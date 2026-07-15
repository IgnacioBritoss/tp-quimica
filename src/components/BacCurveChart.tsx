"use client";

import { useRef, useState } from "react";

interface BacCurveChartProps {
  series: { x: number; bac: number }[];
  nowX: number;
  maxX: number;
  nowMs: number;
}

const WIDTH = 600;
const HEIGHT = 220;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Etiqueta corta del momento: Hoy / Ayer / Manana / dd/mm, con hora. */
function fmtMoment(ms: number, nowMs: number): string {
  const d = new Date(ms);
  const now = new Date(nowMs);
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  const tom = new Date(now); tom.setDate(now.getDate() + 1);
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (sameDay(d, now)) return `Hoy ${hm}`;
  if (sameDay(d, yest)) return `Ayer ${hm}`;
  if (sameDay(d, tom)) return `Manana ${hm}`;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${hm}`;
}

export function BacCurveChart({ series, nowX, maxX, nowMs }: BacCurveChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  // Posicion del cursor que arrastra el usuario (horas desde el inicio). null = seguir "ahora".
  const [cursorX, setCursorX] = useState<number | null>(null);

  const maxY = Math.max(0.6, ...series.map((p) => p.bac)) * 1.15;
  const spanX = Math.max(maxX, 1);

  const toSvgX = (x: number) => PAD_LEFT + (x / spanX) * (WIDTH - PAD_LEFT - PAD_RIGHT);
  const toSvgY = (y: number) => HEIGHT - PAD_BOTTOM - (y / maxY) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

  const path = series
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toSvgX(p.x).toFixed(1)} ${toSvgY(p.bac).toFixed(1)}`)
    .join(" ");

  // Alcoholemia interpolada en cualquier x.
  const bacAtX = (x: number): number => {
    if (!series.length) return 0;
    if (x <= series[0].x) return series[0].bac;
    const last = series[series.length - 1];
    if (x >= last.x) return last.bac;
    const step = spanX / (series.length - 1);
    const i = Math.min(series.length - 2, Math.max(0, Math.floor(x / step)));
    const a = series[i];
    const b = series[i + 1];
    const t = b.x === a.x ? 0 : (x - a.x) / (b.x - a.x);
    return a.bac + (b.bac - a.bac) * t;
  };

  const cx0 = cursorX == null ? nowX : Math.min(Math.max(0, cursorX), maxX);
  const cursorBac = bacAtX(cx0);
  const cursorMs = nowMs + (cx0 - nowX) * 3_600_000;
  const isNow = Math.abs(cx0 - nowX) < 0.02;
  const isFuture = cx0 > nowX + 0.02;

  const cursorSvgX = toSvgX(cx0);
  const cursorSvgY = toSvgY(cursorBac);
  const nowSvgX = toSvgX(nowX);

  function pointerToX(clientX: number): number {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return nowX;
    const svgX = (clientX - rect.left) * (WIDTH / rect.width);
    const x = ((svgX - PAD_LEFT) / (WIDTH - PAD_LEFT - PAD_RIGHT)) * spanX;
    return Math.min(Math.max(0, x), maxX);
  }
  function onMove(e: React.PointerEvent) {
    setCursorX(pointerToX(e.clientX));
  }
  function onDown(e: React.PointerEvent) {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    setCursorX(pointerToX(e.clientX));
  }

  const axis = "color-mix(in srgb, var(--muted) 40%, transparent)";

  // Caja de datos del cursor, ubicada arriba del punto y sin salirse de los bordes.
  const boxW = 96;
  const boxH = 32;
  let boxX = cursorSvgX - boxW / 2;
  boxX = Math.min(Math.max(PAD_LEFT, boxX), WIDTH - PAD_RIGHT - boxW);
  let boxY = cursorSvgY - boxH - 10;
  if (boxY < PAD_TOP) boxY = cursorSvgY + 12;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted">
          {isNow ? "Ahora mismo" : isFuture ? "En ese momento (futuro)" : "En ese momento"}
          {": "}
          <span className="text-text font-medium tabular-nums">{fmtMoment(cursorMs, nowMs)}</span>
        </span>
        <span className="tabular-nums font-semibold" style={{ color: "var(--brand)" }}>
          {cursorBac.toFixed(2)} g/L
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto select-none"
        style={{ touchAction: "none", cursor: "ew-resize" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
      >
        <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} stroke={axis} />
        <line x1={PAD_LEFT} y1={HEIGHT - PAD_BOTTOM} x2={WIDTH - PAD_RIGHT} y2={HEIGHT - PAD_BOTTOM} stroke={axis} />

        <text x={4} y={PAD_TOP + 4} fontSize={10} fill="var(--muted)">g/L</text>
        <text x={WIDTH - PAD_RIGHT} y={HEIGHT - 8} fontSize={10} fill="var(--muted)" textAnchor="end">
          arrastra para ver cada momento
        </text>

        {series.length > 1 && (
          <>
            <path
              d={`${path} L ${toSvgX(series[series.length - 1].x).toFixed(1)} ${HEIGHT - PAD_BOTTOM} L ${PAD_LEFT} ${HEIGHT - PAD_BOTTOM} Z`}
              fill="var(--brand)"
              fillOpacity={0.14}
              stroke="none"
            />
            <path d={path} fill="none" stroke="var(--brand)" strokeWidth={2.5} />
          </>
        )}

        {/* marca fija de "ahora" */}
        <line x1={nowSvgX} y1={PAD_TOP} x2={nowSvgX} y2={HEIGHT - PAD_BOTTOM} stroke="var(--muted)" strokeDasharray="3 3" strokeOpacity={0.5} />
        <text x={nowSvgX + 3} y={PAD_TOP + 10} fontSize={9} fill="var(--muted)">ahora</text>

        {/* cursor arrastrable */}
        <line x1={cursorSvgX} y1={PAD_TOP} x2={cursorSvgX} y2={HEIGHT - PAD_BOTTOM} stroke="var(--brand)" strokeWidth={1.5} strokeOpacity={0.7} />
        <g>
          <rect x={boxX} y={boxY} width={boxW} height={boxH} rx={5} fill="var(--surface)" stroke="var(--brand)" strokeWidth={1} />
          <text x={boxX + boxW / 2} y={boxY + 13} fontSize={10} fill="var(--muted)" textAnchor="middle">{fmtMoment(cursorMs, nowMs)}</text>
          <text x={boxX + boxW / 2} y={boxY + 26} fontSize={12} fontWeight={700} fill="var(--brand)" textAnchor="middle">{cursorBac.toFixed(2)} g/L</text>
        </g>
        <circle cx={cursorSvgX} cy={cursorSvgY} r={5.5} fill="var(--brand)" stroke="var(--surface)" strokeWidth={2} />
      </svg>
    </div>
  );
}
