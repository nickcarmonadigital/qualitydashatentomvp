import { Agent, KPI, Score, ActionPlan, VoiceType, KanoCategory, ErrorCategory, CoachingSession, CoachingType, CoachingOutcome, CoachRole } from '@/types/domain';

// ============================================================================
// STORY-DRIVEN DATASET FOR QUALITYDASH
// 59 Agents across 4 Teams with Realistic Performance Narratives
// ============================================================================

// --- Team Structure ---
// Alpha Team (15 agents): The veterans - consistently high performers
// Beta Team (15 agents): The rising stars - improving over time  
// Gamma Team (15 agents): The volatile team - mixed performance, needs coaching
// Delta Team (14 agents): New hires - learning curve, high coaching needs

// --- KPI Definitions ---
export const KPI_DEFINITIONS = [
    { id: 'kpi-quality', name: 'Quality Pass Rate', type: 'VoP' as VoiceType, kano: 'Satisfier' as KanoCategory, target: 95, unit: '%' as const },
    { id: 'kpi-csat', name: 'CSAT', type: 'VoC' as VoiceType, kano: 'Satisfier' as KanoCategory, target: 85, unit: '%' as const },
    { id: 'kpi-aht', name: 'AHT (seconds)', type: 'VoB' as VoiceType, kano: 'Dissatisfier' as KanoCategory, target: 600, unit: '#' as const },
    { id: 'kpi-resolution', name: 'Issue Resolution', type: 'VoC' as VoiceType, kano: 'Satisfier' as KanoCategory, target: 90, unit: '%' as const },
    { id: 'kpi-productivity', name: 'Tickets/Hour', type: 'VoB' as VoiceType, kano: 'Satisfier' as KanoCategory, target: 8, unit: '#' as const },
];

// --- Agent Personas (59 Agents with Stories) ---
interface AgentPersona {
    name: string;
    team: 'Alpha' | 'Beta' | 'Gamma' | 'Delta';
    tenure_days: number;
    story: 'top_performer' | 'improving' | 'declining' | 'volatile' | 'new_hire' | 'comeback' | 'consistent';
    baseQuality: number;
    baseCsat: number;
    baseAht: number;
    baseResolution: number;
    baseProductivity: number;
}

