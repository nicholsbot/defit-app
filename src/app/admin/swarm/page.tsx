'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  GitBranch,
  Bot,
  Code,
  Search,
  FileText,
  Brain,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Settings,
  Activity,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Agent {
  id: string;
  role: 'leader' | 'coder' | 'researcher' | 'reviewer';
  status: 'idle' | 'working' | 'paused';
  currentTask: string | null;
  tasksCompleted: number;
  uptime: number;
}

const mockAgents: Agent[] = [
  { id: 'leader-1', role: 'leader', status: 'working', currentTask: 'Coordinating swarm execution', tasksCompleted: 12, uptime: 3600 },
  { id: 'coder-1', role: 'coder', status: 'working', currentTask: 'Implementing auth middleware', tasksCompleted: 8, uptime: 3500 },
  { id: 'coder-2', role: 'coder', status: 'idle', currentTask: null, tasksCompleted: 5, uptime: 2400 },
  { id: 'researcher-1', role: 'researcher', status: 'working', currentTask: 'Analyzing API documentation', tasksCompleted: 4, uptime: 1800 },
];

const roleConfig = {
  leader: { icon: GitBranch, color: 'purple', label: 'Orchestrator' },
  coder: { icon: Code, color: 'green', label: 'Coder' },
  researcher: { icon: Search, color: 'blue', label: 'Researcher' },
  reviewer: { icon: FileText, color: 'orange', label: 'Reviewer' },
};

const colorMap = {
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
};

export default function SwarmPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const activeCount = agents.filter(a => a.status === 'working').length;
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Swarm Orchestration</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time agent management and task coordination
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Spawn Agent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Bot} label="Active Agents" value={activeCount} total={agents.length} />
        <StatCard icon={CheckCircle} label="Tasks Completed" value={totalTasks} />
        <StatCard icon={Clock} label="Avg Response" value="1.2s" />
        <StatCard icon={Activity} label="Throughput" value="8.5/min" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Agent Visualization */}
        <div className="col-span-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-400" />
              Swarm Topology
            </h2>
            
            {/* Network Graph Visualization */}
            <div className="relative h-80 bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden">
              {/* Center Node (Leader) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <SwarmNode agent={agents.find(a => a.role === 'leader')!} isCenter />
              </div>
              
              {/* Orbiting Nodes */}
              {agents.filter(a => a.role !== 'leader').map((agent, i) => {
                const angle = (i * 120) - 90;
                const radius = 120;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                
                return (
                  <div
                    key={agent.id}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                  >
                    <SwarmNode agent={agent} />
                    {/* Connection Line */}
                    <svg className="absolute top-1/2 left-1/2 pointer-events-none" style={{ width: radius * 2, height: radius * 2, transform: 'translate(-50%, -50%)' }}>
                      <line
                        x1="50%"
                        y1="50%"
                        x2={50 - (x / radius) * 50 + '%'}
                        y2={50 - (y / radius) * 50 + '%'}
                        stroke={agent.status === 'working' ? '#22c55e' : '#475569'}
                        strokeWidth="1"
                        strokeDasharray={agent.status === 'idle' ? '4,4' : 'none'}
                        className={agent.status === 'working' ? 'animate-pulse' : ''}
                      />
                    </svg>
                  </div>
                );
              })}
              
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at center, #475569 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
            </div>
          </div>
        </div>

        {/* Agent List */}
        <div className="col-span-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/50">
              <h2 className="text-sm font-semibold">Agent Registry</h2>
            </div>
            <div className="divide-y divide-slate-800/50">
              {agents.map((agent) => (
                <AgentRow key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, total }: { icon: any; label: string; value: string | number; total?: number }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold">
        {value}
        {total && <span className="text-sm text-slate-500 font-normal">/{total}</span>}
      </div>
    </div>
  );
}

function SwarmNode({ agent, isCenter }: { agent: Agent; isCenter?: boolean }) {
  const config = roleConfig[agent.role];
  const colors = colorMap[config.color as keyof typeof colorMap];
  const Icon = config.icon;

  return (
    <div className={cn(
      'relative flex flex-col items-center gap-2',
      isCenter && 'scale-125'
    )}>
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
        colors.bg,
        colors.border,
        agent.status === 'working' && 'animate-pulse shadow-lg',
        agent.status === 'working' && `shadow-${config.color}-500/30`
      )}>
        <Icon className={cn('w-5 h-5', colors.text)} />
      </div>
      <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
        {agent.id}
      </div>
      {agent.status === 'working' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}

function AgentRow({ agent }: { agent: Agent }) {
  const config = roleConfig[agent.role];
  const colors = colorMap[config.color as keyof typeof colorMap];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-800/30 transition-colors">
      <div className={cn('p-2 rounded-lg', colors.bg)}>
        <Icon className={cn('w-4 h-4', colors.text)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{agent.id}</span>
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            agent.status === 'working' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
          )} />
        </div>
        <div className="text-xs text-slate-500 truncate">
          {agent.currentTask || 'Idle'}
        </div>
      </div>
      <div className="text-xs text-slate-500">
        {agent.tasksCompleted} tasks
      </div>
    </div>
  );
}
