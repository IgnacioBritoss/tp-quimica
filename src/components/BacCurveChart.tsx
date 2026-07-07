"use client";

interface BacCurveChartProps {
  series: { x: number; bac: number }[];
  nowX: number;
  maxX: number;
}

const WIDTH = 600;
const HEIGHT = 220;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

export function BacCurveChart({ series, nowX, maxX }: BacCurveChartProps) {
  const maxY = Math.max(0.6, ...series.map((p) => p.bac)) * 1.15;
  const spanX = Math.max(maxX, 1);

  const toSvgX = (x: number) => PAD_LEFT + (x / spanX) * (WIDTH - PAD_LEFT - PAD_RIGHT);
  const toSvgY = (y: number) => HEIGHT - PAD_BOTTOM - (y / maxY) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

  const path = series
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toSvgX(p.x).toFixed(1)} ${toSvgY(p.bac).toFixed(1)}`)
    .join(" ");

  // alcoholemia "ahora" (interpolada al punto mas cercano a nowX)
  const nowPoint = series.reduce(
    (best, p) => (Math.abs(p.x - nowX) < Math.abs(best.x - nowX) ? p : best),
    series[0] ?? { x: 0, bac: 0 }
  );
  const cx = toSvgX(nowX);
  const cy = toSvgY(nowPoint.bac);

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
        tiempo (desde el primer trago)
      </text>

      {series.length > 1 && (
        <>
          <path
            d={`${path} L ${toSvgX(series[series.length - 1].x).toFixed(1)} ${HEIGHT - PAD_BOTTOM} L ${PAD_LEFT} ${
              HEIGHT - PAD_BOTTOM
            } Z`}
            fill="var(--brand)"
            fillOpacity={0.14}
            stroke="none"
          />
          <path d={path} fill="none" stroke="var(--brand)" strokeWidth={2.5} />
        </>
      )}

      {/* marca de "ahora" */}
      <line
        x1={cx}
        y1={PAD_TOP}
        x2={cx}
        y2={HEIGHT - PAD_BOTTOM}
        stroke="var(--muted)"
        strokeDasharray="3 3"
        strokeOpacity={0.5}
      />
      <text x={cx + 3} y={PAD_TOP + 10} fontSize={9} fill="var(--muted)">
        ahora
      </text>
      <circle cx={cx} cy={cy} r={4.5} fill="var(--surface)" stroke="var(--brand)" strokeWidth={2} />
    </svg>
  );
}
