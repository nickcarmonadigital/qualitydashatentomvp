import { supabase } from '@/lib/supabase/client';
import { sanitizeObject } from './pii';

export interface AuditLogEntry {
  actor_id: string;   // User ID who performed the action
  action: string;     // e.g., 'update_kpi', 'delete_user'
  target_resource: string; // e.g., 'kpi:123', 'agent:456'
  details: Record<string, any>;
  tenant_id?: string;
}

export const logAudit = async (entry: AuditLogEntry) => {
  try {
    const safeDetails = sanitizeObject(entry.details);

    console.log(`[AUDIT] ${entry.action} on ${entry.target_resource} by ${entry.actor_id}`, safeDetails);

    // In a real app, we would write this to Supabase. 
    // Commented out until the table exists in the real DB.
    /*
    const { error } = await supabase.from('audit_logs').insert({
      actor_id: entry.actor_id,
      action: entry.action,
      target_resource: entry.target_resource,
      details: safeDetails,
      tenant_id: entry.tenant_id,
      timestamp: new Date().toISOString()
    });
 
    if (error) {
      console.error('Failed to write audit log to DB:', error);
    }
    */
  } catch (err) {
    console.error('Audit Logging System Failure:', err);
  }
};

export const getAuditLogs = () => {
  // Mock data for UI development
  return [
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      actor_id: 'user_123',
      actor_name: 'John Admin',
      action: 'update_agent',
      target_resource: 'agent:d98a0c20',
      details: { field: 'status', old: 'inactive', new: 'active' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      actor_id: 'user_123',
      actor_name: 'John Admin',
      action: 'create_kpi',
      target_resource: 'kpi:new_1',
      details: { name: 'AHT', target: 300 }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      actor_id: 'system',
      actor_name: 'System',
      action: 'batch_score_upload',
      target_resource: 'batch:999',
      details: { count: 450, success: true }
    }
  ]
}
