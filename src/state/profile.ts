// src/state/profile.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HouseKey } from "../theme/houses";
import { applyHouseTheme } from "../theme/houses";

type Spells = { accio: number; expelliarmus: number; lumos: number };

export type ProfileState = {
  name: string;
  house: HouseKey | null;
  xp: number;
  spells: Spells;
  patronusUnlocked: boolean;

  setName: (n: string) => void;
  setHouse: (h: HouseKey) => void;
  addXp: (delta: number) => void;
  grantSpell: (key: keyof Spells, amount?: number) => void;
  unlockPatronus: () => void;
  resetAll: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      name: "",
      house: null,
      xp: 0,
      spells: { accio: 1, expelliarmus: 1, lumos: 1 },
      patronusUnlocked: false,

      setName: (n) => set({ name: n }),
      setHouse: (h) => {
        applyHouseTheme(h);        // immediate theme swap
        set({ house: h });
      },
      addXp: (d) => set({ xp: Math.max(0, get().xp + d) }),
      grantSpell: (key, amount = 1) =>
        set({ spells: { ...get().spells, [key]: get().spells[key] + amount } }),
      unlockPatronus: () => set({ patronusUnlocked: true }),
      resetAll: () => {
        applyHouseTheme(null);
        set({
          name: "",
          house: null,
          xp: 0,
          spells: { accio: 1, expelliarmus: 1, lumos: 1 },
          patronusUnlocked: false,
        });
      },
    }),
    {
      name: "hp-quiz-profile",
      onRehydrateStorage: () => (state) => {
        // when the app loads, apply the saved theme
        if (state?.house) applyHouseTheme(state.house);
      },
    }
  )
);
