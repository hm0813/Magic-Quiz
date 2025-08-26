import { useEffect, useState } from "react";
import { BADGE_DEFS, useAchievements } from "../state/achievements";

export default function AchievementToast() {
  const { toasts, clearToasts } = useAchievements();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (!toasts.length) return;
    setId(toasts[0]);
    const t = setTimeout(() => {
      useAchievements.setState((s) => ({ toasts: s.toasts.slice(1) }));
      setId(null);
      if (toasts.length === 1) clearToasts();
    }, 2200);
    return () => clearTimeout(t);
  }, [toasts, clearToasts]);

  if (!id) return null;
  const b = BADGE_DEFS.find(x => x.id === id);
  if (!b) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-xl bg-white border shadow-lg px-4 py-3 w-[280px]">
        <div className="text-xs uppercase tracking-wider text-stone-500">Achievement unlocked</div>
        <div className="font-bold">{b.title}</div>
        <div className="text-xs text-stone-600">{b.description}</div>
      </div>
    </div>
  );
}