const AGENT_PERSONAS: AgentPersona[] = [
    // ===== ALPHA TEAM (15) - The Veterans =====
    { name: 'Maria Santos', team: 'Alpha', tenure_days: 1200, story: 'top_performer', baseQuality: 98, baseCsat: 92, baseAht: 480, baseResolution: 96, baseProductivity: 10 },
    { name: 'James Chen', team: 'Alpha', tenure_days: 980, story: 'top_performer', baseQuality: 97, baseCsat: 90, baseAht: 520, baseResolution: 94, baseProductivity: 9 },
    { name: 'Sarah Mitchell', team: 'Alpha', tenure_days: 1100, story: 'consistent', baseQuality: 94, baseCsat: 88, baseAht: 550, baseResolution: 91, baseProductivity: 8 },
    { name: 'David Kim', team: 'Alpha', tenure_days: 890, story: 'top_performer', baseQuality: 96, baseCsat: 91, baseAht: 500, baseResolution: 95, baseProductivity: 9 },
    { name: 'Elena Rodriguez', team: 'Alpha', tenure_days: 1050, story: 'consistent', baseQuality: 93, baseCsat: 87, baseAht: 580, baseResolution: 90, baseProductivity: 8 },
    { name: 'Michael Thompson', team: 'Alpha', tenure_days: 920, story: 'consistent', baseQuality: 92, baseCsat: 86, baseAht: 590, baseResolution: 89, baseProductivity: 8 },
    { name: 'Lisa Nguyen', team: 'Alpha', tenure_days: 1300, story: 'top_performer', baseQuality: 99, baseCsat: 94, baseAht: 460, baseResolution: 97, baseProductivity: 11 },
    { name: 'Robert Garcia', team: 'Alpha', tenure_days: 850, story: 'consistent', baseQuality: 91, baseCsat: 85, baseAht: 600, baseResolution: 88, baseProductivity: 8 },
    { name: 'Jennifer Brown', team: 'Alpha', tenure_days: 780, story: 'declining', baseQuality: 88, baseCsat: 82, baseAht: 650, baseResolution: 85, baseProductivity: 7 },
    { name: 'William Davis', team: 'Alpha', tenure_days: 1150, story: 'consistent', baseQuality: 94, baseCsat: 88, baseAht: 540, baseResolution: 92, baseProductivity: 9 },
    { name: 'Amanda Wilson', team: 'Alpha', tenure_days: 990, story: 'top_performer', baseQuality: 96, baseCsat: 90, baseAht: 510, baseResolution: 93, baseProductivity: 9 },
    { name: 'Christopher Lee', team: 'Alpha', tenure_days: 870, story: 'consistent', baseQuality: 92, baseCsat: 86, baseAht: 570, baseResolution: 89, baseProductivity: 8 },
    { name: 'Jessica Martinez', team: 'Alpha', tenure_days: 1020, story: 'consistent', baseQuality: 93, baseCsat: 87, baseAht: 560, baseResolution: 90, baseProductivity: 8 },
    { name: 'Daniel Anderson', team: 'Alpha', tenure_days: 940, story: 'declining', baseQuality: 86, baseCsat: 80, baseAht: 680, baseResolution: 82, baseProductivity: 6 },
    { name: 'Stephanie Taylor', team: 'Alpha', tenure_days: 1080, story: 'consistent', baseQuality: 94, baseCsat: 88, baseAht: 550, baseResolution: 91, baseProductivity: 8 },

    // ===== BETA TEAM (15) - The Rising Stars =====
    { name: 'Kevin Patel', team: 'Beta', tenure_days: 450, story: 'improving', baseQuality: 85, baseCsat: 82, baseAht: 620, baseResolution: 84, baseProductivity: 7 },
    { name: 'Rachel Green', team: 'Beta', tenure_days: 380, story: 'improving', baseQuality: 83, baseCsat: 80, baseAht: 640, baseResolution: 82, baseProductivity: 6 },
    { name: 'Andrew Johnson', team: 'Beta', tenure_days: 520, story: 'improving', baseQuality: 88, baseCsat: 85, baseAht: 580, baseResolution: 87, baseProductivity: 8 },
    { name: 'Michelle White', team: 'Beta', tenure_days: 410, story: 'improving', baseQuality: 84, baseCsat: 81, baseAht: 630, baseResolution: 83, baseProductivity: 7 },
    { name: 'Brandon Clark', team: 'Beta', tenure_days: 490, story: 'improving', baseQuality: 86, baseCsat: 84, baseAht: 600, baseResolution: 86, baseProductivity: 7 },
    { name: 'Nicole Harris', team: 'Beta', tenure_days: 350, story: 'comeback', baseQuality: 82, baseCsat: 79, baseAht: 660, baseResolution: 80, baseProductivity: 6 },
    { name: 'Justin Lewis', team: 'Beta', tenure_days: 480, story: 'improving', baseQuality: 87, baseCsat: 83, baseAht: 590, baseResolution: 85, baseProductivity: 7 },
    { name: 'Samantha Walker', team: 'Beta', tenure_days: 540, story: 'improving', baseQuality: 89, baseCsat: 86, baseAht: 560, baseResolution: 88, baseProductivity: 8 },
    { name: 'Tyler Robinson', team: 'Beta', tenure_days: 420, story: 'volatile', baseQuality: 78, baseCsat: 75, baseAht: 720, baseResolution: 76, baseProductivity: 5 },
    { name: 'Ashley Young', team: 'Beta', tenure_days: 390, story: 'improving', baseQuality: 84, baseCsat: 81, baseAht: 620, baseResolution: 83, baseProductivity: 7 },
    { name: 'Ryan Hall', team: 'Beta', tenure_days: 510, story: 'consistent', baseQuality: 90, baseCsat: 85, baseAht: 570, baseResolution: 88, baseProductivity: 8 },
    { name: 'Megan Allen', team: 'Beta', tenure_days: 360, story: 'improving', baseQuality: 82, baseCsat: 79, baseAht: 650, baseResolution: 81, baseProductivity: 6 },
    { name: 'Derek King', team: 'Beta', tenure_days: 470, story: 'improving', baseQuality: 86, baseCsat: 83, baseAht: 600, baseResolution: 85, baseProductivity: 7 },
    { name: 'Lauren Wright', team: 'Beta', tenure_days: 430, story: 'improving', baseQuality: 85, baseCsat: 82, baseAht: 610, baseResolution: 84, baseProductivity: 7 },
    { name: 'Eric Scott', team: 'Beta', tenure_days: 500, story: 'consistent', baseQuality: 88, baseCsat: 84, baseAht: 590, baseResolution: 86, baseProductivity: 8 },

    // ===== GAMMA TEAM (15) - The Volatile Team =====
    { name: 'Marcus Williams', team: 'Gamma', tenure_days: 650, story: 'volatile', baseQuality: 75, baseCsat: 72, baseAht: 750, baseResolution: 73, baseProductivity: 5 },
    { name: 'Christina Lopez', team: 'Gamma', tenure_days: 580, story: 'declining', baseQuality: 78, baseCsat: 74, baseAht: 720, baseResolution: 76, baseProductivity: 5 },
    { name: 'Brian Moore', team: 'Gamma', tenure_days: 720, story: 'volatile', baseQuality: 72, baseCsat: 70, baseAht: 780, baseResolution: 71, baseProductivity: 4 },
    { name: 'Kimberly Jackson', team: 'Gamma', tenure_days: 600, story: 'comeback', baseQuality: 80, baseCsat: 77, baseAht: 680, baseResolution: 79, baseProductivity: 6 },
    { name: 'Steven Martin', team: 'Gamma', tenure_days: 550, story: 'declining', baseQuality: 76, baseCsat: 73, baseAht: 740, baseResolution: 74, baseProductivity: 5 },
    { name: 'Rebecca Thompson', team: 'Gamma', tenure_days: 680, story: 'volatile', baseQuality: 74, baseCsat: 71, baseAht: 760, baseResolution: 72, baseProductivity: 5 },
    { name: 'Jason Garcia', team: 'Gamma', tenure_days: 520, story: 'improving', baseQuality: 82, baseCsat: 79, baseAht: 660, baseResolution: 80, baseProductivity: 6 },
    { name: 'Laura Martinez', team: 'Gamma', tenure_days: 590, story: 'declining', baseQuality: 77, baseCsat: 74, baseAht: 730, baseResolution: 75, baseProductivity: 5 },
    { name: 'Nathan Robinson', team: 'Gamma', tenure_days: 640, story: 'volatile', baseQuality: 73, baseCsat: 70, baseAht: 770, baseResolution: 72, baseProductivity: 4 },
    { name: 'Heather Clark', team: 'Gamma', tenure_days: 560, story: 'comeback', baseQuality: 81, baseCsat: 78, baseAht: 670, baseResolution: 80, baseProductivity: 6 },
    { name: 'Jacob Lee', team: 'Gamma', tenure_days: 700, story: 'declining', baseQuality: 70, baseCsat: 68, baseAht: 820, baseResolution: 69, baseProductivity: 4 },
    { name: 'Amber Walker', team: 'Gamma', tenure_days: 530, story: 'volatile', baseQuality: 76, baseCsat: 73, baseAht: 740, baseResolution: 74, baseProductivity: 5 },
    { name: 'Cody Hall', team: 'Gamma', tenure_days: 610, story: 'declining', baseQuality: 74, baseCsat: 71, baseAht: 760, baseResolution: 73, baseProductivity: 5 },
    { name: 'Danielle Young', team: 'Gamma', tenure_days: 570, story: 'improving', baseQuality: 83, baseCsat: 80, baseAht: 650, baseResolution: 81, baseProductivity: 6 },
    { name: 'Patrick Allen', team: 'Gamma', tenure_days: 660, story: 'volatile', baseQuality: 71, baseCsat: 69, baseAht: 800, baseResolution: 70, baseProductivity: 4 },

    // ===== DELTA TEAM (14) - The New Hires =====
    { name: 'Olivia Turner', team: 'Delta', tenure_days: 45, story: 'new_hire', baseQuality: 68, baseCsat: 65, baseAht: 850, baseResolution: 66, baseProductivity: 3 },
    { name: 'Ethan Brooks', team: 'Delta', tenure_days: 60, story: 'new_hire', baseQuality: 70, baseCsat: 67, baseAht: 820, baseResolution: 68, baseProductivity: 4 },
    { name: 'Sophia Reed', team: 'Delta', tenure_days: 30, story: 'new_hire', baseQuality: 65, baseCsat: 62, baseAht: 900, baseResolution: 64, baseProductivity: 3 },
    { name: 'Mason Cooper', team: 'Delta', tenure_days: 75, story: 'new_hire', baseQuality: 72, baseCsat: 69, baseAht: 790, baseResolution: 70, baseProductivity: 4 },
    { name: 'Isabella Murphy', team: 'Delta', tenure_days: 50, story: 'new_hire', baseQuality: 69, baseCsat: 66, baseAht: 840, baseResolution: 67, baseProductivity: 3 },
    { name: 'Liam Richardson', team: 'Delta', tenure_days: 90, story: 'improving', baseQuality: 75, baseCsat: 72, baseAht: 750, baseResolution: 73, baseProductivity: 5 },
    { name: 'Charlotte Cox', team: 'Delta', tenure_days: 35, story: 'new_hire', baseQuality: 66, baseCsat: 63, baseAht: 880, baseResolution: 65, baseProductivity: 3 },
    { name: 'Noah Howard', team: 'Delta', tenure_days: 55, story: 'new_hire', baseQuality: 69, baseCsat: 66, baseAht: 830, baseResolution: 67, baseProductivity: 4 },
    { name: 'Emma Ward', team: 'Delta', tenure_days: 80, story: 'improving', baseQuality: 74, baseCsat: 71, baseAht: 770, baseResolution: 72, baseProductivity: 5 },
    { name: 'Aiden Torres', team: 'Delta', tenure_days: 40, story: 'new_hire', baseQuality: 67, baseCsat: 64, baseAht: 860, baseResolution: 66, baseProductivity: 3 },
    { name: 'Mia Peterson', team: 'Delta', tenure_days: 65, story: 'new_hire', baseQuality: 71, baseCsat: 68, baseAht: 810, baseResolution: 69, baseProductivity: 4 },
    { name: 'Lucas Gray', team: 'Delta', tenure_days: 85, story: 'improving', baseQuality: 76, baseCsat: 73, baseAht: 740, baseResolution: 74, baseProductivity: 5 },
    { name: 'Ava Ramirez', team: 'Delta', tenure_days: 25, story: 'new_hire', baseQuality: 64, baseCsat: 61, baseAht: 920, baseResolution: 63, baseProductivity: 3 },
    { name: 'Jackson James', team: 'Delta', tenure_days: 70, story: 'new_hire', baseQuality: 70, baseCsat: 67, baseAht: 820, baseResolution: 68, baseProductivity: 4 },
];

