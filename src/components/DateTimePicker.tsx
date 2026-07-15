"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DateTimePickerProps {
  value: number; // epoch ms
  onChange: (value: number) => void;
  compact?: boolean;
  align?: "left" | "right";
}

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function label(value: number): string {
  const d = new Date(value);
  const now = new Date();
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (sameDay(d, now)) return `Hoy ${hm}`;
  if (sameDay(d, yest)) return `Ayer ${hm}`;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${hm}`;
}

const PANEL_HEIGHT = 360; // alto aprox del calendario para decidir si abre hacia arriba

export function DateTimePicker({ value, onChange, compact, align = "left" }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const d = new Date(value);
  const [viewYear, setViewYear] = useState(d.getFullYear());
  const [viewMonth, setViewMonth] = useState(d.getMonth());

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function toggle() {
    if (!open) {
      // al abrir, mostrar el mes del valor actual
      const cur = new Date(value);
      setViewYear(cur.getFullYear());
      setViewMonth(cur.getMonth());
      // si no hay lugar abajo, abrir hacia arriba
      const rect = ref.current?.getBoundingClientRect();
      const below = rect ? window.innerHeight - rect.bottom : Infinity;
      setDropUp(below < PANEL_HEIGHT && (rect ? rect.top > PANEL_HEIGHT : false));
    }
    setOpen((o) => !o);
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Dom
  const offset = (firstDay + 6) % 7; // arranca en lunes
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const sel = new Date(value);

  function pickDay(day: number) {
    const nd = new Date(viewYear, viewMonth, day, sel.getHours(), sel.getMinutes(), 0, 0);
    onChange(nd.getTime());
  }
  function setHM(h: number, m: number) {
    const nd = new Date(sel);
    nd.setHours(h, m, 0, 0);
    onChange(nd.getTime());
  }
  function prevMonth() {
    const m = viewMonth - 1;
    if (m < 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth(m);
  }
  function nextMonth() {
    const m = viewMonth + 1;
    if (m > 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth(m);
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        className={
          compact
            ? "inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-1 text-text hover:border-brand/50 transition-colors"
            : "inline-flex items-center gap-2 rounded border border-border bg-surface-2 px-3 py-2 text-text hover:border-brand/50 transition-colors"
        }
      >
        <svg viewBox="0 0 24 24" width={compact ? 13 : 16} height={compact ? 13 : 16} fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v3M16 3v3" strokeLinecap="round" />
        </svg>
        <span className={compact ? "tabular-nums text-sm font-medium" : "tabular-nums text-base font-semibold"}>
          {label(value)}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className={`absolute z-40 w-[268px] rounded-md border border-border bg-surface shadow-xl overflow-hidden ${
              align === "right" ? "right-0" : "left-0"
            } ${dropUp ? "bottom-full mb-2" : "top-full mt-2"}`}
          >
            <div className="section-bar px-3 py-2 flex items-center justify-between">
              <button type="button" onClick={prevMonth} className="text-on-brand/80 hover:text-on-brand px-1" aria-label="Mes anterior">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span className="text-sm font-semibold capitalize">{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" onClick={nextMonth} className="text-on-brand/80 hover:text-on-brand px-1" aria-label="Mes siguiente">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="text-center text-[10px] font-semibold uppercase text-muted py-1">{w}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: offset }).map((_, i) => <div key={`b${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSel = sel.getFullYear() === viewYear && sel.getMonth() === viewMonth && sel.getDate() === day;
                  const isToday = sameDay(new Date(viewYear, viewMonth, day), new Date());
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => pickDay(day)}
                      className={`h-8 rounded text-sm tabular-nums transition-colors ${
                        isSel
                          ? "bg-brand text-on-brand font-semibold"
                          : isToday
                            ? "text-brand font-semibold hover:bg-surface-2"
                            : "text-text hover:bg-surface-2"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted">Hora</span>
                <select
                  value={sel.getHours()}
                  onChange={(e) => setHM(Number(e.target.value), sel.getMinutes())}
                  className="flex-1 rounded bg-surface-2 border border-border px-2 py-1.5 text-text text-sm"
                >
                  {hours.map((h) => <option key={h} value={h}>{pad(h)}</option>)}
                </select>
                <span className="text-text font-semibold">:</span>
                <select
                  value={sel.getMinutes()}
                  onChange={(e) => setHM(sel.getHours(), Number(e.target.value))}
                  className="flex-1 rounded bg-surface-2 border border-border px-2 py-1.5 text-text text-sm"
                >
                  {minutes.map((m) => <option key={m} value={m}>{pad(m)}</option>)}
                </select>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onChange(Date.now())}
                  className="rounded px-3 py-1.5 text-xs border border-border text-muted hover:text-text hover:bg-surface-2"
                >
                  Ahora
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded px-4 py-1.5 text-sm font-medium text-on-brand bg-brand hover:bg-brand-strong"
                >
                  Listo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
