import { useLeaderboard } from "../state/leaderboard";

export default function Leaderboard() {
  const entries = useLeaderboard(s => s.top(20));

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold">Daily Prophet</h1>
        <p className="text-stone-600">Top scores of the week (local).</p>
      </header>

      <div className="bg-[#f7f3e8] border rounded-xl p-4">
        {/* Newspaper style */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-bold border-b pb-2 mb-3">Headline: Quiz Wizards Soar!</h2>
            <ul className="space-y-2">
              {entries.map((e, i) => (
                <li key={e.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-stone-500">{i+1}.</span>
                    <span className="font-medium">{e.name || "Anonymous"}</span>
                    {e.category && <span className="text-xs px-2 py-0.5 rounded-full border">{e.category}</span>}
                  </div>
                  <div className="font-bold">{e.score}</div>
                </li>
              ))}
              {entries.length === 0 && <li className="text-stone-500">No scores yet — be the first!</li>}
            </ul>
          </div>

          <div className="text-stone-700">
            <h2 className="text-xl font-bold border-b pb-2 mb-3">Moving Stories</h2>
            <p className="animate-pulse">“Bludgers Blaze Past NEWTs!”</p>
            <p className="mt-2 italic">“Headmaster applauds house themes & spellcraft.”</p>
          </div>
        </div>
      </div>
    </section>
  );
}
