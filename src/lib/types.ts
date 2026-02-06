
export type CardioData = {
  runRuckWalk: number;
  ellipticalRow: number;
  swim: number;
  cycle: number;
};

export type WorkoutData = {
  tmar: number;
  strength: number;
  cardio: CardioData;
  hiit: number;
};

export type WeeklyWorkoutSummary = {
  tmar: number;
  strength: number;
  hiit: number;
  cardio: CardioData;
};


export type Activity = {
  category: string;
  description: string;
  value: number;
};

export type DailyPlan = {
  day: string;
  activities: Activity[];
  isRestDay: boolean;
};

export type GenerateAdaptivePlanOutput = {
  plan: DailyPlan[];
};

// Participant categories
export type ParticipantCategory = 'soldier' | 'civilian' | 'family';

// Army Reserve duty statuses (only applicable when category is 'soldier')
export type DutyStatus = 'IMA' | 'TPU' | 'AGR' | 'T10';

export interface UserProfile {
  id: string;
  displayName?: string;
  email?: string;
  participantCategory?: ParticipantCategory;
  dutyStatus?: DutyStatus; // Only for soldiers
  isSoldier?: boolean; // Deprecated - use participantCategory === 'soldier'
  rank?: string;
  unit?: string;
  teamName?: string;
  avatarUrl?: string;
  availableCardio?: string[];
  selectedMission?: 'cadet' | 'operator' | 'commando' | 'refit' | null;
}

export interface WorkoutLog {
  id: string;
  userProfileId: string;
  week: number;
  workoutDate: string;
  tmarMMinutes: number;
  resistanceLbs: number;
  cardioMilesRunning: number;
  cardioMilesRucking: number;
  cardioMilesWalking: number;
  cardioMilesElliptical: number;
  cardioMilesRowing: number;
  cardioMetersSwimming: number;
  cardioMilesCycling: number;
  hiitMinutes: number;
}

    