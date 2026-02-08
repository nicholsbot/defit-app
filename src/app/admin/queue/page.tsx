import { sql } from '@vercel/postgres';
import { 
  ListTodo, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Filter,
  Search,
  MoreHorizontal,
  Play,
  Trash2,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getQueueItems() {
  try {
    const { rows } = await sql`
      SELECT 
        q.id,
        q.task_type,
        q.payload,
        q.status,
        q.created_at,
        q.updated_at,
        c.status as approval_status
      FROM agent_queue q
      LEFT JOIN content_approvals c ON c.queue_id = q.id
      ORDER BY q.created_at DESC
      LIMIT 50;
    `;
    return rows;
  } catch (error) {
    console.error('[DB] getQueueItems failed:', error);
    return [];
  }
}

export default async function QueuePage() {
  const items = await getQueueItems();

  const statusCounts = {
    pending: items.filter(i => i.status === 'pending').length,
    processing: items.filter(i => i.status === 'processing').length,
    completed: items.filter(i => i.status === 'completed').length,
    failed: items.filter(i => i.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <ListTodo className="w-7 h-7 text-orange-400" />
            Task Queue
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View and manage all queued tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <StatusTab label="All" count={items.length} active />
        <StatusTab label="Pending" count={statusCounts.pending} color="orange" />
        <StatusTab label="Processing" count={statusCounts.processing} color="blue" />
        <StatusTab label="Completed" count={statusCounts.completed} color="green" />
        <StatusTab label="Failed" count={statusCounts.failed} color="red" />
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-slate-700"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm hover:border-slate-700 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                {/* Priority column removed - add to DB schema if needed */}
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Created</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Updated</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No tasks in queue
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <QueueRow key={item.id} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
          <span className="text-xs text-slate-500">
            Showing {items.length} of {items.length} tasks
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 text-xs bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusTab({ label, count, color, active }: { label: string; count: number; color?: string; active?: boolean }) {
  const colorClasses = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <button className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
      active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
    )}>
      {label}
      <span className={cn(
        'px-1.5 py-0.5 rounded text-[10px] font-medium',
        color ? `${colorClasses[color as keyof typeof colorClasses]} text-white` : 'bg-slate-700 text-slate-300'
      )}>
        {count}
      </span>
    </button>
  );
}

function QueueRow({ item }: { item: any }) {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    processing: { icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10', animate: true },
    completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  };

  const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-slate-400">#{item.id}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium">{item.task_type}</span>
      </td>
      <td className="px-4 py-3">
        <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', config.bg)}>
          <Icon className={cn('w-3 h-3', config.color, config.animate && 'animate-spin')} />
          <span className={config.color}>{item.status}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-500">
          {new Date(item.created_at).toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-500">
          {new Date(item.updated_at).toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-slate-700 transition-colors">
            <Play className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-700 transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-700 transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </td>
    </tr>
  );
}
