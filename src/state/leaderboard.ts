import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Entry = { id: string; name: string; score: number; date: number; category?: string };

type LB = {
  entries: Entry[];
  add: (e: Omit<Entry, "id"|"date">) => void;
  top: (n: number) => Entry[];
  reset: () => void;
};

export const useLeaderboard = create<LB>()(
  persist(
    (set, get) => ({
      entries: [],
      add: (e) => set({ entries: [{ ...e, id: crypto.randomUUID(), date: Date.now() }, ...get().entries].slice(0, 100) }),
      top: (n) => [...get().entries].sort((a,b)=>b.score-a.score).slice(0, n),
      reset: () => set({ entries: [] })
    }),
    { name: "hp-leaderboard-v1" }
  )
);
