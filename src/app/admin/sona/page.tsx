'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Lightbulb,
  History,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from 'lucide-react';

// Mock SONA metrics
const mockMetrics = {
  approvalRate: 94,
  avgResponseTime: 1.8,
  learningCycles: 47,
  optimizationsApplied: 12,
  feedbackProcessed: 156,
  modelConfidence: 0.87,
};

const mockInsights = [
  { id: 1, type: 'success', message: 'Tweet drafts now 23% more likely to be approved after SONA tuning', time: '2h ago' },
  { id: 2, type: 'learning', message: 'Detected preference for shorter, punchier content in evening hours', time: '4h ago' },
  { id: 3, type: 'warning', message: 'Email drafts showing higher rejection rate - analyzing patterns', time: '6h ago' },
  { id: 4, type: 'success', message: 'Code review accuracy improved by 15% after feedback integration', time: '1d ago' },
];

const mockFeedbackLoop = [
  { skill: 'tweet-compose', approvals: 45, rejections: 3, trend: 'up' },
  { skill: 'email-draft', approvals: 28, rejections: 8, trend: 'down' },
  { skill: 'code-review', approvals: 67, rejections: 5, trend: 'up' },
  { skill: 'research-summary', approvals: 32, rejections: 2, trend: 'stable' },
];

export default function SonaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-400" />
            SONA Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Self-Optimizing Neural Architecture — Learning from every decision
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4" />
          Force Optimization Cycle
        </button>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <MetricCard 
          icon={Target} 
          label="Approval Rate" 
          value={`${mockMetrics.approvalRate}%`}
          trend="up"
          change="+3.2%"
        />
        <MetricCard 
          icon={TrendingUp} 
          label="Avg Response" 
          value={`${mockMetrics.avgResponseTime}s`}
          trend="down"
          change="-0.4s"
        />
        <MetricCard 
          icon={History} 
          label="Learning Cycles" 
          value={mockMetrics.learningCycles}
          trend="neutral"
        />
        <MetricCard 
          icon={Sparkles} 
          label="Optimizations" 
          value={mockMetrics.optimizationsApplied}
          trend="up"
          change="+2 today"
        />
        <MetricCard 
          icon={Brain} 
          label="Feedback Processed" 
          value={mockMetrics.feedbackProcessed}
          trend="neutral"
        />
        <MetricCard 
          icon={BarChart3} 
          label="Confidence" 
          value={`${(mockMetrics.modelConfidence * 100).toFixed(0)}%`}
          trend="up"
          change="+1.5%"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Skill Performance */}
        <div className="col-span-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/50 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Skill Performance Matrix</h2>
              <span className="text-xs text-slate-500">Last 7 days</span>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {mockFeedbackLoop.map((skill) => (
                  <SkillRow key={skill.skill} skill={skill} />
                ))}
              </div>
            </div>
          </div>

          {/* Optimization History */}
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/50">
              <h2 className="text-sm font-semibold">Recent Optimizations</h2>
            </div>
            <div className="p-4 space-y-3">
              <OptimizationItem 
                title="Tweet tone calibration"
                description="Adjusted casual/professional balance based on 45 approval signals"
                impact="+12% approval rate"
                time="Today, 2:34 PM"
              />
              <OptimizationItem 
                title="Email length optimization"
                description="Reduced average draft length by 20% after rejection feedback"
                impact="+8% approval rate"
                time="Yesterday"
              />
              <OptimizationItem 
                title="Code comment style"
                description="Learned preference for concise inline comments over block comments"
                impact="+5% approval rate"
                time="2 days ago"
              />
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="col-span-4 space-y-6">
          {/* Confidence Gauge */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h2 className="text-sm font-semibold mb-4">Model Confidence</h2>
            <div className="relative h-32 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${mockMetrics.modelConfidence * 352} 352`}
                  className="text-purple-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{(mockMetrics.modelConfidence * 100).toFixed(0)}%</span>
                <span className="text-xs text-slate-500">Confidence</span>
              </div>
            </div>
          </div>

          {/* Latest Insights */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/50 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-semibold">SONA Insights</h2>
            </div>
            <div className="divide-y divide-slate-800/50">
              {mockInsights.map((insight) => (
                <InsightItem key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, change }: any) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <div className={cn(
          'text-xs mt-1',
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'
        )}>
          {change}
        </div>
      )}
    </div>
  );
}

function SkillRow({ skill }: { skill: any }) {
  const total = skill.approvals + skill.rejections;
  const rate = (skill.approvals / total * 100).toFixed(0);
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 text-sm font-medium truncate">{skill.skill}</div>
      <div className="flex-1">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>
      <div className="w-16 text-right text-sm font-medium">{rate}%</div>
      <div className="w-20 text-right text-xs text-slate-500">
        {skill.approvals}/{total}
      </div>
      <div className={cn(
        'w-16 text-right text-xs',
        skill.trend === 'up' ? 'text-green-400' : skill.trend === 'down' ? 'text-red-400' : 'text-slate-500'
      )}>
        {skill.trend === 'up' && '↑ improving'}
        {skill.trend === 'down' && '↓ declining'}
        {skill.trend === 'stable' && '— stable'}
      </div>
    </div>
  );
}

function OptimizationItem({ title, description, impact, time }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-800/50">
      <div className="p-1.5 rounded-md bg-purple-500/10">
        <Sparkles className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-green-400">{impact}</span>
          <span className="text-xs text-slate-600">{time}</span>
        </div>
      </div>
    </div>
  );
}

function InsightItem({ insight }: { insight: any }) {
  const icons = {
    success: CheckCircle,
    warning: AlertCircle,
    learning: Brain,
  };
  const colors = {
    success: 'text-green-400 bg-green-500/10',
    warning: 'text-yellow-400 bg-yellow-500/10',
    learning: 'text-blue-400 bg-blue-500/10',
  };
  
  const Icon = icons[insight.type as keyof typeof icons] || Brain;
  const color = colors[insight.type as keyof typeof colors] || colors.learning;

  return (
    <div className="flex items-start gap-3 p-3">
      <div className={cn('p-1.5 rounded-md', color.split(' ')[1])}>
        <Icon className={cn('w-3.5 h-3.5', color.split(' ')[0])} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-300">{insight.message}</p>
        <span className="text-[10px] text-slate-500 mt-1 block">{insight.time}</span>
      </div>
    </div>
  );
}
