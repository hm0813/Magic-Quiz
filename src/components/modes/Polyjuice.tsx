export default function PolyjuiceFrame({ role, streak }: { role: string; streak: number }) {
  return (
    <div className="hp-card p-3 mb-3 bg-gradient-to-r from-emerald-50 to-sky-50 border">
      <div className="text-xs uppercase tracking-wide text-stone-500">Polyjuice</div>
      <div className="flex items-center justify-between">
        <div className="font-bold">You are: {role}</div>
        <div className="text-xs">In-character streak: <b>{streak}</b></div>
      </div>
    </div>
  );
}
