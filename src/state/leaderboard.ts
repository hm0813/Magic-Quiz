// src/state/leaderboard.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LBEntry = {
  id: string;
  name: string;
  house: string;           // gryffindor | slytherin | ...
  category: string;        // library, potions, etc.
  score: number;
  total: number;
  xp: number;
  percent: number;         // 0..100
  at: number;              // timestamp
};

type LeaderboardState = {
  entries: LBEntry[];
  addEntry: (e: Omit<LBEntry, "id">) => void;
  clear: () => void;
};

export const useLeaderboard = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (e) => {
        const id = crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
        const next = [{ ...e, id }, ...get().entries].slice(0, 200); // keep last 200
        set({ entries: next });
      },
      clear: () => set({ entries: [] }),
    }),
    { name: "hp-leaderboard-v1" }
  )
);
