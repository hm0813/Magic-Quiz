import { useSettings } from "../../state/settings";

export default function DifficultyPicker() {
  const d = useSettings(s => s.difficulty);
  const set = useSettings(s => s.setDifficulty);

  return (
    <div className="hp-card p-4 flex items-center gap-3">
      <span className="text-sm font-medium">Difficulty:</span>
      <button
        onClick={() => set("OWL")}
        className={["px-3 py-1 rounded-lg border text-sm", d==="OWL"?"bg-stone-900 text-white":"hover:bg-white"].join(" ")}
      >O.W.L.s (Casual)</button>
      <button
        onClick={() => set("NEWT")}
        className={["px-3 py-1 rounded-lg border text-sm", d==="NEWT"?"bg-stone-900 text-white":"hover:bg-white"].join(" ")}
      >N.E.W.T.s (Hard)</button>
    </div>
  );
}
