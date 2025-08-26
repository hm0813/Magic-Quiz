import { create } from "zustand";
import { persist } from "zustand/middleware";

type Run = {
  category: string | null;
  questionIndex: number;
  score: number;
  streak: number;
  mistakes: number;
  usedSpells: string[];

  start: (cat: string) => void;
  next: () => void;
  correct: () => void;
  wrong: () => void;
  useSpell: (s: string) => void;
  resetRun: () => void;
};

export const useRun = create<Run>()(
  persist(
    (set, get) => ({
      category: null, questionIndex: 0, score: 0, streak: 0, mistakes: 0, usedSpells: [],
      start: (category) => set({ category, questionIndex: 0, score: 0, streak: 0, mistakes: 0, usedSpells: [] }),
      next: () => set({ questionIndex: get().questionIndex + 1 }),
      correct: () => set({ score: get().score + 1, streak: get().streak + 1 }),
      wrong: () => set({ streak: 0, mistakes: get().mistakes + 1 }),
      useSpell: (s) => set({ usedSpells: [...get().usedSpells, s] }),
      resetRun: () => set({ category: null, questionIndex: 0, score: 0, streak: 0, mistakes: 0, usedSpells: [] })
    }),
    { name: "hp-run-v1" }
  )
);
