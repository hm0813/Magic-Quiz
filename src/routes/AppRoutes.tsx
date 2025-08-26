// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sorting from "../pages/Sorting";
import MapPage from "../pages/MapPage";
import Quiz from "../pages/Quiz";
import Results from "../pages/Results";
import Leaderboard from "../pages/Leaderboard";
import Achievements from "../pages/Achievements";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sorting" replace />} />
      <Route path="/sorting" element={<Sorting />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/quiz/:category" element={<Quiz />} />
      <Route path="/results" element={<Results />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/sorting" replace />} />
    </Routes>
  );
}
