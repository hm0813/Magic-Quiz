import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HouseKey = "gryffindor"|"slytherin"|"ravenclaw"|"hufflepuff";

type Spells = {
  accio: number;         // reveals
  expelliarmus: number;  // remove wrong option
  lumos: number;         // show hint
};

type Profile = {
  name: string;
  house: HouseKey | null;
  xp: number;
  patronusUnlocked: boolean;
  spells: Spells;

  setName: (n: string) => void;
  setHouse: (h: HouseKey) => void;
  addXp: (n: number) => void;
  useSpell: (k: keyof Spells) => boolean;
  unlockPatronus: () => void;
  resetProfile: () => void;
};

export const useProfileStore = create<Profile>()(
  persist(
    (set, get) => ({
      name: "",
      house: null,
      xp: 0,
      patronusUnlocked: false,
      spells: { accio: 2, expelliarmus: 2, lumos: 2 },

      setName: (name) => set({ name }),
      setHouse: (house) => set({ house }),
      addXp: (n) => set({ xp: get().xp + n }),
      useSpell: (k) => {
        const cur = get().spells[k];
        if (cur <= 0) return false;
        set({ spells: { ...get().spells, [k]: cur - 1 } });
        return true;
      },
      unlockPatronus: () => set({ patronusUnlocked: true }),
      resetProfile: () => set({
        name: "",
        house: null,
        xp: 0,
        patronusUnlocked: false,
        spells: { accio: 2, expelliarmus: 2, lumos: 2},
      }),
    }),
    { name: "hp-profile-v1" }
  )
);
