
"use client";

import { useMemo } from "react";
import type { WorkoutData, WeeklyWorkoutSummary } from "@/lib/types";
import {
  TMAR_M_GOAL_MINS,
  STRENGTH_GOAL_LBS,
  HIIT_GOAL_MINS,
  CARDIO_GOALS,
  CHALLENGE_WEEKS,
  CATEGORIES,
} from "@/lib/constants";
import CategoryProgressCard from "./category-progress-card";
import LogWorkoutDialog from "./log-workout-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, HeartPulse, Footprints, Zap, ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import OverallProgressCard from "./overall-progress-card";
import { useWorkoutLog } from "@/hooks/use-workout-log";

export default function WorkoutTracker() {
  const { weeklyWorkouts, addWorkout, isDialogOpen, setIsDialogOpen, displayedWeek, setDisplayedWeek, setDialogInitialTab, dialogInitialTab, workoutLogs, userProfile } = useWorkoutLog();


  const workouts = useMemo(() => {
    return weeklyWorkouts[displayedWeek] ?? {
      tmar: 0,
      strength: 0,
      cardio: { runRuckWalk: 0, ellipticalRow: 0, swim: 0, cycle: 0 },
      hiit: 0,
    };
  }, [weeklyWorkouts, displayedWeek]);

  const weeklyProgress = useMemo(() => {
    const tmarPercentage = (workouts.tmar / TMAR_M_GOAL_MINS) * 100;
    const strengthPercentage = (workouts.strength / STRENGTH_GOAL_LBS) * 100;
    const hiitPercentage = (workouts.hiit / HIIT_GOAL_MINS) * 100;

    const cardioPercentage =
      (workouts.cardio.runRuckWalk / CARDIO_GOALS.RUN_RUCK_WALK.goal +
        workouts.cardio.ellipticalRow / CARDIO_GOALS.ELLIPTICAL_ROW.goal +
        workouts.cardio.swim / CARDIO_GOALS.SWIM.goal +
        workouts.cardio.cycle / CARDIO_GOALS.CYCLE.goal) *
      100;

    return {
      tmar: tmarPercentage,
      strength: strengthPercentage,
      cardio: cardioPercentage,
      hiit: hiitPercentage,
    };
  }, [workouts]);

  const overallProgressPercentage = useMemo(() => {
    if (!workoutLogs || workoutLogs.length === 0) return 0;
    
    const weeklyTotals: { [week: number]: { tmar: number; strength: number; hiit: number; cardio: number } } = {};

    workoutLogs.forEach(log => {
      if (!weeklyTotals[log.week]) {
        weeklyTotals[log.week] = { tmar: 0, strength: 0, hiit: 0, cardio: 0 };
      }
      weeklyTotals[log.week].tmar += log.tmarMMinutes;
      weeklyTotals[log.week].strength += log.resistanceLbs;
      weeklyTotals[log.week].hiit += log.hiitMinutes;

      const cardioProgress =
        (log.cardioMilesRunning / CARDIO_GOALS.RUN_RUCK_WALK.goal) +
        (log.cardioMilesRucking / CARDIO_GOALS.RUN_RUCK_WALK.goal) +
        (log.cardioMilesWalking / CARDIO_GOALS.RUN_RUCK_WALK.goal) +
        (log.cardioMilesElliptical / CARDIO_GOALS.ELLIPTICAL_ROW.goal) +
        (log.cardioMilesRowing / CARDIO_GOALS.ELLIPTICAL_ROW.goal) +
        (log.cardioMetersSwimming / CARDIO_GOALS.SWIM.goal) +
        (log.cardioMilesCycling / CARDIO_GOALS.CYCLE.goal);
      
      weeklyTotals[log.week].cardio += cardioProgress * 100;
    });

    const numWeeks = Object.keys(weeklyTotals).length;
    if (numWeeks === 0) return 0;

    let totalTmarPercentage = 0;
    let totalStrengthPercentage = 0;
    let totalHiitPercentage = 0;
    let totalCardioPercentage = 0;

    Object.values(weeklyTotals).forEach(week => {
        totalTmarPercentage += (week.tmar / TMAR_M_GOAL_MINS) * 100;
        totalStrengthPercentage += (week.strength / STRENGTH_GOAL_LBS) * 100;
        totalHiitPercentage += (week.hiit / HIIT_GOAL_MINS) * 100;
        totalCardioPercentage += week.cardio;
    });
    
    const avgTmar = totalTmarPercentage / numWeeks;
    const avgStrength = totalStrengthPercentage / numWeeks;
    const avgHiit = totalHiitPercentage / numWeeks;
    const avgCardio = totalCardioPercentage / numWeeks;

    return (avgTmar + avgStrength + avgHiit + avgCardio) / 4;
  }, [workoutLogs]);
  
  const handleLogWorkout = (data: WorkoutData) => {
    addWorkout(data);
  };

  const goToPreviousWeek = () => {
    if (displayedWeek > 1) {
      setDisplayedWeek(displayedWeek - 1);
    }
  };

  const goToNextWeek = () => {
    if (displayedWeek < CHALLENGE_WEEKS) {
      setDisplayedWeek(displayedWeek + 1);
    }
  };

  const openLogDialog = (tab: keyof typeof CATEGORIES) => {
    setDialogInitialTab(tab);
    setIsDialogOpen(true);
  };
  
  const dialogInitialData: WorkoutData = {
    tmar: workouts.tmar,
    strength: workouts.strength,
    hiit: workouts.hiit,
    cardio: workouts.cardio,
  };

  return (
    <div className="space-y-6">
       <OverallProgressCard progress={overallProgressPercentage} />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek} disabled={displayedWeek <= 1}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">Weekly Tracker</h2>
                <p className="text-muted-foreground">
                    Week {displayedWeek} of {CHALLENGE_WEEKS} - Stay consistent, stay strong.
                </p>
            </div>
            <Button variant="outline" size="icon" onClick={goToNextWeek} disabled={displayedWeek >= CHALLENGE_WEEKS}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <div className="my-4">
        <Button size="lg" className="w-full text-lg py-6" onClick={() => openLogDialog('tmar')}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Log / Edit Workout
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CategoryProgressCard
          title="TMAR-M"
          icon={<HeartPulse className="h-6 w-6 text-primary" />}
          progress={weeklyProgress.tmar}
          currentValue={workouts.tmar}
          goalValue={TMAR_M_GOAL_MINS}
          unit="mins"
          onAdd={() => openLogDialog('tmar')}
        />
        <CategoryProgressCard
          title="Strength & Resistance"
          icon={<Dumbbell className="h-6 w-6 text-primary" />}
          progress={weeklyProgress.strength}
          currentValue={workouts.strength}
          goalValue={STRENGTH_GOAL_LBS}
          unit="lbs"
          onAdd={() => openLogDialog('strength')}
        />
        <CategoryProgressCard
          title="Cardio"
          icon={<Footprints className="h-6 w-6 text-primary" />}
          progress={weeklyProgress.cardio}
          currentValue={Math.round(weeklyProgress.cardio)}
          goalValue={100}
          unit="%"
          description="Combined progress from all cardio activities."
          onAdd={() => openLogDialog('cardio')}
        />
        <CategoryProgressCard
          title="HIIT"
          icon={<Zap className="h-6 w-6 text-primary" />}
          progress={weeklyProgress.hiit}
          currentValue={workouts.hiit}
          goalValue={HIIT_GOAL_MINS}
          unit="mins"
          onAdd={() => openLogDialog('hiit')}
        />
      </div>

      <LogWorkoutDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onLogWorkout={handleLogWorkout}
        initialData={dialogInitialData}
        initialTab={dialogInitialTab}
      />
    </div>
  );
}

    