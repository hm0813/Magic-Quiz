import { DIFFICULTY, useSettings, type Difficulty } from "../../state/settings";

const OPTS: { key: Difficulty; title: string; desc: string }[] = [
  { key: "first-year", title: "First Year", desc: "Comfy timer, all lifelines, fewer points" },
  { key: "owl",        title: "O.W.L.",     desc: "Balanced timer, all lifelines" },
  { key: "newt",       title: "N.E.W.T.",   desc: "Shorter timer, fewer hints, more points" },
];

export default function DifficultyPicker() {
  const s = useSettings();
  return (
    <div className="hp-card p-4">
      <div className="font-semibold mb-2">Difficulty</div>
      <div className="grid sm:grid-cols-3 gap-2">
        {OPTS.map(o => {
          const active = s.difficulty === o.key;
          return (
            <button
              key={o.key}
              onClick={() => s.setDifficulty(o.key)}
              className={[
                "text-left p-3 rounded-lg border transition",
                active ? "hp-border-primary hp-text-primary bg-white" : "hover:bg-white"
              ].join(" ")}
            >
              <div className="font-bold">{o.title}</div>
              <div className="text-xs text-stone-600">{o.desc}</div>
              <div className="text-[11px] text-stone-500 mt-1">
                Timer ×{DIFFICULTY[o.key].timerMult} • Points ×{DIFFICULTY[o.key].pointsMult}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
