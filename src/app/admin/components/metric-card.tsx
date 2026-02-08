'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral' | 'attention';
  subtitle: string;
  accent: 'orange' | 'green' | 'blue' | 'purple' | 'red';
}

const accentColors = {
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    border: 'border-orange-500/20',
    glow: 'shadow-orange-500/5',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/20',
    glow: 'shadow-green-500/5',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/5',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    border: 'border-purple-500/20',
    glow: 'shadow-purple-500/5',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/20',
    glow: 'shadow-red-500/5',
  },
};

const trendIcons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: null,
  attention: AlertCircle,
};

const trendColors = {
  up: 'text-green-500',
  down: 'text-red-500',
  neutral: 'text-slate-500',
  attention: 'text-orange-500 animate-pulse',
};

export function MetricCard({ title, value, icon: Icon, trend, subtitle, accent }: MetricCardProps) {
  const colors = accentColors[accent];
  const TrendIcon = trendIcons[trend];

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border bg-slate-900/50 p-4 transition-all duration-300',
      'hover:bg-slate-900/70 hover:shadow-xl',
      colors.border,
      colors.glow
    )}>
      {/* Background Glow Effect */}
      <div className={cn(
        'absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-20',
        colors.bg.replace('/10', '/30')
      )} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className={cn('p-2 rounded-lg', colors.bg)}>
            <Icon className={cn('w-4 h-4', colors.text)} />
          </div>
          {TrendIcon && (
            <TrendIcon className={cn('w-4 h-4', trendColors[trend])} />
          )}
        </div>

        {/* Value */}
        <div className="text-3xl font-bold tracking-tight mb-1">
          {value}
        </div>

        {/* Title & Subtitle */}
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
          {title}
        </div>
        <div className={cn('text-xs', trendColors[trend])}>
          {subtitle}
        </div>
      </div>

      {/* Animated Border Effect for attention items */}
      {trend === 'attention' && (
        <div className="absolute inset-0 rounded-xl border-2 border-orange-500/30 animate-pulse" />
      )}
    </div>
  );
}
