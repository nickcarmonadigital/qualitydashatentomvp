import { Agent, KPI, Score, ActionPlan, CoachingSession } from '@/types/domain';
import { generateAgents, generateKPIs, generateScores, generateActionPlans } from '@/script/seed_data';
import { generateCoachingSessions } from '@/script/seed_coaching';

// Singleton-ish pattern to keeping data consistent for the User Session (Mock)
let cachedAgents: Agent[] = [];
let cachedKPIs: KPI[] = [];
let cachedScores: Score[] = [];
let cachedActionPlans: ActionPlan[] = [];
let cachedCoachingSessions: CoachingSession[] = [];

export const getMockData = () => {
    if (cachedAgents.length === 0) {
        cachedAgents = generateAgents();
        cachedKPIs = generateKPIs();
        cachedScores = generateScores(cachedAgents, cachedKPIs);
        cachedActionPlans = generateActionPlans(cachedAgents);

        // Auto-generate coaching sessions for at-risk agents
        const atRiskAgentIds = getInterventionCandidatesInternal(cachedAgents, cachedScores)
            .map((c: { agent: Agent }) => c.agent.id);
        cachedCoachingSessions = generateCoachingSessions(cachedAgents, atRiskAgentIds);
    }
    return {
        agents: cachedAgents,
        kpis: cachedKPIs,
        scores: cachedScores,
        actionPlans: cachedActionPlans,
        coachingSessions: cachedCoachingSessions
    };
}

export const getActionPlans = () => {
    return getMockData().actionPlans;
}

export const getDashboardMetrics = () => {
    const { kpis, scores } = getMockData();

    // Aggregate latest values for Dashboard
    // Simple average of the last recorded score for each KPI across all agents
    const metrics = kpis.map(kpi => {
        const kpiScores = scores.filter(s => s.kpi_id === kpi.id && s.is_official);
        // Sort by date desc
        kpiScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Get last score for every agent? No, let's just get average of "This Week" (latest date)
        const latestDate = kpiScores[0]?.date;
        const currentScores = kpiScores.filter(s => s.date === latestDate);

        const sum = currentScores.reduce((acc, s) => acc + s.value, 0);
        const avg = currentScores.length > 0 ? sum / currentScores.length : 0;

        return {
            ...kpi,
            currentValue: Number(avg.toFixed(1)),
            calculationBreakdown: {
                numerator: sum,
                denominator: currentScores.length,
                formula: 'Average (Sum / Count)'
            },
            history: [ // Mock history based on real data would take more calc, using simplified visual data for now
                { date: 'Week 1', value: avg * 0.95 },
                { date: 'Week 2', value: avg * 0.98 },
                { date: 'Week 3', value: avg * 0.92 },
                { date: 'Week 4', value: avg }
            ]
        };
    });

    return metrics;
}

export const getAgents = () => {
    return getMockData().agents;
}

export const getScores = () => {
    return getMockData().scores;
}

export const getKPIs = () => {
    return getMockData().kpis;
}

export const getAgentById = (id: string) => {
    const { agents, scores, kpis } = getMockData();
    const agent = agents.find(a => a.id === id);
    if (!agent) return null;

    const agentScores = scores.filter(s => s.agent_id === id);

    // Sort scores by date desc
    agentScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
        agent,
        scores: agentScores,
        kpis // returning KPIs to map names in UI
    };
}

export const getInterventionCandidates = () => {
    const { agents, scores } = getMockData();

    // Calculate average score for every agent
    const candidates = agents.map(agent => {
        const agentScores = scores.filter(s => s.agent_id === agent.id);
        const sum = agentScores.reduce((acc, s) => acc + s.value, 0);
        const avg = agentScores.length > 0 ? sum / agentScores.length : 0;

        return {
            agent,
            averageScore: Number(avg.toFixed(1)),
            riskLevel: avg < 75 ? 'Critical' : avg < 85 ? 'Warning' : 'Good'
        };
    }).filter(c => c.riskLevel !== 'Good');

    return candidates.sort((a, b) => a.averageScore - b.averageScore);
}

// Internal helper for use during initialization
const getInterventionCandidatesInternal = (agents: Agent[], scores: { agent_id: string; value: number }[]) => {
    const candidates = agents.map(agent => {
        const agentScores = scores.filter(s => s.agent_id === agent.id);
        const sum = agentScores.reduce((acc, s) => acc + s.value, 0);
        const avg = agentScores.length > 0 ? sum / agentScores.length : 0;

        return {
            agent,
            averageScore: Number(avg.toFixed(1)),
            riskLevel: avg < 75 ? 'Critical' : avg < 85 ? 'Warning' : 'Good'
        };
    }).filter(c => c.riskLevel !== 'Good');

    return candidates.sort((a, b) => a.averageScore - b.averageScore);
};

// Coaching Session Functions
export const getCoachingSessions = () => {
    return getMockData().coachingSessions;
}

export const getCoachingSessionsByAgent = (agentId: string) => {
    const { coachingSessions, agents } = getMockData();
    const agent = agents.find(a => a.id === agentId);
    return {
        agent,
        sessions: coachingSessions.filter(s => s.agent_id === agentId)
    };
}

export const getCoachingSessionById = (id: string) => {
    const { coachingSessions, agents } = getMockData();
    const session = coachingSessions.find(s => s.id === id);
    if (!session) return null;

    const agent = agents.find(a => a.id === session.agent_id);
    return {
        ...session,
        agentName: agent?.name || 'Unknown'
    };
}

export const getManagerDashboardData = () => {
    const { coachingSessions, agents } = getMockData();

    // Sessions requiring manager attention
    const pendingSessions = coachingSessions.filter(
        s => s.status === 'follow_up_required' || s.outcome === 'pending'
    );

    // Sessions where manager was notified but not yet reviewed
    const notifiedSessions = coachingSessions.filter(s => s.manager_notified);

    // Auto-generated sessions (triggered by QA failure/KPI decline)
    const autoGeneratedSessions = coachingSessions.filter(
        s => s.status === 'auto_generated' || s.coaching_type === 'qa_failure' || s.coaching_type === 'kpi_decline'
    );

    // Stats
    const stats = {
        totalSessions: coachingSessions.length,
        pendingReview: pendingSessions.length,
        autoTriggered: autoGeneratedSessions.length,
        improved: coachingSessions.filter(s => s.outcome === 'improved').length,
        declined: coachingSessions.filter(s => s.outcome === 'declined').length,
    };

    return {
        stats,
        pendingSessions: pendingSessions.slice(0, 10),
        recentSessions: coachingSessions.slice(0, 10),
        agents
    };
}

export const getActionPlanById = (id: string) => {
    const { actionPlans, agents } = getMockData();
    const plan = actionPlans.find(p => p.id === id);
    if (!plan) return null;

    // Enrich with owner details
    const owner = agents.find(a => a.id === plan.owner_id);

    return {
        ...plan,
        ownerName: owner ? owner.name : 'Unknown'
    };
}


