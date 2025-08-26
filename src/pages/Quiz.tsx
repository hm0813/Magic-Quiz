import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";

import { QUIZ_BANK } from "../data/quiz-data";
import { useProfileStore } from "../state/profile";
import { HOUSES } from "../theme/houses";
import { useAchievements } from "../state/achievements";
import { useLeaderboard } from "../state/leaderboard";
import { DIFFICULTY, useSettings } from "../state/settings";
import { emit } from "../lib/bus";

import HorcruxRing from "../components/modes/Horcrux";
import PolyjuiceFrame from "../components/modes/Polyjuice";
import QuidditchHUD from "../components/modes/Quidditch";

const RESULT_PATH = "/results";
const BASE_XP = 5;
const sfxCorrect = new Howl({ src: ["/assets/sfx/correct.mp3"], volume: 0.5 });
const sfxWrong   = new Howl({ src: ["/assets/sfx/wrong.mp3"],   volume: 0.5 });
const sfxSpell   = new Howl({ src: ["/assets/sfx/spell.mp3"],   volume: 0.45 });

type Choice = { text: string; correct?: boolean; hint?: string };
type Mini = { prompt: string; choices: Choice[] };
type Q = {
  id: string; prompt: string; choices?: Choice[];
  horcruxParts?: Mini[];
  tag?: "polyjuice" | "bonus";
};

type Lifelines = { accio: boolean; expelliarmus: boolean; lumos: boolean; patronus: boolean };

