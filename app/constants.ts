export const LOCAL_STORAGE_KEY = "cemantix_progress";
export const LOCAL_STORAGE_STREAK_KEY = "cemantix_streak";
export const LOCAL_STORAGE_RECORDS_KEY = "cemantix_records";

export type WinStats = {
  guesses: number;
  duration: number;
  place: number;
  hints: number;
};

export type WordEntry = {
  label: string;
  temp: number;
  percentage: number;
};

export type Progress = {
  date: string;
  words: WordEntry[];
  hints: number;
  won: boolean;
  firstWordTs: number | null;
  winTs: number | null;
  wonStats: WinStats | null;
};

export type Records = {
  guesses?: number;
  duration?: number;
  place?: number;
  hints?: number;
};

export type Streak = {
  flammeCount: number;
  lastWinDate: string | null;
  stars: number;
};

export const INITIAL_PROGRESS: Progress = {
  date: "",
  words: [],
  hints: 0,
  won: false,
  firstWordTs: null,
  winTs: null,
  wonStats: null,
};

export const INITIAL_STREAK: Streak = {
  flammeCount: 0,
  lastWinDate: null,
  stars: 0,
};

export const HINTS_CONFIG = [
  { id: 1, cost: 300 },
  { id: 2, cost: 400 },
  { id: 3, cost: 500 },
  { id: 4, cost: 600 },
  { id: 5, cost: 700 },
  { id: 6, cost: 800 },
  { id: 7, cost: 800 },
  { id: 8, cost: 800 },
];
