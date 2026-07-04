# ¿Cuánto tomé? — Calculadora de alcoholemia

Trabajo práctico de Química. Estima la alcoholemia (g/L) de una persona a partir de las
bebidas consumidas durante la noche, aplicando el modelo de Widmark visto en clase.

- Cálculo de gramos de etanol puro a partir de volumen y graduación alcohólica.
- Alcoholemia pico según peso, sexo y tipo de cuerpo (factor R).
- Alcoholemia actual según el tiempo transcurrido (fase de meseta y eliminación a 0.15 g/L·h).
- Tiempo estimado hasta poder conducir según los límites legales vigentes en Argentina.
- Catálogo de bebidas comunes (fermentadas, destiladas y tragos preparados) con medidas
  típicas de vasos, copas, jarras y botellas, para no depender de que el usuario sepa o
  recuerde valores exactos.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion. Pensado para deployar
directo en Vercel, sin base de datos: las bebidas y sus medidas son datos estáticos del
proyecto.

## Aviso

Los valores son estimaciones educativas, no reemplazan un alcoholímetro real. Si tomaste,
no manejes.
