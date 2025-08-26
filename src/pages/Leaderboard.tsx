// src/pages/Leaderboard.tsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLeaderboard } from "../state/leaderboard";
import { HOUSES } from "../theme/houses";
import { useProfileStore } from "../state/profile";

function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function Leaderboard() {
  const { entries, clear } = useLeaderboard();
  const me = useProfileStore();
  const [filter, setFilter] = useState<"all" | "library" | "potions" | "great-hall" | "quidditch">("all");

  const filtered = useMemo(
    () => entries.filter(e => (filter === "all" ? true : e.category === filter)),
    [entries, filter]
  );

  const top = useMemo(() => [...filtered].sort((a,b)=>b.percent-a.percent).slice(0,10), [filtered]);

  return (
    <section className="space-y-6">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="hp-daily-prophet p-4 rounded-xl border overflow-hidden"
      >
        <div className="hp-dp-name">The Daily Prophet</div>
        <div className="hp-dp-marquee">
          <div className="hp-dp-track">
            <span>🎉 Breaking: {me.name || "A Student"} shines at Hogwarts Quiz! </span>
            <span>🏆 Houses compete for glory — who will claim the Cup? </span>
            <span>✨ Spells aid scholars: Accio, Expelliarmus, Lumos, Patronus! </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {["all","great-hall","library","potions","quidditch"].map(k => (
            <button
              key={k}
              onClick={()=>setFilter(k as any)}
              className={[
                "px-3 py-1.5 rounded-lg border",
                filter===k ? "bg-white hp-border-primary hp-text-primary" : "hover:bg-white"
              ].join(" ")}
            >
              {k.replace("-"," ").replace(/\b\w/g, c=>c.toUpperCase())}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <Link to="/map" className="px-3 py-1.5 rounded-lg border hover:bg-white">← Back to Map</Link>
            <button onClick={clear} className="px-3 py-1.5 rounded-lg border hover:bg-white">Clear</button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-stone-600">
              <tr>
                <th className="py-2 pr-2 text-left">Rank</th>
                <th className="py-2 pr-2 text-left">Witch/Wizard</th>
                <th className="py-2 pr-2 text-left">House</th>
                <th className="py-2 pr-2 text-left">Category</th>
                <th className="py-2 pr-2 text-right">Score</th>
                <th className="py-2 pr-2 text-right">XP</th>
                <th className="py-2 pr-2 text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {top.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No entries yet. Play a quiz to see your name in the paper!
                  </td>
                </tr>
              )}
              {top.map((e, i) => {
                const h = HOUSES[e.house as keyof typeof HOUSES];
                return (
                  <tr key={e.id} className="border-b hover:bg-white/80">
                    <td className="py-2 pr-2">{i+1}</td>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full" style={{ background: h.primary }} />
                        <div className="font-medium">{e.name || "Student"}</div>
                      </div>
                    </td>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        {h.crest ? (
                          <img src={h.crest} alt="" className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="text-lg" aria-hidden>{h.crestEmoji}</span>
                        )}
                        <span>{h.name}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-2 capitalize">{e.category.replace("-"," ")}</td>
                    <td className="py-2 pr-2 text-right">
                      <b>{e.score}</b> / {e.total} <span className="text-stone-500">({e.percent}%)</span>
                    </td>
                    <td className="py-2 pr-2 text-right">{e.xp}</td>
                    <td className="py-2 pr-2 text-right text-stone-500">{timeAgo(e.at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-[11px] tracking-wide text-stone-500">
          Printed by the Daily Prophet | Special Hogwarts Edition
        </div>
      </motion.div>
    </section>
  );
}
