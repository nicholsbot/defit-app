
import type { GenerateAdaptivePlanOutput } from "./types";
import { CATEGORIES, CARDIO_GOALS } from "./constants";
import type { CardioData } from "./types";

const cadetPlan: GenerateAdaptivePlanOutput = {
  plan: [
    {
      day: "Day 1",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.strength.name, description: "3x10 Squats (135 lbs), 3x10 Bench Press (95 lbs), 3x10 Barbell Rows (95 lbs)", value: 4050 + 2850 + 2850 },
        { category: CATEGORIES.tmar.name, description: "10 minutes of dynamic stretching (leg swings, arm circles)", value: 10 },
      ],
    },
    {
      day: "Day 2",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Run 3 miles`, value: 3 },
        { category: CATEGORIES.hiit.name, description: "20 minutes of HIIT: 30s on, 30s off (burpees, high knees, mountain climbers)", value: 20 },
      ],
    },
    {
      day: "Day 3",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.strength.name, description: "3x10 Overhead Press (65 lbs), 3x12 Dumbbell Lunges (20 lbs each hand)", value: 1950 + 1440 },
        { category: CATEGORIES.tmar.name, description: "15 minutes of foam rolling and mobility work", value: 15 },
      ],
    },
    {
      day: "Day 4",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Run 3 miles`, value: 3 },
        { category: CATEGORIES.tmar.name, description: "15 minute walk and static stretching", value: 15 },
      ],
    },
    {
      day: "Day 5",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Run 3 miles`, value: 3 },
        { category: CATEGORIES.hiit.name, description: "25 minutes of circuit training (box jumps, kettlebell swings, push-ups)", value: 25 },
      ],
    },
    {
      day: "Day 6",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Walk 3 miles`, value: 3 },
        { category: CATEGORIES.tmar.name, description: "25 minutes of yoga or deep stretching", value: 25 },
      ],
    },
    {
      day: "Day 7",
      isRestDay: true,
      activities: [],
    },
  ],
};

