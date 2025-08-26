import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "../../state/settings";

export type BlitzQ = { prompt: string; options: string[]; correctIndex: number; };

export default function QuidditchBonus({
  duration = 75,          // 60–90s recommended
  questions,
  onFinish
}: {
  duration?: number;
  questions: BlitzQ[];
  onFinish: (score: number, perfectStreak: number) => void;
}) {
  const diff = useSettings(s => s.difficulty);
  const time = diff === "NEWT" ? Math.max(45, duration - 15) : duration;

  const [t, setT] = useState(time);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<any>(null);

  const cur = questions[i];

  useEffect(() => {
    timerRef.current = setInterval(() => setT(s => s - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (t <= 0) {
      clearInterval(timerRef.current);
      onFinish(score, streak);
    }
  }, [t, score, streak, onFinish]);

  function pick(ix: number) {
    const ok = ix === cur.correctIndex;
    setScore(s => s + (ok ? 1 : 0));
    setStreak(s => ok ? s + 1 : 0);

    if (!ok) { setShake(true); setTimeout(() => setShake(false), 220); }

    setI(n => (n + 1) % questions.length); // loop through pool
  }

  const pct = useMemo(() => (t / time) * 100, [t, time]);

  return (
    <div className="hp-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-stone-600">Quidditch Blitz — {time}s total, {diff}</div>
        <div className="text-sm">Score: <b>{score}</b> | Streak: <b>{streak}</b></div>
      </div>

      {/* top time bar with snitch going RIGHT -> LEFT */}
      <div className="relative h-3 bg-stone-200 rounded-full overflow-hidden">
        <div className="absolute inset-y-0 right-0 bg-amber-500" style={{ width: `${pct}%` }} />
        <motion.div
          className="absolute -top-5"
          initial={{ right: "0%" }} animate={{ right: `${100 - pct}%` }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          <span className="text-xl">🏆🟡</span>
        </motion.div>
      </div>

      <motion.div
        animate={shake ? { x: [0, -8, 8, -6, 6, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.25 }}
        key={i}
        className="space-y-3"
      >
        <p className="font-semibold">{cur.prompt}</p>
        <div className="grid gap-2">
          {cur.options.map((o, ix) => (
            <button key={ix} onClick={() => pick(ix)} className="text-left px-4 py-2 rounded-lg border hover:bg-white">
              {o}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
