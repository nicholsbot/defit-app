
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryProgressCardProps {
  title: string;
  icon: React.ReactNode;
  progress: number;
  currentValue: number;
  goalValue: number;
  unit: string;
  description?: string;
  onAdd: () => void;
}

export default function CategoryProgressCard({
  title,
  icon,
  progress,
  currentValue,
  goalValue,
  unit,
  description,
  onAdd,
}: CategoryProgressCardProps) {
  const isComplete = progress >= 100;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Progress value={Math.min(progress, 100)} className="h-3" />
        <div className="flex justify-between text-sm font-medium">
          <span className="text-muted-foreground">Progress</span>
          <span className={isComplete ? "text-accent" : "text-foreground"}>
            {Math.floor(progress)}%
          </span>
        </div>
        {description && <CardDescription className="text-xs pt-2">{description}</CardDescription>}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm">
        <Button variant="outline" size="sm" onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add
        </Button>
        <div className="flex items-center gap-2">
          {isComplete && <CheckCircle2 className="h-5 w-5 text-accent" />}
          <span className="text-muted-foreground text-right">
            {currentValue.toLocaleString()} / {goalValue.toLocaleString()} {unit}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
