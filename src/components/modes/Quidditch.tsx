import { useEffect, useState } from "react";

export default function QuidditchHUD({ shake }: { shake: boolean }) {
  const [key, setKey] = useState(0);
  useEffect(() => { if (shake) { setKey(k => k + 1); } }, [shake]);
  return (
    <div className={["hp-card p-3 mb-3 border", shake ? "hp-bludger" : ""].join(" ")} key={key}>
      <div className="flex items-center justify-between">
        <div className="font-semibold">Quidditch Blitz</div>
        <div className="text-xs text-stone-600">Keep the streak, avoid the bludgers!</div>
      </div>
    </div>
  );
}
