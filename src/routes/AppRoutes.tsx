// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Your existing pages
import Sorting from "../pages/Sorting";
import MapPage from "../pages/MapPage";
import Quiz from "../pages/Quiz";         // your main quiz screen
import Settings from "../pages/Settings";
import Leaderboard from "../pages/Leaderboard";
import AchievementsPage from "../pages/Achievements";

// New special modes
import QuidditchBonus from "../components/modes/Quidditch";
import PolyjuiceRound from "../components/modes/Polyjuice";
import HorcruxMode from "../components/modes/Horcrux";

// Difficulty picker can be used on the main quiz page (optional)
import DifficultyPicker from "../components/quiz/DifficultyPicker";

import { useLeaderboard } from "../state/leaderboard";
import { useProfileStore } from "../state/profile";

// ---------- Sample data (replace with your own later) ----------
const QUIZZ_Q = [
  { prompt: "What color are Hogwarts' carriages' pulling creatures?", options: ["Thestrals (black)", "Hippogriffs", "Dragons", "Nifflers"], correctIndex: 0 },
  { prompt: "Who captains Gryffindor Quidditch in PoA?", options: ["Angelina Johnson", "Harry Potter", "Oliver Wood", "Katie Bell"], correctIndex: 2 },
  { prompt: "What is a Bludger?", options: ["Beater’s bat", "Fast black iron ball", "Golden ball with wings", "Keeper’s glove"], correctIndex: 1 },
];

const POLY_Q = [
  {
    prompt: "A friend breaks a rule for a higher reason. What would Hermione do?",
    options: [
      { label: "Scold them; rules matter.", asCharacterCorrect: true },
      { label: "Applaud the outcome." },
      { label: "Ignore it." },
    ],
  },
  {
    prompt: "Given extra study time?",
    options: [
      { label: "Library marathon.", asCharacterCorrect: true },
      { label: "Practice Quidditch." },
      { label: "Brew prank potions." },
    ],
  },
];

const HORCRUX_PARTS = [
  { prompt: "Dark artifact feels…", options: ["Warm and kind", "Cold and wrong", "Smells like treacle tart", "Sings a lullaby"], correctIndex: 1 },
  { prompt: "Which spell resists Dark influence?", options: ["Alohomora", "Expelliarmus", "Expecto Patronum", "Mobiliarbus"], correctIndex: 2 },
  { prompt: "Best plan to destroy it?", options: ["Wear it daily", "Tell no one", "Use Basilisk venom", "Display proudly"], correctIndex: 2 },
];
// ---------------------------------------------------------------

export default function AppRoutes() {
  return (
    <Routes>
      {/* Phase 0/1 routes */}
      <Route path="/" element={<Navigate to="/sorting" replace />} />
      <Route path="/sorting" element={<Sorting />} />
      <Route path="/map" element={<MapPage />} />

      {/* Main quiz demo; you can also render DifficultyPicker here if you want */}
      <Route path="/quiz/library" element={
        <div className="space-y-4">
          <DifficultyPicker />
          <Quiz />
        </div>
      }/>

      {/* Special modes */}
      <Route path="/quiz/quidditch" element={<QuidditchScreen />} />
      <Route path="/quiz/polyjuice" element={<PolyjuiceScreen />} />
      <Route path="/quiz/horcrux" element={<HorcruxScreen />} />

      {/* Phase 7 pages */}
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/settings" element={<Settings />} />

      {/* 404 → Sorting */}
      <Route path="*" element={<Navigate to="/sorting" replace />} />
    </Routes>
  );
}

/* ---------- Screens for the 3 modes ---------- */

function QuidditchScreen() {
  const nav = useNavigate();
  const addScore = useLeaderboard((s) => s.add);
  const name = useProfileStore((s) => s.name || "Anonymous");

  return (
    <QuidditchBonus
      duration={75} // will be adjusted by difficulty (OWLs/NEWTs) inside the component
      questions={QUIZZ_Q}
      onFinish={(score, perfectStreak) => {
        addScore({ name, score: score + perfectStreak, category: "Quidditch" });
        nav("/leaderboard");
      }}
    />
  );
}

function PolyjuiceScreen() {
  const nav = useNavigate();
  const addScore = useLeaderboard((s) => s.add);
  const name = useProfileStore((s) => s.name || "Anonymous");

  return (
    <PolyjuiceRound
      character="Hermione"
      questions={POLY_Q}
      onFinish={(score, streakBonus) => {
        addScore({ name, score: score + streakBonus, category: "Polyjuice" });
        nav("/leaderboard");
      }}
    />
  );
}

function HorcruxScreen() {
  const nav = useNavigate();
  const addScore = useLeaderboard((s) => s.add);
  const name = useProfileStore((s) => s.name || "Anonymous");

  return (
    <HorcruxMode
      parts={HORCRUX_PARTS}
      onComplete={(destroyed, bonus) => {
        const score = destroyed ? 5 + bonus : 2; // small base + bonus
        addScore({ name, score, category: "Horcrux" });
        nav("/leaderboard");
      }}
    />
  );
}
