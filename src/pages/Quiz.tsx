// src/pages/Quiz.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { QUIZ_DATA } from "../data/quiz-data";
import { useSettings } from "../state/settings";
import { useRun } from "../state/run";
import { useProfileStore } from "../state/profile";
import { useLeaderboard } from "../state/leaderboard";
import { emit } from "../lib/bus";

type QuizItem = {
  prompt: string;
  options: string[];
  correctIndex: number;
  hint?: string;
};

const OWL_TIME = 22;     // seconds per question
const NEWT_TIME = 14;    // harder & faster
const CORRECT_XP = 5;
const PERFECT_BONUS_XP = 25;

export default function Quiz() {
  const nav = useNavigate();
  const params = useParams();

  // Category comes from /quiz/:category or defaults to "library"
  const category = (params.category ?? "library").toLowerCase();
  const pool: QuizItem[] = QUIZ_DATA[category] ?? [];

  const difficulty = useSettings((s) => s.difficulty);
  const tPerQ = difficulty === "NEWT" ? NEWT_TIME : OWL_TIME;

  const run = useRun();
  const profile = useProfileStore();
  const addScore = useLeaderboard((s) => s.add);

  // per-question state
  const [time, setTime] = useState(tPerQ);
  const [locked, setLocked] = useState(false);
  const [revealed, setRevealed] = useState<null | number>(null); // Accio
  const [hiddenWrong, setHiddenWrong] = useState<number | null>(null); // Expelliarmus
  const [showHint, setShowHint] = useState(false); // Lumos hint
  const [patronusUsed, setPatronusUsed] = useState(false); // one-time shield per run

  const timerRef = useRef<number | null>(null);
  const q = pool[run.questionIndex];

  // Start run if not started
  useEffect(() => {
    if (!run.category || run.category !== category) {
      run.start(category);
      setTime(tPerQ);
      resetSpellState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Per-question timer
  useEffect(() => {
    clearTimer();
    setTime(tPerQ);
    timerRef.current = window.setInterval(() => {
      setTime((s) => (s > 0 ? s - 1 : 0));
    }, 1000) as unknown as number;
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run.questionIndex, tPerQ]);

  // Time out => counts like a wrong answer (unless patronus triggers)
  useEffect(() => {
    if (!q) return;
    if (time === 0 && !locked) {
      submitAnswer(-1); // force wrong
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  // Helpers
  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function resetSpellState() {
    setRevealed(null);
    setHiddenWrong(null);
    setShowHint(false);
    setLocked(false);
  }

  // Lifelines / spells
  function useAccio() {
    if (!profile.useSpell("accio") || revealed !== null || !q) return;
    setRevealed(q.correctIndex);
    run.useSpell("accio");
    emit("spell:used", { type: "accio" });
  }

  function useExpelliarmus() {
    if (!profile.useSpell("expelliarmus") || hiddenWrong !== null || !q) return;
    // remove one wrong
    const wrongIndices = q.options
      .map((_, idx) => idx)
      .filter((i) => i !== q.correctIndex);
    const remove = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    setHiddenWrong(remove);
    run.useSpell("expelliarmus");
    emit("spell:used", { type: "expelliarmus" });
  }

  function useLumos() {
    if (!profile.useSpell("lumos") || showHint) return;
    setShowHint(true);
    run.useSpell("lumos");
    emit("spell:used", { type: "lumos" });
  }

  // Patronus shield (one-time per run if they have it)
  function tryPatronusShield(): boolean {
    if (!profile.patronusUnlocked || patronusUsed) return false;
    setPatronusUsed(true);
    emit("spell:used", { type: "patronus-triggered" });
    return true;
  }

  // Answer handling
  function submitAnswer(ix: number) {
    if (!q || locked) return;

    setLocked(true);
    const ok = ix === q.correctIndex;

    // Score + events
    if (ok) {
      run.correct();
      profile.addXp(CORRECT_XP);
      emit("answer:correct", { category, index: run.questionIndex });
    } else {
      // If wrong, see if Patronus blocks the penalty once
      const blocked = tryPatronusShield();
      if (!blocked) {
        run.wrong();
      }
      emit("answer:wrong", { category, index: run.questionIndex });
    }

    // Move next (small pause for animation)
    setTimeout(() => {
      clearTimer();
      if (run.questionIndex >= pool.length - 1) {
        finishQuiz();
      } else {
        run.next();
        resetSpellState();
      }
    }, 450);
  }

  function finishQuiz() {
    // Perfect check
    const perfect = run.score === pool.length;
    if (perfect) {
      profile.addXp(PERFECT_BONUS_XP);
      emit("quiz:perfect", {});
    }

    // Leaderboard
    const name = profile.name || "Anonymous";
    useLeaderboard.getState().add({
      name,
      score: run.score,
      category,
    });

    nav("/results");
  }

  // UI bits
  const progressPct = useMemo(() => {
    return Math.round(((run.questionIndex) / pool.length) * 100);
  }, [run.questionIndex, pool.length]);

  const potionPct = useMemo(() => {
    if (!pool.length) return 0;
    return Math.min(100, Math.round((run.score / pool.length) * 100));
  }, [run.score, pool.length]);

  // Timer as percentage (RIGHT -> LEFT shrink)
  const timePct = useMemo(() => (time / tPerQ) * 100, [time, tPerQ]);

  if (!q) {
    return (
      <div className="hp-card p-6">
        <h1 className="text-xl font-bold">No questions found</h1>
        <p className="text-stone-600">The category “{category}” doesn’t have any questions yet.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold">Quiz · {titleCase(category)}</h1>
        <p className="text-stone-600">
          {difficulty === "NEWT" ? "N.E.W.T.s difficulty — faster timer, higher challenge." : "O.W.L.s difficulty — relaxed timer."}
        </p>
      </header>

      {/* Snitch time bar (right → left) */}
      <div className="relative h-3 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 hp-bg-primary"
          style={{ width: `${timePct}%` }}
        />
        <motion.div
          className="absolute -top-5"
          initial={{ right: "0%" }}
          animate={{ right: `${100 - timePct}%` }}
          transition={{ type: "tween", duration: 0.35 }}
        >
          <span className="text-xl">🟡</span>
        </motion.div>
      </div>

      {/* Potion progress */}
      <div className="hp-card p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-16 rounded-b-xl border relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 hp-bg-primary" style={{ height: `${potionPct}%` }} />
          </div>
          <div className="text-sm text-stone-700">
            Knowledge Potion: <b>{potionPct}%</b> filled ({run.score}/{pool.length})
          </div>
        </div>
      </div>

      {/* Spells bar */}
      <div className="hp-card p-4 flex flex-wrap items-center gap-2">
        <SpellButton label="Accio" count={profile.spells.acco ?? profile.spells["accio"]} onClick={useAccio} />
        <SpellButton label="Expelliarmus" count={profile.spells.expelliarmus} onClick={useExpelliarmus} />
        <SpellButton label="Lumos" count={profile.spells.lumos} onClick={useLumos} />
        <div className="ml-auto text-sm text-stone-600">
          Patronus shield: {profile.patronusUnlocked ? (patronusUsed ? "used" : "ready") : "locked"}
        </div>
      </div>

      {/* Question card */}
      <div className="hp-card p-5 space-y-4">
        <div className="flex items-center justify-between text-sm text-stone-600">
          <div>Question <b>{run.questionIndex + 1}</b> / {pool.length}</div>
          <div>Progress <b>{progressPct}%</b></div>
        </div>

        <p className="font-semibold text-lg">{q.prompt}</p>

        {showHint && q.hint && (
          <div className="text-sm p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            💡 <span className="font-medium">Hint:</span> {q.hint}
          </div>
        )}

        <div className="grid gap-2">
          {q.options.map((opt, idx) => {
            const disabled =
              locked ||
              idx === hiddenWrong ||              // removed by Expelliarmus
              (revealed !== null && idx !== revealed); // forced reveal by Accio

            const isCorrect = locked && idx === q.correctIndex;
            const isWrongPick = locked && idx !== q.correctIndex && idx === revealed;

            return (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => submitAnswer(idx)}
                className={[
                  "text-left px-4 py-2 rounded-lg border transition",
                  disabled ? "opacity-70" : "hover:bg-white",
                  isCorrect ? "border-emerald-600" : "",
                  isWrongPick ? "border-red-500" : "",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------- helpers & small components ----------------- */

function titleCase(s: string) {
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}

function SpellButton({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  const disabled = count <= 0;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "px-3 py-1.5 rounded-lg border text-sm",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white",
      ].join(" ")}
      title={disabled ? "No charges left" : "Cast the spell"}
    >
      {label} {count > 0 ? <span className="text-stone-500">x{count}</span> : null}
    </button>
  );
}
