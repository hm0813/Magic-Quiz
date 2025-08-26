// src/state/achievements.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AchievementKey } from "../data/achievements";

type AchievementsState = {
  unlocked: Record<AchievementKey, string>; // iso date per key
  bestScore: number;                        // global best across categories
  toast: { key: AchievementKey; at: number } | null;
  unlock: (key: AchievementKey) => void;
  maybeBest: (score: number) => boolean;    // returns true if new best (or tie)
  clearToast: () => void;
};

export const useAchievements = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: {} as Record<AchievementKey, string>,
      bestScore: 0,
      toast: null,
      unlock: (key) => {
        const u = { ...get().unlocked };
        if (u[key]) return; // already unlocked
        u[key] = new Date().toISOString();
        set({ unlocked: u, toast: { key, at: Date.now() } });
      },
      maybeBest: (score) => {
        const cur = get().bestScore;
        if (score >= cur) {
          set({ bestScore: score });
          return true;
        }
        return false;
      },
      clearToast: () => set({ toast: null }),
    }),
    { name: "hp-achievements-v1" }
  )
);
