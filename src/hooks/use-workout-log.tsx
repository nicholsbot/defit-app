
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction, useMemo, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs, addDoc, setDoc } from 'firebase/firestore';
import type { CardioData, WorkoutData, WorkoutLog, UserProfile, WeeklyWorkoutSummary } from '@/lib/types';
import { CHALLENGE_START_DATE, CHALLENGE_WEEKS, TMAR_M_GOAL_MINS, STRENGTH_GOAL_LBS, HIIT_GOAL_MINS, CARDIO_GOALS, CATEGORIES } from '@/lib/constants';
import { DEMO_WORKOUTS, isDemoMode, logDemoMessage } from '@/firebase/demo-mode';

type MissionType = 'cadet' | 'operator' | 'commando' | 'refit' | null;

const initialWorkouts: WorkoutData = {
  tmar: 0,
  strength: 0,
  cardio: { runRuckWalk: 0, ellipticalRow: 0, swim: 0, cycle: 0 },
  hiit: 0,
};

type Achievement = {
  categoryName: string;
}

type WeeklyAchievements = {
  tmarAchieved: boolean;
  strengthAchieved: boolean;
  cardioAchieved: boolean;
  hiitAchieved: boolean;
  allWeeklyAchieved: boolean;
};

const initialWeeklyAchievements: WeeklyAchievements = {
  tmarAchieved: false,
  strengthAchieved: false,
  cardioAchieved: false,
  hiitAchieved: false,
  allWeeklyAchieved: false,
};

type NotificationSettings = {
  showAchievementPopups: boolean;
  showWeeklyCompletionPopups: boolean;
}

interface WorkoutContextType {
  weeklyWorkouts: Record<number, WeeklyWorkoutSummary>;
  addWorkout: (data: Partial<WorkoutData>) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  dialogInitialTab: keyof typeof CATEGORIES;
  setDialogInitialTab: Dispatch<SetStateAction<keyof typeof CATEGORIES>>;
  currentWeek: number;
  displayedWeek: number;
  setDisplayedWeek: Dispatch<SetStateAction<number>>;
  selectedMission: MissionType;
  setSelectedMission: Dispatch<SetStateAction<MissionType>>;
  achievementToShow: Achievement | null;
  setAchievementToShow: Dispatch<SetStateAction<Achievement | null>>;
  showWeeklyCompletion: boolean;
  setShowWeeklyCompletion: Dispatch<SetStateAction<boolean>>;
  notificationSettings: NotificationSettings;
  setNotificationSettings: Dispatch<SetStateAction<NotificationSettings>>;
  resetWeekData: (weekNumber: number) => void;
  resetAllData: () => void;
  availableCardio: (keyof CardioData)[];
  setAvailableCardio: Dispatch<SetStateAction<(keyof CardioData)[]>>;
  workoutLogs: WorkoutLog[] | null;
  userProfile: UserProfile | null;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  
  // Handle demo mode - firestore might not be available
  let firestore = null;
  try {
    firestore = useFirestore();
  } catch (error) {
    // In demo mode, firestore is not available
    console.log('Firestore not available - running in demo mode');
  }

  const userDocRef = useMemoFirebase(() => user && firestore ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userProfile } = firestore ? useDoc<UserProfile>(userDocRef) : { data: null };

  const workoutLogsQuery = useMemoFirebase(() => user && firestore ? query(collection(firestore, 'workoutLogs'), where('userProfileId', '==', user.uid)) : null, [user, firestore]);
  const { data: workoutLogs } = firestore ? useCollection<WorkoutLog>(workoutLogsQuery) : { data: isDemoMode() ? DEMO_WORKOUTS as WorkoutLog[] : null };

