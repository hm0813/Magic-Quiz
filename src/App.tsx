import { Link, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useProfileStore } from "./state/profile";
import AchievementToast from "./components/AchievementToast";
import WandFX from "./components/WandFX";
import HouseCursor from "./components/HouseCursor";
import { useSettings } from "./state/settings";
import { initAchievementsBridge } from "./logic/achievements";

export default function App() {
  const { pathname } = useLocation();
  const currentHouse = useProfileStore((s) => s.house);
  const cursorVfx = useSettings(s => s.cursorVfx);

  useEffect(() => { initAchievementsBridge(); }, []);
  useEffect(() => {}, [currentHouse]);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-5xl px-4 py-3 flex gap-3 text-sm">
          <NavLink to="/sorting" active={pathname === "/sorting"}>Sorting</NavLink>
          <NavLink to="/map" active={pathname === "/map"}>Map</NavLink>
          <NavLink to="/quiz/library" active={pathname.startsWith("/quiz")}>Quiz</NavLink>
          <NavLink to="/leaderboard" active={pathname === "/leaderboard"}>Daily Prophet</NavLink>
          <NavLink to="/achievements" active={pathname === "/achievements"}>Achievements</NavLink>
          <NavLink to="/settings" active={pathname === "/settings"}>Settings</NavLink>
        </div>
      </nav>

      <AchievementToast />
      {cursorVfx && <WandFX />}
      <HouseCursor />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <AppRoutes />
      </main>
    </div>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode; }) {
  return (
    <Link to={to} className={["px-3 py-1 rounded transition", active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-200"].join(" ")}>
      {children}
    </Link>
  );
}
