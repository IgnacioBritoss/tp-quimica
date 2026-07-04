"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INGREDIENTS, getIngredient } from "@/lib/ingredients";
import { CocktailPart, DrinkEntry } from "@/lib/types";
import { DrinkImage } from "@/components/DrinkImage";
import { ETHANOL_DENSITY, ethanolGramsForPart } from "@/lib/calc";
import { ingredientImage } from "@/lib/images";

interface CocktailBuilderProps {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: DrinkEntry) => void;
}

export function CocktailBuilder({ open, onClose, onAdd }: CocktailBuilderProps) {
  const [name, setName] = useState("");
  const [parts, setParts] = useState<CocktailPart[]>([]);
  const [selectedId, setSelectedId] = useState<string>(INGREDIENTS[0].id);

  const selected = getIngredient(selectedId)!;
  const [measureId, setMeasureId] = useState<string>(selected.measures[0].id);

  const totals = useMemo(() => {
    const volume = parts.reduce((s, p) => s + p.volumeMl, 0);
    const grams = parts.reduce((s, p) => s + ethanolGramsForPart(p.volumeMl, p.abv), 0);
    const pureEthanolMl = grams / ETHANOL_DENSITY;
    const abv = volume > 0 ? (pureEthanolMl / volume) * 100 : 0;
    return { volume, grams, abv };
  }, [parts]);

  if (!open) return null;

  function selectIngredient(id: string) {
    setSelectedId(id);
    const ing = getIngredient(id)!;
    setMeasureId(ing.measures[0].id);
  }

  function addPart() {
    const measure = selected.measures.find((m) => m.id === measureId) ?? selected.measures[0];
    const part: CocktailPart = {
      ingredientId: selected.id,
      name: selected.name,
      abv: selected.abv,
      volumeMl: measure.volumeMl,
      color: selected.color,
      icon: selected.icon,
    };
    setParts((prev) => [...prev, part]);
  }

  function removePart(index: number) {
    setParts((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAdd() {
    if (parts.length === 0) return;
    const entry: DrinkEntry = {
      id: crypto.randomUUID(),
      presetId: "trago-armado",
      name: name.trim() || "Trago armado",
      icon: "cocktail",
      abv: totals.abv,
      totalVolumeMl: totals.volume,
      pureVolumeMl: totals.grams / ETHANOL_DENSITY,
      quantity: 1,
      color: "#e0a82e",
      ethanolGramsOverride: totals.grams,
      parts,
    };
    onAdd(entry);
    reset();
    onClose();
  }

  function reset() {
    setName("");
    setParts([]);
    selectIngredient(INGREDIENTS[0].id);
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-panel border border-border w-full sm:max-w-lg rounded-t-md sm:rounded-md overflow-hidden max-h-[92vh] overflow-y-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-border bg-panel-2">
            <h3 className="text-base font-semibold text-foreground">Armá tu trago</h3>
            <p className="text-xs text-muted">
              Sumá ingredientes con su medida, como en la barra. Calculamos la graduación final.
            </p>
          </div>

          <div className="p-4 space-y-5">
            <div>
              <label className="text-sm text-muted block mb-1">Nombre (opcional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: mi gin tonic"
                className="w-full rounded bg-panel-2 border border-border px-3 py-2 text-foreground placeholder:text-muted/50"
              />
            </div>

            <div>
              <label className="text-sm text-muted block mb-2">Elegí un ingrediente</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {INGREDIENTS.map((ing) => {
                  const active = ing.id === selectedId;
                  return (
                    <button
                      key={ing.id}
                      onClick={() => selectIngredient(ing.id)}
                      className={`flex flex-col items-center gap-1 rounded border p-2 transition-colors ${
                        active ? "border-accent bg-accent/10" : "border-border bg-panel-2 hover:border-[#3a4150]"
                      }`}
                      title={ing.name}
                    >
                      <div
                        className="w-8 h-8 rounded overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: `${ing.color}22` }}
                      >
                        <DrinkImage
                          src={ingredientImage(ing.id)}
                          icon={ing.icon}
                          color={ing.color}
                          alt={ing.name}
                          className="w-full h-full object-cover"
                          iconClassName="w-6 h-6"
                        />
                      </div>
                      <span className="text-[10px] text-muted text-center leading-tight">{ing.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-muted">
                  Medida de {selected.name.toLowerCase()}{" "}
                  <span className="text-muted/70">({selected.abv}°)</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.measures.map((m) => {
                  const active = measureId === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMeasureId(m.id)}
                      className={`px-3 py-2 rounded text-sm border transition-colors ${
                        active
                          ? "border-accent bg-accent/10 text-foreground"
                          : "border-border text-muted hover:text-foreground hover:border-[#3a4150]"
                      }`}
                    >
                      {m.label} <span className="text-muted/70">· {m.volumeMl}cc</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={addPart}
                className="mt-3 w-full rounded py-2 border border-accent text-accent font-medium hover:bg-accent/10"
              >
                + Sumar al trago
              </button>
            </div>

            {parts.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-muted">En el vaso:</div>
                <ul className="space-y-1.5">
                  {parts.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 rounded bg-panel-2 border border-border px-3 py-2"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-sm text-foreground flex-1">
                        {p.name} <span className="text-muted">· {p.volumeMl}cc · {p.abv}°</span>
                      </span>
                      <button
                        onClick={() => removePart(i)}
                        className="text-muted hover:text-danger px-1"
                        aria-label={`Quitar ${p.name}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-3 gap-2 pt-1 text-sm">
                  <div className="rounded bg-panel-2 border border-border p-2">
                    <div className="text-[11px] text-muted">Volumen</div>
                    <div className="text-foreground font-semibold">{Math.round(totals.volume)} cc</div>
                  </div>
                  <div className="rounded bg-panel-2 border border-border p-2">
                    <div className="text-[11px] text-muted">Graduación</div>
                    <div className="text-foreground font-semibold">{totals.abv.toFixed(1)}°</div>
                  </div>
                  <div className="rounded bg-panel-2 border border-border p-2">
                    <div className="text-[11px] text-muted">Alcohol</div>
                    <div className="text-foreground font-semibold">{totals.grams.toFixed(1)} g</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded py-2.5 border border-border text-muted hover:text-foreground hover:bg-panel-2"
              >
                Cerrar
              </button>
              <button
                onClick={handleAdd}
                disabled={parts.length === 0}
                className="flex-1 rounded py-2.5 font-medium text-black bg-accent hover:bg-accent-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Agregar a mi noche
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
