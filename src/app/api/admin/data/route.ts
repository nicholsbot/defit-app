import { NextResponse } from 'next/server';
import { getPendingApprovals, getStats, getQueueStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [items, stats, queueStats] = await Promise.all([
      getPendingApprovals(),
      getStats(),
      getQueueStats(),
    ]);

    return NextResponse.json({
      items,
      stats,
      queueStats,
    });
  } catch (error) {
    console.error('[API] Failed to fetch admin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', items: [], stats: {}, queueStats: {} },
      { status: 500 }
    );
  }
}
