import { BADGE_DEFS, useAchievements } from "../state/achievements";

export default function AchievementsPage() {
  const { unlocked } = useAchievements();
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold">Achievements</h1>
        <p className="text-stone-600">Keep playing to unlock magical badges.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGE_DEFS.map(b => {
          const on = !!unlocked[b.id];
          return (
            <div key={b.id} className={["hp-card p-4 rounded-xl", on? "":"opacity-60"].join(" ")}>
              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-full border flex items-center justify-center">{on ? "✨" : "🔒"}</div>
                <div>
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-stone-600">{b.description}</div>
                  {on && <div className="text-xs text-green-700 mt-1">Unlocked</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
