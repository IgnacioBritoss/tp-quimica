export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number; // indice de la opcion correcta (antes de mezclar)
  explain: string;
}

/** Cantidad de preguntas por partida (se eligen al azar del banco). */
export const QUIZ_COUNT = 10;

const VF = ["Verdadero", "Falso"];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Que es la alcoholemia?",
    options: [
      "La cantidad de alcohol en sangre (g/L)",
      "La cantidad de tragos que tomaste",
      "El tiempo que tardas en emborracharte",
      "El tipo de bebida que tomas",
    ],
    correct: 0,
    explain: "La alcoholemia es la concentracion de etanol en sangre, en gramos por litro.",
  },
  {
    question: "Cual es el limite de alcohol para conducir en Argentina?",
    options: ["0,0 g/L (alcohol cero)", "0,5 g/L", "0,8 g/L", "1,0 g/L"],
    correct: 0,
    explain: "Rige la ley de alcohol cero al volante: el limite es 0,0 g/L.",
  },
  {
    question: "Sobre el sistema nervioso, el etanol actua como...",
    options: ["Depresor", "Estimulante", "Alucinogeno", "No lo afecta"],
    correct: 0,
    explain: "El alcohol es un depresor no selectivo del sistema nervioso central.",
  },
  {
    question: "Que baja realmente la alcoholemia?",
    options: ["El paso del tiempo", "El cafe", "Una ducha fria", "Comer mucho"],
    correct: 0,
    explain: "Solo el tiempo la baja: el higado elimina el alcohol a un ritmo fijo.",
  },
  {
    question: "A que ritmo aproximado elimina alcohol el cuerpo?",
    options: ["0,15 g/L por hora", "1 g/L por hora", "0,5 g/L por hora", "No se elimina"],
    correct: 0,
    explain: "En promedio se elimina alrededor de 0,15 g/L por cada hora.",
  },
  {
    question: "Donde se metaboliza principalmente el alcohol?",
    options: ["En el higado", "En el estomago", "En los pulmones", "En el corazon"],
    correct: 0,
    explain: "El higado transforma el etanol en acido acetico mediante enzimas.",
  },
  {
    question: "Por que a igual cantidad las mujeres suelen alcanzar mayor alcoholemia?",
    options: [
      "Menor proporcion de agua corporal",
      "Toman mas rapido",
      "Tienen mas sangre",
      "No es cierto",
    ],
    correct: 0,
    explain: "El alcohol se distribuye en el agua del cuerpo; a menor agua, mayor concentracion.",
  },
  {
    question: "Que organo se puede dañar por el consumo cronico de alcohol?",
    options: ["El higado (higado graso, cirrosis)", "Solo la piel", "Los huesos", "Ninguno"],
    correct: 0,
    explain: "El consumo cronico produce higado graso y otros daños hepaticos.",
  },
  {
    question: "Mezclar alcohol con energizantes es riesgoso porque...",
    options: [
      "La cafeina enmascara la borrachera",
      "Baja la alcoholemia",
      "Elimina el alcohol",
      "No pasa nada",
    ],
    correct: 0,
    explain: "La cafeina te mantiene despierto y no notas cuanto subiste: la alcoholemia sube igual.",
  },
  {
    question: "Una persona con unos 2 g/L de alcoholemia probablemente este en...",
    options: [
      "Confusion, con problemas de equilibrio",
      "Totalmente sobria",
      "Sin ningun sintoma",
      "Su mejor momento para manejar",
    ],
    correct: 0,
    explain: "Cerca de 1 a 2 g/L aparece el periodo de confusion: se afecta la postura y la marcha.",
  },
  {
    question: "Si tomas la misma cantidad pero con el estomago lleno...",
    options: [
      "El pico de alcoholemia es mas bajo y tarda mas",
      "El pico es mas alto",
      "No cambia nada",
      "El alcohol desaparece",
    ],
    correct: 0,
    explain: "La comida demora la absorcion, asi que el pico de alcoholemia es mas bajo.",
  },
  {
    question: "Cual de estos ayuda a que el pico de alcoholemia sea mas bajo?",
    options: [
      "Comer antes y durante",
      "Tomar mas rapido",
      "Mezclar con energizantes",
      "Tomar en ayunas",
    ],
    correct: 0,
    explain: "Comer demora la absorcion; tomar rapido o en ayunas eleva el pico.",
  },
  {
    question: "El alcohol atraviesa la placenta?",
    options: [
      "Si, por eso no se recomienda tomar en el embarazo",
      "No, la placenta lo bloquea",
      "Solo el vino",
      "Solo los destilados",
    ],
    correct: 0,
    explain: "El etanol es una molecula pequeña que atraviesa la placenta y afecta al feto.",
  },
  {
    question: "Cual es la forma mas precisa de conocer la alcoholemia?",
    options: [
      "Medir el alcohol directamente en sangre",
      "Contar los tragos",
      "Mirar como camina la persona",
      "Preguntarle como se siente",
    ],
    correct: 0,
    explain: "La medicion directa en sangre es el patron; los calculos son solo estimaciones.",
  },
  {
    question: "Cuanto pesa aproximadamente 1 ml de etanol puro?",
    options: ["0,789 g", "1 g", "0,5 g", "2 g"],
    correct: 0,
    explain: "La densidad del etanol es 0,789 g/ml, dato clave para calcular los gramos de alcohol.",
  },
  {
    question: "Que aparato se usa para estimar la alcoholemia por el aliento?",
    options: ["El alcoholimetro", "El termometro", "El tensiometro", "La balanza"],
    correct: 0,
    explain: "El alcoholimetro estima el alcohol en sangre a partir del aire espirado.",
  },
  // ----- Verdadero / Falso (mitos) -----
  {
    question: "Verdadero o falso: el cafe baja la alcoholemia.",
    options: VF,
    correct: 1,
    explain: "Falso. El cafe te mantiene despierto, pero no reduce el alcohol en sangre.",
  },
  {
    question: "Verdadero o falso: solo el paso del tiempo baja la alcoholemia.",
    options: VF,
    correct: 0,
    explain: "Verdadero. El higado elimina el alcohol a ritmo fijo y no se puede acelerar.",
  },
  {
    question: "Verdadero o falso: aguantar bien el alcohol significa que no te hace mal.",
    options: VF,
    correct: 1,
    explain: "Falso. La tolerancia cambia la sensacion, pero el daño y la alcoholemia son los mismos.",
  },
  {
    question: "Verdadero o falso: a igual cantidad de alcohol, la cerveza emborracha menos que los destilados.",
    options: VF,
    correct: 1,
    explain: "Falso. Lo que importa son los gramos totales de alcohol, no el tipo de bebida.",
  },
  {
    question: "Verdadero o falso: el alcohol da calor de verdad al cuerpo.",
    options: VF,
    correct: 1,
    explain: "Falso. Da sensacion de calor pero el cuerpo pierde temperatura mas rapido.",
  },
  {
    question: "Verdadero o falso: en Argentina se puede manejar con hasta 0,5 g/L.",
    options: VF,
    correct: 1,
    explain: "Falso. El limite es 0,0 g/L: alcohol cero al volante.",
  },
  {
    question: "Verdadero o falso: vomitar revierte el alcohol que ya paso a la sangre.",
    options: VF,
    correct: 1,
    explain: "Falso. El alcohol se absorbe rapido; lo que ya paso a la sangre no se revierte.",
  },
  {
    question: "Verdadero o falso: una ducha fria despeja el alcohol del cuerpo.",
    options: VF,
    correct: 1,
    explain: "Falso. Solo cambia la sensacion; la alcoholemia sigue igual.",
  },
];
