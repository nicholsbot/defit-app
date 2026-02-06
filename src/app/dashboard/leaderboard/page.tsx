
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Heart, Star, Sparkles, Atom, Medal, Swords, Axe, Award, Sun, Rocket, Moon, Gem, Diamond, Trophy, Bomb, Crown } from "lucide-react";
import RankProgression from "@/components/leaderboard/rank-progression";
import { useWorkoutLog } from "@/hooks/use-workout-log";
import { useMemo } from "react";
import {
  TMAR_M_GOAL_MINS,
  STRENGTH_GOAL_LBS,
  HIIT_GOAL_MINS,
  CARDIO_GOALS,
  CHALLENGE_WEEKS,
} from "@/lib/constants";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { UserProfile, WorkoutLog } from "@/lib/types";
import { UserAvatarWithRank } from "@/components/user/user-avatar-with-rank";
import { Badge } from "@/components/ui/badge";
import { isDemoMode, logDemoMessage } from "@/firebase/demo-mode";

export const ranks = [
    { name: "Recruit", percentage: 0, icon: Shield, color: "text-slate-500" },
    { name: "Spark", percentage: 50, icon: Sparkles, color: "text-slate-400" },
    { name: "Private", percentage: 100, icon: Atom, color: "text-green-500" },
    { name: "Tactician", percentage: 200, icon: Star, color: "text-green-400" },
    { name: "Sapper", percentage: 300, icon: Medal, color: "text-cyan-500" },
    { name: "Hardcore", percentage: 400, icon: Swords, color: "text-cyan-400" },
    { name: "Sergeant", percentage: 500, icon: Axe, color: "text-blue-500" },
    { name: "Ranger", percentage: 600, icon: Award, color: "text-blue-400" },
    { name: "Gladiator", percentage: 700, icon: Sun, color: "text-purple-500" },
    { name: "Barbarian", percentage: 800, icon: Rocket, color: "text-purple-400" },
    { name: "Beast", percentage: 900, icon: Moon, color: "text-pink-500" },
    { name: "Major", percentage: 1000, icon: Gem, color: "text-pink-400" },
    { name: "Vanguard", percentage: 1250, icon: Diamond, color: "text-orange-500" },
    { name: "Colonel", percentage: 1500, icon: Trophy, color: "text-orange-400" },
    { name: "Warlord", percentage: 2000, icon: Bomb, color: "text-yellow-500" },
    { name: "General", percentage: 2500, icon: Crown, color: "text-yellow-400" },
    { name: "Titan", percentage: 3500, icon: Shield, color: "text-amber-500" },
    { name: "Legend", percentage: 4500, icon: Sparkles, color: "text-red-500" },
    { name: "Mythic", percentage: 5000, icon: Star, color: "text-rose-500" },
];


