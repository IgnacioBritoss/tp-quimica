interface LogoProps {
  className?: string;
}

/**
 * Sol de Mayo (el sol de la bandera argentina): disco con cara y 32 rayos que
 * alternan rectos y ondulados (flamigeros). Dibujado por completo en SVG.
 */
export function Logo({ className }: LogoProps) {
  const cx = 32;
  const cy = 32;
  const discR = 11;
  const rayInner = 11.2;
  const straightOuter = 30;
  const wavyOuter = 27;
  const gold = "#f4b400";
  const goldDark = "#c8791a";

  const rays: React.ReactElement[] = [];
  const count = 32;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    if (i % 2 === 0) {
      // rayo recto (triangulo fino)
      const w = 0.052;
      const x1 = cx + Math.cos(angle - w) * rayInner;
      const y1 = cy + Math.sin(angle - w) * rayInner;
      const x2 = cx + Math.cos(angle + w) * rayInner;
      const y2 = cy + Math.sin(angle + w) * rayInner;
      const xt = cx + Math.cos(angle) * straightOuter;
      const yt = cy + Math.sin(angle) * straightOuter;
      rays.push(
        <path
          key={i}
          d={`M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${xt.toFixed(2)} ${yt.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} Z`}
          fill={gold}
          stroke={goldDark}
          strokeWidth={0.4}
          strokeLinejoin="round"
        />
      );
    } else {
      // rayo ondulado (flama)
      const bx = cx + Math.cos(angle) * rayInner;
      const by = cy + Math.sin(angle) * rayInner;
      const tx = cx + Math.cos(angle) * wavyOuter;
      const ty = cy + Math.sin(angle) * wavyOuter;
      const perp = angle + Math.PI / 2;
      const off = 2.1;
      const midR = (rayInner + wavyOuter) / 2;
      const mx = cx + Math.cos(angle) * midR;
      const my = cy + Math.sin(angle) * midR;
      // dos curvas para dar forma de S / llama
      const c1x = mx + Math.cos(perp) * off;
      const c1y = my + Math.sin(perp) * off;
      const c2x = mx - Math.cos(perp) * off;
      const c2y = my - Math.sin(perp) * off;
      rays.push(
        <path
          key={i}
          d={`M ${bx.toFixed(2)} ${by.toFixed(2)}
              Q ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${tx.toFixed(2)} ${ty.toFixed(2)}
              Q ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${bx.toFixed(2)} ${by.toFixed(2)} Z`}
          fill={gold}
          stroke={goldDark}
          strokeWidth={0.4}
          strokeLinejoin="round"
        />
      );
    }
  }

  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Sol de Mayo">
      {rays}
      <circle cx={cx} cy={cy} r={discR} fill={gold} stroke={goldDark} strokeWidth={1} />
      {/* cara del sol */}
      <g fill="none" stroke={goldDark} strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round">
        {/* cejas */}
        <path d="M27.6 28.4 Q29 27.6, 30.3 28.3" />
        <path d="M33.7 28.3 Q35 27.6, 36.4 28.4" />
        {/* ojos */}
        <ellipse cx={29} cy={30.2} rx={1.4} ry={1.8} fill="#fff8e6" />
        <ellipse cx={35} cy={30.2} rx={1.4} ry={1.8} fill="#fff8e6" />
        <circle cx={29} cy={30.4} r={0.7} fill={goldDark} stroke="none" />
        <circle cx={35} cy={30.4} r={0.7} fill={goldDark} stroke="none" />
        {/* nariz */}
        <path d="M32 31.4 L31.2 34 Q32 34.6, 32.8 34" />
        {/* boca */}
        <path d="M29.8 36.2 Q32 37.6, 34.2 36.2" />
      </g>
    </svg>
  );
}
