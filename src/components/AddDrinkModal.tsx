"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DrinkPreset, DrinkEntry } from "@/lib/types";
import { DrinkImage } from "@/components/DrinkImage";
import { ETHANOL_DENSITY } from "@/lib/calc";
import { drinkImage } from "@/lib/images";

interface AddDrinkModalProps {
  preset: DrinkPreset | null;
  onClose: () => void;
  onAdd: (entry: DrinkEntry) => void;
}

export function AddDrinkModal({ preset, onClose, onAdd }: AddDrinkModalProps) {
  const isPreparado = preset?.category === "preparado";

  const [measureId, setMeasureId] = useState<string | null>(preset?.measures[0]?.id ?? null);
  const [customVolume, setCustomVolume] = useState<number | null>(null);
  const [abv, setAbv] = useState<number>(preset?.defaultAbv ?? 10);
  const [ratio, setRatio] = useState<number>(preset?.baseRatio ?? 1);
  const [quantity, setQuantity] = useState<number>(1);

  const measure = preset?.measures.find((m) => m.id === measureId) ?? preset?.measures[0];
  const totalVolume = customVolume ?? measure?.volumeMl ?? 0;
  const isCustomDrink = preset?.id === "otra";

  const pureVolume = useMemo(() => {
    if (isPreparado) return totalVolume * ratio;
    return totalVolume;
  }, [isPreparado, totalVolume, ratio]);

  const gramsPreview = pureVolume * ETHANOL_DENSITY * (abv / 100) * quantity;

  if (!preset) return null;
  const photo = drinkImage(preset.id);

  function handleAdd() {
    if (!preset) return;
    const entry: DrinkEntry = {
      id: crypto.randomUUID(),
      presetId: preset.id,
      name: preset.name,
      icon: preset.icon,
      abv,
      totalVolumeMl: totalVolume,
      pureVolumeMl: pureVolume,
      quantity,
      color: preset.color,
      image: photo,
    };
    onAdd(entry);
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-surface border border-border w-full sm:max-w-md rounded-t-md sm:rounded-md overflow-hidden max-h-[92vh] overflow-y-auto shadow-xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 p-4 section-bar">
            <div className="w-14 h-14 rounded overflow-hidden flex items-center justify-center shrink-0 bg-white/15 border border-white/20">
              <DrinkImage
                src={photo}
                icon={preset.icon}
                color="#ffffff"
                alt={preset.name}
                className="w-full h-full object-cover"
                iconClassName="w-9 h-9"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold">{preset.name}</h3>
              <p className="text-xs text-white/80">Ajusta lo que necesites</p>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {isCustomDrink && (
              <div>
                <label className="text-sm text-muted block mb-1">Volumen total (ml)</label>
                <input
                  type="number"
                  min={0}
                  value={customVolume ?? measure?.volumeMl ?? 0}
                  onChange={(e) => setCustomVolume(Number(e.target.value))}
                  className="w-full rounded bg-surface-2 border border-border px-3 py-2 text-text"
                />
              </div>
            )}

            {!isCustomDrink && (
              <div>
                <label className="text-sm text-muted block mb-2">
                  {isPreparado ? "Tamano del vaso" : "Medida"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {preset.measures.map((m) => {
                    const active = measureId === m.id && customVolume === null;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setMeasureId(m.id);
                          setCustomVolume(null);
                        }}
                        className={`px-3 py-2 rounded text-sm border transition-colors ${
                          active
                            ? "border-brand bg-brand/10 text-text"
                            : "border-border text-muted hover:text-text hover:border-brand/40"
                        }`}
                      >
                        {m.label} <span className="text-muted/70">· {m.volumeMl}cc</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-baseline justify-between mb-1">
                <label className="text-sm text-muted">
                  {isPreparado ? "Graduacion de la bebida base" : "Graduacion alcoholica"}
                </label>
                <span className="text-sm font-medium text-text tabular-nums">{abv}°</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={60}
                step={0.5}
                value={abv}
                onChange={(e) => setAbv(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {isPreparado && (
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <label className="text-sm text-muted">Proporcion de bebida base (resto: hielo/gaseosa/jugo)</label>
                  <span className="text-sm font-medium text-text tabular-nums">{Math.round(ratio * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={ratio}
                  onChange={(e) => setRatio(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted mt-1">
                  Aprox. {Math.round(pureVolume)} cc de bebida base en un vaso de {totalVolume} cc
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="text-sm text-muted">Cantidad</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded border border-border text-text text-lg flex items-center justify-center hover:bg-surface-2"
                >
                  −
                </button>
                <span className="w-6 text-center text-text font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded border border-border text-text text-lg flex items-center justify-center hover:bg-surface-2"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded bg-surface-2 border border-border p-3 text-sm text-muted">
              Vas a sumar aprox. <span className="text-text font-semibold">{gramsPreview.toFixed(1)} g</span> de alcohol puro
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded py-2.5 border border-border text-muted hover:text-text hover:bg-surface-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 rounded py-2.5 font-medium text-on-brand bg-brand hover:bg-brand-strong transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
