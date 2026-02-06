
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

interface OverallProgressCardProps {
  progress: number;
}

export default function OverallProgressCard({ progress }: OverallProgressCardProps) {
  const isComplete = progress >= 100;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Challenge Progress</CardTitle>
            <CardDescription>Your total progress over 10 weeks.</CardDescription>
          </div>
          <Award className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <Progress value={Math.min(progress, 100)} className="h-4" />
            <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Total Progress</span>
                <span className={isComplete ? "text-accent" : "text-foreground"}>
                    {progress.toFixed(1)}%
                </span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