  const [weeklyWorkouts, setWeeklyWorkouts] = useState<Record<number, WeeklyWorkoutSummary>>({});
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInitialTab, setDialogInitialTab] = useState<keyof typeof CATEGORIES>('tmar');
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [displayedWeek, setDisplayedWeek] = useState<number>(1);
  
  const [selectedMission, setSelectedMission] = useState<MissionType>(null);
  const [achievementsByWeek, setAchievementsByWeek] = useState<Record<number, WeeklyAchievements>>({});
  const [achievementToShow, setAchievementToShow] = useState<Achievement | null>(null);
  const [showWeeklyCompletion, setShowWeeklyCompletion] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    showAchievementPopups: true,
    showWeeklyCompletionPopups: true,
  });
  
  const [availableCardio, setAvailableCardio] = useState<(keyof CardioData)[]>(
    Object.keys(CARDIO_GOALS) as (keyof CardioData)[]
  );

  useEffect(() => {
    const today = new Date();
    const timeDiff = today.getTime() - CHALLENGE_START_DATE.getTime();
    const week = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7)) + 1;
    
    let challengeWeek = 1;
    if (week > 0 && week <= CHALLENGE_WEEKS) {
      challengeWeek = week;
    } else if (week > CHALLENGE_WEEKS) {
      challengeWeek = CHALLENGE_WEEKS;
    }
    
    setCurrentWeek(challengeWeek);
    setDisplayedWeek(challengeWeek);
  }, []);

  useEffect(() => {
    if (workoutLogs) {
      const summary: Record<number, WeeklyWorkoutSummary> = {};
      workoutLogs.forEach(log => {
        if (!summary[log.week]) {
          summary[log.week] = { tmar: 0, strength: 0, hiit: 0, cardio: { runRuckWalk: 0, ellipticalRow: 0, swim: 0, cycle: 0 } };
        }
        summary[log.week].tmar += log.tmarMMinutes;
        summary[log.week].strength += log.resistanceLbs;
        summary[log.week].hiit += log.hiitMinutes;
        summary[log.week].cardio.runRuckWalk += log.cardioMilesRunning + log.cardioMilesRucking + log.cardioMilesWalking;
        summary[log.week].cardio.ellipticalRow += log.cardioMilesElliptical + log.cardioMilesRowing;
        summary[log.week].cardio.swim += log.cardioMetersSwimming;
        summary[log.week].cardio.cycle += log.cardioMilesCycling;
      });
      setWeeklyWorkouts(summary);
    }
  }, [workoutLogs]);

  useEffect(() => {
    if (userProfile?.availableCardio) {
      setAvailableCardio(userProfile.availableCardio as (keyof CardioData)[]);
    }
    if(userProfile?.selectedMission) {
      setSelectedMission(userProfile.selectedMission);
    }
  }, [userProfile]);

  const addWorkout = useCallback(async (data: Partial<WorkoutData>) => {
    if (!user) return;

    if (isDemoMode() || !firestore) {
      logDemoMessage('Adding workout to demo data (not persisted)');
      return;
    }

    const newLog: Omit<WorkoutLog, 'id'> = {
      userProfileId: user.uid,
      week: displayedWeek,
      workoutDate: new Date().toISOString(),
      tmarMMinutes: data.tmar || 0,
      resistanceLbs: data.strength || 0,
      hiitMinutes: data.hiit || 0,
      cardioMilesRunning: data.cardio?.runRuckWalk || 0,
      cardioMilesRucking: 0,
      cardioMilesWalking: 0,
      cardioMilesElliptical: data.cardio?.ellipticalRow || 0,
      cardioMilesRowing: 0,
      cardioMetersSwimming: data.cardio?.swim || 0,
      cardioMilesCycling: data.cardio?.cycle || 0,
    };
    
    await addDoc(collection(firestore, "workoutLogs"), newLog);

  }, [user, firestore, displayedWeek]);

  const resetWeekData = useCallback(async (weekNumber: number) => {
    if (!user) return;
    
    if (isDemoMode() || !firestore) {
      logDemoMessage('Resetting week data in demo mode (not persisted)');
      setAchievementsByWeek(prev => ({ ...prev, [weekNumber]: { ...initialWeeklyAchievements } }));
      return;
    }
    
    const q = query(collection(firestore, 'workoutLogs'), where('userProfileId', '==', user.uid), where('week', '==', weekNumber));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(firestore);
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    setAchievementsByWeek(prev => ({ ...prev, [weekNumber]: { ...initialWeeklyAchievements } }));
  }, [user, firestore]);

  const resetAllData = useCallback(async () => {
    if (!user) return;
    
    if (isDemoMode() || !firestore) {
      logDemoMessage('Resetting all data in demo mode (not persisted)');
      setSelectedMission(null);
      setAchievementsByWeek({});
      return;
    }
    
    const q = query(collection(firestore, 'workoutLogs'), where('userProfileId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(firestore);
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    setSelectedMission(null);
    if(userDocRef) {
        await setDoc(userDocRef, { selectedMission: null }, { merge: true });
    }
    setAchievementsByWeek({});
  }, [user, firestore, userDocRef]);
  
  const handleSetSelectedMission = useCallback(async (mission: MissionType) => {
      setSelectedMission(mission);
      if (isDemoMode() || !firestore) {
        logDemoMessage('Setting selected mission in demo mode (not persisted)');
        return;
      }
      if(userDocRef) {
          await setDoc(userDocRef, { selectedMission: mission }, { merge: true });
      }
  }, [userDocRef, firestore]);

  const handleSetAvailableCardio = useCallback(async (cardio: (keyof CardioData)[] | ((prev: (keyof CardioData)[]) => (keyof CardioData)[])) => {
      const newCardio = typeof cardio === 'function' ? cardio(availableCardio) : cardio;
      setAvailableCardio(newCardio);
      if (isDemoMode() || !firestore) {
        logDemoMessage('Setting available cardio in demo mode (not persisted)');
        return;
      }
      if(userDocRef) {
          await setDoc(userDocRef, { availableCardio: newCardio }, { merge: true });
      }
  }, [userDocRef, availableCardio, firestore]);


  const workoutsForProgress = useMemo(() => {
    return weeklyWorkouts[displayedWeek] ?? { tmar: 0, strength: 0, hiit: 0, cardio: { runRuckWalk: 0, ellipticalRow: 0, swim: 0, cycle: 0 } };
  }, [weeklyWorkouts, displayedWeek]);

  const weeklyProgress = useMemo(() => {
    const tmarPercentage = (workoutsForProgress.tmar / TMAR_M_GOAL_MINS) * 100;
    const strengthPercentage = (workoutsForProgress.strength / STRENGTH_GOAL_LBS) * 100;
    const hiitPercentage = (workoutsForProgress.hiit / HIIT_GOAL_MINS) * 100;
    const cardioPercentage =
      ((workoutsForProgress.cardio.runRuckWalk / CARDIO_GOALS.RUN_RUCK_WALK.goal) +
        (workoutsForProgress.cardio.ellipticalRow / CARDIO_GOALS.ELLIPTICAL_ROW.goal) +
        (workoutsForProgress.cardio.swim / CARDIO_GOALS.SWIM.goal) +
        (workoutsForProgress.cardio.cycle / CARDIO_GOALS.CYCLE.goal)) * 100;
    return { tmar: tmarPercentage, strength: strengthPercentage, cardio: cardioPercentage, hiit: hiitPercentage };
  }, [workoutsForProgress]);

  useEffect(() => {
    const checkAchievements = () => {
      if (achievementToShow || showWeeklyCompletion) return;

      const currentWeekAchievements = achievementsByWeek[displayedWeek] ?? initialWeeklyAchievements;

      const categories = [
        { name: "TMAR-M", progress: weeklyProgress.tmar, key: 'tmarAchieved' as const, achieved: currentWeekAchievements.tmarAchieved },
        { name: "Strength & Resistance", progress: weeklyProgress.strength, key: 'strengthAchieved' as const, achieved: currentWeekAchievements.strengthAchieved },
        { name: "Cardio", progress: weeklyProgress.cardio, key: 'cardioAchieved' as const, achieved: currentWeekAchievements.cardioAchieved },
        { name: "HIIT", progress: weeklyProgress.hiit, key: 'hiitAchieved' as const, achieved: currentWeekAchievements.hiitAchieved },
      ];

      let achievementsUpdated = false;
      const updatedAchievements = { ...currentWeekAchievements };

      for (const category of categories) {
        if (category.progress >= 100 && !category.achieved) {
          setAchievementToShow({ categoryName: category.name });
          updatedAchievements[category.key] = true;
          achievementsUpdated = true;
          break; 
        }
      }

      if(achievementsUpdated) {
        setAchievementsByWeek(prev => ({ ...prev, [displayedWeek]: updatedAchievements }));
        return;
      }
      
      const allComplete = categories.every(c => c.progress >= 100);
      if (allComplete && !currentWeekAchievements.allWeeklyAchieved) {
        setShowWeeklyCompletion(true);
        updatedAchievements.allWeeklyAchieved = true;
        setAchievementsByWeek(prev => ({ ...prev, [displayedWeek]: updatedAchievements }));
      }
    };
    
    if (notificationSettings.showAchievementPopups) {
      checkAchievements();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyProgress, achievementsByWeek, displayedWeek, achievementToShow, showWeeklyCompletion, notificationSettings.showAchievementPopups]);

  const contextValue = {
    weeklyWorkouts,
    addWorkout,
    isDialogOpen,
    setIsDialogOpen,
    dialogInitialTab,
    setDialogInitialTab,
    currentWeek,
    displayedWeek,
    setDisplayedWeek,
    selectedMission,
    setSelectedMission: handleSetSelectedMission,
    achievementToShow,
    setAchievementToShow,
    showWeeklyCompletion,
    setShowWeeklyCompletion,
    notificationSettings,
    setNotificationSettings,
    resetWeekData,
    resetAllData,
    availableCardio,
    setAvailableCardio: handleSetAvailableCardio,
    workoutLogs,
    userProfile
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutLog = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkoutLog must be used within a WorkoutProvider');
  }
  return context;
};

    