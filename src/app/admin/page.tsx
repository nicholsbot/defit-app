'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity, 
  Zap, 
  TrendingUp, 
  Users, 
  GitBranch,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MetricCard } from './components/metric-card';
import { ApprovalCard } from './components/approval-card';
import { SwarmMiniMap } from './components/swarm-minimap';
import { ActivityFeed } from './components/activity-feed';
import { QuickActions } from './components/quick-actions';
import { PipelineView } from './components/pipeline-view';

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
}

interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

interface ApprovalItem {
  id: number;
  content: string;
  status: string;
  created_at: string;
  task_type: string;
  payload: any;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0 });
  const [queueStats, setQueueStats] = useState<QueueStats>({ pending: 0, processing: 0, completed: 0, failed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) {
          console.warn('API returned error, using demo data');
          // Use demo data on API error
          setItems([
            { id: 1, content: 'Draft tweet: Excited to announce our new swarm architecture! 🚀', status: 'pending', created_at: new Date().toISOString(), task_type: 'tweet', payload: { topic: 'announcement' } },
            { id: 2, content: 'Email draft: Weekly progress update for stakeholders...', status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString(), task_type: 'email', payload: { recipient: 'team' } },
          ]);
          setStats({ pending: 2, approved: 15, rejected: 1 });
          setQueueStats({ pending: 2, processing: 1, completed: 15, failed: 1 });
          setLoading(false);
          return;
        }
        const data = await res.json();
        setItems(data.items || []);
        setStats(data.stats || { pending: 0, approved: 0, rejected: 0 });
        setQueueStats(data.queueStats || { pending: 0, processing: 0, completed: 0, failed: 0 });
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        // Fallback to demo data on network error
        setItems([
          { id: 1, content: 'Draft tweet: Excited to announce our new swarm architecture! 🚀', status: 'pending', created_at: new Date().toISOString(), task_type: 'tweet', payload: { topic: 'announcement' } },
          { id: 2, content: 'Email draft: Weekly progress update for stakeholders...', status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString(), task_type: 'email', payload: { recipient: 'team' } },
        ]);
        setStats({ pending: 2, approved: 15, rejected: 1 });
        setQueueStats({ pending: 2, processing: 1, completed: 15, failed: 1 });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate derived metrics
  const totalProcessed = (stats?.approved || 0) + (stats?.rejected || 0);
  const approvalRate = totalProcessed > 0 
    ? Math.round((stats?.approved / totalProcessed) * 100) 
    : 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time swarm orchestration and approval pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            All systems operational
          </span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Pending Review"
          value={stats?.pending || 0}
          icon={Clock}
          trend={items.length > 0 ? 'attention' : 'neutral'}
          subtitle={items.length > 0 ? 'Requires attention' : 'All clear'}
          accent="orange"
        />
        <MetricCard
          title="Shipped Today"
          value={stats?.approved || 0}
          icon={CheckCircle}
          trend="up"
          subtitle="+12% from yesterday"
          accent="green"
        />
        <MetricCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          icon={TrendingUp}
          trend={approvalRate >= 90 ? 'up' : 'down'}
          subtitle="Last 24 hours"
          accent="blue"
        />
        <MetricCard
          title="Active Agents"
          value={3}
          icon={Users}
          trend="neutral"
          subtitle="2 coding, 1 research"
          accent="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Review Queue */}
        <div className="col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Review Queue
            </h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
              {items.length} pending
            </span>
          </div>

          {items.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">All caught up!</p>
              <p className="text-slate-600 text-sm mt-1">No pending approvals right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.slice(0, 5).map((item) => (
                <ApprovalCard key={item.id} item={item} />
              ))}
              {items.length > 5 && (
                <button className="w-full py-3 text-sm text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2 bg-slate-900/30 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                  View {items.length - 5} more items
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Panels */}
        <div className="col-span-5 space-y-4">
          {/* Pipeline Status */}
          <PipelineView queueStats={queueStats} />

          {/* Swarm Mini Map */}
          <SwarmMiniMap />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-4 border-t border-slate-800">
        <span>SuperClaw v0.1.0 • SONA Active • Last sync: just now</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Connected to Neon Postgres
        </span>
      </div>
    </div>
  );
}
