"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Award, BarChart, BarChart2, BarChart3, Star, Shield, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkoutLog } from "@/hooks/use-workout-log";
import { useRouter } from "next/navigation";

const missions = [
  {
    name: "Cadet",
    level: "Beginner",
    icon: <BarChart className="w-6 h-6 text-muted-foreground" />,
    description: "Build your foundation with fundamental exercises and steady progress.",
    missionType: "cadet" as const,
  },
  {
    name: "Operator",
    level: "Intermediate",
    icon: <BarChart2 className="w-6 h-6 text-muted-foreground" />,
    description: "Challenge your limits with more intense and complex workout routines.",
    missionType: "operator" as const,
  },
  {
    name: "Commando",
    level: "Advanced",
    icon: <BarChart3 className="w-6 h-6 text-muted-foreground" />,
    description: "Push to peak performance with elite-level training plans.",
    missionType: "commando" as const,
  },
  {
    name: "REFIT",
    level: "Adaptive",
    icon: <Heart className="w-6 h-6 text-muted-foreground" />,
    description: "A tailored path to rebuild, recover, and return to peak form. Your comeback starts here.",
    missionType: "refit" as const,
  },
];

export default function MissionsPage() {
  const { setSelectedMission } = useWorkoutLog();
  const router = useRouter();

  const handleSelectMission = (missionType: 'cadet' | 'operator' | 'commando' | 'refit') => {
    setSelectedMission(missionType);
    router.push('/dashboard');
  };


  return (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Your Mission</CardTitle>
          <CardDescription>
            Choose a workout plan that matches your fitness level and goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          {missions.map((mission) => (
            <Card key={mission.name} className="flex flex-col hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {mission.name === "Cadet" && <Shield className="w-6 h-6 text-primary" />}
                  {mission.name === "Operator" && <ShieldCheck className="w-6 h-6 text-primary" />}
                  {mission.name === "Commando" && <Star className="w-6 h-6 text-primary" />}
                  {mission.name === "REFIT" && <Award className="w-6 h-6 text-primary" />}
                  <span>{mission.name}</span>
                </CardTitle>
                <CardDescription>{mission.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow"/>
              <CardFooter className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                  {mission.icon}
                  <span>{mission.level}</span>
                 </div>
                 <Button variant="outline" onClick={() => handleSelectMission(mission.missionType)}>
                   Select Plan
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
