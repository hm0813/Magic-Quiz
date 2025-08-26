// src/pages/MapPage.tsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";

/* inline icons (tiny) */
const IconCastle = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 21h18M5 21V11l2 2 2-2v10M15 21V11l2 2 2-2v10"/><path d="M10 11V7l2 1 2-1v4"/><path d="M8 7V3l2 1 2-1 2 1 2-1v4"/>
  </svg>
);
const IconBook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 19V5a2 2 0 0 1 2-2h11"/><path d="M6 3a2 2 0 0 1 2 2v14"/><path d="M20 5v14a2 2 0 0 1-2 2H8"/><path d="M12 7h6M12 11h6M12 15h6"/>
  </svg>
);
const IconFlask = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M10 2v4l-5.5 9.5A3 3 0 0 0 7 20h10a3 3 0 0 0 2.5-4.5L14 6V2"/><path d="M8 10h8"/>
  </svg>
);
const IconBroom = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 20c2-1 4-1 6 0"/><path d="M4 16l4 4"/><path d="M14 3l7 7"/><path d="M6 14l8-8 4 4-8 8z"/>
  </svg>
);

type Room = {
  id: "great-hall" | "library" | "potions" | "quidditch";
  label: string;
  x: number; y: number; // %
  to: string; hint: string;
  Icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
};
const ROOMS: Room[] = [
  { id: "great-hall", label: "Great Hall", x: 20, y: 82, to: "/quiz/great-hall", hint: "Ceremonies, feasts, and… trivia!", Icon: IconCastle },
  { id: "library",   label: "Library",   x: 72, y: 78, to: "/quiz/library",    hint: "Quiet please. Difficult questions live here.", Icon: IconBook },
  { id: "potions",   label: "Potions",   x: 32, y: 36, to: "/quiz/potions",    hint: "Tricky brews & logic puzzles.", Icon: IconFlask },
  { id: "quidditch", label: "Quidditch", x: 86, y: 30, to: "/quiz/quidditch",  hint: "Fast bonus round—catch the Snitch!", Icon: IconBroom },
];

/* SFX (optional) */
const rustle = new Howl({ src: ["/assets/sfx/map-close.mp3"], volume: 0.4 });

/* Tunables */
const ZOOM_SCALE = 1.32;
const ZOOM_MS    = 700;
const MM_MS      = 900;

export default function MapPage() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<{x:number;y:number;to:string}|null>(null);
  const [closing, setClosing] = useState(false);

  function handleEnterRoom(room: Room) {
    try { rustle.play(); } catch {}
    setZoomTarget({ x: room.x, y: room.y, to: room.to });
    setClosing(true);
    window.setTimeout(() => navigate(room.to), ZOOM_MS + MM_MS);
  }

  const origin = zoomTarget ? `${zoomTarget.x}% ${zoomTarget.y}%` : "50% 50%";

  // Pre-drawn “ink” lines between rooms (in viewBox 100x100 for simpler math)
  const inkPaths = useMemo(() => ([
    "M20,82 C22,74 28,60 32,36",   // great-hall -> potions
    "M32,36 C44,52 58,60 72,78",   // potions -> library
    "M72,78 C78,62 82,46 86,30",   // library -> quidditch
    "M20,82 C36,84 56,84 72,78",   // great-hall -> library
  ]), []);

  return (
    <div className="space-y-4 hp-map-font">
      <header className="space-y-2">
        <div className="hp-map-title text-lg">
          <span>The Marauder’s Map</span>
        </div>
        <p className="text-stone-700">Messrs. Moony, Wormtail, Padfoot, and Prongs are proud to present…</p>
      </header>

      {/* Reveal curtain */}
      {!revealed && (
        <div className="hp-card hp-parchment hp-map-bg p-6">
          <div className="hp-reveal">
            <div className="text-2xl font-extrabold">“I solemnly swear that I am up to no good.”</div>
            <button onClick={() => setRevealed(true)}>Reveal the Map</button>
            <p className="text-stone-700 text-sm">Click to unveil the inked passages and rooms.</p>
          </div>
        </div>
      )}

      {/* The actual map */}
      <AnimatePresence initial={false}>
        {revealed && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            /* ↓↓↓ THIS is the important class list so the background shows */
            className="hp-map relative w-full aspect-[16/9] hp-map-bg hp-parchment hp-folds overflow-hidden"
          >
            {/* Inner wrapper scales toward the chosen room */}
            <motion.div
              style={{ transformOrigin: origin }}
              animate={{ scale: zoomTarget ? ZOOM_SCALE : 1 }}
              transition={{ duration: ZOOM_MS / 1000, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* Ink network (drawn on reveal) */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ zIndex: 3 }}>
                {inkPaths.map((d, i) => (
                  <path key={i} d={d} className="hp-ink-path" style={{ animationDelay: `${i * 180}ms` }} />
                ))}
              </svg>

              {/* Rooms */}
              {ROOMS.map((r, idx) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + 0.06 * idx }}
                  className="absolute"
                  style={{ left: `${r.x}%`, top: `${r.y}%`, zIndex: 10 }}
                >
                  <button
                    onClick={() => handleEnterRoom(r)}
                    className="hp-room hp-ink focus:outline-none inline-flex items-center gap-2"
                    title={r.hint}
                    type="button"
                  >
                    <r.Icon className="hp-room-icon" aria-hidden />
                    <span className="font-semibold">{r.label}</span>
                  </button>
                  <Link to={r.to} className="sr-only">Go to {r.label}</Link>
                </motion.div>
              ))}

              {/* Footprints overlay (inline data-URI, no external file needed) */}
              {(() => {
                const FP = `url("data:image/svg+xml;utf8,` +
                  encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 64 32" fill="none">'
                    + '<path d="M12 24c3 0 5-2 5-4s-2-4-5-4-5 2-5 4 2 4 5 4Z" fill="black" fill-opacity=".75"/>'
                    + '<circle cx="12" cy="14" r="2" fill="black" fill-opacity=".75"/>'
                    + '<path d="M36 18c3 0 5-2 5-4s-2-4-5-4-5 2-5 4 2 4 5 4Z" fill="black" fill-opacity=".75"/>'
                    + '<circle cx="36" cy="8" r="2" fill="black" fill-opacity=".75"/>'
                    + '</svg>'
                  ) + `")`;
                const styleVar = { ['--fp-url' as any]: FP };
                return (
                  <>
                    <div className="hp-footprints hp-fp-greathall" style={styleVar} />
                    <div className="hp-footprints hp-fp-library"   style={styleVar} />
                    <div className="hp-footprints hp-fp-potions"   style={styleVar} />
                    <div className="hp-footprints hp-fp-quidditch" style={styleVar} />
                  </>
                );
              })()}
            </motion.div>

            {/* Mischief Managed overlay */}
            <AnimatePresence>
              {closing && (
                <motion.div
                  key="mm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hp-mm-overlay"
                  style={{ animation: `hp-mm-wipe ${MM_MS}ms ease-out forwards` }}
                >
                  <div className="hp-mm-text">Mischief Managed</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 text-stone-700">
        <button
          className="px-3 py-1.5 rounded-full border"
          onClick={() => setRevealed(false)}
        >
          Hide Map
        </button>
        <span className="text-sm">Say the words again to reveal it.</span>
      </div>
    </div>
  );
}
