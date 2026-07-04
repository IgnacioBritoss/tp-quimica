"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INGREDIENTS, getIngredient } from "@/lib/ingredients";
import { CocktailPart, DrinkEntry } from "@/lib/types";
import { DrinkImage } from "@/components/DrinkImage";
import { ETHANOL_DENSITY, ethanolGramsForPart } from "@/lib/calc";
import { ingredientImage } from "@/lib/images";
import { IceCluster } from "@/components/IceCluster";

interface GlassPourBuilderProps {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: DrinkEntry) => void;
}

interface GlassType {
  id: string;
  label: string;
  maxMl: number;
  clip: string;
  round: string;
}

const GLASSES: GlassType[] = [
  { id: "vaso-corto", label: "Vaso corto", maxMl: 250, clip: "polygon(15% 0, 85% 0, 76% 100%, 24% 100%)", round: "0 0 10px 10px" },
  { id: "trago-largo", label: "Vaso trago largo", maxMl: 400, clip: "polygon(17% 0, 83% 0, 74% 100%, 26% 100%)", round: "0 0 10px 10px" },
  { id: "pinta", label: "Pinta", maxMl: 500, clip: "polygon(11% 0, 89% 0, 78% 100%, 22% 100%)", round: "0 0 12px 12px" },
  { id: "copa-vino", label: "Copa de vino", maxMl: 350, clip: "polygon(6% 0, 94% 0, 86% 60%, 66% 100%, 34% 100%, 14% 60%)", round: "0 0 40% 40%" },
  { id: "copa-trago", label: "Copa de trago", maxMl: 300, clip: "polygon(4% 0, 96% 0, 58% 100%, 42% 100%)", round: "0" },
];

// Cubos de hielo grandes, como en la vida real: pocos y de buen tamano.
const ICE_CUBE_ML = 28;
const maxCubesFor = (glass: GlassType) => Math.max(2, Math.round(glass.maxMl / 75));

