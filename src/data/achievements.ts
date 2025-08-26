// src/data/achievements.ts
export type AchievementKey =
  | "first_correct"
  | "perfect_score"
  | "top_scorer"
  | "speedy_snitch"
  | "patronus_protector";

export type Achievement = {
  key: AchievementKey;
  title: string;
  description: string;
  emoji: string;
};

export const ACHIEVEMENTS: Record<AchievementKey, Achievement> = {
  first_correct: {
    key: "first_correct",
    title: "You're a Wizard!",
    description: "Get your first correct answer.",
    emoji: "🧙‍♂️",
  },
  perfect_score: {
    key: "perfect_score",
    title: "I Open at the Close",
    description: "Finish a quiz with a perfect score.",
    emoji: "🗝️",
  },
  top_scorer: {
    key: "top_scorer",
    title: "The Chosen One",
    description: "Set (or tie) your best score.",
    emoji: "⭐",
  },
  speedy_snitch: {
    key: "speedy_snitch",
    title: "Speedy Snitch",
    description: "Answer correctly with 15s or more remaining.",
    emoji: "🪶",
  },
  patronus_protector: {
    key: "patronus_protector",
    title: "Patronus Protector",
    description: "Patronus shield saved you from a wrong answer.",
    emoji: "🦌",
  },
};
