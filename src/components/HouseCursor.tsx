// src/components/HouseCursor.tsx
import { useEffect } from "react";
import { useProfileStore } from "../state/profile";
import { HOUSES } from "../theme/houses";
import { useSettings } from "../state/settings";

export default function HouseCursor() {
  const houseKey = (useProfileStore(s => s.house) ?? "gryffindor") as keyof typeof HOUSES;
  const color = HOUSES[houseKey].primary;
  const enabled = useSettings(s => s.enableWandFX);

  useEffect(() => {
    if (!enabled) return; // don't override cursor
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = 32, h = 32;
    const canvas = document.createElement("canvas");
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // handle
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.strokeStyle = "#2d1b14";
    ctx.beginPath(); ctx.moveTo(6, 26); ctx.lineTo(20, 12); ctx.stroke();

    // tip
    ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(20, 12); ctx.lineTo(24, 8); ctx.stroke();

    // spark star
    ctx.fillStyle = color; star(ctx, 24, 8, 5, 3.6, 1.6); ctx.fill();

    // glow
    const grad = ctx.createRadialGradient(24, 8, .5, 24, 8, 6);
    grad.addColorStop(0, hexWithAlpha(color, .6)); grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(24, 8, 6, 0, Math.PI*2); ctx.fill();

    const url = canvas.toDataURL("image/png");
    const cursor = `url(${url}) 24 8, auto`;
    const elts = [document.documentElement, document.body, document.getElementById("root")!].filter(Boolean) as HTMLElement[];
    const prev: string[] = [];
    elts.forEach((el,i)=>{ prev[i]=el.style.cursor; el.style.cursor = cursor; });
    return () => { elts.forEach((el,i)=> el.style.cursor = prev[i] || ""); };
  }, [color, enabled]);

  return null;
}

function star(ctx: CanvasRenderingContext2D, x:number, y:number, points:number, outerR:number, innerR:number) {
  const step = Math.PI / points;
  ctx.beginPath();
  for (let i=0;i<2*points;i++) {
    const r = i%2 ? innerR : outerR;
    ctx.lineTo(x + Math.cos(i*step - Math.PI/2)*r, y + Math.sin(i*step - Math.PI/2)*r);
  }
  ctx.closePath();
}
function hexWithAlpha(hex: string, a: number) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(0,0,0,${a})`;
  const r = parseInt(m[1],16), g = parseInt(m[2],16), b = parseInt(m[3],16);
  return `rgba(${r},${g},${b},${a})`;
}
