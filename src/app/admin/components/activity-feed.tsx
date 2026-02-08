'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Bot,
  Zap,
  Code,
  Send,
  Clock,
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'approval' | 'rejection' | 'spawn' | 'complete' | 'error';
  message: string;
  timestamp: Date;
  agent?: string;
}

const mockActivity: ActivityItem[] = [
  { id: '1', type: 'approval', message: 'Tweet draft approved and shipped', timestamp: new Date(Date.now() - 5 * 60000) },
  { id: '2', type: 'spawn', message: 'Spawned coder-2 for feature implementation', timestamp: new Date(Date.now() - 12 * 60000), agent: 'leader-1' },
  { id: '3', type: 'complete', message: 'Code review task completed', timestamp: new Date(Date.now() - 25 * 60000), agent: 'coder-1' },
  { id: '4', type: 'rejection', message: 'Email draft rejected: needs more context', timestamp: new Date(Date.now() - 45 * 60000) },
  { id: '5', type: 'spawn', message: 'Spawned researcher-1 for API analysis', timestamp: new Date(Date.now() - 60 * 60000), agent: 'leader-1' },
];

const typeConfig = {
  approval: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  rejection: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  spawn: { icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  complete: { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  error: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

export function ActivityFeed() {
  const [filter, setFilter] = useState<string | null>(null);
  const filteredItems = filter 
    ? mockActivity.filter(item => item.type === filter)
    : mockActivity;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold">Activity Feed</h3>
          <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
            Live
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FilterButton 
            label="All" 
            active={!filter} 
            onClick={() => setFilter(null)} 
          />
          <FilterButton 
            label="Approvals" 
            active={filter === 'approval'} 
            onClick={() => setFilter('approval')} 
          />
          <FilterButton 
            label="Swarm" 
            active={filter === 'spawn'} 
            onClick={() => setFilter('spawn')} 
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-800" />

          {/* Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;
              return (
                <div key={item.id} className="relative flex gap-4 pl-8">
                  {/* Dot */}
                  <div className={cn(
                    'absolute left-0 w-6 h-6 rounded-full flex items-center justify-center',
                    config.bg
                  )}>
                    <Icon className={cn('w-3 h-3', config.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{item.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        {formatTime(item.timestamp)}
                      </span>
                      {item.agent && (
                        <>
                          <span className="text-slate-700">•</span>
                          <span className="text-xs text-slate-500">{item.agent}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-800/50 bg-slate-900/30">
        <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
          View full history <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2 py-1 text-xs rounded transition-colors',
        active 
          ? 'bg-slate-700 text-slate-200' 
          : 'text-slate-500 hover:text-slate-300'
      )}
    >
      {label}
    </button>
  );
}

function formatTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}
