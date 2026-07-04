/* eslint-disable @next/next/no-img-element */
// Usamos <img> nativo a propósito: las fotos pueden venir de cualquier dominio
// (los links que cargue el usuario) y no queremos configurar next/image para
// cada host. La optimización de next/image no aplica a este caso.
"use client";

import { useState } from "react";
import { IconKey } from "@/lib/types";
import { DrinkIcon } from "@/components/DrinkIcon";

interface DrinkImageProps {
  src?: string;
  icon: IconKey;
  color: string;
  alt: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Muestra una foto real si hay URL y carga bien; si no hay o falla, cae al
 * dibujo vectorial. Usa <img> nativo para aceptar cualquier dominio sin
 * configurar next/image.
 */
export function DrinkImage({ src, icon, color, alt, className, iconClassName }: DrinkImageProps) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={className}
      />
    );
  }

  return <DrinkIcon icon={icon} color={color} className={iconClassName ?? className} />;
}
