import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export type PolyQ = {
  prompt: string;
  options: { label: string; asCharacterCorrect?: boolean }[];
};

export default function PolyjuiceRound({
  character,
  questions,
  onFinish,
}: {
  character: string;
  questions: PolyQ[];
  onFinish: (score: number, streakBonus: number) => void;
}) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const cur = questions[i];

  function choose(ix: number) {
    const good = !!cur.options[ix].asCharacterCorrect;
    setScore(s => s + (good ? 1 : 0));
    setStreak(s => (good ? s + 1 : 0));
    if (i < questions.length - 1) setI(i+1);
    else onFinish(score + (good?1:0), Math.max(streak + (good?1:0) - 1, 0));
  }

  const frameColor = useMemo(() => ({
    Hermione: "#14b8a6", Harry: "#ef4444", Snape: "#64748b", Dumbledore: "#a855f7"
  } as Record<string,string>)[character] ?? "#0ea5e9", [character]);

  useEffect(() => { document.title = `Polyjuice: ${character}`; }, [character]);

  return (
    <div className="hp-card p-0 overflow-hidden">
      {/* Role banner */}
      <div className="px-4 py-3 text-white font-semibold" style={{ background: frameColor }}>
        You are <span className="underline">{character}</span> — answer as they would.
      </div>

      <div className="p-5 space-y-4">
        <div className="text-sm text-stone-600">Streak bonus grows with consecutive “in-character” choices.</div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
          className="space-y-3"
        >
          <div className="font-semibold">{i+1}. {cur.prompt}</div>
          <div className="grid gap-2">
            {cur.options.map((o, ix) => (
              <button key={ix} onClick={() => choose(ix)}
                className="text-left px-4 py-2 rounded-lg border hover:bg-white">
                {o.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center gap-4 text-sm">
          <span>Score: <b>{score}</b></span>
          <span>Streak: <b>{streak}</b></span>
        </div>
      </div>
    </div>
  );
}