// --- Score Generation with Story Trajectories ---
const WEEKS_OF_HISTORY = 8; // 8 weeks of data for meaningful trends

function getScoreModifier(story: string, weekIndex: number): number {
    // weekIndex 0 = current week, weekIndex 7 = 8 weeks ago
    const weeksAgo = weekIndex;

    switch (story) {
        case 'top_performer':
            // Consistently high with minor fluctuations
            return (Math.random() * 4) - 2; // -2 to +2
        case 'improving':
            // Started lower, getting better each week
            return weeksAgo * -1.5; // Week 7: -10.5, Week 0: 0
        case 'declining':
            // Started higher, getting worse each week
            return weeksAgo * 1.2; // Week 7: +8.4, Week 0: 0
        case 'volatile':
            // Wild swings week to week
            return (Math.random() * 20) - 10; // -10 to +10
        case 'new_hire':
            // Learning curve - improving but still low
            return weeksAgo * -2; // Week 7: -14, Week 0: 0
        case 'comeback':
            // Hit rock bottom at week 4, now recovering
            if (weeksAgo >= 4) return -8 + (weeksAgo - 4) * 2;
            return weeksAgo * 2; // Recovering since week 4
        case 'consistent':
            // Steady performance with small variations
            return (Math.random() * 6) - 3; // -3 to +3
        default:
            return 0;
    }
}