const operatorPlan: GenerateAdaptivePlanOutput = {
  plan: [
    {
      day: "Day 1",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.strength.name, description: "Lower Body Power: 5x5 Squats (185 lbs), 3x8 Deadlifts (225 lbs), 3x10 Leg Press (300 lbs)", value: 4625 + 5400 + 9000 },
        { category: CATEGORIES.tmar.name, description: "15 minutes of dynamic lower body mobility", value: 15 },
      ],
    },
    {
      day: "Day 2",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Run 4 miles`, value: 4 },
        { category: CATEGORIES.hiit.name, description: "25 minutes AMRAP: 5 pull-ups, 10 push-ups, 15 air squats", value: 25 },
      ],
    },
    {
      day: "Day 3",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.strength.name, description: "Upper Body Power: 5x5 Bench Press (155 lbs), 4x8 Overhead Press (95 lbs), 4x10 Weighted Pull-ups (10 lbs)", value: 3875 + 3040 + 4400 },
        { category: CATEGORIES.tmar.name, description: "20 minutes of upper body stretching and shoulder mobility", value: 20 },
      ],
    },
    {
      day: "Day 4",
      isRestDay: false,
      activities: [
         { category: CATEGORIES.cardio.name, description: `Run 4 miles`, value: 4 },
         { category: CATEGORIES.tmar.name, description: "20 minute active recovery walk", value: 20 },
      ]
    },
    {
      day: "Day 5",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Ruck 4 miles with 35lb pack`, value: 4 },
        { category: CATEGORIES.hiit.name, description: "15-minute kettlebell circuit: 1 min swings, 1 min goblet squats, 1 min rest, repeat", value: 15 },
      ],
    },
    {
      day: "Day 6",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Cycle ${CARDIO_GOALS.CYCLE.goal} miles`, value: CARDIO_GOALS.CYCLE.goal },
        { category: CATEGORIES.tmar.name, description: "30 minutes of foam rolling and mindfulness", value: 30 },
      ],
    },
    {
      day: "Day 7",
      isRestDay: true,
      activities: [],
    },
  ],
};

const commandoPlan: GenerateAdaptivePlanOutput = {
  plan: [
    {
      day: "Day 1",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.strength.name, description: "Push Day: 4x8 Bench Press (155 lbs), 4x10 Incline Dumbbell Press (40 lbs each), 3x12 Cable Flys (35 lbs)", value: 4960 + 3200 + 1260 },
        { category: CATEGORIES.tmar.name, description: "10 mins shoulder mobility and dynamic chest stretches", value: 10 },
      ],
    },
    {
      day: "Day 2",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Run 6 miles at a moderate pace`, value: 6 },
        { category: CATEGORIES.hiit.name, description: "20 minutes of hill sprints: 8 sets of 30-second sprints with 90-second recovery", value: 20 },
      ],
    },
    {
      day: "Day 3",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.strength.name, description: "Pull Day: 4x8 Weighted Pull-ups (15 lbs), 4x10 Barbell Rows (135 lbs), 3x12 Lat Pulldowns (100 lbs)", value: 5280 + 5400 + 3600 },
        { category: CATEGORIES.tmar.name, description: "15 mins of back and bicep stretching", value: 15 },
      ],
    },
    {
      day: "Day 4",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Cycle 20 miles as active recovery`, value: 20 },
        { category: CATEGORIES.tmar.name, description: "30 minutes of dedicated foam rolling and mobility work for the full body", value: 30 },
      ],
    },
    {
      day: "Day 5",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.strength.name, description: "Leg Day: 4x8 Squats (185 lbs), 4x8 Deadlifts (185 lbs), 3x12 Leg Press (250 lbs)", value: 5920 + 5920 + 9000 },
        { category: CATEGORIES.tmar.name, description: "10 minutes cool-down and hip flexor stretches", value: 10 },
      ],
    },
     {
      day: "Day 6",
      isRestDay: false,
      activities: [
        { category: CATEGORIES.cardio.name, description: `Ruck 6 miles with a 45lb pack`, value: 6 },
        { category: CATEGORIES.hiit.name, description: "25-minute complex: 5 rounds of 8 thrusters (75 lbs), 10 burpees, 12-cal row", value: 25 },
      ],
    },
    {
      day: "Day 7",
      isRestDay: true,
      activities: [],
    },
  ],
};


const refitBasePlan: GenerateAdaptivePlanOutput = {
  plan: [
    { day: "Day 1", isRestDay: false, activities: [ { category: CATEGORIES.strength.name, description: "3x12 Leg Press (150 lbs), 3x12 Seated Cable Row (80 lbs)", value: 5400 + 2880 }, { category: CATEGORIES.tmar.name, description: "10 mins dynamic stretching", value: 10 } ] },
    { day: "Day 2", isRestDay: false, activities: [ { category: CATEGORIES.cardio.name, description: `Walk 4 miles`, value: 4 }, { category: CATEGORIES.hiit.name, description: "20 mins low-impact HIIT (e.g. battle ropes, bike sprints)", value: 20 } ] },
    { day: "Day 3", isRestDay: false, activities: [ { category: CATEGORIES.strength.name, description: "3x12 Dumbbell Bench Press (30 lbs each), 3x15 Bodyweight Squats (to comfortable depth)", value: 2160 }, { category: CATEGORIES.tmar.name, description: "20 mins foam rolling", value: 20 } ] },
    { day: "Day 4", isRestDay: true, activities: [] },
    { day: "Day 5", isRestDay: false, activities: [ { category: CATEGORIES.cardio.name, description: `Elliptical 7.5 miles`, value: 7.5}, { category: CATEGORIES.hiit.name, description: "25 mins of kettlebell swings and goblet squats", value: 25 } ] },
    { day: "Day 6", isRestDay: false, activities: [ { category: CATEGORIES.cardio.name, description: `Walk 4 miles`, value: 4 }, { category: CATEGORIES.cardio.name, description: `Walk 4 miles`, value: 4 }, { category: CATEGORIES.tmar.name, description: "30 mins yoga/stretching", value: 30 } ] },
    { day: "Day 7", isRestDay: true, activities: [] }
  ]
};

const refitNoHeavyLiftingPlan: GenerateAdaptivePlanOutput = {
    plan: [
      { day: "Day 1", isRestDay: false, activities: [ { category: CATEGORIES.strength.name, description: "4x15 Leg Press (100 lbs), 4x15 Seated Cable Row (60 lbs)", value: 6000 + 3600 }, { category: CATEGORIES.tmar.name, description: "10 mins dynamic stretching", value: 10 } ] },
      { day: "Day 2", isRestDay: false, activities: [ { category: CATEGORIES.cardio.name, description: `Cycle 20 miles`, value: 20 }, { category: CATEGORIES.hiit.name, description: "20 mins HIIT on elliptical", value: 20 } ] },
      { day: "Day 3", isRestDay: false, activities: [ { category: CATEGORIES.strength.name, description: "4x15 Dumbbell Bench Press (20 lbs each), 4x20 Bodyweight Squats", value: 2400 }, { category: CATEGORIES.tmar.name, description: "20 mins foam rolling", value: 20 } ] },
      { day: "Day 4", isRestDay: true, activities: [] },
      { day: "Day 5", isRestDay: false, activities: [ { category: CATEGORIES.cardio.name, description: `Swim 1600 meters`, value: 1600 }, { category: CATEGORIES.hiit.name, description: "25 mins of light kettlebell swings and goblet squats", value: 25 } ] },
      { day: "Day 6", isRestDay: false, activities: [ { category: CATEGORIES.cardio.name, description: `Walk 6 miles`, value: 6 }, { category: CATEGORIES.tmar.name, description: "30 mins yoga/stretching", value: 30 } ] },
      { day: "Day 7", isRestDay: true, activities: [] }
    ]
  };

const staticPlans = {
    cadet: cadetPlan,
    operator: operatorPlan,
    commando: commandoPlan,
    refit: refitBasePlan,
    refit_heavy_lifting: refitNoHeavyLiftingPlan,
};

type CardioOption = keyof typeof CARDIO_GOALS;

const cardioEquivalents: Record<CardioOption, { description: (val: number) => string, value: number, goal: number, type: keyof CardioData }> = {
  RUN_RUCK_WALK: { description: (val) => `Run ${val.toFixed(1)} miles`, value: 1, goal: CARDIO_GOALS.RUN_RUCK_WALK.goal, type: 'runRuckWalk' },
  CYCLE: { description: (val) => `Cycle ${val.toFixed(1)} miles`, value: 1, goal: CARDIO_GOALS.CYCLE.goal, type: 'cycle' },
  SWIM: { description: (val) => `Swim ${val.toFixed(0)} meters`, value: 1, goal: CARDIO_GOALS.SWIM.goal, type: 'swim' },
  ELLIPTICAL_ROW: { description: (val) => `Elliptical ${val.toFixed(1)} miles`, value: 1, goal: CARDIO_GOALS.ELLIPTICAL_ROW.goal, type: 'ellipticalRow' },
};

function adaptCardio(plan: GenerateAdaptivePlanOutput, availableCardio: (keyof CardioData)[]): GenerateAdaptivePlanOutput {
    const adaptedPlan = JSON.parse(JSON.stringify(plan));
    
    if (availableCardio.length === 0) {
        return adaptedPlan; // Return original plan if no preference is set
    }

    const getReplacement = (originalValue: number, originalGoal: number) => {
        const percentageOfGoal = originalValue / originalGoal;
        const firstAvailable = availableCardio[0] as CardioOption;
        const replacementInfo = cardioEquivalents[firstAvailable];
        const replacementValue = percentageOfGoal * replacementInfo.goal;
        return {
            description: replacementInfo.description(replacementValue),
            value: replacementValue,
            type: replacementInfo.type,
        };
    };

    adaptedPlan.plan.forEach((day: any) => {
        day.activities = day.activities.map((activity: any) => {
            if (activity.category === CATEGORIES.cardio.name) {
                const desc = activity.description.toLowerCase();
                let activityType: keyof CardioData | null = null;
                let originalGoal = 0;

                if (desc.includes('run') || desc.includes('ruck') || desc.includes('walk')) {
                    activityType = 'runRuckWalk';
                    originalGoal = CARDIO_GOALS.RUN_RUCK_WALK.goal;
                } else if (desc.includes('cycle')) {
                    activityType = 'cycle';
                    originalGoal = CARDIO_GOALS.CYCLE.goal;
                } else if (desc.includes('swim')) {
                    activityType = 'swim';
                    originalGoal = CARDIO_GOALS.SWIM.goal;
                } else if (desc.includes('elliptical') || desc.includes('row')) {
                    activityType = 'ellipticalRow';
                    originalGoal = CARDIO_GOALS.ELLIPTICAL_ROW.goal;
                }

                if (activityType && !availableCardio.includes(activityType)) {
                    const { description, value, type } = getReplacement(activity.value, originalGoal);
                    
                    let newDesc = activity.description;
                    if (type === 'runRuckWalk') newDesc = `Run ${value.toFixed(1)} miles`;
                    if (type === 'cycle') newDesc = `Cycle ${value.toFixed(1)} miles`;
                    if (type === 'swim') newDesc = `Swim ${value.toFixed(0)} meters`;
                    if (type === 'ellipticalRow') newDesc = `Elliptical ${value.toFixed(1)} miles`;
                    
                    return { ...activity, description: newDesc, value: value };
                }
            }
            return activity;
        });
    });

    return adaptedPlan;
}


export const getStaticPlan = (
    mission: keyof Omit<typeof staticPlans, 'refit_heavy_lifting'>, 
    limitations: string[], 
    availableCardio: (keyof CardioData)[]
): GenerateAdaptivePlanOutput => {
    let planKey: keyof typeof staticPlans = mission;
    
    if (mission === 'refit') {
        if (limitations.includes('heavy_lifting')) {
            planKey = 'refit_heavy_lifting';
        } else {
            planKey = 'refit';
        }
    }

    const basePlan = staticPlans[planKey];
    return adaptCardio(basePlan, availableCardio);
};
