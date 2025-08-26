import { on, emit } from "../lib/bus";
import { useAchievements } from "../state/achievements";

let wired = false;
export function initAchievementsBridge() {
  if (wired) return; wired = true;

  on("answer:correct", () => {
    const s = useAchievements.getState();
    if (!s.unlocked["first_correct"]) s.unlock("first_correct");
  });

  on("quiz:perfect", () => {
    const s = useAchievements.getState();
    if (!s.unlocked["perfect_score"]) s.unlock("perfect_score");
  });

  on("spell:used", (p:any) => {
    if (p?.type === "patronus-triggered") {
      const s = useAchievements.getState();
      if (!s.unlocked["patronus_pro"]) s.unlock("patronus_pro");
      emit("achievement:unlock", { id: "patronus_pro" });
    }
  });
}
