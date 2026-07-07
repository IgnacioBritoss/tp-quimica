"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  compact?: boolean;
  align?: "left" | "right";
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function TimePicker({ value, onChange, compact, align = "left" }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [hh, mm] = useMemo(() => {
    const [h, m] = (value || "").split(":");
    return [h ?? "", m ?? ""];
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  function setHour(h: number) {
    onChange(`${pad(h)}:${mm || "00"}`);
  }
  function setMinute(m: number) {
    onChange(`${hh || "00"}:${pad(m)}`);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          compact
            ? "inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-1 text-text hover:border-brand/50 transition-colors"
            : "inline-flex items-center gap-2 rounded border border-border bg-surface-2 px-3 py-2 text-text hover:border-brand/50 transition-colors min-w-[130px]"
        }
      >
        <svg
          viewBox="0 0 24 24"
          width={compact ? 13 : 16}
          height={compact ? 13 : 16}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-brand"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={compact ? "tabular-nums text-sm font-medium" : "tabular-nums text-lg font-semibold tracking-wide"}>
          {value || "--:--"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className={`absolute z-40 mt-2 rounded-md border border-border bg-surface shadow-xl overflow-hidden ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <div className="flex items-center justify-between px-3 py-2 section-bar">
              <span className="text-sm font-semibold">Elegi la hora</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-on-brand/80 hover:text-on-brand text-sm"
              >
                Listo
              </button>
            </div>
            <div className="flex">
              <TimeColumn label="Hora" items={hours} selected={hh} onSelect={setHour} />
              <div className="w-px bg-border" />
              <TimeColumn label="Min" items={minutes} selected={mm} onSelect={setMinute} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimeColumn({
  label,
  items,
  selected,
  onSelect,
}: {
  label: string;
  items: number[];
  selected: string;
  onSelect: (n: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>("[data-selected='true']");
    el?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="w-[84px]">
      <div className="text-center text-xs font-semibold uppercase tracking-wide text-muted py-1.5 border-b border-border">
        {label}
      </div>
      <div ref={listRef} className="h-48 overflow-y-auto py-1">
        {items.map((n) => {
          const isSel = selected === String(n).padStart(2, "0");
          return (
            <button
              key={n}
              type="button"
              data-selected={isSel}
              onClick={() => onSelect(n)}
              className={`w-full text-center py-1.5 text-sm tabular-nums transition-colors ${
                isSel
                  ? "bg-brand text-on-brand font-semibold"
                  : "text-text hover:bg-surface-2"
              }`}
            >
              {String(n).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
