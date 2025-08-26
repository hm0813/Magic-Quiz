// src/App.tsx
import { Link, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

// Phase 1: listen to house changes so the app can react to theme updates
import { useEffect } from "react";
import { useProfileStore } from "./state/profile";

export default function App() {
  const { pathname } = useLocation();

  // when house changes (or rehydrates on reload), App will re-render.
  // the store already applies CSS variables; this keeps UI in sync for future tweaks.
  const currentHouse = useProfileStore((s) => s.house);
  useEffect(() => {
    // no-op for now; theme is applied by the store.
    // later we can show house crest, special menu accents, etc.
  }, [currentHouse]);

  return (
    <div className="min-h-screen">
      {/* simple top nav for Phase 0/1 testing */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-5xl px-4 py-3 flex gap-3 text-sm">
          <NavLink to="/sorting" active={pathname === "/sorting"}>
            Sorting
          </NavLink>
          <NavLink to="/map" active={pathname === "/map"}>
            Map
          </NavLink>
          <NavLink to="/quiz/library" active={pathname.startsWith("/quiz")}>
            Quiz Demo
          </NavLink>
          <NavLink to="/leaderboard" active={pathname === "/leaderboard"}>
            Daily Prophet
          </NavLink>
          <NavLink to="/achievements" active={pathname === "/achievements"}>
            Achievements
          </NavLink>
          <NavLink to="/settings" active={pathname === "/settings"}>
            Settings
          </NavLink>
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
