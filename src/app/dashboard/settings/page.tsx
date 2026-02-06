
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWorkoutLog } from '@/hooks/use-workout-log';
import { useToast } from '@/hooks/use-toast';
import { Bell, Trash2, RotateCcw, HeartPulse } from 'lucide-react';
import { CHALLENGE_WEEKS, CARDIO_GOALS } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import type { CardioData } from '@/lib/types';


const cardioOptions = Object.keys(CARDIO_GOALS).map(key => ({
  id: key as keyof CardioData,
  label: CARDIO_GOALS[key as keyof CardioData].label
}));

export default function SettingsPage() {
  const {
    notificationSettings,
    setNotificationSettings,
    resetWeekData,
    resetAllData,
    displayedWeek,
    availableCardio,
    setAvailableCardio,
  } = useWorkoutLog();
  const { toast } = useToast();
  const [weekToReset, setWeekToReset] = useState<number>(displayedWeek);

  const handleResetWeek = () => {
    resetWeekData(weekToReset);
    toast({
      title: 'Week Reset',
      description: `All progress for Week ${weekToReset} has been cleared.`,
    });
  };

  const handleResetAll = () => {
    resetAllData();
    toast({
      title: 'Challenge Reset',
      description: 'All your workout data and mission progress have been cleared.',
    });
  };
  
  const handleCardioChange = (cardioId: keyof CardioData) => {
    setAvailableCardio(prev =>
      prev.includes(cardioId)
        ? prev.filter(id => id !== cardioId)
        : [...prev, cardioId]
    );
    toast({
        title: "Preferences Updated",
        description: "Your available cardio options have been saved.",
    });
  };

  const weekOptions = Array.from({ length: CHALLENGE_WEEKS }, (_, i) => i + 1);


  return (
    <div className="container mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your application preferences and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Control which pop-up notifications you receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="achievement-popups" className="flex-grow">
                  <h4 className="font-semibold">Goal Achievement Pop-ups</h4>
                  <p className="text-sm text-muted-foreground">
                    Show a notification when you meet a weekly category goal.
                  </p>
                </Label>
                <Switch
                  id="achievement-popups"
                  checked={notificationSettings.showAchievementPopups}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      showAchievementPopups: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="weekly-completion-popups" className="flex-grow">
                   <h4 className="font-semibold">Weekly Mission Complete Pop-ups</h4>
                   <p className="text-sm text-muted-foreground">
                    Show a notification when you complete all goals for a week.
                  </p>
                </Label>
                <Switch
                  id="weekly-completion-popups"
                  checked={notificationSettings.showWeeklyCompletionPopups}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      showWeeklyCompletionPopups: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Cardio Equipment Settings */}
          <Card>
             <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HeartPulse className="h-5 w-5" />
                Cardio Equipment
              </CardTitle>
              <CardDescription>
                Update your available cardio options to tailor workout suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cardioOptions.map((cardio) => (
                <div key={cardio.id} className="flex items-center space-x-3 p-3 border rounded-md">
                  <Checkbox
                    id={`setting-${cardio.id}`}
                    checked={availableCardio.includes(cardio.id)}
                    onCheckedChange={() => handleCardioChange(cardio.id)}
                  />
                  <Label htmlFor={`setting-${cardio.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {cardio.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trash2 className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Reset your workout progress. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4 gap-4">
                <div>
                  <h4 className="font-semibold">Reset Specific Week</h4>
                  <p className="text-sm text-muted-foreground">
                    Select a week to clear all of its logged workouts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={String(weekToReset)} onValueChange={(value) => setWeekToReset(Number(value))}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a week" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekOptions.map(week => (
                        <SelectItem key={week} value={String(week)}>Week {week}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={!weekToReset}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Week
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all your workout data for{' '}
                          <strong>Week {weekToReset}</strong>. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetWeek}>
                          Yes, Reset Week
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>


              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h4 className="font-semibold">Reset All Challenge Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Clear all logged workouts, achievements, and mission selections for the entire challenge.
                  </p>
                </div>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Reset All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>This is a permanent action!</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete <strong>ALL</strong> your workout data, achievements, and mission progress for the entire challenge.
                        <br />
                        <strong>This cannot be undone.</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetAll}>
                        Yes, I Understand, Reset Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