export function GlassPourBuilder({ open, onClose, onAdd }: GlassPourBuilderProps) {
  const [glass, setGlass] = useState<GlassType>(GLASSES[0]);
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState<string>(INGREDIENTS[0].id);
  const [parts, setParts] = useState<CocktailPart[]>([]); // solo liquidos
  const [iceCubes, setIceCubes] = useState(0);
  const [preview, setPreview] = useState(0);
  const [pouring, setPouring] = useState(false);

  const glassRef = useRef<HTMLDivElement>(null);
  const selected = getIngredient(selectedId)!;
  const isIce = selected.id === "hielo";
  const maxCubes = maxCubesFor(glass);

  const committedLiquid = useMemo(() => parts.reduce((s, p) => s + p.volumeMl, 0), [parts]);
  const iceVolume = iceCubes * ICE_CUBE_ML;
  const totalVolume = committedLiquid + iceVolume;

  const totals = useMemo(() => {
    const grams = parts.reduce((s, p) => s + ethanolGramsForPart(p.volumeMl, p.abv), 0);
    const abv = committedLiquid > 0 ? (grams / ETHANOL_DENSITY / committedLiquid) * 100 : 0;
    return { grams, abv };
  }, [parts, committedLiquid]);

  if (!open) return null;

  function volumeFromPointer(clientY: number): number {
    const el = glassRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height));
    return fraction * glass.maxMl;
  }

  function addCube() {
    if (iceCubes >= maxCubes) return;
    if (iceVolume + ICE_CUBE_ML + committedLiquid > glass.maxMl) return;
    setIceCubes((c) => c + 1);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (isIce) {
      addCube();
      return;
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setPouring(true);
    const target = volumeFromPointer(e.clientY);
    setPreview(Math.max(0, Math.min(target - totalVolume, glass.maxMl - totalVolume)));
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!pouring || isIce) return;
    const target = volumeFromPointer(e.clientY);
    setPreview(Math.max(0, Math.min(target - totalVolume, glass.maxMl - totalVolume)));
  }
  function commitPour() {
    if (!isIce && preview > 3) {
      const part: CocktailPart = {
        ingredientId: selected.id,
        name: selected.name,
        abv: selected.abv,
        volumeMl: Math.round(preview),
        color: selected.color,
        icon: selected.icon,
      };
      setParts((prev) => [...prev, part]);
    }
    setPreview(0);
    setPouring(false);
  }

  function undo() {
    setParts((prev) => prev.slice(0, -1));
  }
  function resetAll() {
    setParts([]);
    setIceCubes(0);
    setPreview(0);
  }

  function handleAdd() {
    if (parts.length === 0 && iceCubes === 0) return;
    const allParts: CocktailPart[] = [...parts];
    if (iceCubes > 0) {
      allParts.push({
        ingredientId: "hielo",
        name: `Hielo (${iceCubes})`,
        abv: 0,
        volumeMl: iceVolume,
        color: "#cfe0ee",
        icon: "soda",
      });
    }
    const entry: DrinkEntry = {
      id: crypto.randomUUID(),
      presetId: "trago-armado",
      name: name.trim() || `Trago en ${glass.label.toLowerCase()}`,
      icon: "cocktail",
      abv: totals.abv,
      totalVolumeMl: totalVolume,
      pureVolumeMl: totals.grams / ETHANOL_DENSITY,
      quantity: 1,
      color: "#1c5aa6",
      ethanolGramsOverride: totals.grams,
      parts: allParts,
    };
    onAdd(entry);
    resetAll();
    setName("");
    onClose();
  }

  const icePerRow = glass.id.startsWith("copa") ? 2 : 3;

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
          className="bg-surface border border-border w-full sm:max-w-lg rounded-t-md sm:rounded-md overflow-hidden max-h-[94vh] overflow-y-auto shadow-xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="section-bar px-5 py-3">
            <h3 className="text-base font-semibold">Arma tu trago a ojo</h3>
          </div>

          <div className="p-5 space-y-5">
            {/* Paso 1: envase */}
            <div>
              <label className="text-sm font-medium text-text block mb-2">1. Elegi el envase</label>
              <div className="flex flex-wrap gap-2">
                {GLASSES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setGlass(g);
                      resetAll();
                    }}
                    className={`px-3 py-2 rounded text-sm border transition-colors ${
                      glass.id === g.id
                        ? "border-brand bg-brand/10 text-text"
                        : "border-border text-muted hover:text-text hover:border-brand/40"
                    }`}
                  >
                    {g.label} <span className="text-muted/70">· {g.maxMl}cc</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 2: bebida */}
            <div>
              <label className="text-sm font-medium text-text block mb-2">2. Elegi la bebida</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {INGREDIENTS.map((ing) => {
                  const active = ing.id === selectedId;
                  return (
                    <button
                      key={ing.id}
                      onClick={() => setSelectedId(ing.id)}
                      className={`flex flex-col items-center gap-1 rounded border p-2 transition-colors ${
                        active ? "border-brand bg-brand/10" : "border-border bg-surface-2 hover:border-brand/40"
                      }`}
                      title={ing.name}
                    >
                      <div className="w-8 h-8 rounded overflow-hidden flex items-center justify-center" style={{ backgroundColor: `${ing.color}22` }}>
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

            {/* Paso 3: servir */}
            <div>
              <label className="text-sm font-medium text-text block mb-1">
                {isIce ? "3. Agrega cubitos de hielo" : "3. Servi arrastrando hacia arriba"}
              </label>
              <p className="text-xs text-muted mb-3">
                {isIce ? (
                  <>
                    Toca el vaso o usa los botones para agregar cubitos. Entran hasta{" "}
                    <span className="font-medium text-text">{maxCubes}</span> en este envase.
                  </>
                ) : (
                  <>
                    Manten presionado dentro del vaso y subi hasta el nivel que serviste de{" "}
                    <span className="font-medium text-text">{selected.name}</span>. Solta para confirmar.
                  </>
                )}
              </p>

              <div className="flex items-end justify-center gap-5">
                <div className="relative select-none" style={{ width: 160, height: 240 }}>
                  <div
                    ref={glassRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={commitPour}
                    onPointerLeave={() => pouring && commitPour()}
                    className={`relative w-full h-full touch-none border-2 border-brand/40 ${isIce ? "cursor-pointer" : "cursor-ns-resize"}`}
                    style={{
                      clipPath: glass.clip,
                      WebkitClipPath: glass.clip,
                      borderRadius: glass.round,
                      background: "color-mix(in srgb, var(--muted) 12%, transparent)",
                    }}
                  >
                    {/* liquido: llena hasta el nivel total; el hielo desplaza y sube el liquido */}
                    {committedLiquid > 0 && (
                      <div
                        className="absolute inset-x-0 bottom-0 flex flex-col-reverse"
                        style={{ height: `${(totalVolume / glass.maxMl) * 100}%` }}
                      >
                        {parts.map((p, i) => (
                          <div
                            key={i}
                            style={{ height: `${(p.volumeMl / committedLiquid) * 100}%`, backgroundColor: p.color, opacity: 0.82 }}
                          />
                        ))}
                      </div>
                    )}
                    {/* preview del liquido en curso */}
                    {preview > 0 && (
                      <div
                        className="absolute left-0 right-0"
                        style={{ bottom: `${(totalVolume / glass.maxMl) * 100}%`, height: `${(preview / glass.maxMl) * 100}%`, backgroundColor: selected.color, opacity: 0.5 }}
                      />
                    )}
                    {/* hielo: flota en la superficie del liquido; si no hay liquido, al fondo */}
                    {iceCubes > 0 && (
                      <IceCluster
                        cubes={iceCubes}
                        perRow={icePerRow}
                        centerX={80}
                        containerH={240}
                        floating={committedLiquid > 0}
                        surfaceBottom={(totalVolume / glass.maxMl) * 240}
                      />
                    )}
                  </div>
                </div>

                <div className="text-sm space-y-1 min-w-[92px]">
                  <div className="text-muted text-xs">Servido</div>
                  <div className="text-2xl font-bold text-brand tabular-nums">
                    {Math.round(totalVolume + preview)}
                    <span className="text-sm text-muted"> cc</span>
                  </div>
                  <div className="text-xs text-muted">de {glass.maxMl} cc</div>
                  {iceCubes > 0 && <div className="text-xs text-muted">Hielo: {iceCubes} cubitos</div>}
                  <div className="text-xs text-muted pt-1">Graduacion: {totals.abv.toFixed(1)}°</div>
                  <div className="text-xs text-muted">Alcohol: {totals.grams.toFixed(1)} g</div>
                </div>
              </div>

              {/* control de cubitos cuando esta el hielo elegido */}
              {isIce && (
                <div className="flex items-center justify-center gap-3 mt-3">
                  <button
                    onClick={() => setIceCubes((c) => Math.max(0, c - 1))}
                    disabled={iceCubes === 0}
                    className="w-9 h-9 rounded border border-border text-text text-lg flex items-center justify-center hover:bg-surface-2 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="text-sm text-text tabular-nums w-24 text-center">
                    {iceCubes} / {maxCubes} cubitos
                  </span>
                  <button
                    onClick={addCube}
                    disabled={iceCubes >= maxCubes}
                    className="w-9 h-9 rounded border border-border text-text text-lg flex items-center justify-center hover:bg-surface-2 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={undo}
                  disabled={parts.length === 0}
                  className="flex-1 rounded py-2 text-sm border border-border text-muted hover:text-text hover:bg-surface-2 disabled:opacity-40"
                >
                  Deshacer liquido
                </button>
                <button
                  onClick={resetAll}
                  disabled={parts.length === 0 && iceCubes === 0}
                  className="flex-1 rounded py-2 text-sm border border-border text-muted hover:text-text hover:bg-surface-2 disabled:opacity-40"
                >
                  Vaciar vaso
                </button>
              </div>
            </div>

            {(parts.length > 0 || iceCubes > 0) && (
              <ul className="space-y-1.5">
                {parts.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-text flex-1">
                      {p.name} <span className="text-muted">· {p.volumeMl}cc · {p.abv}°</span>
                    </span>
                  </li>
                ))}
                {iceCubes > 0 && (
                  <li className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: "#cfe0ee" }} />
                    <span className="text-text flex-1">
                      Hielo <span className="text-muted">· {iceCubes} cubitos · {iceVolume}cc</span>
                    </span>
                  </li>
                )}
              </ul>
            )}

            <div>
              <label className="text-sm text-muted block mb-1">Nombre (opcional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: mi fernet"
                className="w-full rounded bg-surface-2 border border-border px-3 py-2 text-text placeholder:text-muted/50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded py-2.5 border border-border text-muted hover:text-text hover:bg-surface-2"
              >
                Cerrar
              </button>
              <button
                onClick={handleAdd}
                disabled={parts.length === 0 && iceCubes === 0}
                className="flex-1 rounded py-2.5 font-medium text-on-brand bg-brand hover:bg-brand-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
