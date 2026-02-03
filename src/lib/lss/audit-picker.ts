import { Agent } from '@/types/domain';

export interface TicketToAudit {
    ticketId: string;
    timestamp: string;
    category: string;
}

export interface AuditAssignment {
    agent: Agent;
    reason: 'Bottom Quartile' | 'Random Sample';
    ticketsToAudit: TicketToAudit[];
}

// Helper to generate random ticket ID
function generateTicketId(): string {
    const year = 2024;
    const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TKT-${year}-${num}`;
}

// Helper to generate random timestamp (within last 7 days)
function generateTimestamp(): string {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);

    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(hoursAgo);
    timestamp.setMinutes(minutesAgo);

    return timestamp.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Helper to get random category
function getRandomCategory(): string {
    const categories = [
        'Account Issue',
        'Billing Inquiry',
        'Technical Support',
        'Refund Request',
        'Product Question',
        'Password Reset',
        'Shipping Delay',
        'General Inquiry'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
}

// Generate random tickets for an agent
function generateTicketsForAgent(count: number = 2): TicketToAudit[] {
    const tickets: TicketToAudit[] = [];
    for (let i = 0; i < count; i++) {
        tickets.push({
            ticketId: generateTicketId(),
            timestamp: generateTimestamp(),
            category: getRandomCategory()
        });
    }
    return tickets;
}

export const pickAuditTargets = (agents: Agent[], count: number = 3): AuditAssignment[] => {
    // Sort agents by a primary metric to identify bottom quartile
    // For demo, we'll use a random metric or assume metrics['QA Score'] exists
    const sortedAgents = [...agents].sort((a, b) => {
        const scoreA = a.metrics['QA Score'] || Math.random() * 100;
        const scoreB = b.metrics['QA Score'] || Math.random() * 100;
        return scoreA - scoreB; // Ascending order (lowest first)
    });

    // Take bottom performers
    const bottomQuartileCount = Math.ceil(agents.length * 0.25);
    const bottomQuartile = sortedAgents.slice(0, bottomQuartileCount);

    // Select 'count' agents (mix of bottom quartile and random)
    const selected: Agent[] = [];

    // First, add bottom quartile agents
    const numBottomQuartile = Math.min(Math.ceil(count * 0.7), bottomQuartile.length);
    selected.push(...bottomQuartile.slice(0, numBottomQuartile));

    // Fill remaining with random agents
    const remaining = count - selected.length;
    if (remaining > 0) {
        const randomAgents = [...agents]
            .filter(a => !selected.includes(a))
            .sort(() => 0.5 - Math.random())
            .slice(0, remaining);
        selected.push(...randomAgents);
    }

    return selected.map(agent => {
        const isBottomQuartile = bottomQuartile.includes(agent);
        return {
            agent,
            reason: isBottomQuartile ? 'Bottom Quartile' : 'Random Sample',
            ticketsToAudit: generateTicketsForAgent(Math.floor(Math.random() * 2) + 2) // 2-3 tickets
        };
    });
};