// --- Main Generators ---

export const generateAgents = (): Agent[] => {
    return AGENT_PERSONAS.map((persona, index) => ({
        id: `agent-${String(index + 1).padStart(3, '0')}`,
        name: persona.name,
        role: 'Agent',
        team: persona.team,
        tenure_days: persona.tenure_days,
        status: 'active' as const,
        metrics: {}
    }));
};

export const generateKPIs = (): KPI[] => {
    return KPI_DEFINITIONS.map(def => ({
        id: def.id,
        name: def.name,
        voice_type: def.type,
        kano_category: def.kano,
        target: def.target,
        unit: def.unit,
        description: `${def.name} - Target: ${def.target}${def.unit === '%' ? '%' : ''}`
    }));
};

export const generateScores = (agents: Agent[], kpis: KPI[]): Score[] => {
    const scores: Score[] = [];
    const today = new Date();

    AGENT_PERSONAS.forEach((persona, agentIndex) => {
        const agentId = `agent-${String(agentIndex + 1).padStart(3, '0')}`;

        for (let weekIndex = 0; weekIndex < WEEKS_OF_HISTORY; weekIndex++) {
            const date = new Date(today);
            date.setDate(date.getDate() - (weekIndex * 7));
            const dateStr = date.toISOString().split('T')[0];

            const modifier = getScoreModifier(persona.story, weekIndex);

            // Quality Score
            let qualityValue = Math.max(50, Math.min(100, persona.baseQuality + modifier));
            scores.push({
                id: `score-${agentId}-quality-w${weekIndex}`,
                agent_id: agentId,
                kpi_id: 'kpi-quality',
                value: Number(qualityValue.toFixed(1)),
                date: dateStr,
                is_official: true
            });

            // CSAT Score
            let csatValue = Math.max(50, Math.min(100, persona.baseCsat + modifier * 0.8));
            scores.push({
                id: `score-${agentId}-csat-w${weekIndex}`,
                agent_id: agentId,
                kpi_id: 'kpi-csat',
                value: Number(csatValue.toFixed(1)),
                date: dateStr,
                is_official: true
            });

            // AHT (inverse - lower is better)
            let ahtValue = Math.max(300, Math.min(1200, persona.baseAht - modifier * 15));
            scores.push({
                id: `score-${agentId}-aht-w${weekIndex}`,
                agent_id: agentId,
                kpi_id: 'kpi-aht',
                value: Math.round(ahtValue),
                date: dateStr,
                is_official: true
            });

            // Resolution Rate
            let resolutionValue = Math.max(50, Math.min(100, persona.baseResolution + modifier * 0.9));
            scores.push({
                id: `score-${agentId}-resolution-w${weekIndex}`,
                agent_id: agentId,
                kpi_id: 'kpi-resolution',
                value: Number(resolutionValue.toFixed(1)),
                date: dateStr,
                is_official: true
            });

            // Productivity
            let productivityValue = Math.max(2, Math.min(15, persona.baseProductivity + modifier * 0.2));
            scores.push({
                id: `score-${agentId}-productivity-w${weekIndex}`,
                agent_id: agentId,
                kpi_id: 'kpi-productivity',
                value: Number(productivityValue.toFixed(1)),
                date: dateStr,
                is_official: true
            });
        }
    });

    return scores;
};

