export type HouseKey = "gryffindor" | "slytherin" | "ravenclaw" | "hufflepuff";

export const HOUSES: Record<HouseKey, {
  name: string;
  primary: string;
  secondary: string;
  surface: string;
  text: string;
  crestEmoji: string;
  crest?: string;
}> = {
  gryffindor: {
    name: "Gryffindor",
    primary: "#7F0909",
    secondary: "#FFC500",
    surface: "#fff7e6",
    text: "#1f1f1f",
    crestEmoji: "🦁",
    crest: "/assets/crests/gryffindor.png",
  },
  slytherin: {
    name: "Slytherin",
    primary: "#1A472A",
    secondary: "#AAAAAA",
    surface: "#eef6f0",
    text: "#121212",
    crestEmoji: "🐍",
    crest: "/assets/crests/slytherin.png",
  },
  ravenclaw: {
    name: "Ravenclaw",
    primary: "#0E1A40",
    secondary: "#946B2D",
    surface: "#eaf0fb",
    text: "#0b0b0b",
    crestEmoji: "🦅",
    crest: "/assets/crests/ravenclaw.png",
  },
  hufflepuff: {
    name: "Hufflepuff",
    primary: "#ECB939",
    secondary: "#000000",
    surface: "#fff9e5",
    text: "#101010",
    crestEmoji: "🦡",
    crest: "/assets/crests/hufflepuff.png",
  },
};

export function applyHouseTheme(house: HouseKey | null) {
  const root = document.documentElement;
  if (!house) {
    root.style.removeProperty("--hp-primary");
    root.style.removeProperty("--hp-secondary");
    root.style.removeProperty("--hp-surface");
    root.style.removeProperty("--hp-text");
    document.body.dataset.house = "";
    return;
  }
  const t = HOUSES[house];
  root.style.setProperty("--hp-primary", t.primary);
  root.style.setProperty("--hp-secondary", t.secondary);
  root.style.setProperty("--hp-surface", t.surface);
  root.style.setProperty("--hp-text", t.text);
  document.body.dataset.house = house;
}
