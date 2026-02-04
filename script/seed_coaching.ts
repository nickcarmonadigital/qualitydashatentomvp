import { faker } from '@faker-js/faker';
import { CoachingSession, CoachingType, CoachingOutcome, CoachRole, Agent } from '@/types/domain';

// Generate coaching sessions based on at-risk agents
export const generateCoachingSessions = (agents: Agent[], atRiskAgentIds: string[]): CoachingSession[] => {
    faker.seed(456); // Different seed for coaching data

    const sessions: CoachingSession[] = [];
    const coachNames = ['Maria Santos', 'John Mitchell', 'Sarah Chen', 'David Kowalski', 'Linda Thompson'];
    const coachRoles: CoachRole[] = ['team_lead', 'qa_analyst', 'sme', 'manager'];
    const coachingTypes: CoachingType[] = ['qa_failure', 'kpi_decline', 'behavioral', 'skills_gap', 'routine'];
    const outcomes: CoachingOutcome[] = ['improved', 'no_change', 'declined', 'pending'];

    // Auto-generate sessions for at-risk agents
    atRiskAgentIds.forEach(agentId => {
        const agent = agents.find(a => a.id === agentId);
        if (!agent) return;

        // Each at-risk agent gets 1-3 coaching sessions
        const sessionCount = faker.number.int({ min: 1, max: 3 });

        for (let i = 0; i < sessionCount; i++) {
            const sessionDate = new Date();
            sessionDate.setDate(sessionDate.getDate() - faker.number.int({ min: 1, max: 30 }));

            const coachRole = faker.helpers.arrayElement(coachRoles);
            const coachingType = i === 0 ? 'qa_failure' : faker.helpers.arrayElement(coachingTypes);

            sessions.push({
                id: faker.string.uuid(),
                agent_id: agentId,
                coach_id: faker.string.uuid(),
                coach_name: faker.helpers.arrayElement(coachNames),
                coach_role: coachRole,
                session_date: sessionDate.toISOString().split('T')[0],
                coaching_type: coachingType,
                trigger_score_id: coachingType === 'qa_failure' ? faker.string.uuid() : undefined,
                trigger_kpi_id: coachingType === 'kpi_decline' ? faker.string.uuid() : undefined,
                notes: faker.lorem.paragraphs(2),
                key_observations: [
                    faker.lorem.sentence(),
                    faker.lorem.sentence(),
                    faker.lorem.sentence()
                ],
                action_items: [
                    faker.lorem.sentence(),
                    faker.lorem.sentence()
                ],
                follow_up_date: faker.datatype.boolean(0.7)
                    ? faker.date.future({ years: 0.1 }).toISOString().split('T')[0]
                    : undefined,
                outcome: i < sessionCount - 1 ? faker.helpers.arrayElement(['improved', 'no_change', 'declined']) : 'pending',
                linked_action_plan_id: faker.datatype.boolean(0.3) ? faker.string.uuid() : undefined,
                manager_notified: coachRole !== 'manager' && faker.datatype.boolean(0.6),
                status: i === sessionCount - 1 ? 'follow_up_required' : 'completed'
            });
        }
    });

    // Add some routine coaching sessions for non-at-risk agents
    const healthyAgents = agents.filter(a => !atRiskAgentIds.includes(a.id)).slice(0, 5);
    healthyAgents.forEach(agent => {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() - faker.number.int({ min: 7, max: 60 }));

        sessions.push({
            id: faker.string.uuid(),
            agent_id: agent.id,
            coach_id: faker.string.uuid(),
            coach_name: faker.helpers.arrayElement(coachNames),
            coach_role: 'team_lead',
            session_date: sessionDate.toISOString().split('T')[0],
            coaching_type: 'routine',
            notes: faker.lorem.paragraph(),
            key_observations: [faker.lorem.sentence()],
            action_items: [],
            outcome: 'improved',
            manager_notified: false,
            status: 'completed'
        });
    });

    // Sort by date desc
    return sessions.sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
};
