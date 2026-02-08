import { sql } from '@vercel/postgres';

export async function getPendingApprovals() {
  try {
    const { rows } = await sql`
      SELECT 
        c.id, 
        c.content, 
        c.status, 
        c.created_at,
        q.task_type, 
        q.payload
      FROM content_approvals c
      JOIN agent_queue q ON c.queue_id = q.id
      WHERE c.status = 'pending'
      ORDER BY c.created_at DESC;
    `;
    return rows;
  } catch (error) {
    console.error('[DB] getPendingApprovals failed:', error);
    return [];
  }
}

export async function getStats() {
  try {
    const { rows } = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
      FROM content_approvals;
    `;
    return rows[0] || { pending: 0, approved: 0, rejected: 0 };
  } catch (error) {
    console.error('[DB] getStats failed:', error);
    return { pending: 0, approved: 0, rejected: 0 };
  }
}

export async function getQueueStats() {
  try {
    const { rows } = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'processing') as processing,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM agent_queue;
    `;
    return rows[0] || { pending: 0, processing: 0, completed: 0, failed: 0 };
  } catch (error) {
    console.error('[DB] getQueueStats failed:', error);
    return { pending: 0, processing: 0, completed: 0, failed: 0 };
  }
}
