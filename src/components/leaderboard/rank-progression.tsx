
"use client";
import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Rank {
  name: string;
  percentage: number;
  icon: LucideIcon;
  color: string;
}

interface RankProgressionProps {
  ranks: Rank[];
  userProgress: number;
}

const RankProgression: React.FC<RankProgressionProps> = ({ ranks, userProgress }) => {
  const currentRankIndex = ranks.slice().reverse().findIndex(rank => userProgress >= rank.percentage);
  const currentRank = currentRankIndex !== -1 ? ranks[ranks.length - 1 - currentRankIndex] : null;
  const nextRankIndex = ranks.findIndex(rank => userProgress < rank.percentage);
  const nextRank = nextRankIndex !== -1 ? ranks[nextRankIndex] : null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRankPercentage = ranks[ranks.length - 1]?.percentage || 1;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
        const viewport = scrollRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            const scrollAmount = 300;
            viewport.scrollBy({ 
                left: direction === 'left' ? -scrollAmount : scrollAmount, 
                behavior: 'smooth' 
            });
        }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Achievements</CardTitle>
        <CardDescription>
          Your total average weekly progress is <strong>{userProgress.toFixed(1)}%</strong>. 
          {currentRank && ` You have achieved the rank of ${currentRank.name}. `}
          {nextRank ? `You are ${(nextRank.percentage - userProgress).toFixed(1)}% away from the next rank: ${nextRank.name}.` : 'You have reached the highest rank!'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative flex items-center">
            <Button variant="outline" size="icon" className="h-8 w-8 absolute left-0 z-20" onClick={() => scroll('left')}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <ScrollArea className="w-full whitespace-nowrap px-12" ref={scrollRef}>
                <div className="relative w-full pt-4 pb-10" style={{minWidth: `${ranks.length * 8}rem`}}>
                    <div className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-border w-full" />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-primary" 
                      style={{ width: `${Math.min((userProgress / lastRankPercentage) * 100, 100)}%` }} 
                    />

                    <div className="relative flex justify-between w-full">
                        {ranks.map((rank) => {
                            const Icon = rank.icon;
                            const isAchieved = userProgress >= rank.percentage;
                            
                            return (
                                <TooltipProvider key={rank.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="flex flex-col items-center cursor-pointer"
                                                style={{
                                                    position: 'absolute',
                                                    left: `${(rank.percentage / lastRankPercentage) * 100}%`,
                                                    transform: 'translateX(-50%)',
                                                }}
                                            >
                                                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center z-10 border-2 bg-card",
                                                isAchieved ? "border-primary" : "border-border"
                                                )}>
                                                    <Icon className={cn("h-5 w-5", isAchieved ? rank.color : "text-muted-foreground")} />
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-semibold">{rank.name}</p>
                                            <p className="text-sm text-muted-foreground">Required: {rank.percentage}% Avg. Progress</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
             <Button variant="outline" size="icon" className="h-8 w-8 absolute right-0 z-20" onClick={() => scroll('right')}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankProgression;
