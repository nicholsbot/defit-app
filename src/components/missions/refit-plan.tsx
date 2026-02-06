"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { GenerateAdaptivePlanOutput } from '@/lib/types';
import { useWorkoutLog } from "@/hooks/use-workout-log";
import { PlusCircle } from "lucide-react";
import { CATEGORIES, CARDIO_GOALS } from "@/lib/constants";
import { getStaticPlan } from "@/lib/static-plans";
import type { CardioData } from "@/lib/types";


const limitationsOptions = [
  { id: "overhead_presses", label: "Overhead Presses" },
  { id: "high_impact_cardio", label: "High-Impact Cardio (e.g., running, jumping)" },
  { id: "heavy_lifting", label: "Heavy Lifting" },
  { id: "squats_lunges", label: "Deep Squats or Lunges" },
];

const cardioOptions = Object.keys(CARDIO_GOALS).map(key => ({
  id: key as keyof typeof CARDIO_GOALS,
  label: CARDIO_GOALS[key as keyof typeof CARDIO_GOALS].label
}));

export default function RefitPlan() {
  const [selectedLimitations, setSelectedLimitations] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<GenerateAdaptivePlanOutput | null>(null);

  const { toast } = useToast();
  const { addWorkout, displayedWeek, availableCardio, setAvailableCardio } = useWorkoutLog();
  const [logCounts, setLogCounts] = useState<Record<number, number>>({});
  

  useEffect(() => {
    // Reset log counts when the plan or week changes
    setLogCounts({});
  }, [generatedPlan, displayedWeek]);


  const findPlan = () => {
    if (availableCardio.length === 0) {
      toast({
        variant: "destructive",
        title: "No Cardio Selected",
        description: "Please select at least one available cardio option.",
      });
      return;
    }
    
    const plan = getStaticPlan('refit', selectedLimitations, availableCardio);
    setGeneratedPlan(plan);
    
    toast({
      title: "Adaptive Plan Loaded!",
      description: "Your REFIT workout plan is ready below.",
    });
  };

  const handleLimitationChange = (limitationId: string) => {
    setSelectedLimitations(prev =>
      prev.includes(limitationId)
        ? prev.filter(id => id !== limitationId)
        : [...prev, limitationId]
    );
    setGeneratedPlan(null); // Reset plan when limitations change
  };
  
  const handleCardioChange = (cardioId: keyof CardioData) => {
    setAvailableCardio(prev =>
      prev.includes(cardioId)
        ? prev.filter(id => id !== cardioId)
        : [...prev, cardioId]
    );
     setGeneratedPlan(null); // Reset plan when cardio options change
  };

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
        Tell us about your physical limitations and available equipment so we can generate a workout plan tailored to you.
      </p>
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Select Your Limitations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {limitationsOptions.map((limitation) => (
            <div key={limitation.id} className="flex items-center space-x-3 p-3 border rounded-md">
              <Checkbox
                id={limitation.id}
                checked={selectedLimitations.includes(limitation.id)}
                onCheckedChange={() => handleLimitationChange(limitation.id)}
              />
              <Label htmlFor={limitation.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {limitation.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
       <div className="space-y-4">
        <h3 className="font-semibold text-lg">Select Available Cardio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardioOptions.map((cardio) => (
            <div key={cardio.id} className="flex items-center space-x-3 p-3 border rounded-md">
              <Checkbox
                id={cardio.id}
                checked={availableCardio.includes(cardio.id as keyof CardioData)}
                onCheckedChange={() => handleCardioChange(cardio.id as keyof CardioData)}
              />
              <Label htmlFor={cardio.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {cardio.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 text-center border-dashed border-2 rounded-lg space-y-4">
         <Button onClick={findPlan}>
            Generate My Adaptive Plan
         </Button>
        
        {generatedPlan && (
          <div className="text-left space-y-4">
            {generatedPlan.plan.map((dayPlan, index) => (
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
        )}
        
        {!generatedPlan && (
           <p className="text-muted-foreground mt-2 text-sm">
              After selecting your limitations and cardio options, your personalized plan will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
