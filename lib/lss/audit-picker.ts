import { Agent } from '@/types/domain';

export interface AuditPickResult {
    agent: Agent;
    reason: 'Random' | 'Low Performance' | 'New Hire';
}

export const pickAuditTargets = (agents: Agent[], count: number = 5): AuditPickResult[] => {
    // Simple randomization for MVP
    // In real LSS, this would weight by 'Low Performance' history
    const shuffled = [...agents].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return selected.map(agent => ({
        agent,
        reason: Math.random() > 0.7 ? 'Low Performance' : 'Random' // Mock reasoning
    }));
};
