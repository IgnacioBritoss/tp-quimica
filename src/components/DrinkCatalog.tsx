"use client";

import { useState } from "react";
import { CATEGORY_LABELS, DRINKS } from "@/lib/drinks";
import { DrinkCategory, DrinkEntry, DrinkPreset } from "@/lib/types";
import { DrinkImage } from "@/components/DrinkImage";
import { AddDrinkModal } from "@/components/AddDrinkModal";
import { SectionCard } from "@/components/SectionCard";
import { drinkImage } from "@/lib/images";

interface DrinkCatalogProps {
  onAdd: (entry: DrinkEntry) => void;
  onOpenBuilder: () => void;
}

const CATEGORY_ORDER: DrinkCategory[] = ["fermentada", "destilada", "preparado", "otra"];

export function DrinkCatalog({ onAdd, onOpenBuilder }: DrinkCatalogProps) {
  const [selected, setSelected] = useState<DrinkPreset | null>(null);

  return (
    <SectionCard
      title="2. Que tomaste"
      subtitle="Elegi bebidas con medidas tipicas de vaso, copa o botella. Cada una trae sus medidas."
      right={
        <button
          onClick={onOpenBuilder}
          className="shrink-0 rounded border border-white/40 bg-white/10 text-on-brand text-sm font-medium px-3 py-1.5 hover:bg-white/20 transition-colors"
        >
          Arma tu trago
        </button>
      }
    >
      {CATEGORY_ORDER.map((category) => {
        const items = DRINKS.filter((d) => d.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {items.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelected(preset)}
                  className="group flex flex-col items-center gap-2 rounded border border-border bg-surface-2 p-3 hover:border-brand/50 hover:shadow-sm transition-all"
                >
                  <div
                    className="w-16 h-16 rounded overflow-hidden flex items-center justify-center border border-border transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${preset.color}1f` }}
                  >
                    <DrinkImage
                      src={drinkImage(preset.id)}
                      icon={preset.icon}
                      color={preset.color}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                      iconClassName="w-10 h-10"
                    />
                  </div>
                  <span className="text-xs text-text text-center leading-tight">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <AddDrinkModal
        key={selected?.id ?? "none"}
        preset={selected}
        onClose={() => setSelected(null)}
        onAdd={onAdd}
      />
    </SectionCard>
  );
}
