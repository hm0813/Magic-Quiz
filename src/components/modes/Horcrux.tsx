import { useState } from "react";
import { motion } from "framer-motion";
import { emit } from "../../lib/bus";

export type MiniQ = { prompt: string; options: string[]; correctIndex: number; };
export type HorcruxProps = {
  locketLabel?: string;
  parts: MiniQ[];                 // 2–3 mini questions
  onComplete: (ok: boolean, bonus: number) => void;
};

export default function HorcruxMode({ parts, locketLabel="Locket", onComplete }: HorcruxProps) {
  const [i, setI] = useState(0);
  const [okCount, setOk] = useState(0);

  const cur = parts[i];

  function pick(ix: number) {
    const ok = ix === cur.correctIndex;
    emit("horcrux:partComplete", { ok, partIndex: i });
    if (ok) setOk(v => v+1);

    if (i < parts.length - 1) {
      setI(i + 1);
    } else {
      const win = (okCount + (ok?1:0)) === parts.length;
      const bonus = win ? 3 : 1;
      onComplete(win, bonus);
    }
  }

  const prog = (okCount / parts.length) * 100;

  return (
    <div className="hp-card p-6 space-y-6">
      <header className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="absolute inset-0">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="4"/>
            <motion.circle
              cx="18" cy="18" r="16" fill="none"
              stroke="#16a34a" strokeWidth="4" strokeLinecap="round"
              style={{ pathLength: okCount / parts.length }}
              initial={{ pathLength: 0 }} animate={{ pathLength: okCount / parts.length }}
            />
          </svg>
          <div className="absolute inset-0 rounded-full flex items-center justify-center text-xs">
            {locketLabel}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Horcrux Challenge</h2>
          <p className="text-sm text-stone-600">Destroy it by answering all mini-questions correctly.</p>
        </div>
      </header>

      <div className="space-y-3">
        <p className="font-semibold">{i+1}. {cur.prompt}</p>
        <div className="grid gap-2">
          {cur.options.map((opt, ix) => (
            <button key={ix}
              onClick={() => pick(ix)}
              className="text-left px-4 py-2 rounded-lg border hover:bg-white">
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600" style={{ width: `${prog}%` }} />
      </div>
    </div>
  );
}
