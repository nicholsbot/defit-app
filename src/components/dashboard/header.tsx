
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useWorkoutLog } from "@/hooks/use-workout-log";
import { useMemo } from "react";
import { UserAvatarWithRank } from "@/components/user/user-avatar-with-rank";
import {
  TMAR_M_GOAL_MINS,
  STRENGTH_GOAL_LBS,
  HIIT_GOAL_MINS,
  CARDIO_GOALS,
} from "@/lib/constants";
import { isDemoMode, logDemoMessage } from "@/firebase/demo-mode";


export default function DashboardHeader() {
  const { user } = useUser();
  
  let auth = null;
  try {
    auth = useAuth();
  } catch (error) {
    // Auth not available in demo mode
    console.log('Auth not available - running in demo mode');
  }
  
  const router = useRouter();
  const { workoutLogs, userProfile } = useWorkoutLog();


  const handleLogout = async () => {
    try {
      if (isDemoMode() || !auth) {
        logDemoMessage('Demo logout - redirecting to home');
        router.push('/');
        return;
      }
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 ml-2">
            <Image
              src="/fonts/Images/defit logo 1.png"
              alt="DEFIT Challenge Logo"
              width={150}
              height={75}
              className="h-12 w-auto"
            />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <UserAvatarWithRank
                src={userProfile?.avatarUrl || user?.photoURL || undefined}
                fallback={userProfile?.displayName?.charAt(0) || 'U'}
                overallProgress={overallProgressPercentage}
                className="h-9 w-9"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userProfile?.displayName || "Soldier"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

    