export const generateActionPlans = (agents: Agent[]): ActionPlan[] => {
    const plans: ActionPlan[] = [];

    // Generate action plans for struggling agents
    const strugglingStories = ['declining', 'volatile', 'new_hire'];

    AGENT_PERSONAS.forEach((persona, index) => {
        if (strugglingStories.includes(persona.story)) {
            const agentId = `agent-${String(index + 1).padStart(3, '0')}`;

            const problemTypes = {
                declining: {
                    title: `Performance Recovery Plan - ${persona.name}`,
                    problem: `${persona.name} has shown consistent decline in quality metrics over the past 4 weeks.`,
                    cause: 'Investigation revealed burnout symptoms and lack of recent training refreshers.',
                    correction: 'Implement reduced caseload and mandatory training refresh program.',
                    category: 'People' as ErrorCategory
                },
                volatile: {
                    title: `Consistency Improvement - ${persona.name}`,
                    problem: `${persona.name} shows high variability in daily performance metrics.`,
                    cause: 'Root cause analysis indicates inconsistent application of quality guidelines.',
                    correction: 'Assign dedicated QA mentor and implement daily coaching touchpoints.',
                    category: 'Process' as ErrorCategory
                },
                new_hire: {
                    title: `Onboarding Success Plan - ${persona.name}`,
                    problem: `New hire ${persona.name} is below target metrics during ramp period.`,
                    cause: 'Expected learning curve for new team member in first 90 days.',
                    correction: 'Continue nesting program with increased shadow sessions.',
                    category: 'People' as ErrorCategory
                }
            };

            const planDetails = problemTypes[persona.story as keyof typeof problemTypes];

            plans.push({
                id: `plan-${agentId}`,
                title: planDetails.title,
                owner_id: agentId,
                status: persona.story === 'new_hire' ? 'in_progress' : (Math.random() > 0.5 ? 'in_progress' : 'open'),
                due_date: new Date(Date.now() + (persona.story === 'new_hire' ? 30 : 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                problem_statement: planDetails.problem,
                root_cause: planDetails.cause,
                correction: planDetails.correction,
                causal_category: planDetails.category
            });
        }
    });

    return plans;
};

// --- Coaching Sessions Generator ---
export const generateCoachingSessions = (agents: Agent[], atRiskAgentIds: string[]): CoachingSession[] => {
    const sessions: CoachingSession[] = [];
    const coaches = [
        { name: 'Maria Santos', role: 'team_lead' as CoachRole },
        { name: 'Sarah Mitchell', role: 'qa_analyst' as CoachRole },
        { name: 'David Kim', role: 'sme' as CoachRole },
        { name: 'Lisa Nguyen', role: 'manager' as CoachRole }
    ];

    AGENT_PERSONAS.forEach((persona, index) => {
        const agentId = `agent-${String(index + 1).padStart(3, '0')}`;
        const needsCoaching = ['declining', 'volatile', 'new_hire', 'comeback'].includes(persona.story);

        if (!needsCoaching) return;

        const sessionCount = persona.story === 'new_hire' ? 4 : (persona.story === 'volatile' ? 3 : 2);

        for (let i = 0; i < sessionCount; i++) {
            const daysAgo = i * 7 + Math.floor(Math.random() * 3);
            const sessionDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            const coach = coaches[i % coaches.length];

            const coachingType: CoachingType =
                i === 0 && persona.story === 'declining' ? 'qa_failure' :
                    i === 0 && persona.story === 'volatile' ? 'kpi_decline' :
                        persona.story === 'new_hire' ? 'skills_gap' : 'routine';

            const observations = {
                declining: [
                    'Agent showing signs of disengagement during calls',
                    'Quality errors increasing in policy interpretation',
                    'Recommended refresher training on core procedures'
                ],
                volatile: [
                    'Performance varies significantly day-to-day',
                    'Strong on some call types, weak on others',
                    'Need to identify trigger patterns for low performance days'
                ],
                new_hire: [
                    'Progressing well through training curriculum',
                    'Shows enthusiasm but needs more product knowledge',
                    'Recommending extended nesting period'
                ],
                comeback: [
                    'Agent responding well to intervention',
                    'Quality scores improving week over week',
                    'Continuing current coaching cadence'
                ]
            };

            const actionItems = {
                declining: ['Complete QA refresher module', 'Schedule 1:1 with supervisor'],
                volatile: ['Daily pre-shift huddle', 'Use consistency checklist'],
                new_hire: ['Complete product certification', 'Shadow top performer 2x this week'],
                comeback: ['Maintain current routine', 'Share success strategies with peers']
            };

            const outcome: CoachingOutcome =
                i > 0 && persona.story === 'comeback' ? 'improved' :
                    i > 0 && persona.story === 'new_hire' ? 'improved' :
                        i === 0 ? 'pending' : 'no_change';

            sessions.push({
                id: `coaching-${agentId}-${i}`,
                agent_id: agentId,
                coach_id: `coach-${coach.role}`,
                coach_name: coach.name,
                coach_role: coach.role,
                session_date: sessionDate.toISOString().split('T')[0],
                coaching_type: coachingType,
                trigger_score_id: coachingType === 'qa_failure' ? `score-${agentId}-quality-w${i}` : undefined,
                trigger_kpi_id: coachingType === 'kpi_decline' ? 'kpi-quality' : undefined,
                notes: `Coaching session ${i + 1} with ${persona.name}. ${observations[persona.story as keyof typeof observations]?.[0] || 'Regular check-in session.'}`,
                key_observations: observations[persona.story as keyof typeof observations] || ['Standard coaching session'],
                action_items: actionItems[persona.story as keyof typeof actionItems] || [],
                follow_up_date: i === 0 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
                outcome,
                manager_notified: coachingType !== 'routine' && i === 0,
                status: i === 0 ? 'follow_up_required' : 'completed'
            });
        }
    });

    // Sort by date descending
    return sessions.sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
};
