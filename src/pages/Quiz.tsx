// src/pages/Quiz.tsx (top of file)
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";

import { QUIZ_BANK /*, type QA */ } from "../data/quiz-data"; // <- single import
import { useProfileStore } from "../state/profile";

// ---------- optional SFX (safe if missing) ----------
const sfxCorrect = new Howl({ src: ["/assets/sfx/correct.mp3"], volume: 0.55 });
const sfxWrong   = new Howl({ src: ["/assets/sfx/wrong.mp3"],   volume: 0.5  });
const sfxClick   = new Howl({ src: ["/assets/sfx/click.mp3"],   volume: 0.3  });

// ---------- lifeline types ----------
type Lifelines = {
  accio: boolean;       // reveal correct option
  expelliarmus: boolean;// remove 1 wrong option
  lumos: boolean;       // show a small clue
};

export default function Quiz() {
  const navigate = useNavigate();
  const { category = "library" } = useParams();
  const cat = (category as QuizCategoryKey) || "library";

  const { name, addXp } = useProfileStore();

  // questions for this category
  const questions: QuizQ[] = useMemo(() => {
    const src = QUIZ_BANK[cat] ?? [];
    // small shuffle to keep variety
    return [...src].sort(() => Math.random() - 0.5).slice(0, 12);
  }, [cat]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);

  const [lifelines, setLifelines] = useState<Lifelines>({
    accio: true,
    expelliarmus: true,
    lumos: true,
  });

  // reduced options from Expelliarmus
  const [hiddenIdx, setHiddenIdx] = useState<number | null>(null);
  // clue from Lumos
  const [hintOn, setHintOn] = useState(false);

  const q = questions[index];

  // potion % (fills on correct)
  const potionPct = Math.round((score / questions.length) * 100);

  // handle answer
  function answer(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);

    const correct = q.options[i] === q.answer;

    if (correct) {
      try { sfxCorrect.play(); } catch {}
      setScore(s => s + 1);
      addXp(2); // small XP per correct
    } else {
      try { sfxWrong.play(); } catch {}
    }

    setTimeout(() => {
      // next
      setSelected(null);
      setLocked(false);
      setHiddenIdx(null);
      setHintOn(false);
      if (index + 1 < questions.length) {
        setIndex(i => i + 1);
      } else {
        // finished -> go to map
        navigate("/map");
      }
    }, 950);
  }

  // lifelines
  function useAccio() {
    if (!lifelines.accio || locked) return;
    try { sfxClick.play(); } catch {}
    setLifelines(l => ({ ...l, accio: false }));
    // auto select the correct after a flash
    const idx = q.options.findIndex(o => o === q.answer);
    setTimeout(() => answer(idx), 300);
  }

  function useExpelliarmus() {
    if (!lifelines.expelliarmus || locked) return;
    try { sfxClick.play(); } catch {}
    setLifelines(l => ({ ...l, expelliarmus: false }));
    // remove one wrong
    const candidates = q.options
      .map((opt, i) => ({ opt, i }))
      .filter(x => x.opt !== q.answer);
    const remove = candidates[Math.floor(Math.random() * candidates.length)].i;
    setHiddenIdx(remove);
  }

  function useLumos() {
    if (!lifelines.lumos || locked) return;
    try { sfxClick.play(); } catch {}
    setLifelines(l => ({ ...l, lumos: false }));
    setHintOn(true);
  }

  // derive options (maybe with one hidden)
  const visibleOptions = q.options
    .map((opt, i) => ({ opt, i }))
    .filter(item => hiddenIdx === null || item.i !== hiddenIdx);

  // simple category label
  const catName = {
    "library": "Library",
    "great-hall": "Great Hall",
    "potions": "Potions Class",
    "quidditch": "Quidditch Pitch",
  }[cat] ?? "Library";

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-extrabold">{catName}</h1>
        <p className="text-stone-600 text-sm">
          {name ? `${name}, ` : ""}answer the questions. Use your spells wisely!
        </p>
      </header>

      {/* Top bar: progress + lifelines */}
      <div className="hp-card p-4 flex flex-col gap-3">
        {/* progress */}
        <div className="flex items-center justify-between text-sm">
          <span>Question {index + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>

        {/* potion bar */}
        <div className="h-4 rounded-full bg-stone-200 overflow-hidden relative">
          <div className="absolute inset-0 hp-potion-grid pointer-events-none" />
          <motion.div
            className="h-full hp-bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${potionPct}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          />
        </div>

        {/* lifelines */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={useAccio}
            disabled={!lifelines.accio}
            className="hp-btn"
            title="Accio Answer — reveals the right one"
          >
            🪄 Accio
          </button>
          <button
            onClick={useExpelliarmus}
            disabled={!lifelines.expelliarmus}
            className="hp-btn"
            title="Expelliarmus — removes one wrong choice"
          >
            ✨ Expelliarmus
          </button>
          <button
            onClick={useLumos}
            disabled={!lifelines.lumos}
            className="hp-btn"
            title="Lumos — shows a clue"
          >
            🔦 Lumos
          </button>
        </div>
      </div>

      {/* question card */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="hp-card p-5 grid gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">❓</div>
            <p className="font-semibold leading-snug">{q.prompt}</p>
          </div>

          {/* Lumos hint */}
          <AnimatePresence>
            {hintOn && q.clue && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-900"
              >
                💡 <span className="font-semibold">Hint:</span> {q.clue}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-2">
            {visibleOptions.map(({ opt, i }) => {
              const isChosen = selected === i;
              const isCorrect = opt === q.answer;

              let cls = "w-full text-left px-4 py-2 rounded-lg border transition";
              if (isChosen) {
                cls += isCorrect ? " hp-border-primary hp-text-primary bg-white" : " border-rose-400 text-rose-600 bg-white";
              } else {
                cls += " hover:bg-white";
              }

              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={locked}
                  className={cls}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="text-sm text-stone-600">
        <Link to="/map" className="underline">← Back to the Map</Link>
      </div>
    </div>
  );
}
