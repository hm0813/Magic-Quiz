// src/pages/Settings.tsx
import { useSettings } from "../state/settings";

export default function Settings() {
  const s = useSettings();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold">Settings</h1>
        <p className="text-stone-600">Tune your magic, sound, and difficulty.</p>
      </header>

      {/* Quidditch Timer */}
      <div className="hp-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Quidditch Timer</div>
            <div className="text-sm text-stone-600">Countdown per question.</div>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={s.enableTimer}
              onChange={(e) => s.setTimerEnabled(e.target.checked)}
            />
            <span className="text-sm">Enabled</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={120}
            value={s.secondsPerQuestion}
            onChange={(e) => s.setSecondsPerQuestion(parseInt(e.target.value))}
            className="w-full"
            disabled={!s.enableTimer}
          />
          <div className="w-16 text-right">
            <b>{s.secondsPerQuestion}</b>s
          </div>
        </div>
      </div>

      {/* Sound */}
      <div className="hp-card p-5 space-y-4">
        <div className="font-semibold">Sound Effects</div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(s.sfxVolume * 100)}
            onChange={(e) => s.setSfxVolume(parseInt(e.target.value) / 100)}
            className="w-full"
          />
          <div className="w-16 text-right">
            <b>{Math.round(s.sfxVolume * 100)}</b>%
          </div>
        </div>
        <p className="text-xs text-stone-500">0% mutes all quiz SFX (correct/wrong/spells).</p>
      </div>

      {/* Visual FX */}
      <div className="hp-card p-5 space-y-3">
        <div className="font-semibold">Visual Effects</div>
        <label className="flex items-center justify-between">
          <span>Wand Cursor & Spark Trail</span>
          <input type="checkbox" checked={s.enableWandFX} onChange={(e)=>s.setWandFX(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between">
          <span>Talking Portraits (Lumos hints)</span>
          <input type="checkbox" checked={s.enablePortraits} onChange={(e)=>s.setPortraits(e.target.checked)} />
        </label>
      </div>
    </section>
  );
}
