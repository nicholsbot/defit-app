
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { GenerateAdaptivePlanOutput } from '@/lib/types';
import { useWorkoutLog } from '@/hooks/use-workout-log';
import { PlusCircle } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { getStaticPlan } from '@/lib/static-plans';

export default function OperatorPlan() {
  const { toast } = useToast();
  const { addWorkout, displayedWeek, availableCardio } = useWorkoutLog();
  const [logCounts, setLogCounts] = useState<Record<number, number>>({});
  
  const missionType = 'operator';
  const generatedPlan = getStaticPlan(missionType, [], availableCardio);

  useEffect(() => {
    // Reset log counts when the week changes
    setLogCounts({});
  }, [displayedWeek]);


  const handleAddDayToLog = (dayPlan: GenerateAdaptivePlanOutput['plan'][0], dayIndex: number) => {
    const workoutData = { tmar: 0, strength: 0, hiit: 0, cardio: { runRuckWalk: 0, ellipticalRow: 0, swim: 0, cycle: 0 }};

    dayPlan.activities.forEach(activity => {
      switch (activity.category) {
        case CATEGORIES.tmar.name:
          workoutData.tmar += activity.value;
          break;
        case CATEGORIES.strength.name:
          workoutData.strength += activity.value;
          break;
        case CATEGORIES.hiit.name:
          workoutData.hiit += activity.value;
          break;
        case CATEGORIES.cardio.name:
           if (activity.description.toLowerCase().includes('run') || activity.description.toLowerCase().includes('ruck') || activity.description.toLowerCase().includes('walk')) {
              workoutData.cardio.runRuckWalk += activity.value;
           } else if (activity.description.toLowerCase().includes('cycle')) {
              workoutData.cardio.cycle += activity.value;
           } else if (activity.description.toLowerCase().includes('swim')) {
              workoutData.cardio.swim += activity.value;
           } else if (activity.description.toLowerCase().includes('elliptical') || activity.description.toLowerCase().includes('row')) {
              workoutData.cardio.ellipticalRow += activity.value;
           }
          break;
      }
    });

    addWorkout(workoutData);
    setLogCounts(prev => ({
      ...prev,
      [dayIndex]: (prev[dayIndex] || 0) + 1,
    }));
    toast({
      title: 'Workout Logged!',
      description: `${dayPlan.day}'s activities have been added to your weekly tracker.`,
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        A 5-day workout schedule designed to challenge your limits and build on your existing fitness foundation. Click "Add to Log" to record a day's workout.
      </p>
       <div className="p-4 border rounded-lg space-y-4">
           <div className="text-left space-y-4">
            {generatedPlan?.plan.map((dayPlan, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="font-bold text-lg">{dayPlan.day}</h3>
                   {!dayPlan.isRestDay && (
                     <Button size="sm" variant={logCounts[index] > 0 ? "secondary" : "default"} onClick={() => handleAddDayToLog(dayPlan, index)}>
                       <PlusCircle className="mr-2 h-4 w-4" />
                       {logCounts[index] > 0 ? `Logged (${logCounts[index]}x)` : 'Add to Log'}
                     </Button>
                   )}
                </div>
                {dayPlan.isRestDay ? (
                  <p className="text-muted-foreground">Rest Day</p>
                ) : (
                  <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                    {dayPlan.activities.map((activity, actIndex) => (
                       <li key={actIndex}>
                         <strong>{activity.category}:</strong> {activity.description}
                       </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
