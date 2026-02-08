'use client';

import { cn } from '@/lib/utils';
import { 
  Plus, 
  Play, 
  RotateCcw, 
  FileText,
  MessageSquare,
  Code,
  Search,
  Sparkles
} from 'lucide-react';

const actions = [
  { 
    icon: Plus, 
    label: 'New Task', 
    description: 'Queue a task for the swarm',
    color: 'orange' 
  },
  { 
    icon: Play, 
    label: 'Run Demo', 
    description: 'Test the pipeline',
    color: 'green' 
  },
  { 
    icon: RotateCcw, 
    label: 'Retry Failed', 
    description: 'Re-process failed tasks',
    color: 'blue' 
  },
  { 
    icon: Sparkles, 
    label: 'SONA Tune', 
    description: 'Optimize from feedback',
    color: 'purple' 
  },
];

const colorStyles = {
  orange: 'hover:border-orange-500/50 hover:bg-orange-500/5',
  green: 'hover:border-green-500/50 hover:bg-green-500/5',
  blue: 'hover:border-blue-500/50 hover:bg-blue-500/5',
  purple: 'hover:border-purple-500/50 hover:bg-purple-500/5',
};

const iconColors = {
  orange: 'text-orange-400',
  green: 'text-green-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
};

export function QuickActions() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800/50">
        <h3 className="text-sm font-semibold">Quick Actions</h3>
      </div>
      <div className="p-3 space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border border-slate-800/50 transition-all duration-200 text-left',
                colorStyles[action.color as keyof typeof colorStyles]
              )}
            >
              <div className={cn(
                'p-2 rounded-lg bg-slate-800',
                iconColors[action.color as keyof typeof iconColors]
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">{action.label}</div>
                <div className="text-xs text-slate-500">{action.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
