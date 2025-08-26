// src/components/HouseBadge.tsx
import { HOUSES } from "../theme/houses";

export default function HouseBadge({ houseKey }: { houseKey: keyof typeof HOUSES }) {
  const h = HOUSES[houseKey];
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-sm" style={{ borderColor: h.primary }}>
      {h.crest ? (
        <img src={h.crest} className="w-5 h-5 object-contain" alt="" />
      ) : (
        <span className="text-lg" aria-hidden>{h.crestEmoji}</span>
      )}
      <span>{h.name}</span>
    </span>
  );
}
