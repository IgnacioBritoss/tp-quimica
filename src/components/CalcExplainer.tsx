"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/SectionCard";

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-surface-2 border border-border px-4 py-3 text-center font-mono text-sm sm:text-base text-text overflow-x-auto">
      {children}
    </div>
  );
}

const STEPS = [
  {
    n: 1,
    title: "Cuanto alcohol puro tomaste",
    body: "De cada bebida sacamos los gramos de etanol puro a partir del volumen y la graduacion.",
    formula: (
      <>
        gramos = volumen (ml) &times; 0,789 &times; (graduacion / 100)
      </>
    ),
    note: "0,789 g/ml es la densidad del etanol: cuanto pesa 1 ml de alcohol puro.",
  },
  {
    n: 2,
    title: "Tu pico de alcoholemia",
    body: "Con la formula de Widmark repartimos ese alcohol en el agua de tu cuerpo, segun tu peso y contextura.",
    formula: (
      <>
        alcoholemia (g/L) = gramos / (peso &times; r)
      </>
    ),
    note: "r es el factor de distribucion: depende del sexo y del tipo de cuerpo (cuanta agua tiene). Va de 0,58 a 0,85 aprox.",
  },
  {
    n: 3,
    title: "Cuanto baja con el tiempo",
    body: "Desde que dejas de tomar, el higado elimina el alcohol a un ritmo casi constante.",
    formula: (
      <>
        alcoholemia actual = pico &minus; 0,15 &times; horas
      </>
    ),
    note: "Se elimina alrededor de 0,15 g/L por hora. Nada acelera ese proceso: solo el tiempo.",
  },
];

const TIMELINE = [
  {
    year: "Antes",
    title: "Se juzgaba a ojo",
    body: "Sin instrumentos, el estado de una persona se estimaba solo por su conducta: como hablaba, caminaba o reaccionaba.",
  },
  {
    year: "1852",
    title: "Primeras medidas quimicas",
    body: "Empiezan las primeras determinaciones quimicas de alcohol en fluidos del cuerpo en el laboratorio.",
  },
  {
    year: "1922 - 1932",
    title: "Erik Widmark y su formula",
    body: "El sueco Erik Widmark desarrolla un metodo para medir alcohol en una gota de sangre y la formula que todavia usamos para estimar la alcoholemia.",
  },
  {
    year: "1938",
    title: "El Drunkometer",
    body: "Rolla Harger presenta el primer aparato que estima el alcohol por el aliento, soplando en un globo con reactivos.",
  },
  {
    year: "1954",
    title: "El Breathalyzer",
    body: "Robert Borkenstein crea un alcoholimetro de aliento practico y confiable, que hace posible el control en la via publica.",
  },
  {
    year: "1980 - 1990",
    title: "Sensores modernos",
    body: "Aparecen alcoholimetros portatiles con celda electroquimica e infrarrojo: mas precisos, rapidos y faciles de usar.",
  },
  {
    year: "Hoy",
    title: "Sangre, aliento y bloqueo",
    body: "El analisis de sangre en laboratorio es el patron de oro. Se usan alcoholimetros homologados y hasta sistemas que bloquean el arranque del auto si detectan alcohol.",
  },
];

export function CalcExplainer() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Como calculamos tu alcoholemia"
        subtitle="El metodo de Widmark en tres pasos. Es una estimacion educativa, no un alcoholimetro."
      >
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-md border border-border bg-surface p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full bg-brand text-on-brand flex items-center justify-center font-bold">
                  {s.n}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="font-semibold text-text">{s.title}</div>
                  <p className="text-sm text-muted">{s.body}</p>
                  <Formula>{s.formula}</Formula>
                  <p className="text-xs text-muted">{s.note}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-brand bg-surface-2 px-4 py-3 text-sm text-text">
          Juntando los tres pasos podemos estimar cuanto tenes ahora y cuanto falta para volver a
          0,0 g/L. Como cada cuerpo es distinto, el resultado es una aproximacion.
        </div>
      </SectionCard>

      <SectionCard
        title="Como se fue midiendo el alcohol"
        subtitle="De juzgar a ojo a los alcoholimetros y analisis de hoy."
      >
        <ol className="relative space-y-6 py-1">
          <span className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" aria-hidden />
          {TIMELINE.map((t, i) => (
            <motion.li
              key={t.year}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative pl-9"
            >
              <span className="absolute left-0 top-1 w-4 h-4 rounded-full bg-brand border-2 border-surface" />
              <div className="text-xs font-bold uppercase tracking-wider text-brand">{t.year}</div>
              <div className="font-semibold text-text">{t.title}</div>
              <p className="text-sm text-muted mt-0.5">{t.body}</p>
            </motion.li>
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}
