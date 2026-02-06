
"use client";

import { useEffect, useState } from 'react';
import DashboardHeader from "@/components/dashboard/header";
import DashboardNav from "@/components/dashboard/nav";
import { useWorkoutLog } from "@/hooks/use-workout-log";
import AchievementDialog from '@/app/dashboard/achievement-dialog';
import WeeklyCompletionDialog from '@/app/dashboard/weekly-completion-dialog';

function AchievementHandler({ children }: { children: React.ReactNode }) {
  const { 
    achievementToShow, 
    setAchievementToShow, 
    showWeeklyCompletion, 
    setShowWeeklyCompletion,
    notificationSettings 
  } = useWorkoutLog();
  
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  const [isWeeklyOpen, setIsWeeklyOpen] = useState(false);

  useEffect(() => {
    if (achievementToShow && notificationSettings.showAchievementPopups) {
      setIsAchievementOpen(true);
      
      const timer = setTimeout(() => {
        setIsAchievementOpen(false);
        // Delay clearing to allow for exit animation
        setTimeout(() => setAchievementToShow(null), 300); 
      }, 3000); // Show dialog for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [achievementToShow, setAchievementToShow, notificationSettings.showAchievementPopups]);

  useEffect(() => {
    if (showWeeklyCompletion && notificationSettings.showWeeklyCompletionPopups) {
      setIsWeeklyOpen(true);
      const timer = setTimeout(() => {
        setIsWeeklyOpen(false);
        setTimeout(() => setShowWeeklyCompletion(false), 500);
      }, 5000); // Show for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showWeeklyCompletion, setShowWeeklyCompletion, notificationSettings.showWeeklyCompletionPopups]);

  const handleAchievementClose = () => {
    setIsAchievementOpen(false);
    setTimeout(() => setAchievementToShow(null), 300);
  }
  
  const handleWeeklyClose = () => {
    setIsWeeklyOpen(false);
    setTimeout(() => setShowWeeklyCompletion(false), 500);
  }

  return (
    <>
      <AchievementDialog 
        isOpen={isAchievementOpen} 
        onClose={handleAchievementClose} 
        categoryName={achievementToShow?.categoryName || ""} 
      />
      <WeeklyCompletionDialog 
        isOpen={isWeeklyOpen}
        onClose={handleWeeklyClose}
      />
      {children}
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AchievementHandler>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <DashboardNav />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </AchievementHandler>
  );
}
