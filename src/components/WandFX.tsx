// src/components/WandFX.tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSettings } from "../state/settings";

export default function WandFX() {
  const host = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);
  const enabled = useSettings(s => s.enableWandFX);

  useEffect(() => {
    if (!enabled) {
      if (host.current) { host.current.remove(); host.current = null; }
      return;
    }
    if (!host.current) {
      const div = document.createElement("div");
      div.className = "hp-wand-layer";
      document.body.appendChild(div);
      host.current = div;
    }
    const onClick = (e: MouseEvent) => {
      if (!host.current) return;
      for (let i = 0; i < 8; i++) {
        const id = idRef.current++;
        const span = document.createElement("span");
        span.className = "hp-spark";
        const dx = (Math.random() - 0.5) * 60;
        const dy = (Math.random() - 0.5) * 60;
        span.style.left = `${e.clientX}px`;
        span.style.top = `${e.clientY}px`;
        span.style.setProperty("--dx", `${dx}px`);
        span.style.setProperty("--dy", `${dy}px`);
        span.dataset.id = String(id);
        host.current.appendChild(span);
        setTimeout(() => span.remove(), 650);
      }
    };
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
      if (host.current) { host.current.remove(); host.current = null; }
    };
  }, [enabled]);

  return host.current ? createPortal(null, host.current) : null;
}
