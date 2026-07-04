"use client";

import { motion } from "framer-motion";

interface IceClusterProps {
  cubes: number;
  perRow: number;
  centerX: number;
  containerH: number;
  floating: boolean;
  surfaceBottom: number;
  size?: number;
}

/**
 * Cubos de hielo apilados/flotando de forma natural (escalonados, con jitter y
 * rotacion). Translucidos: el liquido se ve a traves. Reutilizable en el
 * calculador y en el juego de bartender.
 */
export function IceCluster({
  cubes,
  perRow,
  centerX,
  containerH,
  floating,
  surfaceBottom,
  size = 26,
}: IceClusterProps) {
  const stepX = Math.round(size * 0.92);
  const stepY = Math.round(size * 0.62);
  const baseBottom = floating ? surfaceBottom - size * 0.55 : 4;
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "100%" }}>
      {Array.from({ length: cubes }).map((_, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const jitterX = ((i * 37) % 5) - 2;
        const jitterY = ((i * 13) % 4) - 1;
        const rot = ((i * 53) % 22) - 11;
        const brick = row % 2 ? stepX / 2 : 0;
        const offsetX = (col - (perRow - 1) / 2) * stepX + brick + jitterX;
        const left = centerX + offsetX - size / 2;
        const rawBottom = floating ? baseBottom - row * stepY + jitterY : baseBottom + row * stepY + jitterY;
        const bottom = Math.max(2, Math.min(containerH - size + 8, rawBottom));
        return (
          <motion.div
            key={i}
            initial={{ scale: 0.3, opacity: 0, rotate: rot }}
            animate={{ scale: 1, opacity: 1, rotate: rot }}
            transition={{ type: "spring", stiffness: 480, damping: 22 }}
            className="absolute rounded-[6px]"
            style={{
              width: size,
              height: size,
              left,
              bottom,
              zIndex: floating ? 50 - row : row,
              background: "rgba(226,241,252,0.8)",
              border: "1px solid rgba(248,252,255,0.92)",
              boxShadow: "inset 4px 4px 6px rgba(255,255,255,0.7), inset -3px -3px 5px rgba(110,150,185,0.5)",
            }}
          />
        );
      })}
    </div>
  );
}
