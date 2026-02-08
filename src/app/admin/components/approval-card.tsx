'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  Clock,
  Tag,
  User,
  Code,
  FileText,
  Loader2
} from 'lucide-react';
import { approveContent, rejectContent } from '../actions';

interface ApprovalCardProps {
  item: {
    id: number;
    content: string;
    status: string;
    created_at: string;
    task_type: string;
    payload: any;
  };
}

const taskTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  tweet: { icon: MessageSquare, color: 'bg-blue-500/10 text-blue-400', label: 'Tweet' },
  code: { icon: Code, color: 'bg-purple-500/10 text-purple-400', label: 'Code' },
  email: { icon: FileText, color: 'bg-green-500/10 text-green-400', label: 'Email' },
  default: { icon: Tag, color: 'bg-slate-500/10 text-slate-400', label: 'Task' },
};

export function ApprovalCard({ item }: ApprovalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const config = taskTypeConfig[item.task_type] || taskTypeConfig.default;
  const Icon = config.icon;
  
  const timeAgo = getTimeAgo(new Date(item.created_at));

  async function handleApprove() {
    setIsApproving(true);
    await approveContent(item.id);
    setIsApproving(false);
  }

  async function handleReject() {
    if (!feedback.trim()) {
      setShowFeedback(true);
      return;
    }
    setIsRejecting(true);
    await rejectContent(item.id, feedback);
    setIsRejecting(false);
  }

  return (
    <div className={cn(
      'group relative rounded-xl border bg-slate-900/50 overflow-hidden transition-all duration-300',
      'border-slate-800 hover:border-slate-700 hover:bg-slate-900/70',
      'hover:shadow-xl hover:shadow-slate-900/50'
    )}>
      {/* Priority Indicator Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className={cn('p-1.5 rounded-md', config.color)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Content Preview */}
      <div className="p-4">
        <p className={cn(
          'text-sm text-slate-200 leading-relaxed',
          !expanded && 'line-clamp-3'
        )}>
          {item.content}
        </p>
        
        {item.content.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> Show more
              </>
            )}
          </button>
        )}
      </div>

      {/* Payload Preview (Expandable) */}
      {item.payload && (
        <details className="group/details border-t border-slate-800/50">
          <summary className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500 cursor-pointer hover:text-slate-400 transition-colors">
            <ChevronDown className="w-3 h-3 group-open/details:rotate-180 transition-transform" />
            View context payload
          </summary>
          <div className="px-4 pb-3">
            <pre className="text-xs bg-slate-950 border border-slate-800 rounded-lg p-3 overflow-x-auto text-green-400/80 font-mono">
              {JSON.stringify(item.payload, null, 2)}
            </pre>
          </div>
        </details>
      )}

      {/* Feedback Input (conditional) */}
      {showFeedback && (
        <div className="px-4 py-2 border-t border-slate-800/50">
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Why are you rejecting this? (Required for SONA learning)"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            autoFocus
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 p-3 border-t border-slate-800/50 bg-slate-900/30">
        <button
          onClick={handleApprove}
          disabled={isApproving || isRejecting}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
            'bg-green-600 hover:bg-green-500 text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:shadow-lg hover:shadow-green-600/25'
          )}
        >
          {isApproving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Approve & Ship
        </button>
        <button
          onClick={handleReject}
          disabled={isApproving || isRejecting}
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
            'bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isRejecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
