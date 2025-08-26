import { on } from "../lib/bus";
import { useAchievements } from "../state/achievements";

let booted = false;

export function initAchievementsBridge() {
  if (booted) return;
  booted = true;

  // First correct answer
  on("answer:correct", () => {
    const s = useAchievements.getState();
    if (!s.unlocked["first_correct"]) s.unlock("first_correct");
  });

  // Perfect quiz: your Quiz.tsx already emits this via results,
  // but if you ever emit 'quiz:perfect', handle it here too.
  on("quiz:perfect", () => {
    const s = useAchievements.getState();
    if (!s.unlocked["perfect_score"]) s.unlock("perfect_score");
  });

  // Patronus saved you
  on("spell:used", (p: any) => {
    if (p?.type === "patronus-triggered") {
      const s = useAchievements.getState();
      if (!s.unlocked["patronus_protector"]) s.unlock("patronus_protector");
    }
  });

  // Weekly top scorer is still handled in Results/Quiz when adding entries,
  // but you could also listen for 'leaderboard:weeklyTop' here.
}
