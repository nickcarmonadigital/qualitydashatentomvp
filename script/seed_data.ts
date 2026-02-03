import { faker } from '@faker-js/faker';
import { Agent, KPI, Score, WeeklyInsight, ActionPlan, VoiceType, KanoCategory, ErrorCategory } from '@/types/domain';

// --- Constants ---
faker.seed(123); // Ensure deterministic data for SSR consistency

const LOBS = ['Trust & Safety', 'Moderation', 'Creator Support', 'Monetization'];
const TEAMS = ['Alpha', 'Beta', 'Gamma', 'Delta'];
const KPIS_DEF = [
    { name: 'Quality Pass Rate', type: 'VoP', kano: 'Satisfier', target: 95, unit: '%' },
    { name: 'CSAT', type: 'VoC', kano: 'Satisfier', target: 85, unit: '%' },
    { name: 'AHT', type: 'VoB', kano: 'Dissatisfier', target: 600, unit: '#' },
    { name: 'Issue Resolution', type: 'VoC', kano: 'Satisfier', target: 90, unit: '%' },
];

const AGENT_COUNT = 50;
const WEEKS_OF_HISTORY = 4;

// --- Generators ---

export const generateAgents = (): Agent[] => {
    return Array.from({ length: AGENT_COUNT }).map(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        role: 'Agent',
        team: faker.helpers.arrayElement(TEAMS),
        tenure_days: faker.number.int({ min: 30, max: 1000 }),
        status: 'active',
        metrics: {}
    }));
};

export const generateKPIs = (): KPI[] => {
    return KPIS_DEF.map((def) => ({
        id: faker.string.uuid(),
        name: def.name,
        voice_type: def.type as VoiceType,
        kano_category: def.kano as KanoCategory,
        target: def.target,
        unit: def.unit as '%' | '#' | 'Currency',
        description: `Standard operating metric for ${def.name}`
    }));
};

export const generateScores = (agents: Agent[], kpis: KPI[]): Score[] => {
    const scores: Score[] = [];
    const today = new Date();

    agents.forEach(agent => {
        kpis.forEach(kpi => {
            for (let i = 0; i < WEEKS_OF_HISTORY; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (i * 7));

                // Generate main official score
                scores.push({
                    id: faker.string.uuid(),
                    agent_id: agent.id,
                    kpi_id: kpi.id,
                    value: kpi.name === 'AHT'
                        ? faker.number.int({ min: 400, max: 800 })
                        : faker.number.float({ min: 70, max: 100, fractionDigits: 1 }),
                    date: date.toISOString().split('T')[0],
                    is_official: true
                });

                // 20% chance of having a "Low Performance" unofficial monitoring
                if (faker.datatype.boolean(0.2)) {
                    scores.push({
                        id: faker.string.uuid(),
                        agent_id: agent.id,
                        kpi_id: kpi.id,
                        value: kpi.name === 'AHT'
                            ? faker.number.int({ min: 800, max: 1200 }) // High AHT (bad)
                            : faker.number.float({ min: 50, max: 70, fractionDigits: 1 }), // Low Score
                        date: date.toISOString().split('T')[0],
                        is_official: false // Flagged as unofficial
                    });
                }
            }
        });
    });
    return scores;
};

export const generateActionPlans = (agents: Agent[]): ActionPlan[] => {
    return Array.from({ length: 15 }).map(() => {
        const owner = faker.helpers.arrayElement(agents);
        return {
            id: faker.string.uuid(),
            title: faker.company.catchPhrase(),
            owner_id: owner.id,
            status: faker.helpers.arrayElement(['open', 'in_progress', 'closed']),
            due_date: faker.date.future().toISOString().split('T')[0],
            problem_statement: faker.lorem.sentence(),
            root_cause: faker.lorem.paragraph(),
            correction: faker.lorem.sentence(),
            causal_category: faker.helpers.arrayElement(['People', 'Process', 'Technology', 'Environment']) as ErrorCategory
        };
    });
};

// --- Console Output for Verification ---
// End of generators
