// src/pages/Sorting.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { useNavigate } from "react-router-dom";
import { SORTING_QUESTIONS } from "../data/sorting-questions";
import { HOUSES, type HouseKey } from "../theme/houses";
import { useProfileStore } from "../state/profile";

const fanfare = new Howl({
  src: ["/assets/sfx/sort.mp3"], // optional; safe if missing
  volume: 0.6,
});

// ----- SETTINGS: tweak these -----
const RESULT_DELAY_MS = 10000;   // how long to show the result screen (in ms)
const AUTO_NAVIGATE   = true;   // true = auto go to /map after delay; false = only button
// ---------------------------------

export default function Sorting() {
  const navigate = useNavigate();
  const { name, setName, house, setHouse, addXp } = useProfileStore();

  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [answers, setAnswers] = useState<Record<string, HouseKey | null>>({});
  const [result, setResult] = useState<HouseKey | null>(null);
  const [countdown, setCountdown] = useState<number>(Math.ceil(RESULT_DELAY_MS / 1000));

  // keep timer ids so we can clean them up
  const tickRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Initialize answer map
  useEffect(() => {
    const init: Record<string, HouseKey | null> = {};
    SORTING_QUESTIONS.forEach((q) => (init[q.id] = null));
    setAnswers(init);
  }, []);

  // Clean up timers when the component unmounts or step changes
  useEffect(() => {
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const progress = useMemo(() => {
    const total = SORTING_QUESTIONS.length;
    const done = Object.values(answers).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }, [answers]);

  function chooseAnswer(qid: string, h: HouseKey) {
    setAnswers((prev) => ({ ...prev, [qid]: h }));
  }

  function computeHouse(): HouseKey {
    const tally: Record<HouseKey, number> = {
      gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0
    };
    Object.values(answers).forEach((h) => { if (h) tally[h] += 1; });
    let best: HouseKey = "gryffindor"; let bestScore = -1;
    (Object.keys(tally) as HouseKey[]).forEach((k) => {
      if (tally[k] > bestScore) { bestScore = tally[k]; best = k; }
    });
    return best;
  }

  function startQuiz() {
    setStep("quiz");
  }

  function finish() {
    const h = computeHouse();
    setResult(h);
    setHouse(h);
    addXp(10);
    try { fanfare.play(); } catch {}
    setStep("result");

    // reset and start countdown
    setCountdown(Math.ceil(RESULT_DELAY_MS / 1000));
    const startedAt = Date.now();

    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => {
      const msLeft = Math.max(0, RESULT_DELAY_MS - (Date.now() - startedAt));
      setCountdown(Math.ceil(msLeft / 1000));
      if (msLeft <= 0 && tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    }, 250);

    if (AUTO_NAVIGATE) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        navigate("/map");
      }, RESULT_DELAY_MS);
    }
  }

  // If already sorted, keep result visible
  useEffect(() => { if (house) setResult(house); }, [house]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold">Sorting Hat</h1>
        <p className="text-stone-600">
          Answer a few fun questions. We’ll sort you and set your theme colors automatically.
        </p>
      </header>

      {/* Name input */}
      <div className="hp-card p-5">
        <label className="block text-sm font-medium mb-2">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name..."
          className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
        />
        <p className="mt-2 text-xs text-stone-500">We’ll show this on leaderboards and certificates.</p>
      </div>

      {/* Intro → Quiz Button */}
      {step === "intro" && (
        <div className="flex justify-end">
          <button
            onClick={startQuiz}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-xl text-white bg-stone-900 disabled:opacity-40"
          >
            Begin Sorting
          </button>
        </div>
      )}

      {/* Progress bar */}
      {step !== "intro" && (
        <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
          <div className="h-full hp-bg-primary" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Quiz + Result */}
      <AnimatePresence mode="popLayout">
        {step === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid gap-6"
          >
            {SORTING_QUESTIONS.map((q, i) => (
              <div key={q.id} className="hp-card p-5">
                <p className="font-semibold mb-3">{i + 1}. {q.prompt}</p>
                <div className="grid gap-2">
                  {q.options.map((opt, idx) => {
                    const selected = answers[q.id] === opt.favors;
                    return (
                      <button
                        key={idx}
                        onClick={() => chooseAnswer(q.id, opt.favors)}
                        className={[
                          "w-full text-left px-4 py-2 rounded-lg border transition",
                          selected ? "hp-border-primary hp-text-primary bg-white" : "hover:bg-white"
                        ].join(" ")}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={finish}
                disabled={progress < 100}
                className="px-4 py-2 rounded-xl text-white bg-stone-900 disabled:opacity-40"
              >
                Reveal My House
              </button>
            </div>
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hp-card p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="hp-crest-wrap"
            >
              {HOUSES[result].crest ? (
                <img
                  src={HOUSES[result].crest}
                  alt={`${HOUSES[result].name} crest`}
                  className="hp-crest"
                />
              ) : (
                <span className="hp-crest text-7xl flex items-center justify-center" aria-hidden>
                  {HOUSES[result].crestEmoji}
                </span>
              )}
            </motion.div>

            <h2 className="mt-4 text-3xl font-extrabold house-name">
              {HOUSES[result].name}!
            </h2>

            <p className="mt-2 text-stone-600">
              {AUTO_NAVIGATE
                ? <>Your theme has been set. Taking you to the Map in <b>{countdown}s</b>…</>
                : <>Your theme has been set. You can continue whenever you’re ready.</>}
            </p>

            <button
              onClick={() => navigate("/map")}
              className="mt-4 px-4 py-2 rounded-xl text-white bg-stone-900"
            >
              Continue to the Map →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
