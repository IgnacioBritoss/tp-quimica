import { BodyType, Sex } from "./types";

export interface BodyTypeInfo {
  id: BodyType;
  label: string;
  description: string;
  r: Record<Sex, number>;
}

export const BODY_TYPES: BodyTypeInfo[] = [
  {
    id: "astenico",
    label: "Asténico",
    description: "Cuerpos delgados, altos, tórax estrecho",
    r: { masculino: 0.85, femenino: 0.76 },
  },
  {
    id: "atletico",
    label: "Atlético",
    description: "Cuerpos con fuerte musculatura",
    r: { masculino: 0.76, femenino: 0.67 },
  },
  {
    id: "picnico",
    label: "Pícnico",
    description: "Redondeados y robustos, de baja estatura",
    r: { masculino: 0.64, femenino: 0.58 },
  },
  {
    id: "promedio",
    label: "No estoy seguro / Promedio",
    description: "Usa un valor promedio general",
    r: { masculino: 0.75, femenino: 0.67 },
  },
];

export function getR(sex: Sex, bodyType: BodyType): number {
  const info = BODY_TYPES.find((b) => b.id === bodyType) ?? BODY_TYPES[3];
  return info.r[sex];
}
