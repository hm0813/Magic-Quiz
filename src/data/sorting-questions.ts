// src/data/sorting-questions.ts
import type { HouseKey } from "../theme/houses";

export type SortingOption = {
  label: string;
  // pick one house this answer favors (simple & explainable)
  favors: HouseKey;
};

export type SortingQuestion = {
  id: string;
  prompt: string;
  options: SortingOption[];
};

export const SORTING_QUESTIONS: SortingQuestion[] = [
  {
    id: "q1",
    prompt: "You find a mysterious locked door. What do you do?",
    options: [
      { label: "Try a brave push and peek in.", favors: "gryffindor" },
      { label: "Analyze the lock and pick it smartly.", favors: "ravenclaw" },
      { label: "Look for a secret passage around it.", favors: "slytherin" },
      { label: "Ask a caretaker politely for help.", favors: "hufflepuff" },
    ],
  },
  {
    id: "q2",
    prompt: "Pick a study style for exams:",
    options: [
      { label: "Practice with real challenges.", favors: "gryffindor" },
      { label: "Read every book & take notes.", favors: "ravenclaw" },
      { label: "Find shortcuts that work.", favors: "slytherin" },
      { label: "Group study and help friends.", favors: "hufflepuff" },
    ],
  },
  {
    id: "q3",
    prompt: "You see someone being picked on. You…",
    options: [
      { label: "Step in and defend them.", favors: "gryffindor" },
      { label: "Plan a clever way to stop it.", favors: "ravenclaw" },
      { label: "Warn the bully with sharp words.", favors: "slytherin" },
      { label: "Comfort the person and get help.", favors: "hufflepuff" },
    ],
  },
  {
    id: "q4",
    prompt: "Which class excites you most?",
    options: [
      { label: "Defence & adventure.", favors: "gryffindor" },
      { label: "Ancient Runes & puzzles.", favors: "ravenclaw" },
      { label: "Potions & rare ingredients.", favors: "slytherin" },
      { label: "Care of Magical Creatures.", favors: "hufflepuff" },
    ],
  },
  {
    id: "q5",
    prompt: "What’s your idea of success?",
    options: [
      { label: "Courage to face anything.", favors: "gryffindor" },
      { label: "Knowledge & understanding.", favors: "ravenclaw" },
      { label: "Power to shape destiny.", favors: "slytherin" },
      { label: "Loyalty & steady growth.", favors: "hufflepuff" },
    ],
  },
];
