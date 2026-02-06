
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ranks } from "@/app/dashboard/leaderboard/page";

interface UserAvatarWithRankProps {
  src?: string;
  fallback: string;
  overallProgress: number;
  className?: string;
}

export function UserAvatarWithRank({
  src,
  fallback,
  overallProgress,
  className,
}: UserAvatarWithRankProps) {
  const currentRankIndex = ranks
    .slice()
    .reverse()
    .findIndex((rank) => overallProgress >= rank.percentage);
  
  const currentRank =
    currentRankIndex !== -1 ? ranks[ranks.length - 1 - currentRankIndex] : null;

  const RankIcon = currentRank?.icon;

  return (
    <div className="relative">
      <Avatar className={cn(className)}>
        <AvatarImage src={src} alt="User avatar" />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      {currentRank && RankIcon && (
        <div className="absolute -bottom-1 -left-1 bg-background rounded-full p-0.5">
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full",
              currentRank.color.startsWith('text-') ? "" : "bg-card"
            )}
          >
            <RankIcon className={cn("h-4 w-4", currentRank.color)} />
          </div>
        </div>
      )}
    </div>
  );
}
