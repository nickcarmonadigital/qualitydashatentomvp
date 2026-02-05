import { Agent, KPI, Score, ActionPlan, CoachingSession, CoachingAudit, GoalRow } from '@/types/domain';
import { TrainingSession } from '@/types/sessions';
import { generateAgents, generateKPIs, generateScores, generateActionPlans, generateCoachingSessions } from '@/script/seed_data';

// Singleton-ish pattern to keeping data consistent for the User Session (Mock)
let cachedAgents: Agent[] = [];
let cachedKPIs: KPI[] = [];
let cachedScores: Score[] = [];
let cachedActionPlans: ActionPlan[] = [];
let cachedCoachingSessions: CoachingSession[] = [];
let cachedCoachingAudits: CoachingAudit[] = [];
let cachedWeeklyInsights: any[] = [];

// Mock Data for Training/Calibration
let trainingSessions: TrainingSession[] = [
    {
        id: 'cal-001',
        date: '2025-01-15',
        type: 'Calibration',
        conductor: 'Sarah Connor',
        calibrationResults: {
            ticketIds: ['TKT-998', 'TKT-999', 'TKT-1000'],
            consensusScore: {
                understanding: true,
                accuracy: true,
                compliance: true,
                quality: true,
                timeliness: true
            },
            teamAlignmentScore: 88,
            participants: [
                {
                    agentName: 'John Doe',
                    scores: { understanding: true, accuracy: true, compliance: true, quality: true, timeliness: true },
                    alignmentScore: 100
                },
                {
                    agentName: 'Jane Smith',
                    scores: { understanding: true, accuracy: false, compliance: true, quality: true, timeliness: true },
                    alignmentScore: 80
                }
            ]
        }
    },
    {
        id: 'tb-001',
        date: '2025-01-22',
        type: 'Teach-back',
        conductor: 'Sarah Connor',
        teachBackDetails: {
            topic: 'Smart+ UTM Logic',
            speakerName: 'John Doe',
            ticketExample: 'TKT-5542',
            logicWalkthrough: 'Explained how UTMs parses differ in new engine.',
            whyTestVerified: true,
            edgeCasesDiscussed: 'Handled missing referrer edge case.'
        }
    }
];

