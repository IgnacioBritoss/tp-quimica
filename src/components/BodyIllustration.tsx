import { BodyType, Sex } from "@/lib/types";

interface BodyIllustrationProps {
  bodyType: BodyType;
  sex: Sex;
  className?: string;
  active?: boolean;
}

/**
 * Silueta de cuerpo prolija (una sola forma cerrada y suave) que cambia de
 * proporciones segun contextura y sexo. Dibujada con curvas para que se vea
 * limpia a cualquier tamano.
 */
export function BodyIllustration({ bodyType, sex, className, active }: BodyIllustrationProps) {
  const female = sex === "femenino";

  // Anchos (en unidades del viewBox 0..100) por contextura
  const p = {
    astenico: { shoulder: 15, chest: 13, waist: 11, hip: female ? 15 : 12 },
    atletico: { shoulder: female ? 20 : 23, chest: female ? 17 : 20, waist: female ? 12 : 15, hip: female ? 19 : 15 },
    picnico: { shoulder: 20, chest: female ? 20 : 22, waist: female ? 19 : 21, hip: female ? 22 : 20 },
    promedio: { shoulder: female ? 17 : 19, chest: female ? 15 : 17, waist: female ? 13 : 15, hip: female ? 18 : 15 },
  }[bodyType];

  const cx = 50;
  const fill = active ? "var(--brand)" : "var(--muted)";

  // Puntos verticales
  const headR = 9;
  const headCy = 15;
  const neckY = headCy + headR + 1;
  const shoulderY = neckY + 5;
  const chestY = shoulderY + 12;
  const waistY = chestY + 14;
  const hipY = waistY + 12;
  // Las piernas salen de abajo del torso (no del borde externo de la cadera),
  // con una separacion natural en el centro y bajando casi rectas.
  const legTopY = hipY - 1;
  const legBottomY = 95;
  const legW = Math.max(7, Math.min(10.5, p.hip * 0.7));
  const legTopX = p.hip * 0.46;
  const legBotX = p.hip * 0.34;

  // Contorno del torso (lado derecho de arriba a abajo, luego espejo)
  const torso = `
    M ${cx - p.shoulder} ${shoulderY}
    C ${cx - p.shoulder} ${shoulderY}, ${cx - p.chest} ${chestY - 4}, ${cx - p.chest} ${chestY}
    C ${cx - p.chest} ${chestY + 4}, ${cx - p.waist} ${waistY - 4}, ${cx - p.waist} ${waistY}
    C ${cx - p.waist} ${waistY + 5}, ${cx - p.hip} ${hipY - 4}, ${cx - p.hip} ${hipY}
    L ${cx + p.hip} ${hipY}
    C ${cx + p.hip} ${hipY - 4}, ${cx + p.waist} ${waistY + 5}, ${cx + p.waist} ${waistY}
    C ${cx + p.waist} ${waistY - 4}, ${cx + p.chest} ${chestY + 4}, ${cx + p.chest} ${chestY}
    C ${cx + p.chest} ${chestY - 4}, ${cx + p.shoulder} ${shoulderY}, ${cx + p.shoulder} ${shoulderY}
    C ${cx + p.shoulder - 2} ${shoulderY - 3}, ${cx + 4} ${neckY}, ${cx + 3} ${neckY}
    L ${cx - 3} ${neckY}
    C ${cx - 4} ${neckY}, ${cx - p.shoulder + 2} ${shoulderY - 3}, ${cx - p.shoulder} ${shoulderY}
    Z
  `;

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* cabeza */}
      <circle cx={cx} cy={headCy} r={headR} fill={fill} fillOpacity={active ? 0.9 : 0.55} />
      {/* torso */}
      <path d={torso} fill={fill} fillOpacity={active ? 0.9 : 0.55} />
      {/* brazos */}
      <path
        d={`M ${cx - p.shoulder + 1} ${shoulderY + 1}
            C ${cx - p.shoulder - 5} ${chestY}, ${cx - p.shoulder - 4} ${waistY}, ${cx - p.waist - 3} ${hipY - 2}`}
        stroke={fill}
        strokeOpacity={active ? 0.9 : 0.55}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx + p.shoulder - 1} ${shoulderY + 1}
            C ${cx + p.shoulder + 5} ${chestY}, ${cx + p.shoulder + 4} ${waistY}, ${cx + p.waist + 3} ${hipY - 2}`}
        stroke={fill}
        strokeOpacity={active ? 0.9 : 0.55}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* piernas: casi rectas, centradas bajo el torso, con separacion */}
      <path
        d={`M ${cx - legTopX} ${legTopY} L ${cx - legBotX} ${legBottomY}`}
        stroke={fill}
        strokeOpacity={active ? 0.9 : 0.55}
        strokeWidth={legW}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx + legTopX} ${legTopY} L ${cx + legBotX} ${legBottomY}`}
        stroke={fill}
        strokeOpacity={active ? 0.9 : 0.55}
        strokeWidth={legW}
        strokeLinecap="round"
      />
    </svg>
  );
}
