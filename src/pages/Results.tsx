// src/pages/Results.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HOUSES } from "../theme/houses";
import { useProfileStore } from "../state/profile";

type ResultState = {
  from: string;     // category
  score: number;
  total: number;
  gained: number;   // xp gained
  player?: string;
  house?: keyof typeof HOUSES;
};

export default function Results() {
  const { state } = useLocation();
  const nav = useNavigate();
  const profile = useProfileStore();
  const [showConfetti, setShowConfetti] = useState(true);

  const data = (state || {}) as ResultState;
  const houseKey = (data.house ?? profile.house ?? "gryffindor") as keyof typeof HOUSES;
  const house = HOUSES[houseKey];

  const percent = useMemo(() => {
    if (!data.total) return 0;
    return Math.round((data.score / data.total) * 100);
  }, [data.score, data.total]);

  // auto-hide confetti after a bit (nice & subtle)
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(t);
  }, []);

  // share helpers
  const shareText = encodeURIComponent(
    `${data.player || "A Hogwarts student"} scored ${data.score}/${data.total} (${percent}%) in ${titleCase(
      data.from || "the quiz"
    )}! #Hogwarts #Quiz`
  );
  const shareUrl = encodeURIComponent(window.location.origin + "/leaderboard");
  const xShare = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const copyRef = useRef<HTMLButtonElement>(null);

  async function copyShare() {
    const text = `${decodeURIComponent(shareText)} ${decodeURIComponent(shareUrl)}`;
    try {
      await navigator.clipboard.writeText(text);
      if (copyRef.current) {
        copyRef.current.innerText = "Copied!";
        setTimeout(() => (copyRef.current!.innerText = "Copy text"), 1200);
      }
    } catch {}
  }

  function playAgain() {
    if (data.from) nav(`/quiz/${data.from}`);
    else nav("/map");
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold">Results</h1>
        <p className="text-stone-600">Great work{data.player ? `, ${data.player}` : ""}! Here’s your scorecard.</p>
      </header>

      {/* Top Card */}
      <div
        className="hp-card p-6 relative overflow-hidden"
        style={{ borderColor: house.primary }}
      >
        {/* Crest + Medal */}
        <div className="flex items-center gap-5">
          <motion.div
            initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="w-24 h-24 rounded-2xl flex items-center justify-center bg-white border"
            style={{ borderColor: house.primary }}
          >
            {house.crest ? (
              <img src={house.crest} alt={`${house.name} crest`} className="w-20 h-20 object-contain" />
            ) : (
              <span className="text-6xl">{house.crestEmoji}</span>
            )}
          </motion.div>

          <div className="flex-1">
            <div className="text-sm uppercase tracking-wide text-stone-500">Category</div>
            <div className="font-bold text-xl capitalize">{titleCase(data.from || "quiz")}</div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Medal percent={percent} color={house.primary} />
              <div className="text-stone-700">
                <b>{data.score}</b>/<span className="text-stone-500">{data.total}</span> correct
                <span className="mx-2">•</span>
                <span className="text-stone-600">+{data.gained} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confetti overlay */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hp-confetti"
            >
              {Array.from({ length: 80 }).map((_, i) => (
                <i key={i} style={{ ["--d" as any]: `${(Math.random() * 1.5 + 0.3).toFixed(2)}s` }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={playAgain}
          className="px-4 py-2 rounded-xl text-white bg-stone-900"
        >
          Play Again →
        </button>
        <Link to="/map" className="px-4 py-2 rounded-xl border hover:bg-white">
          Back to Map
        </Link>
        <Link to="/leaderboard" className="px-4 py-2 rounded-xl border hover:bg-white">
          See Daily Prophet
        </Link>
      </div>

      {/* Share */}
      <div className="hp-card p-5">
        <div className="font-semibold mb-2">Share your glory</div>
        <div className="flex flex-wrap gap-2">
          <a
            href={xShare}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg border hover:bg-white"
          >
            Post on X/Twitter
          </a>
          <button
            ref={copyRef}
            onClick={copyShare}
            className="px-3 py-1.5 rounded-lg border hover:bg-white"
          >
            Copy text
          </button>
        </div>
      </div>
    </section>
  );
}

function Medal({ percent, color }: { percent: number; color: string }) {
  const ring = `conic-gradient(${color} ${percent}%, rgba(0,0,0,.08) 0)`;
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-14 h-14 rounded-full grid place-items-center"
        style={{ background: ring }}
      >
        <div className="w-10 h-10 rounded-full bg-white grid place-items-center text-sm font-bold">
          {percent}%
        </div>
      </div>
      <div className="text-sm text-stone-600">Accuracy</div>
    </div>
  );
}

function titleCase(s: string) {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
