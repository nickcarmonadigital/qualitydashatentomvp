import { Agent, KPI, Score, ActionPlan } from '@/types/domain';
import { generateAgents, generateKPIs, generateScores, generateActionPlans } from '@/script/seed_data';

// Singleton-ish pattern to keeping data consistent for the User Session (Mock)
let cachedAgents: Agent[] = [];
let cachedKPIs: KPI[] = [];
let cachedScores: Score[] = [];
let cachedActionPlans: ActionPlan[] = [];

export const getMockData = () => {
    if (cachedAgents.length === 0) {
        cachedAgents = generateAgents();
        cachedKPIs = generateKPIs();
        cachedScores = generateScores(cachedAgents, cachedKPIs);
        cachedActionPlans = generateActionPlans(cachedAgents);
    }
    return { agents: cachedAgents, kpis: cachedKPIs, scores: cachedScores, actionPlans: cachedActionPlans };
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