export const getTrainingSessions = () => trainingSessions;
export const addTrainingSession = (session: TrainingSession) => {
    trainingSessions.unshift(session);
    return session;
};

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

        // Add a FIXED session for reliable testing
        cachedCoachingSessions.unshift({
            id: 'CS-FIXED-001',
            agent_id: cachedAgents[0]?.id || 'agent-001',
            coach_id: 'coach-001',
            coach_name: 'Sarah Connor',
            coach_role: 'team_lead',
            session_date: new Date().toISOString().split('T')[0],
            coaching_type: 'behavioral',
            trigger_kpi_ids: [],
            status: 'follow_up_required',
            outcome: 'pending',
            notes: 'Fixed session for demonstration purposes. This session will always be available.',
            key_observations: ['Agent was late to shift', 'Adherence impact'],
            action_items: ['Review schedule', 'Commit to on-time arrival'],
            manager_notified: true,
            problem_identified: true,
            issue_resolved: false,
            agent_commitment: 'I will set a daily alarm.',
            supervisor_commitment: 'I will check in on arrival time for 1 week.'
        });

        cachedWeeklyInsights = [
            { id: 'week-6', week: 'Week 6 (Feb 02 - Feb 08)', status: 'draft', author: 'You', summary: 'Leadership summary pending...' },
            { id: 'week-5', week: 'Week 5 (Jan 26 - Feb 01)', status: 'submitted', author: 'You', summary: 'Strong KPI recovery in Spanish queues.' },
            { id: 'week-4', week: 'Week 4 (Jan 19 - Jan 25)', status: 'approved', author: 'You', summary: 'Q1 Training deployment successful.' },
        ];
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

    // Aggregate latest values for Dashboard with REAL 8-week history
    const metrics = kpis.map(kpi => {
        const kpiScores = scores.filter(s => s.kpi_id === kpi.id && s.is_official);

        // Get unique dates sorted by date desc
        const uniqueDates = [...new Set(kpiScores.map(s => s.date))].sort((a, b) =>
            new Date(b).getTime() - new Date(a).getTime()
        );

        // Calculate weekly averages for trend history
        const history = uniqueDates.slice(0, 8).map((date, idx) => {
            const weekScores = kpiScores.filter(s => s.date === date);
            const avg = weekScores.length > 0
                ? weekScores.reduce((acc, s) => acc + s.value, 0) / weekScores.length
                : 0;
            return {
                date: `Week ${8 - idx}`,
                value: Number(avg.toFixed(1)),
                rawDate: date
            };
        }).reverse();

        // Current (latest) value
        const latestDate = uniqueDates[0];
        const currentScores = kpiScores.filter(s => s.date === latestDate);
        const sum = currentScores.reduce((acc, s) => acc + s.value, 0);
        const avg = currentScores.length > 0 ? sum / currentScores.length : 0;

        // Calculate trend (compare latest week to previous week)
        const trend = history.length >= 2
            ? history[history.length - 1].value - history[history.length - 2].value
            : 0;

        return {
            ...kpi,
            currentValue: Number(avg.toFixed(1)),
            trend: Number(trend.toFixed(1)),
            calculationBreakdown: {
                numerator: sum,
                denominator: currentScores.length,
                formula: 'Average (Sum / Count)'
            },
            history
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
    const { agents, scores, kpis, coachingSessions, actionPlans } = getMockData();
    const agent = agents.find(a => a.id === id);
    if (!agent) return null;

    const agentScores = scores.filter(s => s.agent_id === id);
    const agentCoaching = coachingSessions.filter(s => s.agent_id === id);
    const agentPlans = actionPlans.filter(p => p.owner_id === id);

    // Sort scores by date desc
    agentScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate current performance (average of latest week's quality scores)
    const latestDate = agentScores[0]?.date;
    const latestScores = agentScores.filter(s => s.date === latestDate);
    const avgPerformance = latestScores.length > 0
        ? latestScores.reduce((acc, s) => acc + s.value, 0) / latestScores.length
        : 0;

    // Calculate week-over-week change
    const uniqueDates = [...new Set(agentScores.map(s => s.date))].sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );
    const previousDate = uniqueDates[1];
    const previousScores = previousDate ? agentScores.filter(s => s.date === previousDate) : [];
    const prevAvg = previousScores.length > 0
        ? previousScores.reduce((acc, s) => acc + s.value, 0) / previousScores.length
        : avgPerformance;
    const weekChange = avgPerformance - prevAvg;

    // Calculate risk level
    const overallAvg = agentScores.length > 0
        ? agentScores.reduce((acc, s) => acc + s.value, 0) / agentScores.length
        : 0;
    const riskLevel = overallAvg < 75 ? 'Critical' : overallAvg < 85 ? 'Medium' : 'Low';

    // Get coaching status
    const activeCoaching = agentCoaching.find(c => c.status === 'follow_up_required');
    const coachingStatus = activeCoaching ? 'Active' : (agentCoaching.length > 0 ? 'Completed' : 'None');

    return {
        agent,
        scores: agentScores,
        kpis,
        coachingSessions: agentCoaching,
        actionPlans: agentPlans,
        metrics: {
            currentPerformance: Number(avgPerformance.toFixed(1)),
            weekChange: Number(weekChange.toFixed(1)),
            riskLevel,
            coachingStatus,
            nextFollowUp: activeCoaching?.follow_up_date || null,
            totalCoachingSessions: agentCoaching.length,
            openActionPlans: agentPlans.filter(p => p.status !== 'closed').length
        }
    };
}

export const updateAgent = (id: string, updates: Partial<Agent>): Agent | null => {
    const { agents } = getMockData();
    const index = agents.findIndex(a => a.id === id);
    if (index === -1) return null;

    agents[index] = { ...agents[index], ...updates };
    return agents[index];
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
    const audit = cachedCoachingAudits.find(a => a.session_id === id);

    return {
        ...session,
        agentName: agent?.name || 'Unknown',
        audit
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

export const createCoachingSession = (sessionData: Omit<CoachingSession, 'id' | 'status'>): CoachingSession => {
    const { coachingSessions } = getMockData();

    // Generate ID
    const newId = `coaching-new-${Date.now()}`;

    const newSession: CoachingSession = {
        ...sessionData,
        id: newId,
        status: 'scheduled', // Default for new sessions
        manager_notified: false // Default
    };

    coachingSessions.unshift(newSession); // Add to beginning
    return newSession;
}

export const updateCoachingSession = (id: string, updates: Partial<CoachingSession>): CoachingSession | null => {
    const { coachingSessions } = getMockData();
    const index = coachingSessions.findIndex(s => s.id === id);
    if (index === -1) return null;

    coachingSessions[index] = { ...coachingSessions[index], ...updates };
    return coachingSessions[index];
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

// ... existing imports

export const createAgent = (agentData: Omit<Agent, 'id' | 'tenure_days' | 'metrics' | 'avatar'>): Agent => {
    const { agents } = getMockData();
    const newAgent: Agent = {
        ...agentData,
        id: `agent-new-${Date.now()}`,
        tenure_days: 1, // New agent
        avatar: '/avatars/01.png', // Default
        metrics: {
            quality_score: 100, // Start high
            aht: 300,
            attendance: 100,
            sentiment_score: 8.5
        }
    };
    agents.push(newAgent);
    cachedAgents = agents; // Update cache
    return newAgent;
};

// ... existing functions

// LSS Tools Team-Based Data
export const getTeamLSSData = (teamFilter?: string | null) => {
    const { agents, scores, kpis, coachingSessions } = getMockData();

    // Application Layer Filtering
    const filteredAgents = teamFilter
        ? agents.filter(a => a.team === teamFilter)
        : agents;

    const filteredAgentIds = filteredAgents.map(a => a.id);

    // Get KPIs by name
    const ahtKpi = kpis.find(k => k.name.toLowerCase().includes('aht'));
    const csatKpi = kpis.find(k => k.name.toLowerCase().includes('csat'));
    const qualityKpi = kpis.find(k => k.name.toLowerCase().includes('quality'));

    // Get unique teams (always return all teams for the selector/cards, or just filtered? 
    // Usually standard to keep comparisons available, but user asked for "only that team's stats")
    // We'll keep the team list for the top cards but filter the charts.
    const teams = [...new Set(agents.map(a => a.team))];

    // ======== Pareto Data (Coaching Issues by Type) ========
    // Filter sessions to only those for the filtered agents
    const filteredSessions = coachingSessions.filter(s => filteredAgentIds.includes(s.agent_id));

    const coachingTypeCounts: Record<string, number> = {};
    filteredSessions.forEach(s => {
        const type = s.coaching_type || 'unknown';
        coachingTypeCounts[type] = (coachingTypeCounts[type] || 0) + 1;
    });
    const paretoData = Object.entries(coachingTypeCounts)
        .map(([name, count]) => ({
            name: name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            count
        }))
        .sort((a, b) => b.count - a.count);

    // ======== Scatter Data (AHT vs CSAT per agent) ========
    const scatterData: { x: number; y: number; agent: string; team: string }[] = [];
    filteredAgents.forEach(agent => {
        const agentScores = scores.filter(s => s.agent_id === agent.id);
        const ahtScores = ahtKpi ? agentScores.filter(s => s.kpi_id === ahtKpi.id) : [];
        const csatScores = csatKpi ? agentScores.filter(s => s.kpi_id === csatKpi.id) : [];

        const avgAHT = ahtScores.length > 0
            ? ahtScores.reduce((acc, s) => acc + s.value, 0) / ahtScores.length
            : 0;
        const avgCSAT = csatScores.length > 0
            ? csatScores.reduce((acc, s) => acc + s.value, 0) / csatScores.length
            : 0;

        if (avgAHT > 0 && avgCSAT > 0) {
            scatterData.push({
                x: Math.round(avgAHT * 6), // Convert % to seconds-ish for demo
                y: Number(avgCSAT.toFixed(1)),
                agent: agent.name,
                team: agent.team
            });
        }
    });

    // ======== Histogram Data (All QA scores for filtered agents) ========
    const histogramData: number[] = [];
    if (qualityKpi) {
        scores
            .filter(s => s.kpi_id === qualityKpi.id && filteredAgentIds.includes(s.agent_id))
            .forEach(s => histogramData.push(s.value));
    }

    // ======== BoxPlot Data (QA scores by team) ========
    // If filtered, we might only want that team's boxplot, or maybe keep all for comparison?
    // User said "displays only that team's stats". Let's filter strictly.
    const boxPlotData: Record<string, number[]> = {};

    const teamsToProcess = teamFilter ? [teamFilter] : teams;

    teamsToProcess.forEach(team => {
        boxPlotData[team] = [];
    });

    if (qualityKpi) {
        filteredAgents.forEach(agent => {
            const agentQAScores = scores.filter(
                s => s.agent_id === agent.id && s.kpi_id === qualityKpi.id
            );
            agentQAScores.forEach(s => {
                if (boxPlotData[agent.team]) {
                    boxPlotData[agent.team].push(s.value);
                }
            });
        });
    }

    // Team Stats for UI (Always return ALL teams for the top buttons/cards, so user can switch)
    const teamStats = teams.map(team => {
        const teamAgents = agents.filter(a => a.team === team); // Always use all agents for summary cards
        const teamScores = scores.filter(s =>
            teamAgents.some(a => a.id === s.agent_id)
        );
        const avg = teamScores.length > 0
            ? teamScores.reduce((acc, s) => acc + s.value, 0) / teamScores.length
            : 0;
        return {
            team,
            agentCount: teamAgents.length,
            avgScore: Number(avg.toFixed(1)),
            coachingSessions: coachingSessions.filter(c =>
                teamAgents.some(a => a.id === c.agent_id)
            ).length
        };
    });

    return {
        teams, // List of all teams
        teamStats, // Summary of all teams (unfiltered)
        paretoData,
        scatterData,
        histogramData,
        boxPlotData
    };
}

export const createCoachingAudit = (auditData: Omit<CoachingAudit, 'id' | 'calculated_score' | 'audit_date'>): CoachingAudit => {
    // 1. Calculate Score based on SOP Weights
    // Formula: (Rating / 5) * Weight

    // Weights from SOP
    const weights = {
        trust: {
            welcoming_tone: 5,
            rapport_building: 5,
            empathy: 7,
            review_previous: 8
        },
        execution: {
            agent_involvement: 5,
            probing_questions: 10,
            root_cause_id: 10,
            solution_relevance: 10,
            objection_handling: 7,
            skill_transfer: 8
        },
        followWidth: {
            expectations_set: 10,
            smart_goal_quality: 10,
            documentation: 5
        }
    };

    const s = auditData.sections;

    let totalScore = 0;

    // Trust (25 max)
    totalScore += (s.trust_connection.welcoming_tone / 5) * weights.trust.welcoming_tone;
    totalScore += (s.trust_connection.rapport_building / 5) * weights.trust.rapport_building;
    totalScore += (s.trust_connection.empathy / 5) * weights.trust.empathy;
    totalScore += (s.trust_connection.review_previous / 5) * weights.trust.review_previous;

    // Execution (50 max)
    totalScore += (s.coaching_execution.agent_involvement / 5) * weights.execution.agent_involvement;
    totalScore += (s.coaching_execution.probing_questions / 5) * weights.execution.probing_questions;
    totalScore += (s.coaching_execution.root_cause_id / 5) * weights.execution.root_cause_id;
    totalScore += (s.coaching_execution.solution_relevance / 5) * weights.execution.solution_relevance;
    totalScore += (s.coaching_execution.objection_handling / 5) * weights.execution.objection_handling;
    totalScore += (s.coaching_execution.skill_transfer / 5) * weights.execution.skill_transfer;

    // Follow-up (25 max)
    totalScore += (s.follow_up.expectations_set / 5) * weights.followWidth.expectations_set;
    totalScore += (s.follow_up.smart_goal_quality / 5) * weights.followWidth.smart_goal_quality;
    totalScore += (s.follow_up.documentation / 5) * weights.followWidth.documentation;

    const newAudit: CoachingAudit = {
        ...auditData,
        id: `audit-${Date.now()}`,
        audit_date: new Date().toISOString().split('T')[0],
        calculated_score: Math.round(totalScore)
    };

    cachedCoachingAudits.push(newAudit);
    return newAudit;
}

// Weekly Insight Mock Functions
export const getWeeklyInsightById = (id: string) => {
    // In a real app, this would fetch from DB. 
    // For now we just return a dummy populated object if ID exists, or null.
    if (!id) return null;

    return {
        id,
        week_start: '2025-02-02',
        author_id: '1',
        status: 'draft',
        summary: 'Leadership Summary loaded from mock...',
        // ... other fields would be populated here
    };
}



export const getWeeklyInsights = () => {
    // Ensure cache is populated
    if (cachedWeeklyInsights.length === 0) {
        getMockData();
    }
    return cachedWeeklyInsights;
}

export const createWeeklyInsight = (insight: any) => {
    const newInsight = {
        ...insight,
        id: `week-${Date.now()}`,
        status: 'submitted', // Default to submmitted for demo flow
        author: 'You'
    };
    cachedWeeklyInsights.unshift(newInsight);
    return newInsight;
}

export const updateWeeklyInsight = (id: string, updates: any) => {
    // Ensure cache is populated
    if (cachedWeeklyInsights.length === 0) {
        getMockData();
    }
    const index = cachedWeeklyInsights.findIndex(w => w.id === id);
    if (index === -1) return null;

    cachedWeeklyInsights[index] = { ...cachedWeeklyInsights[index], ...updates };
    return cachedWeeklyInsights[index];
}
