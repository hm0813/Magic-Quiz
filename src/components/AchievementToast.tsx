// src/components/AchievementToast.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS } from "../data/achievements";
import { useAchievements } from "../state/achievements";

export default function AchievementToast() {
  const { toast, clearToast } = useAchievements();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => clearToast(), 1800);
    return () => clearTimeout(t);
  }, [toast, clearToast]);
  if (!toast) return null;

  const a = ACHIEVEMENTS[toast.key];
  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        <motion.div
          key={a.key}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          className="px-4 py-3 rounded-xl border bg-white shadow-lg"
        >
          <div className="text-lg">{a.emoji} <b>{a.title}</b></div>
          <div className="text-xs text-stone-600">{a.description}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
