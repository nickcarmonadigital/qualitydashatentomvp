export type SessionType = 'Calibration' | 'Teach-back';

export type CalibrationAttribute = 'Understanding' | 'Accuracy' | 'Compliance' | 'Quality' | 'Timeliness';

export interface CalibrationScore {
    understanding: boolean; // Pass/Fail
    accuracy: boolean;
    compliance: boolean;
    quality: boolean;
    timeliness: boolean;
}

export interface ParticipantResult {
    agentName: string;
    scores: CalibrationScore; // The agent's grading
    alignmentScore: number; // Calculated % match with consensus
}

export interface CalibrationDetails {
    ticketIds: string[]; // List of 3 Ticket IDs
    consensusScore: CalibrationScore; // The Gold Standard
    participants: ParticipantResult[];
    teamAlignmentScore: number; // Average alignment of all participants
}

export interface TeachBackDetails {
    topic: string; // e.g., "Smart+ UTMs"
    speakerName: string;
    ticketExample: string;

    // WI Specific Fields
    logicWalkthrough: string;
    whyTestVerified: boolean;
    edgeCasesDiscussed: string;
}

export interface TrainingSession {
    id: string;
    date: string;
    type: SessionType;
    conductor: string; // Support Staff / QA Lead

    // Discriminated Union based on Type
    calibrationResults?: CalibrationDetails;
    teachBackDetails?: TeachBackDetails;
}
