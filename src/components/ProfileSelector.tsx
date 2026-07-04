"use client";

import { BODY_TYPES } from "@/lib/bodyTypes";
import { Profile, Sex } from "@/lib/types";
import { BodyIllustration } from "@/components/BodyIllustration";
import { SectionCard } from "@/components/SectionCard";

interface ProfileSelectorProps {
  profile: Profile;
  onChange: (profile: Profile) => void;
}

const SEX_OPTIONS: { id: Sex; label: string }[] = [
  { id: "masculino", label: "Masculino" },
  { id: "femenino", label: "Femenino" },
];

export function ProfileSelector({ profile, onChange }: ProfileSelectorProps) {
  return (
    <SectionCard
      title="1. Tu cuerpo"
      subtitle="El mismo trago afecta distinto segun el cuerpo. Elegi lo que mas se parezca a vos."
    >
      <div className="grid grid-cols-2 gap-2">
        {SEX_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange({ ...profile, sex: opt.id })}
            className={`rounded py-2.5 text-sm font-medium border transition-colors ${
              profile.sex === opt.id
                ? "bg-brand text-on-brand border-brand"
                : "border-border text-muted hover:text-text hover:border-brand/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {BODY_TYPES.map((bt) => {
          const active = profile.bodyType === bt.id;
          const label =
            bt.id === "promedio"
              ? `No estoy segur${profile.sex === "femenino" ? "a" : "o"} / Promedio`
              : bt.label;
          return (
            <button
              key={bt.id}
              onClick={() => onChange({ ...profile, bodyType: bt.id })}
              className={`text-left rounded border p-3 transition-all ${
                active
                  ? "border-brand bg-brand/10 shadow-sm"
                  : "border-border bg-surface-2 hover:border-brand/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-16 shrink-0 flex items-center justify-center">
                  <BodyIllustration bodyType={bt.id} sex={profile.sex} active={active} className="w-full h-full" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">{label}</div>
                  <div className="text-xs text-muted mt-0.5 leading-tight">{bt.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label htmlFor="weight" className="text-sm text-muted">
            Peso aproximado
          </label>
          <span className="text-xl font-bold text-brand tabular-nums">{profile.weightKg} kg</span>
        </div>
        <input
          id="weight"
          type="range"
          min={35}
          max={150}
          step={1}
          value={profile.weightKg}
          onChange={(e) => onChange({ ...profile, weightKg: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted/70 mt-1">
          <span>35 kg</span>
          <span>150 kg</span>
        </div>
      </div>
    </SectionCard>
  );
}
