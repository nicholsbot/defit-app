"use client";

import WorkoutTracker from "@/components/dashboard/workout-tracker";
import { useWorkoutLog } from "@/hooks/use-workout-log";
import CadetPlan from "@/components/missions/cadet-plan";
import OperatorPlan from "@/components/missions/operator-plan";
import CommandoPlan from "@/components/missions/commando-plan";
import RefitPlan from "@/components/missions/refit-plan";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const missionComponents = {
  cadet: { component: CadetPlan, title: "Cadet Mission" },
  operator: { component: OperatorPlan, title: "Operator Mission" },
  commando: { component: CommandoPlan, title: "Commando Mission" },
  refit: { component: RefitPlan, title: "REFIT Mission" },
};

export default function DashboardPage() {
  const { selectedMission, setSelectedMission } = useWorkoutLog();
  const router = useRouter();

  const handleAbortMission = () => {
    setSelectedMission(null);
    router.push('/dashboard/missions');
  }

  const ActiveMissionComponent = selectedMission ? missionComponents[selectedMission]?.component : null;
  const missionTitle = selectedMission ? missionComponents[selectedMission]?.title : "";

  return (
    <div className="container mx-auto space-y-8">
      <WorkoutTracker />
      
      {selectedMission && ActiveMissionComponent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Active Mission: {missionTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveMissionComponent />
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleAbortMission}>
              Abort Mission
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
