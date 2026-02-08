'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function approveContent(id: number) {
  try {
    // 1. Mark as approved
    await sql`UPDATE content_approvals SET status = 'approved', updated_at = NOW() WHERE id = ${id}`;

    // 2. Update the queue item status
    await sql`
      UPDATE agent_queue 
      SET status = 'completed', updated_at = NOW() 
      WHERE id = (SELECT queue_id FROM content_approvals WHERE id = ${id})
    `;

    console.log(`[ACTION] Content ${id} approved. Dispatching...`);

    // 3. Refresh the dashboard
    revalidatePath('/admin');
    revalidatePath('/admin/queue');
    return { success: true };
  } catch (error) {
    console.error('[ACTION] Approve failed:', error);
    return { success: false, error: 'Failed to approve' };
  }
}

export async function rejectContent(id: number, feedback: string) {
  try {
    // 1. Mark as rejected and save feedback for SONA
    await sql`
      UPDATE content_approvals 
      SET status = 'rejected', admin_feedback = ${feedback}, updated_at = NOW()
      WHERE id = ${id}
    `;

    // 2. Update queue status
    await sql`
      UPDATE agent_queue 
      SET status = 'failed', updated_at = NOW() 
      WHERE id = (SELECT queue_id FROM content_approvals WHERE id = ${id})
    `;

    console.log(`[ACTION] Content ${id} rejected. Feedback: ${feedback}`);

    // 3. Refresh the dashboard
    revalidatePath('/admin');
    revalidatePath('/admin/queue');
    return { success: true };
  } catch (error) {
    console.error('[ACTION] Reject failed:', error);
    return { success: false, error: 'Failed to reject' };
  }
}

export async function retryTask(queueId: number) {
  try {
    await sql`
      UPDATE agent_queue 
      SET status = 'pending', updated_at = NOW() 
      WHERE id = ${queueId}
    `;

    console.log(`[ACTION] Task ${queueId} queued for retry`);
    revalidatePath('/admin');
    revalidatePath('/admin/queue');
    return { success: true };
  } catch (error) {
    console.error('[ACTION] Retry failed:', error);
    return { success: false, error: 'Failed to retry' };
  }
}

export async function deleteTask(queueId: number) {
  try {
    // Delete related approvals first
    await sql`DELETE FROM content_approvals WHERE queue_id = ${queueId}`;
    // Then delete the queue item
    await sql`DELETE FROM agent_queue WHERE id = ${queueId}`;

    console.log(`[ACTION] Task ${queueId} deleted`);
    revalidatePath('/admin');
    revalidatePath('/admin/queue');
    return { success: true };
  } catch (error) {
    console.error('[ACTION] Delete failed:', error);
    return { success: false, error: 'Failed to delete' };
  }
}
