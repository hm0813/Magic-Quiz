import { create } from "zustand";
import { persist } from "zustand/middleware";

export const BADGE_DEFS = [
  { id: "first_correct",   title: "You’re a Wizard!",     description: "Your first correct answer." },
  { id: "perfect_score",   title: "I Open at the Close",  description: "Finish a quiz with a perfect score." },
  { id: "patronus_pro",    title: "Protego Patronum",     description: "Your Patronus saved you once." },
  { id: "top_scorer",      title: "The Chosen One",       description: "Top weekly score (local)." },
];

type AchState = {
  unlocked: Record<string, number>;
  toasts: string[];
  unlock: (id: string) => void;
  queue: (id: string) => void;
  clearToasts: () => void;
};

export const useAchievements = create<AchState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      toasts: [],
      unlock: (id) => {
        if (get().unlocked[id]) return;
        set((s) => ({ unlocked: { ...s.unlocked, [id]: Date.now() } }));
        get().queue(id);
      },
      queue: (id) => set((s) => ({ toasts: [...s.toasts, id] })),
      clearToasts: () => set({ toasts: [] }),
    }),
    { name: "hp-achievements-v1" }
  )
);
