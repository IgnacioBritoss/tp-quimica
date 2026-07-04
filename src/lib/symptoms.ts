/**
 * Periodos de la intoxicacion aguda con etanol (segun los centros nerviosos
 * deprimidos), tomados del material de la cursada. Los rangos estan en g/L.
 */
export interface SymptomStage {
  id: string;
  period: string;
  min: number;
  max: number;
  title: string;
  tone: "ok" | "warn" | "danger" | "critical";
  symptoms: string[];
}

export const SYMPTOM_STAGES: SymptomStage[] = [
  {
    id: "sobrio",
    period: "Sin efectos relevantes",
    min: 0,
    max: 0.2,
    title: "Alcoholemia muy baja",
    tone: "ok",
    symptoms: [
      "Efectos poco perceptibles en la mayoria de las personas.",
      "Igual puede haber leve relajacion y menor atencion.",
    ],
  },
  {
    id: "periodo1",
    period: "Periodo I - Inestabilidad emocional",
    min: 0.2,
    max: 1,
    title: "Se afectan los centros corticales",
    tone: "warn",
    symptoms: [
      "Memoria, atencion y juicio perturbados.",
      "Dificultad para asociar ideas.",
      "Falta de compostura y de autocritica.",
      "Conducta mas espontanea e infantil, se pierden los buenos modales.",
    ],
  },
  {
    id: "periodo2",
    period: "Periodo II - Confusion",
    min: 1,
    max: 2,
    title: "Se afectan los centros subcorticales",
    tone: "danger",
    symptoms: [
      "Alteraciones en la postura y en los movimientos voluntarios.",
      "Problemas en el equilibrio, en la marcha y diplopia (vision doble).",
      "La falta de autocontrol puede llevar a agresividad y a actos de violencia.",
    ],
  },
  {
    id: "periodo3",
    period: "Periodo III - Estupor",
    min: 2,
    max: 3,
    title: "Se deprimen los centros espinales",
    tone: "critical",
    symptoms: [
      "Sueno profundo que puede llevar a inconsciencia.",
      "Estupor y riesgo de coma.",
    ],
  },
  {
    id: "periodo4",
    period: "Periodo IV - Coma",
    min: 3,
    max: 99,
    title: "Se deprimen los centros bulbares",
    tone: "critical",
    symptoms: [
      "Los centros bulbares controlan la respiracion y la funcion cardiovascular.",
      "El coma puede ser profundo y desencadenar una paralisis respiratoria.",
      "Situacion de riesgo vital: se necesita atencion medica urgente.",
    ],
  },
];

export function stageForBac(bac: number): SymptomStage {
  return (
    SYMPTOM_STAGES.find((s) => bac >= s.min && bac < s.max) ??
    SYMPTOM_STAGES[SYMPTOM_STAGES.length - 1]
  );
}
