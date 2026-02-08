'use client';

import { cn } from '@/lib/utils';
import { 
  Inbox, 
  Loader2, 
  CheckCircle, 
  XCircle,
  ArrowRight
} from 'lucide-react';

interface PipelineViewProps {
  queueStats: {
    pending?: number;
    processing?: number;
    completed?: number;
    failed?: number;
  } | null;
}

export function PipelineView({ queueStats }: PipelineViewProps) {
  const stages = [
    { 
      id: 'queued',
      label: 'Queued', 
      count: queueStats?.pending || 0, 
      icon: Inbox,
      color: 'orange',
      description: 'Awaiting processing'
    },
    { 
      id: 'processing',
      label: 'Processing', 
      count: queueStats?.processing || 0, 
      icon: Loader2,
      color: 'blue',
      description: 'Active swarm tasks',
      animate: true
    },
    { 
      id: 'completed',
      label: 'Shipped', 
      count: queueStats?.completed || 0, 
      icon: CheckCircle,
      color: 'green',
      description: 'Successfully delivered'
    },
    { 
      id: 'failed',
      label: 'Failed', 
      count: queueStats?.failed || 0, 
      icon: XCircle,
      color: 'red',
      description: 'Need attention'
    },
  ];

  const total = stages.reduce((sum, s) => sum + s.count, 0) || 1;

  const colorMap = {
    orange: { bg: 'bg-orange-500', text: 'text-orange-400', light: 'bg-orange-500/10' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-400', light: 'bg-blue-500/10' },
    green: { bg: 'bg-green-500', text: 'text-green-400', light: 'bg-green-500/10' },
    red: { bg: 'bg-red-500', text: 'text-red-400', light: 'bg-red-500/10' },
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
        <h3 className="text-sm font-semibold">Pipeline Status</h3>
        <span className="text-xs text-slate-500">{total} total tasks</span>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-4">
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
          {stages.map((stage, i) => {
            const width = (stage.count / total) * 100;
            if (width === 0) return null;
            return (
              <div
                key={stage.id}
                className={cn(
                  'h-full transition-all duration-500',
                  colorMap[stage.color as keyof typeof colorMap].bg,
                  i > 0 && 'border-l border-slate-900'
                )}
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Stage Cards */}
      <div className="p-4 grid grid-cols-2 gap-2">
        {stages.map((stage) => {
          const colors = colorMap[stage.color as keyof typeof colorMap];
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className={cn(
                'p-3 rounded-lg border border-slate-800/50 transition-colors',
                stage.count > 0 && 'hover:border-slate-700'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn('p-1 rounded', colors.light)}>
                  <Icon className={cn(
                    'w-3 h-3',
                    colors.text,
                    stage.animate && stage.count > 0 && 'animate-spin'
                  )} />
                </div>
                <span className="text-lg font-bold">{stage.count}</span>
              </div>
              <div className="text-xs text-slate-500">{stage.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