function calculateOverallProgress(logs: WorkoutLog[]) {
    if (!logs || logs.length === 0) return 0;
    
    const weeklyTotals: { [week: number]: { tmar: number; strength: number; hiit: number; cardio: number } } = {};

    logs.forEach(log => {
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
}

function LeaderboardList({ users, workoutLogs }: { users: UserProfile[] | null, workoutLogs: WorkoutLog[] | null }) {
    const leaderboardData = useMemo(() => {
        if (!users || !workoutLogs) return [];

        const logsByUser = workoutLogs.reduce((acc, log) => {
            if (!acc[log.userProfileId]) {
                acc[log.userProfileId] = [];
            }
            acc[log.userProfileId].push(log);
            return acc;
        }, {} as Record<string, WorkoutLog[]>);

        return users.map(user => ({
            ...user,
            progress: calculateOverallProgress(logsByUser[user.id] || [])
        })).sort((a, b) => b.progress - a.progress);

    }, [users, workoutLogs]);

    if (!leaderboardData || leaderboardData.length === 0) {
        return (
            <CardContent className="text-center text-muted-foreground p-8">
                <Users className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-xl font-semibold">No Participants Yet</h3>
                <p>As soon as users start logging their workouts, they will appear here.</p>
            </CardContent>
        )
    }

    return (
      <CardContent className="space-y-4 p-4">
        {leaderboardData.map((user, index) => (
          <div key={user.id} className="flex items-center gap-4 p-2 rounded-lg border bg-card-foreground/5">
            <Badge variant="secondary" className="text-lg font-bold w-12 h-12 flex items-center justify-center rounded-full">
              {index + 1}
            </Badge>
            <UserAvatarWithRank
              src={user.avatarUrl}
              fallback={user.displayName?.charAt(0) || 'U'}
              overallProgress={user.progress}
              className="h-12 w-12"
            />
            <div className="flex-grow">
              <p className="font-semibold text-lg">{user.displayName}</p>
              {user.isSoldier && user.rank && user.unit && (
                <p className="text-sm text-muted-foreground">{user.rank}, {user.unit}</p>
              )}
            </div>
            <div className="text-right">
                <p className="font-bold text-xl text-primary">{user.progress.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg. Progress</p>
            </div>
          </div>
        ))}
      </CardContent>
    );
}

function TeamLeaderboardList({ users, workoutLogs, noTeamsMessage }: { users: UserProfile[] | null, workoutLogs: WorkoutLog[] | null, noTeamsMessage: { title: string, description: string } }) {
    const teamLeaderboardData = useMemo(() => {
        if (!users || !workoutLogs) return [];

        const logsByUser = workoutLogs.reduce((acc, log) => {
            if (!acc[log.userProfileId]) {
                acc[log.userProfileId] = [];
            }
            acc[log.userProfileId].push(log);
            return acc;
        }, {} as Record<string, WorkoutLog[]>);

        const usersWithProgress = users.map(user => ({
            ...user,
            progress: calculateOverallProgress(logsByUser[user.id] || [])
        }));

        const teams = usersWithProgress.reduce((acc, user) => {
            if (user.teamName) {
                if (!acc[user.teamName]) {
                    acc[user.teamName] = { name: user.teamName, members: [], totalProgress: 0, memberCount: 0 };
                }
                acc[user.teamName].members.push(user);
                acc[user.teamName].totalProgress += user.progress;
                acc[user.teamName].memberCount++;
            }
            return acc;
        }, {} as Record<string, { name: string; members: (UserProfile & {progress: number})[]; totalProgress: number; memberCount: number }>);

        return Object.values(teams).map(team => ({
            ...team,
            averageProgress: team.memberCount > 0 ? team.totalProgress / team.memberCount : 0
        })).sort((a, b) => b.averageProgress - a.averageProgress);

    }, [users, workoutLogs]);

    if (!teamLeaderboardData || teamLeaderboardData.length === 0) {
        return (
            <CardContent className="text-center text-muted-foreground p-8">
                <Users className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-xl font-semibold">{noTeamsMessage.title}</h3>
                <p>{noTeamsMessage.description}</p>
            </CardContent>
        );
    }

    return (
      <CardContent className="space-y-4 p-4">
        {teamLeaderboardData.map((team, index) => (
          <div key={team.name} className="flex items-center gap-4 p-2 rounded-lg border bg-card-foreground/5">
            <Badge variant="secondary" className="text-lg font-bold w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0">
              {index + 1}
            </Badge>
            <div className="flex-grow">
              <p className="font-semibold text-lg">{team.name}</p>
              <div className="flex -space-x-2 overflow-hidden mt-2">
                {team.members.slice(0, 5).map(member => (
                  <UserAvatarWithRank
                    key={member.id}
                    src={member.avatarUrl}
                    fallback={member.displayName?.charAt(0) || 'U'}
                    overallProgress={member.progress}
                    className="h-8 w-8 border-2 border-background"
                  />
                ))}
                {team.members.length > 5 && (
                   <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-semibold">
                        +{team.members.length - 5}
                    </div>
                )}
              </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-xl text-primary">{team.averageProgress.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg. Progress</p>
            </div>
          </div>
        ))}
      </CardContent>
    );
}

export default function LeaderboardPage() {
    const { userProfile } = useWorkoutLog();
    
    let firestore = null;
    try {
      firestore = useFirestore();
    } catch (error) {
      // Firestore not available in demo mode
      console.log('Firestore not available - running in demo mode');
    }

    const usersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "users")) : null, [firestore]);
    const { data: users } = firestore ? useCollection<UserProfile>(usersQuery) : { data: null };
    
    const workoutLogsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "workoutLogs")) : null, [firestore]);
    const { data: workoutLogs } = firestore ? useCollection<WorkoutLog>(workoutLogsQuery) : { data: null };

    const individualUsers = useMemo(() => users?.filter(u => u.isSoldier) || [], [users]);
    const teamUsers = useMemo(() => users?.filter(u => u.teamName && u.isSoldier) || [], [users]);
    const communityTeamUsers = useMemo(() => users?.filter(u => u.teamName && !u.isSoldier) || [], [users]);
    const familyUsers = useMemo(() => users?.filter(u => !u.isSoldier) || [], [users]);

    const overallProgressPercentage = useMemo(() => {
        const currentUserLogs = workoutLogs?.filter(log => log.userProfileId === userProfile?.id) || [];
        return calculateOverallProgress(currentUserLogs);
    }, [workoutLogs, userProfile]);

  return (
    <div className="container mx-auto space-y-6">
      <RankProgression ranks={ranks} userProgress={overallProgressPercentage} />
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="individual">Individuals</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="community">Community Teams</TabsTrigger>
          <TabsTrigger value="family">Civilians/Family</TabsTrigger>
        </TabsList>
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Leaderboard</CardTitle>
            </CardHeader>
            <LeaderboardList users={individualUsers} workoutLogs={workoutLogs} />
          </Card>
        </TabsContent>
        <TabsContent value="teams">
           <Card>
            <CardHeader>
              <CardTitle>Team Leaderboard</CardTitle>
            </CardHeader>
            <TeamLeaderboardList 
                users={teamUsers} 
                workoutLogs={workoutLogs}
                noTeamsMessage={{ title: "No Official Teams Yet", description: "Soldier-based teams will appear here once members start logging workouts."}} 
            />
          </Card>
        </TabsContent>
         <TabsContent value="community">
           <Card>
            <CardHeader>
              <CardTitle>Community Team Leaderboard</CardTitle>
            </CardHeader>
            <TeamLeaderboardList 
                users={communityTeamUsers} 
                workoutLogs={workoutLogs}
                noTeamsMessage={{ title: "No Community Teams Yet", description: "Teams created by civilians and family will appear here."}} 
            />
          </Card>
        </TabsContent>
        <TabsContent value="family">
           <Card>
            <CardHeader>
              <CardTitle>Civilian & Family Leaderboard</CardTitle>
            </CardHeader>
            <LeaderboardList users={familyUsers} workoutLogs={workoutLogs} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    