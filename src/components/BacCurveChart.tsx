"use client";

import { useMemo } from "react";
import { bacAtHour } from "@/lib/calc";

interface BacCurveChartProps {
  peak: number;
  hoursSinceLastDrink: number;
}

const WIDTH = 600;
const HEIGHT = 220;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

export function BacCurveChart({ peak, hoursSinceLastDrink }: BacCurveChartProps) {
  const maxHours = useMemo(() => {
    const timeToZero = peak > 0 ? peak / 0.15 + 0.75 : 1;
    return Math.max(timeToZero, hoursSinceLastDrink + 1, 3);
  }, [peak, hoursSinceLastDrink]);
  const maxY = Math.max(peak * 1.2, 0.6);

  const toSvgX = (h: number) => PAD_LEFT + (h / maxHours) * (WIDTH - PAD_LEFT - PAD_RIGHT);
  const toSvgY = (y: number) => HEIGHT - PAD_BOTTOM - (y / maxY) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

  const path = useMemo(() => {
    const steps = 60;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const h = (maxHours * i) / steps;
      pts.push({ x: h, y: bacAtHour(peak, h) });
    }
    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${toSvgX(p.x).toFixed(1)} ${toSvgY(p.y).toFixed(1)}`)
      .join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peak, maxHours]);

  const currentBac = bacAtHour(peak, hoursSinceLastDrink);
  const currentPoint = { x: toSvgX(hoursSinceLastDrink), y: toSvgY(currentBac) };

  const axis = "color-mix(in srgb, var(--muted) 40%, transparent)";

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
      <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} stroke={axis} />
      <line
        x1={PAD_LEFT}
        y1={HEIGHT - PAD_BOTTOM}
        x2={WIDTH - PAD_RIGHT}
        y2={HEIGHT - PAD_BOTTOM}
        stroke={axis}
      />

      <text x={4} y={PAD_TOP + 4} fontSize={10} fill="var(--muted)">
        g/L
      </text>
      <text x={WIDTH - PAD_RIGHT} y={HEIGHT - 8} fontSize={10} fill="var(--muted)" textAnchor="end">
        horas desde el ultimo trago
      </text>

      <path
        d={`${path} L ${toSvgX(maxHours).toFixed(1)} ${HEIGHT - PAD_BOTTOM} L ${PAD_LEFT} ${
          HEIGHT - PAD_BOTTOM
        } Z`}
        fill="var(--brand)"
        fillOpacity={0.14}
        stroke="none"
      />
      <path d={path} fill="none" stroke="var(--brand)" strokeWidth={2.5} />

      <circle cx={currentPoint.x} cy={currentPoint.y} r={4.5} fill="var(--surface)" stroke="var(--brand)" strokeWidth={2} />
      <line
        x1={currentPoint.x}
        y1={currentPoint.y}
        x2={currentPoint.x}
        y2={HEIGHT - PAD_BOTTOM}
        stroke="var(--brand)"
        strokeDasharray="3 3"
        strokeOpacity={0.5}
      />
    </svg>
  );
}
