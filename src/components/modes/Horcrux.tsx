import { memo } from "react";

export default memo(function HorcruxRing({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / Math.max(1,total)) * 100);
  const stroke = 8;
  const r = 36 - stroke;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div className="flex items-center gap-3">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden>
        <defs>
          <linearGradient id="locketGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9a7b2f" />
          </linearGradient>
        </defs>
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(0,0,0,.1)" strokeWidth={stroke} />
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke="url(#locketGrad)"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        {/* locket */}
        <g transform="translate(22,22)">
          <ellipse cx="14" cy="14" rx="10" ry="13" fill="#f2e4bd" stroke="#8e7934" />
          <circle cx="14" cy="14" r="3.5" fill="#e9d68f" stroke="#8e7934" />
          <path d="M14 1.5 L14 6" stroke="#8e7934" />
          <circle cx="14" cy="1.5" r="2" fill="#e9d68f" stroke="#8e7934" />
        </g>
      </svg>
      <div>
        <div className="text-sm font-semibold">Horcrux</div>
        <div className="text-xs text-stone-600">Destroyed {current} / {total}</div>
      </div>
    </div>
  );
});
