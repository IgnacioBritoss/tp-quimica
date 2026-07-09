"use client";

import { motion } from "framer-motion";
import { ScoreEntry } from "@/lib/leaderboard";

export function fmtTime(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

const MEDAL: Record<number, { bg: string; ring: string }> = {
  1: { bg: "#d4af37", ring: "#b8912a" }, // oro
  2: { bg: "#9aa4ad", ring: "#7d868e" }, // plata
  3: { bg: "#b87333", ring: "#96602a" }, // bronce
};

function RankBadge({ rank }: { rank: number }) {
  const medal = MEDAL[rank];
  if (medal) {
    return (
      <span
        className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
        style={{ backgroundColor: medal.bg, border: `2px solid ${medal.ring}` }}
      >
        {rank}
      </span>
    );
  }
  return (
    <span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-muted text-sm font-semibold border border-border">
      {rank}
    </span>
  );
}

interface LeaderboardProps {
  entries: ScoreEntry[];
  highlightDate?: number;
  limit?: number;
}

export function Leaderboard({ entries, highlightDate, limit = 8 }: LeaderboardProps) {
  const shown = entries.slice(0, limit);
  return (
    <ol className="space-y-1.5">
      {shown.map((e, i) => {
        const rank = i + 1;
        const isYou = highlightDate != null && e.date === highlightDate;
        return (
          <motion.li
            key={`${e.name}-${e.date ?? "pin"}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 rounded-md border p-2.5 ${
              isYou ? "border-brand bg-brand/10" : "border-border bg-surface-2"
            }`}
          >
            <RankBadge rank={rank} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-text truncate">
                {e.name}
                {e.pinned && <span className="ml-1.5 text-[10px] uppercase tracking-wide text-warn">leyenda</span>}
                {isYou && <span className="ml-1.5 text-[10px] uppercase tracking-wide text-brand">vos</span>}
              </div>
              <div className="text-[11px] text-muted">
                {e.meta ? `${e.meta} · ` : ""}
                {fmtTime(e.timeMs)}
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold text-brand tabular-nums">{e.score}</div>
              <div className="text-[10px] text-muted">pts</div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
