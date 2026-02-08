'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Bot, 
  GitBranch, 
  ArrowRight,
  Zap,
  Code,
  Search,
  FileText,
  Activity
} from 'lucide-react';

interface Agent {
  id: string;
  role: string;
  status: 'idle' | 'working' | 'completed';
  task?: string;
  icon: React.ElementType;
}

const mockAgents: Agent[] = [
  { id: 'leader-1', role: 'Orchestrator', status: 'working', task: 'Coordinating swarm', icon: GitBranch },
  { id: 'coder-1', role: 'Coder', status: 'working', task: 'Implementing feature', icon: Code },
  { id: 'coder-2', role: 'Coder', status: 'idle', icon: Code },
  { id: 'researcher-1', role: 'Researcher', status: 'completed', task: 'API analysis done', icon: Search },
];

export function SwarmMiniMap() {
  const [agents, setAgents] = useState(mockAgents);
  const [pulse, setPulse] = useState(false);

  // Simulate activity
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = agents.filter(a => a.status === 'working').length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold">Swarm Status</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'w-2 h-2 rounded-full',
            activeCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
          )} />
          <span className="text-xs text-slate-500">{activeCount} active</span>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {agents.map((agent) => (
          <AgentNode key={agent.id} agent={agent} pulse={pulse} />
        ))}
      </div>

      {/* Connections Visualization */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Activity className="w-3 h-3" />
          <span>3 tasks in pipeline</span>
        </div>
      </div>
    </div>
  );
}

function AgentNode({ agent, pulse }: { agent: Agent; pulse: boolean }) {
  const Icon = agent.icon;
  
  const statusColors = {
    idle: 'border-slate-700 bg-slate-800/50',
    working: 'border-green-500/50 bg-green-500/5',
    completed: 'border-blue-500/50 bg-blue-500/5',
  };

  const statusDot = {
    idle: 'bg-slate-500',
    working: 'bg-green-500 animate-pulse',
    completed: 'bg-blue-500',
  };

  return (
    <div className={cn(
      'relative p-3 rounded-lg border transition-all duration-500',
      statusColors[agent.status],
      agent.status === 'working' && pulse && 'shadow-lg shadow-green-500/10'
    )}>
      <div className="flex items-start gap-2">
        <div className={cn(
          'p-1.5 rounded-md',
          agent.status === 'working' ? 'bg-green-500/20' : 'bg-slate-700'
        )}>
          <Icon className={cn(
            'w-3.5 h-3.5',
            agent.status === 'working' ? 'text-green-400' : 'text-slate-400'
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-200 truncate">
              {agent.role}
            </span>
            <span className={cn('w-1.5 h-1.5 rounded-full', statusDot[agent.status])} />
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5">
            {agent.task || 'Awaiting task'}
          </div>
        </div>
      </div>

      {/* Connection Line */}
      {agent.status === 'working' && (
        <div className="absolute -right-3 top-1/2 w-3 h-px bg-gradient-to-r from-green-500/50 to-transparent" />
      )}
    </div>
  );
}