export default function Quiz() {
  const navigate = useNavigate();
  const { category = "library" } = useParams();
  const { addXp, name, house } = useProfileStore();
  const ach = useAchievements();
  const leaderboard = useLeaderboard();
  const settings = useSettings();

  // difficulty knobs
  const d = DIFFICULTY[settings.difficulty];
  const TIME_ACTIVE = settings.enableTimer;
  const BASE_TIME   = settings.secondsPerQuestion;
  const TIME_LIMIT  = Math.round(BASE_TIME * d.timerMult);
  const VOL         = settings.sfx;

  const questions: Q[] = useMemo(() => QUIZ_BANK[category] ?? [], [category]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [bonusXP, setBonusXP] = useState(0);

  const [feedback, setFeedback] = useState<"correct" | "wrong" | "shield" | null>(null);
  const [locked, setLocked] = useState(false);

  const [life, setLife] = useState<Lifelines>(d.lifelines);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const [removedIndex, setRemovedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [shieldArmed, setShieldArmed] = useState(false);

  const [polyjuiceStreak, setPolyjuiceStreak] = useState(0);
  const [patronusTriggered, setPatronusTriggered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  const q = questions[index];
  const isHorcrux = !!q?.horcruxParts?.length;
  const [partIndex, setPartIndex] = useState(0);
  const display: Mini = useMemo(() => {
    if (isHorcrux) return q!.horcruxParts![partIndex];
    return { prompt: q?.prompt ?? "", choices: q?.choices ?? [] };
  }, [q, isHorcrux, partIndex]);

  // volume helper
  function play(h: Howl) { try { h.volume(VOL); h.play(); } catch {} }
  const fill = Math.round((score / Math.max(1, questions.length)) * 100);

  // reset per question
  useEffect(() => {
    setFeedback(null); setLocked(false);
    setRevealCorrect(false); setRemovedIndex(null);
    setShowHint(false); setTimeLeft(TIME_LIMIT);
    setPartIndex(0);
  }, [index, TIME_LIMIT]);

  // timer
  useEffect(() => {
    if (!q || locked || !TIME_ACTIVE) return;
    if (timeLeft <= 0) { selectAnswer(-1); return; }
    const t = window.setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, locked, q, TIME_ACTIVE]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q || locked) return;
      const k = e.key.toLowerCase();
      if (k >= "1" && k <= "4") {
        const idx = parseInt(k, 10) - 1;
        if (display.choices[idx] && idx !== removedIndex) selectAnswer(idx);
      } else if (k === "a") { if (life.accio && !revealCorrect) useAccio(); }
      else if (k === "e") { if (life.expelliarmus && removedIndex === null) useExpelliarmus(); }
      else if (k === "l") { if (life.lumos && !showHint) useLumos(); }
      else if (k === "h") { if (!showHint) setShowHint(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, display, life, revealCorrect, removedIndex, showHint, locked]);

  // lifelines
  function useAccio() {
    if (!life.accio || !q) return;
    play(sfxSpell); setRevealCorrect(true);
    emit("spell:used", { type: "accio" });
    setLife(l => ({ ...l, accio:false }));
  }
  function useExpelliarmus() {
    if (!life.expelliarmus || !q) return;
    const wrong = display.choices.map((c,i)=>({c,i})).filter(({c,i}) => !c.correct && i !== removedIndex).map(x=>x.i);
    if (!wrong.length) return; play(sfxSpell);
    emit("spell:used", { type: "expelliarmus" });
    const pick = wrong[Math.floor(Math.random()*wrong.length)];
    setRemovedIndex(pick); setLife(l => ({ ...l, expelliarmus:false }));
  }
  function useLumos() {
    if (!life.lumos || !q) return;
    play(sfxSpell); setShowHint(true);
    emit("spell:used", { type: "lumos" });
    setLife(l => ({ ...l, lumos:false }));
  }
  function armPatronus() {
    if (!life.patronus) return;
    play(sfxSpell); setShieldArmed(true);
    emit("spell:used", { type: "patronus" });
    setLife(l => ({ ...l, patronus:false }));
  }

  function selectAnswer(choiceIdx: number) {
    if (!q || locked) return;
    if (choiceIdx === removedIndex) return;
    setLocked(true);

    const timedOut = choiceIdx === -1;
    const choice = !timedOut ? display.choices[choiceIdx] : null;
    const isCorrect = !!choice?.correct;

    // Polyjuice streak logic: only count when the question is tagged polyjuice
    const isPoly = q?.tag === "polyjuice";

    // Horcrux flow
    if (isHorcrux) {
      if (isCorrect) {
        emit("horcrux:part", { partIndex, total: q.horcruxParts!.length });
        setFeedback("correct"); play(sfxSpell);
        setTimeout(() => {
          setFeedback(null); setLocked(false);
          if (partIndex + 1 < q.horcruxParts!.length) {
            setPartIndex(i => i + 1);
          } else {
            emit("horcrux:destroy", { id: q.id });
            finalizeCorrect(isPoly);
          }
        }, 480);
        return;
      } else {
        // wrong in horcrux
        if (shieldArmed) {
          setShieldArmed(false); setPatronusTriggered(true);
          play(sfxSpell); emit("spell:used", { type: "patronus-triggered" });
          setFeedback("shield");
          setTimeout(()=>{ setFeedback(null); setLocked(false); if (TIME_ACTIVE && timeLeft<=0) setTimeLeft(5); }, 650);
          return;
        }
        play(sfxWrong); setFeedback("wrong"); emit("answer:wrong", { category, index });
        setTimeout(()=> next(), 900);
        return;
      }
    }

    // normal question
    if (isCorrect) {
      finalizeCorrect(isPoly);
      return;
    }

    // wrong
    if (shieldArmed) {
      setShieldArmed(false); setPatronusTriggered(true);
      play(sfxSpell); emit("spell:used", { type: "patronus-triggered" });
      setFeedback("shield");
      setTimeout(()=>{ setFeedback(null); setLocked(false); if (TIME_ACTIVE && timeLeft<=0) setTimeLeft(5); }, 650);
      return;
    }
    play(sfxWrong); setFeedback("wrong");
    emit("answer:wrong", { category, index });
    // reset polyjuice streak
    if (isPoly) setPolyjuiceStreak(0);
    setTimeout(()=> next(), 900);
  }

  function finalizeCorrect(isPoly: boolean) {
    emit("answer:correct", { category, index });
    const timeBonus = TIME_ACTIVE ? Math.max(0, Math.ceil(timeLeft / 5)) : 0;
    const diffBonus = d.pointsMult;
    const polyBonus = isPoly ? 0.1 * (polyjuiceStreak + 1) : 0;
    const gained = Math.round((BASE_XP + timeBonus) * diffBonus * (1 + polyBonus));

    setScore(s => s + 1);
    setBonusXP(b => b + (gained - BASE_XP)); // track just the bonus part
    play(sfxCorrect); setFeedback("correct");
    if (isPoly) setPolyjuiceStreak((s) => s + 1);

    setTimeout(()=> next(), 700);
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(i => i + 1);
    } else {
      const totalXP = score * BASE_XP + bonusXP;
      addXp(totalXP);
      if (score === questions.length && questions.length > 0) {
        ach.unlock("perfect_score");
        emit("quiz:perfect", {});
      }
      if (ach.maybeBest(score)) ach.unlock("top_scorer");

      leaderboard.addEntry({
        name: name || "Student",
        house: (house ?? "gryffindor") as string,
        category: category, score, total: questions.length, xp: totalXP,
        percent: Math.round((score / Math.max(1, questions.length)) * 100), at: Date.now(),
      });

      navigate(RESULT_PATH, { state: { from: category, score, total: questions.length, gained: totalXP, player: name, house } });
    }
  }

  if (!questions.length || !q) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold">No questions yet</h1>
        <p className="text-stone-600">We don’t have questions for <b>{category}</b> yet.</p>
        <Link className="underline" to="/map">← Back to the Map</Link>
      </section>
    );
  }

  const houseKey = (house ?? "gryffindor") as keyof typeof HOUSES;
  const houseColors = { borderColor: HOUSES[houseKey].primary };

  // Timer visuals (right → left, snitch rides the edge)
  const fillWidthPct = TIME_ACTIVE ? (timeLeft / Math.max(1, TIME_LIMIT)) * 100 : 100;
  const snitchLeft = 100 - fillWidthPct;

  // Portrait hint (if Lumos / settings)
  const portrait = (() => {
    if (!settings.enablePortraits || !showHint) return null;
    const wiseLine = display?.choices.find(c=>c.correct)?.hint || "Use your wit wisely.";
    if (category === "potions") return { name: "The Stern Professor", img: "/assets/portraits/snape.png", line: wiseLine };
    return { name: "The Wise Headmaster", img: "/assets/portraits/dumbledore.png", line: wiseLine };
  })();

  const isQuidditch = q?.tag === "bonus" || category === "quidditch";
  const showShake = feedback === "wrong" && isQuidditch;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold capitalize">
            {category.replace("-", " ")} {q?.tag==="polyjuice" && <span className="text-sm text-stone-500">(Polyjuice)</span>}
            {isQuidditch && <span className="text-sm text-amber-600 ml-2">Quidditch Bonus ✦</span>}
          </h1>
          <p className="text-stone-600 text-sm">
            {index + 1} / {questions.length}
            {isHorcrux && ` • Horcrux ${partIndex+1}/${q.horcruxParts!.length}`}
            {settings.difficulty !== "owl" && ` • ${settings.difficulty.toUpperCase()}`}
          </p>
        </div>

        {/* Potion progress */}
        <div className="flex items-center gap-3">
          <div className="hp-potion" style={{ ["--fill" as any]: `${fill}%` }}>
            <div className="hp-bubble" /><div className="hp-bubble" /><div className="hp-bubble" />
          </div>
          <div className="text-sm text-stone-600"><b>{fill}%</b> brewed</div>
        </div>
      </header>

      {/* Mode frames */}
      {q?.tag === "polyjuice" && <PolyjuiceFrame role="Hermione-like Wit" streak={polyjuiceStreak} />}
      {isQuidditch && <QuidditchHUD shake={showShake} />}

      {/* Timer */}
      {settings.enableTimer && (
        <div className="hp-snitch-wrap" aria-label="time remaining">
          <div className="hp-snitch-track">
            <div className="hp-snitch-fill" style={{ width: `${fillWidthPct}%`, left: "auto", right: 0 }} />
            <div className="hp-snitch" style={{ left: `calc(${snitchLeft}% )` }}>
              <SnitchSVG />
            </div>
          </div>
          <p className="text-xs text-stone-600 text-right mt-1">{timeLeft}s left</p>
        </div>
      )}

      {/* Horcrux ring */}
      {isHorcrux && <HorcruxRing current={partIndex} total={q!.horcruxParts!.length} />}

      {/* Question card */}
      <AnimatePresence mode="popLayout">
        <motion.div key={(q.id||"q")+":"+partIndex} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} className="hp-card p-5 relative" style={houseColors}>
          <div className="mb-2 flex items-center gap-2">
            <p className="font-semibold">{isHorcrux ? display.prompt : q.prompt}</p>
            {showHint && display.choices.find(c=>c.correct && c.hint) && (
              <span className="text-xs text-stone-500">({display.choices.find(c => c.correct)?.hint})</span>
            )}
          </div>

          {/* Portrait hint bubble */}
          <AnimatePresence>
            {portrait && (
              <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} className="mb-3 hp-portrait">
                {portrait.img ? (
                  <img src={portrait.img} alt={portrait.name} onError={(e)=>{(e.target as HTMLImageElement).style.display="none"}} />
                ) : (
                  <div className="w-14 h-14 text-3xl flex items-center justify-center">🖼️</div>
                )}
                <div>
                  <div className="name">{portrait.name}</div>
                  <div className="bubble">{portrait.line}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-2">
            {display.choices.map((c, i) => {
              const isRemoved = removedIndex === i;
              const showAsCorrect = revealCorrect && c.correct;
              const btn = [
                "hp-answer w-full text-left px-4 py-2 rounded-lg border hover:bg-white",
                isRemoved ? "hp-removed" : "",
                (locked && feedback === "correct" && c.correct) || showAsCorrect ? "hp-correct" : "",
              ].join(" ");
              return (
                <button key={i} onClick={()=>selectAnswer(i)} disabled={locked||isRemoved} className={btn}>
                  {c.text}
                </button>
              );
            })}
          </div>

          {/* wrong + shield messages */}
          <AnimatePresence>
            {feedback === "shield" && (
              <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} className="mt-3 text-sm hp-life-badge">
                🛡️ Patronus protected you — try again!
              </motion.div>
            )}
            {feedback === "wrong" && (
              <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} className="mt-3 text-sm text-rose-600">
                Time’s up or wrong — moving on…
              </motion.div>
            )}
          </AnimatePresence>

          {/* smoke on wrong */}
          <AnimatePresence>
            {feedback === "wrong" && (
              <motion.div key="smoke" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="hp-smoke">
                <i></i><i></i><i></i>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* lifelines row (respects difficulty availability) */}
      <div className="flex flex-wrap items-center gap-2">
        <button className="hp-life" onClick={useAccio} disabled={!life.accio || revealCorrect}>✨ Accio Answer</button>
        <button className="hp-life" onClick={useExpelliarmus} disabled={!life.expelliarmus || removedIndex !== null}>🗡️ Expelliarmus</button>
        <button className="hp-life" onClick={useLumos} disabled={!life.lumos || showHint}>🔦 Lumos</button>
        <button className="hp-life" onClick={armPatronus} disabled={!life.patronus || shieldArmed}>🦌 Patronus</button>
        {shieldArmed && <span className="hp-life-badge hp-shield">Shield ready</span>}
        <div className="ml-auto">
          <Link className="underline text-sm" to="/map">← Back to the Map</Link>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={()=>{ if (index + 1 < questions.length) setIndex(i=>i+1); else next(); }} className="px-4 py-2 rounded-xl text-white bg-stone-900">
          {index + 1 < questions.length ? "Skip →" : "Finish →"}
        </button>
      </div>
    </section>
  );
}

function SnitchSVG() {
  return (
    <svg viewBox="0 0 64 32" width="32" height="32" aria-hidden>
      <path className="hp-wing left" d="M30,10 C20,3 8,4 2,10 C8,8 16,12 23,15" fill="none" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" />
      <path className="hp-wing" d="M34,10 C44,3 56,4 62,10 C56,8 48,12 41,15" fill="none" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <radialGradient id="snitchGold" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fff6a5" />
          <stop offset="55%" stopColor="#ffd34d" />
          <stop offset="100%" stopColor="#d4a300" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="16" r="6.5" fill="url(#snitchGold)" stroke="#b07f00" strokeWidth="1.5" />
      <circle cx="32" cy="16" r="3" fill="rgba(255,255,255,.6)" />
    </svg>
  );
}
