export const CHALLENGE_START_DATE = new Date('2026-01-12T00:00:00Z');
export const CHALLENGE_WEEKS = 10;

export const TMAR_M_GOAL_MINS = 60;
export const STRENGTH_GOAL_LBS = 5000;
export const HIIT_GOAL_MINS = 45;

export const CARDIO_GOALS = {
  RUN_RUCK_WALK: { label: "Run/Ruck/Walk", unit: "miles", goal: 12 },
  ELLIPTICAL_ROW: { label: "Elliptical/Row", unit: "miles", goal: 15 },
  SWIM: { label: "Swim", unit: "meters", goal: 3200 },
  CYCLE: { label: "Cycle", unit: "miles", goal: 40 },
};

export const CATEGORIES = {
  tmar: { id: 'tmar', name: 'TMAR-M' },
  strength: { id: 'strength', name: 'Strength & Resistance' },
  cardio: { id: 'cardio', name: 'Cardio' },
  hiit: { id: 'hiit', name: 'HIIT' },
} as const;
