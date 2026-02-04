// Enums & Constants
export type VoiceType = 'VoC' | 'VoB' | 'VoE' | 'VoP';
export type KanoCategory = 'Satisfier' | 'Dissatisfier' | 'Delighter' | 'Indifferent';
export type ErrorCategory = 'People' | 'Process' | 'Technology' | 'Environment';

export enum TrendDirection {
    UP = 'up',
    DOWN = 'down',
    FLAT = 'flat',
    UNDEFINED = 'undefined'
}

// Domain Interfaces

export interface Agent {
    id: string;
    name: string;
    role: string;
    team: string;
    tenure_days: number;
    status: 'active' | 'inactive';
    metrics: {
        [key: string]: number; // e.g. "QA Score": 85
    };
}

export interface KPI {
    id: string;
    name: string;
    voice_type: VoiceType;
    kano_category: KanoCategory;
    target: number;
    unit: '%' | '#' | 'Currency';
    description?: string;
}

export interface Score {
    id: string;
    agent_id: string;
    kpi_id: string;
    value: number;
    date: string;
    is_official: boolean; // false = Low Performance Monitoring / Practice
}

// LSS / Insight Structures

export interface WeeklyInsight {
    id: string;
    week_start: string;
    author_id: string;
    status: 'draft' | 'submitted' | 'approved';

    // Section 1: KPI Movements
    kpi_movements: {
        kpi_id: string;
        trend: TrendDirection;
        delta: number;
        comment: string;
    }[];

    // Section 2: Correlated Issues
    correlated_issues: {
        issue: string;
        impact_kpi: string;
        root_cause_type: ErrorCategory;
    }[];

    // Section 3: New Hire Focus
    new_hire_summary: string; // 30/60/90

    // Section 4: Product Knowledge
    pk_gaps: string[];

    // Section 5: Bottom Quartile
    bottom_quartile_agents: string[]; // Agent IDs

    // Section 6: Leadership Summary
    executive_summary: string;
}

export interface ActionPlan {
    id: string;
    title: string;
    owner_id: string;
    status: 'open' | 'in_progress' | 'closed';
    due_date: string;

    // LSS Fields
    problem_statement: string;
    root_cause: string; // 5 Whys output
    correction: string;
    causal_category: ErrorCategory; // Fishbone category
}

// Coaching Types
export type CoachingType = 'qa_failure' | 'kpi_decline' | 'behavioral' | 'skills_gap' | 'routine';
export type CoachingOutcome = 'improved' | 'no_change' | 'declined' | 'pending';
export type CoachRole = 'team_lead' | 'qa_analyst' | 'sme' | 'manager';

export interface CoachingSession {
    id: string;
    agent_id: string;
    coach_id: string;
    coach_name: string;
    coach_role: CoachRole;
    session_date: string;
    coaching_type: CoachingType;
    trigger_score_id?: string;  // Links to failed QA score
    trigger_kpi_ids?: string[]; // Array of links to KPIs that declined

    // Diagnosis
    problem_identified: boolean;
    issue_resolved: boolean;

    // Session Content
    notes: string;
    key_observations: string[]; // Primary/Secondary Opportunities

    // Commitments
    agent_commitment: string;
    supervisor_commitment: string;

    // Goal Tracking
    goal_tracking_notes?: string; // Notes from the SMART Goals Tracker

    action_items: string[];
    follow_up_date?: string;

    // Outcomes
    outcome: CoachingOutcome;
    linked_action_plan_id?: string;
    manager_notified: boolean;

    status: 'scheduled' | 'completed' | 'follow_up_required' | 'auto_generated';

    // Optional audit attached to this session
    audit?: CoachingAudit;
}

export interface CoachingAudit {
    id: string;
    session_id: string;
    auditor_id: string;
    audit_date: string;

    // SOP Trilevel Model Scores (1-5)
    sections: {
        trust_connection: {
            welcoming_tone: number;
            rapport_building: number;
            empathy: number;
            review_previous: number;
        };
        coaching_execution: {
            agent_involvement: number;
            probing_questions: number;
            root_cause_id: number;
            solution_relevance: number;
            objection_handling: number;
            skill_transfer: number;
        };
        follow_up: {
            expectations_set: number;
            smart_goal_quality: number; // Specific, Tracked, Time-bound
            documentation: number;
        };
    };

    goal_outcome_verified: 'achieved' | 'missed' | 'in_progress' | 'not_started';

    calculated_score: number; // Weighted score / 100
    strengths: string;
    opportunities: string;

    // COPC Compliance Fields
    audit_source?: 'random' | 'nps_detractor' | 'escalation';
    is_critical_error?: boolean;
}

export interface GoalRow {
    sessionId: string;
    agentName: string;
    agentId: string;
    coachName: string;
    date: string;
    smartGoal: string;
    targetDate: string;
    status: string;
    outcome: string;
    notes: string;
}

