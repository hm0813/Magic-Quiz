// src/data/quiz-data.ts

export type Choice = { text: string; correct?: boolean; hint?: string };
export type QA = { id: string; prompt: string; choices: Choice[] };

/**
 * Quiz questions grouped by category (room).
 * Categories: "great-hall", "library", "potions", "quidditch"
 * - Each question has a unique id
 * - Exactly ONE choice per question is marked { correct: true }
 * - Optional "hint" shows up when we enable the Lumos spell (Phase 3.2)
 */
export const QUIZ_BANK: Record<string, QA[]> = {
  // ----- GREAT HALL (general Hogwarts knowledge / ceremonies) -----
  "great-hall": [
    {
      id: "gh-1",
      prompt: "Which house values bravery the most?",
      choices: [
        { text: "Gryffindor", correct: true, hint: "Scarlet & gold lion" },
        { text: "Slytherin" },
        { text: "Ravenclaw" },
        { text: "Hufflepuff" },
      ],
    },
    {
      id: "gh-2",
      prompt: "The Sorting Hat sits on…",
      choices: [
        { text: "A goblet" },
        { text: "A stool", correct: true, hint: "Short and wooden" },
        { text: "A throne" },
        { text: "A pumpkin" },
      ],
    },
    {
      id: "gh-3",
      prompt: "The Great Hall’s ceiling is enchanted to look like the…",
      choices: [
        { text: "Forest" },
        { text: "Sky", correct: true, hint: "It mirrors the weather outside" },
        { text: "Lake" },
        { text: "Common Room" },
      ],
    },
    {
      id: "gh-4",
      prompt: "At the start of term, students enjoy a feast in the…",
      choices: [
        { text: "Quidditch Pitch" },
        { text: "Great Hall", correct: true },
        { text: "Library" },
        { text: "Greenhouses" },
      ],
    },
    {
      id: "gh-5",
      prompt: "Who makes the opening announcements at Hogwarts feasts?",
      choices: [
        { text: "The Headmaster/Headmistress", correct: true, hint: "Often standing at the Staff Table" },
        { text: "The Keeper" },
        { text: "The Caretaker" },
        { text: "The Hogwarts Ghosts" },
      ],
    },
    {
      id: "gh-6",
      prompt: "Which item selects champions in the Triwizard Tournament?",
      choices: [
        { text: "The Sorting Hat" },
        { text: "The Goblet of Fire", correct: true },
        { text: "The Elder Wand" },
        { text: "The Pensieve" },
      ],
    },
    {
      id: "gh-7",
      prompt: "House points are tracked using giant hourglasses filled with…",
      choices: [
        { text: "Sand" },
        { text: "Colored gems", correct: true, hint: "Sapphires, emeralds, rubies, etc." },
        { text: "Water" },
        { text: "Quills" },
      ],
    },
    {
      id: "gh-8",
      prompt: "Dumbledore is famously fond of which Muggle sweet?",
      choices: [
        { text: "Chocolate Frogs" },
        { text: "Sherbet Lemons", correct: true, hint: "Also called lemon drops" },
        { text: "Bertie Bott’s Every Flavour Beans" },
        { text: "Treacle Tart" },
      ],
    },
  ],

  // ----- LIBRARY (books, knowledge, spells, school rules) -----
  library: [
    {
      id: "lib-1",
      prompt: "Who runs the Hogwarts Library?",
      choices: [
        { text: "Madam Pince", correct: true, hint: "Very strict librarian" },
        { text: "Madam Pomfrey" },
        { text: "Professor Sprout" },
        { text: "Sirius Black" },
      ],
    },
    {
      id: "lib-2",
      prompt: "Which spell repairs small objects?",
      choices: [
        { text: "Alohomora" },
        { text: "Reparo", correct: true, hint: "Hermione uses it often" },
        { text: "Lumos" },
        { text: "Expelliarmus" },
      ],
    },
    {
      id: "lib-3",
      prompt: "What’s required to access the Restricted Section?",
      choices: [
        { text: "A Prefect badge" },
        { text: "A note from a teacher", correct: true },
        { text: "Being a Seeker" },
        { text: "A Marauder’s Map" },
      ],
    },
    {
      id: "lib-4",
      prompt: "Which book is known to bite and needs to be stroked to calm down?",
      choices: [
        { text: "The Monster Book of Monsters", correct: true, hint: "Used in Care of Magical Creatures" },
        { text: "Hogwarts: A History" },
        { text: "Magical Drafts and Potions" },
        { text: "The Tales of Beedle the Bard" },
      ],
    },
    {
      id: "lib-5",
      prompt: "Which spell unlocks doors?",
      choices: [
        { text: "Alohomora", correct: true },
        { text: "Petrificus Totalus" },
        { text: "Wingardium Leviosa" },
        { text: "Finite Incantatem" },
      ],
    },
    {
      id: "lib-6",
      prompt: "Hermione frequently references which book?",
      choices: [
        { text: "Hogwarts: A History", correct: true },
        { text: "Quidditch Through the Ages" },
        { text: "Magical Me" },
        { text: "The Standard Book of Spells, Grade 1" },
      ],
    },
    {
      id: "lib-7",
      prompt: "Who wrote The Tales of Beedle the Bard?",
      choices: [
        { text: "Beedle the Bard", correct: true },
        { text: "Gilderoy Lockhart" },
        { text: "Newt Scamander" },
        { text: "Bathilda Bagshot" },
      ],
    },
    {
      id: "lib-8",
      prompt: "Which charm produces light at the tip of your wand?",
      choices: [
        { text: "Nox" },
        { text: "Lumos", correct: true, hint: "Counter-charm is Nox" },
        { text: "Incendio" },
        { text: "Diffindo" },
      ],
    },
  ],

  // ----- POTIONS (ingredients, effects, professors) -----
  potions: [
    {
      id: "po-1",
      prompt: "Felix Felicis is also known as…",
      choices: [
        { text: "Liquid Luck", correct: true, hint: "Gives unusually good fortune" },
        { text: "Truth Serum" },
        { text: "Sleeping Draught" },
        { text: "Pepperup Potion" },
      ],
    },
    {
      id: "po-2",
      prompt: "Who is known for a strict Potions class?",
      choices: [
        { text: "Professor Snape", correct: true, hint: "No foolish wand-waving!" },
        { text: "Professor McGonagall" },
        { text: "Professor Flitwick" },
        { text: "Professor Binns" },
      ],
    },
    {
      id: "po-3",
      prompt: "Veritaserum is a powerful…",
      choices: [
        { text: "Love potion" },
        { text: "Truth serum", correct: true },
        { text: "Hair-growth tonic" },
        { text: "Laughing potion" },
      ],
    },
    {
      id: "po-4",
      prompt: "A bezoar can save someone from…",
      choices: [
        { text: "Dementors" },
        { text: "Poison", correct: true, hint: "Small stone from a goat’s stomach" },
        { text: "Stunning spells" },
        { text: "Werewolf bites" },
      ],
    },
    {
      id: "po-5",
      prompt: "Polyjuice Potion allows the drinker to…",
      choices: [
        { text: "Turn invisible" },
        { text: "Change appearance into someone else", correct: true },
        { text: "Breathe underwater" },
        { text: "Fly without a broom" },
      ],
    },
    {
      id: "po-6",
      prompt: "Amortentia is famous for producing a scent that…",
      choices: [
        { text: "Smells like the person’s favorite things", correct: true, hint: "Different for everyone" },
        { text: "Smells like old books" },
        { text: "Has no smell" },
        { text: "Smells like pumpkins" },
      ],
    },
    {
      id: "po-7",
      prompt: "The Draught of Living Death causes…",
      choices: [
        { text: "A deep, potion-induced sleep", correct: true },
        { text: "Temporary invisibility" },
        { text: "Laughter" },
        { text: "Immediate healing" },
      ],
    },
    {
      id: "po-8",
      prompt: "Which potion helps a werewolf keep their mind during transformation?",
      choices: [
        { text: "Wolfsbane Potion", correct: true, hint: "Doesn’t cure lycanthropy" },
        { text: "Pepperup Potion" },
        { text: "Skele-Gro" },
        { text: "Elixir to Induce Euphoria" },
      ],
    },
  ],

  // ----- QUIDDITCH (rules, roles, scoring) -----
  quidditch: [
    {
      id: "q-1",
      prompt: "Catching the Golden Snitch gives…",
      choices: [
        { text: "50 points" },
        { text: "150 points", correct: true, hint: "Often decides the match" },
        { text: "10 points" },
        { text: "200 points" },
      ],
    },
    {
      id: "q-2",
      prompt: "Which position chases the Quaffle?",
      choices: [
        { text: "Chasers", correct: true, hint: "There are three per team" },
        { text: "Beaters" },
        { text: "Seeker" },
        { text: "Keeper" },
      ],
    },
    {
      id: "q-3",
      prompt: "How many players are on a Quidditch team (on the field)?",
      choices: [
        { text: "5" },
        { text: "7", correct: true },
        { text: "9" },
        { text: "11" },
      ],
    },
    {
      id: "q-4",
      prompt: "How many goal hoops does each team defend?",
      choices: [
        { text: "1" },
        { text: "3", correct: true },
        { text: "4" },
        { text: "6" },
      ],
    },
    {
      id: "q-5",
      prompt: "What do Beaters mainly do?",
      choices: [
        { text: "Score with the Quaffle" },
        { text: "Hit Bludgers away from teammates", correct: true, hint: "They use bats" },
        { text: "Catch the Snitch" },
        { text: "Guard the hoops" },
      ],
    },
    {
      id: "q-6",
      prompt: "A successful Quaffle goal is worth…",
      choices: [
        { text: "5 points" },
        { text: "10 points", correct: true },
        { text: "20 points" },
        { text: "25 points" },
      ],
    },
    {
      id: "q-7",
      prompt: "Which of these is NOT a Quidditch ball?",
      choices: [
        { text: "Quaffle" },
        { text: "Bludger" },
        { text: "Golden Snitch" },
        { text: "Cognate", correct: true, hint: "Not in Quidditch!" },
      ],
    },
    {
      id: "q-8",
      prompt: "The Keeper’s job is to…",
      choices: [
        { text: "Call fouls" },
        { text: "Guard the hoops", correct: true },
        { text: "Hit Bludgers" },
        { text: "Chase the Quaffle" },
      ],
    },
  ],
};
