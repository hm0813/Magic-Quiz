// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import Sorting from "../pages/Sorting";
import MapPage from "../pages/MapPage";
import Quiz from "../pages/Quiz";
import Leaderboard from "../pages/Leaderboard";
import Achievements from "../pages/Achievements";
import Settings from "../pages/Settings";

function NotFound() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="text-stone-600">That page does not exist.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sorting" replace />} />
      <Route path="/sorting" element={<Sorting />} />
      <Route path="/map" element={<MapPage />} />
      {/* Important: dynamic quiz route */}
      <Route path="/quiz/:category" element={<Quiz />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
