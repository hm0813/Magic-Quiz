import { create } from "zustand";
import { persist } from "zustand/middleware";

type Settings = {
  music: boolean;
  sfx: boolean;
  cursorVfx: boolean;
  difficulty: "OWL" | "NEWT"; // OWL = easier, NEWT = hard

  toggle: (k: keyof Omit<Settings, "toggle"|"setDifficulty">) => void;
  setDifficulty: (d: Settings["difficulty"]) => void;
};

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      music: false,
      sfx: true,
      cursorVfx: true,
      difficulty: "OWL",
      toggle: (k) => set((s:any) => ({ [k]: !s[k] })),
      setDifficulty: (difficulty) => set({ difficulty })
    }),
    { name: "hp-settings-v1" }
  )
);
