export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            agents: {
                Row: {
                    id: string
                    employee_id: string
                    name: string
                    email: string
                    role: string
                    team_id: string
                    hire_date: string
                    status: 'active' | 'inactive' | 'leave'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    employee_id: string
                    name: string
                    email: string
                    role?: string
                    team_id?: string
                    hire_date?: string
                    status?: 'active' | 'inactive' | 'leave'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    employee_id?: string
                    name?: string
                    email?: string
                    role?: string
                    team_id?: string
                    hire_date?: string
                    status?: 'active' | 'inactive' | 'leave'
                    created_at?: string
                    updated_at?: string
                }
            }
            kpi_records: {
                Row: {
                    id: string
                    agent_id: string
                    metric_type: string
                    value: number
                    target: number
                    period_start: string
                    period_end: string
                    is_official: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    agent_id: string
                    metric_type: string
                    value: number
                    target: number
                    period_start: string
                    period_end: string
                    is_official?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    agent_id?: string
                    metric_type?: string
                    value?: number
                    target?: number
                    period_start?: string
                    period_end?: string
                    is_official?: boolean
                    created_at?: string
                }
            }
            // Add other tables as we build
        }
    }
}
