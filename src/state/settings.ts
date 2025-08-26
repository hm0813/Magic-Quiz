import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Difficulty = "first-year" | "owl" | "newt";

type SettingsState = {
  // audio & fx
  music: number;           // reserved for future bgm (0..1)
  sfx: number;             // 0..1
  cursorVfx: boolean;      // wand + sparkles
  enablePortraits: boolean;

  // quiz
  enableTimer: boolean;
  secondsPerQuestion: number;
  difficulty: Difficulty;

  // setters
  setMusic: (v: number) => void;
  setSfx: (v: number) => void;
  setCursorVfx: (v: boolean) => void;
  setPortraits: (v: boolean) => void;

  setTimerEnabled: (v: boolean) => void;
  setSecondsPerQuestion: (n: number) => void;
  setDifficulty: (d: Difficulty) => void;
};

// difficulty knobs
export const DIFFICULTY = {
  "first-year": { timerMult: 1.2, pointsMult: 0.8, lifelines: { accio:true, expelliarmus:true, lumos:true, patronus:true } },
  "owl":        { timerMult: 1.0, pointsMult: 1.0, lifelines: { accio:true, expelliarmus:true, lumos:true, patronus:true } },
  "newt":       { timerMult: 0.8, pointsMult: 1.25, lifelines: { accio:false, expelliarmus:true, lumos:false, patronus:true } },
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      music: 0,
      sfx: 0.5,
      cursorVfx: true,
      enablePortraits: true,

      enableTimer: true,
      secondsPerQuestion: 20,
      difficulty: "owl",

      setMusic: (v) => set({ music: Math.max(0, Math.min(1, v)) }),
      setSfx: (v) => set({ sfx: Math.max(0, Math.min(1, v)) }),
      setCursorVfx: (v) => set({ cursorVfx: v }),
      setPortraits: (v) => set({ enablePortraits: v }),

      setTimerEnabled: (v) => set({ enableTimer: v }),
      setSecondsPerQuestion: (n) => set({ secondsPerQuestion: Math.max(5, Math.min(120, n | 0)) }),
      setDifficulty: (d) => set({ difficulty: d }),
    }),
    { name: "hp-settings-v2" }
  )
);
