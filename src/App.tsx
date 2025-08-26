// src/App.tsx
import { Link, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import { useEffect } from "react";
import { useProfileStore } from "./state/profile";
import { initAchievementsBridge } from "./logic/achievements";
import AchievementToast from "./components/AchievementToast";

export default function App() {
  const { pathname } = useLocation();

  // react to house changes (your store already applies CSS vars)
  const currentHouse = useProfileStore((s) => s.house);
  useEffect(() => {
    // reserved for future house-aware tweaks
  }, [currentHouse]);

  // achievements listeners (answer:correct, quiz:perfect, patronus, etc.)
  useEffect(() => {
    initAchievementsBridge();
  }, []);

  return (
    <div className="min-h-screen">
      <AchievementToast />

      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-5xl px-4 py-3 flex gap-3 text-sm">
          <NavLink to="/sorting" active={pathname === "/sorting"}>Sorting</NavLink>
          <NavLink to="/map" active={pathname === "/map"}>Map</NavLink>

          {/* Your main quiz demo (library) */}
          <NavLink to="/quiz/library" active={pathname.startsWith("/quiz")}>Quiz Demo</NavLink>

          {/* Special modes */}
          <NavLink to="/quiz/quidditch" active={pathname === "/quiz/quidditch"}>Quidditch</NavLink>
          <NavLink to="/quiz/polyjuice" active={pathname === "/quiz/polyjuice"}>Polyjuice</NavLink>
          <NavLink to="/quiz/horcrux" active={pathname === "/quiz/horcrux"}>Horcrux</NavLink>

          <NavLink to="/leaderboard" active={pathname === "/leaderboard"}>Daily Prophet</NavLink>
          <NavLink to="/achievements" active={pathname === "/achievements"}>Achievements</NavLink>
          <NavLink to="/settings" active={pathname === "/settings"}>Settings</NavLink>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <AppRoutes />
      </main>
    </div>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={[
        "px-3 py-1 rounded transition",
        active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-200",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
