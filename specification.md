# 🏗️ Quality Operations Dashboard — Full Stack Specification

## For: Atento BPO (TikTok Contract)
## Method: First Principles + Inversion Thinking

---

# PART 1: FIRST PRINCIPLES ANALYSIS

## What Are We Fundamentally Trying to Do?

Strip away all the jargon. At the core:

```
1. COLLECT    → QAs enter quality data weekly
2. CALCULATE  → System computes trends, patterns, risk scores
3. IDENTIFY   → Surface which AGENTS need help (not pillars)
4. ACT        → Enable 2-week intervention cycles
5. REPORT     → Roll up to pillar scores for client (TikTok)
6. PROTECT    → Keep data isolated and secure (BPO requirement)
```

## The Fundamental Truths

| Truth | Implication |
|-------|-------------|
| You can't coach a pillar | Actions must be at AGENT level |
| Monthly is too late | System must support 2-week cycles |
| QAs aren't data scientists | Analysis must be AUTO-CALCULATED |
| BPO = multi-client | Data isolation is non-negotiable |
| TikTok needs visibility | Client portal with limited access |
| Patterns > anecdotes | Statistical significance matters (LSS) |
| Time kills action | Alerts must be real-time |

---

# PART 2: INVERSION ANALYSIS

## How Would This System Fail?

Think backwards: What must we PREVENT?

| Failure Mode | Consequence | Prevention |
|--------------|-------------|------------|
| Data leaks between clients | Contract breach, legal issues | Tenant isolation at DB level |
| QA forgets to enter data | Incomplete analysis | Deadline reminders + escalation |
| Wrong calculations | Bad decisions | Unit tests + audit trail |
| Too complex to use | Adoption fails | <3 clicks to any action |
| No audit trail | Compliance failure | Log everything |
| Single point of failure | System down = blind | Redundancy + offline mode |
| Slow with scale | Users abandon it | Pagination, caching, async jobs |
| No mobile access | Managers can't act on-the-go | Responsive design |
| Stale alerts | Miss critical issues | Real-time + push notifications |
| No rollback | Mistakes are permanent | Version history on all data |

## Designing Against Failure

```
FAILURE: Data leaks          → SOLUTION: Row-level security + tenant ID on every record
FAILURE: Missed deadlines    → SOLUTION: Automated reminders at 24h, 4h, 1h before due
FAILURE: Wrong calculations  → SOLUTION: Show calculation breakdown, allow manual override
FAILURE: Too complex         → SOLUTION: Role-based views (QA sees only their tasks)
FAILURE: No audit            → SOLUTION: Immutable audit log, every change tracked
FAILURE: System down         → SOLUTION: Offline-first PWA, sync when online
FAILURE: Slow performance    → SOLUTION: Background jobs for heavy calculations
FAILURE: No mobile           → SOLUTION: Mobile-first responsive design
FAILURE: Stale alerts        → SOLUTION: WebSocket for real-time, push for mobile
FAILURE: No rollback         → SOLUTION: Soft deletes, version history table
```

---

# PART 3: SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENTS                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│   │   QA Web     │   │  Manager Web │   │ Client Portal│   │  Mobile PWA  │   │
│   │   (React)    │   │   (React)    │   │   (React)    │   │   (React)    │   │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   │
│          │                  │                  │                  │            │
└──────────┼──────────────────┼──────────────────┼──────────────────┼────────────┘
           │                  │                  │                  │
           └──────────────────┴────────┬─────────┴──────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY (Next.js)                                │
│                        Authentication + Rate Limiting + RBAC                      │
└──────────────────────────────────────┬───────────────────────────────────────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │                           │                           │
           ▼                           ▼                           ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│   AUTH SERVICE      │   │    CORE API         │   │  CALCULATION ENGINE │
│   (NextAuth.js)     │   │    (Next.js API)    │   │  (Background Jobs)  │
│                     │   │                     │   │                     │
│ • JWT tokens        │   │ • CRUD operations   │   │ • LSS calculations  │
│ • MFA support       │   │ • Business logic    │   │ • 50/75 rule eval   │
│ • Role management   │   │ • Tenant isolation  │   │ • Trend analysis    │
│ • Session handling  │   │ • Data validation   │   │ • Alert generation  │
└─────────────────────┘   └──────────┬──────────┘   └──────────┬──────────┘
                                     │                         │
                                     └────────────┬────────────┘
                                                  │
┌─────────────────────────────────────────────────┼─────────────────────────────────┐
│                                    DATA LAYER                                     │
├─────────────────────────────────────────────────┼─────────────────────────────────┤
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐               │
│   │   PostgreSQL    │   │     Redis       │   │   S3 / Blob     │               │
│   │   (Primary DB)  │   │   (Cache)       │   │   (Storage)     │               │
│   │                 │   │                 │   │                 │               │
│   │ • Row-level     │   │ • Sessions      │   │ • Audit logs    │               │
│   │   security      │   │ • Real-time     │   │ • Exports       │               │
│   │ • Tenant ID     │   │ • Rate limiting │   │ • Backups       │               │
│   │   on all tables │   │ • Job queues    │   │                 │               │
│   └─────────────────┘   └─────────────────┘   └─────────────────┘               │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | Next.js 14 (App Router) | SSR for security, React for UI |
| **UI** | shadcn/ui + Tailwind | Clean, accessible, fast |
| **Charts** | Recharts + Tremor | Dashboard-optimized |
| **State** | Zustand + React Query | Simple, performant |
| **Backend** | Next.js API Routes | Full-stack in one repo |
| **Database** | PostgreSQL (Supabase) | Row-level security built-in |
| **Auth** | NextAuth.js | Enterprise SSO support |
| **Cache** | Redis (Upstash) | Serverless-friendly |
| **Jobs** | Inngest | Serverless background jobs |
| **Hosting** | Vercel | Easy deployment |

---

# PART 4: DATABASE SCHEMA

## Multi-Tenancy (Every Table Has)

```sql
tenant_id       UUID NOT NULL REFERENCES tenants(id)
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
created_by      UUID REFERENCES users(id)
deleted_at      TIMESTAMPTZ  -- Soft delete
```

## Core Tables

```sql
-- ============================================
-- ORGANIZATION
-- ============================================

CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,  -- "Atento"
  client_name     TEXT NOT NULL,  -- "TikTok"
  settings        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  name            TEXT NOT NULL,  -- "Platforms", "Performance", etc.
  code            TEXT NOT NULL,  -- "PLAT", "PERF"
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  email           TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN (
    'admin', 'manager', 'team_lead', 'qa', 'sme', 'client_viewer'
  )),
  lob_ids         UUID[],  -- Which LOBs they can access
  is_active       BOOLEAN DEFAULT true,
  mfa_enabled     BOOLEAN DEFAULT false,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  lob_id          UUID NOT NULL REFERENCES lobs(id),
  employee_id     TEXT NOT NULL,  -- External ID from client
  name            TEXT NOT NULL,
  hire_date       DATE NOT NULL,
  tenure_months   INTEGER GENERATED ALWAYS AS (
    EXTRACT(MONTH FROM AGE(CURRENT_DATE, hire_date))
  ) STORED,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- KPI CONFIGURATION
-- ============================================

CREATE TABLE kpi_definitions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  name            TEXT NOT NULL,  -- "CSAT %"
  code            TEXT NOT NULL,  -- "csat_pct"
  target_value    DECIMAL(10,4) NOT NULL,
  direction       TEXT NOT NULL CHECK (direction IN ('higher_better', 'lower_better')),
  unit            TEXT DEFAULT '%',
  has_penalty     BOOLEAN DEFAULT false,
  display_order   INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WEEKLY INSIGHT DATA
-- ============================================

CREATE TABLE weekly_insights (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  lob_id          UUID NOT NULL REFERENCES lobs(id),
  year            INTEGER NOT NULL,
  month           INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  week_number     INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 5),
  week_start_date DATE NOT NULL,
  week_end_date   DATE NOT NULL,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
  submitted_at    TIMESTAMPTZ,
  submitted_by    UUID REFERENCES users(id),
  approved_at     TIMESTAMPTZ,
  approved_by     UUID REFERENCES users(id),
  summary_insight TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES users(id),
  UNIQUE(tenant_id, lob_id, year, month, week_number)
);

CREATE TABLE weekly_kpi_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_insight_id UUID NOT NULL REFERENCES weekly_insights(id) ON DELETE CASCADE,
  kpi_id          UUID NOT NULL REFERENCES kpi_definitions(id),
  value           DECIMAL(10,4),
  previous_value  DECIMAL(10,4),  -- Auto-filled from last week
  delta           DECIMAL(10,4) GENERATED ALWAYS AS (value - previous_value) STORED,
  met_target      BOOLEAN,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE weekly_errors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_insight_id UUID NOT NULL REFERENCES weekly_insights(id) ON DELETE CASCADE,
  error_type      TEXT NOT NULL,
  count           INTEGER NOT NULL DEFAULT 0,
  category        TEXT CHECK (category IN (
    'people', 'process', 'technology', 'training', 'environment', 'management'
  )),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE weekly_knowledge_gaps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_insight_id UUID NOT NULL REFERENCES weekly_insights(id) ON DELETE CASCADE,
  gap_description TEXT NOT NULL,
  agents_affected INTEGER DEFAULT 0,
  impact_kpi_id   UUID REFERENCES kpi_definitions(id),
  doc_status      TEXT CHECK (doc_status IN ('not_documented', 'needs_update', 'current')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENT PERFORMANCE
-- ============================================

CREATE TABLE agent_weekly_scores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_insight_id UUID NOT NULL REFERENCES weekly_insights(id) ON DELETE CASCADE,
  agent_id        UUID NOT NULL REFERENCES agents(id),
  csat_score      DECIMAL(5,2),
  pass_rate       DECIMAL(5,2),
  productivity    DECIMAL(5,2),
  tickets_handled INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(weekly_insight_id, agent_id)
);

CREATE TABLE agent_quartile_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  agent_id        UUID NOT NULL REFERENCES agents(id),
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  period_type     TEXT NOT NULL CHECK (period_type IN ('weekly', 'biweekly', 'monthly')),
  quartile        INTEGER NOT NULL CHECK (quartile BETWEEN 1 AND 4),
  primary_kpi_value DECIMAL(10,4),
  rank_in_lob     INTEGER,
  total_in_lob    INTEGER,
  consecutive_q4_periods INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTION PLANS
-- ============================================

CREATE TABLE action_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  agent_id        UUID NOT NULL REFERENCES agents(id),
  period_type     TEXT NOT NULL CHECK (period_type IN ('biweekly', 'monthly')),
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  status          TEXT DEFAULT 'open' CHECK (status IN (
    'open', 'in_progress', 'completed', 'escalated', 'cancelled'
  )),
  
  -- Root cause analysis
  root_cause_summary TEXT,
  fishbone_category TEXT CHECK (fishbone_category IN (
    'people', 'process', 'technology', 'training', 'environment', 'management'
  )),
  five_whys       JSONB,  -- [{level, question, answer}]
  
  -- Ownership
  owner_id        UUID REFERENCES users(id),
  target_completion DATE,
  actual_completion DATE,
  
  -- Outcome
  outcome_notes   TEXT,
  did_graduate_q4 BOOLEAN,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES users(id),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE action_plan_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id  UUID NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  action_description TEXT NOT NULL,
  owner_id        UUID REFERENCES users(id),
  due_date        DATE,
  status          TEXT DEFAULT 'not_started' CHECK (status IN (
    'not_started', 'in_progress', 'completed', 'blocked'
  )),
  completion_date DATE,
  notes           TEXT,
  display_order   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LSS CALCULATIONS (Computed)
-- ============================================

CREATE TABLE lss_calculations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  lob_id          UUID NOT NULL REFERENCES lobs(id),
  calculation_type TEXT NOT NULL CHECK (calculation_type IN (
    'trend_r2', 'vsf', 'pareto', 'correlation'
  )),
  kpi_id          UUID REFERENCES kpi_definitions(id),
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  
  -- Results
  r_squared       DECIMAL(10,6),
  vsf_value       DECIMAL(10,6),
  mean_value      DECIMAL(10,4),
  std_dev         DECIMAL(10,4),
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'flat')),
  
  -- Interpretation
  interpretation  TEXT,
  recommendation  TEXT,
  input_data      JSONB,  -- Raw data for audit
  
  calculated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pareto_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lss_calculation_id UUID NOT NULL REFERENCES lss_calculations(id) ON DELETE CASCADE,
  error_type      TEXT NOT NULL,
  count           INTEGER NOT NULL,
  percentage      DECIMAL(5,2),
  cumulative_pct  DECIMAL(5,2),
  priority        TEXT CHECK (priority IN ('high', 'medium', 'low')),
  rank            INTEGER NOT NULL
);

-- ============================================
-- 50/75 RULE
-- ============================================

CREATE TABLE fifty_seventy_five_evaluations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  lob_id          UUID NOT NULL REFERENCES lobs(id),
  kpi_id          UUID NOT NULL REFERENCES kpi_definitions(id),
  evaluation_month DATE NOT NULL,
  
  -- 75% Rule
  weeks_evaluated INTEGER NOT NULL,
  weeks_met_target INTEGER NOT NULL,
  passed_75_rule  BOOLEAN,
  
  -- Improvement Rule
  first_half_avg  DECIMAL(10,4),
  second_half_avg DECIMAL(10,4),
  is_improving    BOOLEAN,
  
  -- Overall
  overall_status  TEXT CHECK (overall_status IN (
    'healthy', 'monitor', 'recovering', 'at_risk'
  )),
  
  calculated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, lob_id, kpi_id, evaluation_month)
);

-- ============================================
-- ALERTS
-- ============================================

CREATE TABLE alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  alert_type      TEXT NOT NULL CHECK (alert_type IN (
    'deadline_reminder', 'kpi_breach', 'agent_q4_entry',
    'agent_q4_extended', 'vsf_high', 'trend_negative',
    'action_plan_overdue', 'system'
  )),
  severity        TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  
  -- Context
  lob_id          UUID REFERENCES lobs(id),
  agent_id        UUID REFERENCES agents(id),
  
  -- Targeting
  target_roles    TEXT[],
  target_user_ids UUID[],
  
  -- Status
  is_read         BOOLEAN DEFAULT false,
  read_at         TIMESTAMPTZ,
  is_dismissed    BOOLEAN DEFAULT false,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ
);

-- ============================================
-- AUDIT LOG (Immutable)
-- ============================================

CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL,
  user_id         UUID,
  action          TEXT NOT NULL,
  entity_type     TEXT NOT NULL,
  entity_id       UUID,
  old_values      JSONB,
  new_values      JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Make audit log append-only
REVOKE UPDATE, DELETE ON audit_log FROM PUBLIC;
```

## Row-Level Security

```sql
-- Enable RLS
ALTER TABLE weekly_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY tenant_isolation ON weekly_insights
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- LOB restriction for QA/Team Lead
CREATE POLICY lob_restriction ON weekly_insights
  FOR ALL USING (
    lob_id = ANY(
      SELECT unnest(lob_ids) FROM users
      WHERE id = current_setting('app.user_id')::UUID
    )
  );
```

---

# PART 5: API ENDPOINTS

## Authentication

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
POST   /api/auth/mfa/verify
```

## Weekly Insights

```
GET    /api/weekly-insights                    # List (filtered)
GET    /api/weekly-insights/:id                # Get one
POST   /api/weekly-insights                    # Create
PUT    /api/weekly-insights/:id                # Update
POST   /api/weekly-insights/:id/submit         # Submit
POST   /api/weekly-insights/:id/approve        # Approve

# Nested resources
GET    /api/weekly-insights/:id/kpis
PUT    /api/weekly-insights/:id/kpis           # Bulk update

GET    /api/weekly-insights/:id/errors
POST   /api/weekly-insights/:id/errors
DELETE /api/weekly-insights/:id/errors/:errorId
```

## Agents

```
GET    /api/agents                             # List
GET    /api/agents/:id                         # Detail with history
GET    /api/agents/:id/scores                  # Score history
GET    /api/agents/:id/quartiles               # Quartile history
GET    /api/agents/bottom-quartile             # Current Q4 list
```

## Action Plans

```
GET    /api/action-plans
GET    /api/action-plans/:id
POST   /api/action-plans
PUT    /api/action-plans/:id
PUT    /api/action-plans/:id/items/:itemId     # Update item
POST   /api/action-plans/:id/complete
POST   /api/action-plans/:id/escalate
```

## LSS Analysis

```
GET    /api/lss/trends?lobId=&kpiId=
GET    /api/lss/vsf?lobId=
GET    /api/lss/pareto?lobId=
GET    /api/lss/correlations?lobId=&x=&y=
POST   /api/lss/calculate                      # Trigger recalc
```

## 50/75 Rule

```
GET    /api/fifty-seventy-five?lobId=&month=
POST   /api/fifty-seventy-five/calculate
```

## Dashboard

```
GET    /api/dashboard/summary                  # Main dashboard
GET    /api/dashboard/lob/:lobId               # LOB-specific
```

## Alerts

```
GET    /api/alerts
PUT    /api/alerts/:id/read
PUT    /api/alerts/:id/dismiss
```

## Exports

```
POST   /api/exports/weekly-report
POST   /api/exports/monthly-report
GET    /api/exports/:id/download
```

---

# PART 6: FRONTEND PAGES

## Page Structure

```
/                           → Dashboard redirect
/login                      → Login
/dashboard                  → Main dashboard
/dashboard/lob/[lobId]      → LOB view

/weekly-insight             → List
/weekly-insight/new         → Create
/weekly-insight/[id]        → Edit

/agents                     → List
/agents/[id]                → Detail
/agents/bottom-quartile     → Q4 list

/action-plans               → List
/action-plans/[id]          → Detail
/action-plans/new           → Create

/lss                        → Analysis dashboard
/lss/trends                 → Run charts
/lss/vsf                    → VSF analysis
/lss/pareto                 → Pareto analysis

/fifty-seventy-five         → 50/75 dashboard

/reports                    → Export center

/admin                      → Admin only
/admin/users
/admin/lobs
/admin/kpis
```

---

# PART 7: CALCULATION LOGIC

## R² Trend Calculation

```typescript
function calculateR2(values: number[]): {
  rSquared: number;
  direction: 'up' | 'down' | 'flat';
  interpretation: string;
} {
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i + 1);

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * values[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = values.reduce((acc, yi) => acc + yi * yi, 0);

  const r = (n * sumXY - sumX * sumY) /
    Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const rSquared = r * r;

  const direction = values[n - 1] > values[0] ? 'up' :
                    values[n - 1] < values[0] ? 'down' : 'flat';

  const interpretation = rSquared > 0.5
    ? `Strong ${direction} trend`
    : rSquared > 0.35 ? 'Possible trend' : 'No clear trend';

  return { rSquared, direction, interpretation };
}
```

## VSF Calculation

```typescript
function calculateVSF(values: number[]): {
  vsf: number;
  interpretation: string;
  recommendation: string;
} {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const vsf = (stdDev * 6) / mean;

  let interpretation: string;
  let recommendation: string;

  if (vsf > 1.0) {
    interpretation = '🔴 OUTLIER PROBLEM';
    recommendation = 'Focus on individual bottom performers';
  } else if (vsf > 0.7) {
    interpretation = '🟡 MIXED';
    recommendation = 'Coach outliers AND review process';
  } else {
    interpretation = '🟢 PROCESS PROBLEM';
    recommendation = 'Fix for all agents, not just Q4';
  }

  return { vsf, interpretation, recommendation };
}
```

## 50/75 Rule

```typescript
function calculate5075(
  weeklyValues: { value: number; target: number; direction: string }[]
): {
  passed75: boolean;
  isImproving: boolean;
  status: 'healthy' | 'monitor' | 'recovering' | 'at_risk';
} {
  const weeksMet = weeklyValues.filter(w =>
    w.direction === 'higher_better' ? w.value >= w.target : w.value <= w.target
  ).length;

  const passed75 = weeksMet >= Math.ceil(weeklyValues.length * 0.75);

  const mid = Math.floor(weeklyValues.length / 2);
  const firstHalfAvg = weeklyValues.slice(0, mid).reduce((a, w) => a + w.value, 0) / mid;
  const secondHalfAvg = weeklyValues.slice(mid).reduce((a, w) => a + w.value, 0) / (weeklyValues.length - mid);

  const isImproving = weeklyValues[0].direction === 'higher_better'
    ? secondHalfAvg > firstHalfAvg
    : secondHalfAvg < firstHalfAvg;

  let status: 'healthy' | 'monitor' | 'recovering' | 'at_risk';
  if (passed75 && isImproving) status = 'healthy';
  else if (passed75 && !isImproving) status = 'monitor';
  else if (!passed75 && isImproving) status = 'recovering';
  else status = 'at_risk';

  return { passed75, isImproving, status };
}
```

---

# PART 8: SECURITY

## Authentication

```typescript
const authConfig = {
  provider: 'nextauth',
  mfa: { required: true, methods: ['totp', 'email'] },
  session: { maxAge: 8 * 60 * 60 },  // 8 hour shift
  password: {
    minLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: true,
    preventReuse: 5
  }
};
```

## Role Permissions

| Role | Weekly Insight | Agents | Action Plans | Reports | Admin |
|------|----------------|--------|--------------|---------|-------|
| admin | Full | Full | Full | Full | Full |
| manager | Read/Approve | Read | Read/Update | Export | No |
| team_lead | Read | Own LOB | Create/Update | Read | No |
| qa | Create/Submit | Read | Read | Read | No |
| client_viewer | Approved only | None | Summary | Read | No |

## Data Protection

- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- PII fields pseudonymized in logs
- 7-year audit log retention
- Row-level security on all tables

---

# PART 9: ALERTS

## Trigger Rules

| Alert | Condition | Severity | Targets |
|-------|-----------|----------|---------|
| deadline_reminder | Insight due in 24h/4h/1h | warning/critical | qa, team_lead |
| kpi_breach | KPI >10% below target | warning | manager |
| agent_q4_entry | Agent enters Q4 | info | team_lead |
| agent_q4_extended | Agent in Q4 4+ periods | critical | manager |
| vsf_high | VSF > 1.0 | warning | manager |
| trend_negative | R² > 0.5 AND down | warning | manager |
| action_plan_overdue | Item past due | warning | owner |

---

# PART 10: IMPLEMENTATION PHASES

## Phase 1: Foundation (Weeks 1-2)
- Project setup
- Database + migrations
- Authentication + MFA
- RBAC implementation

## Phase 2: Data Entry (Weeks 3-4)
- Weekly Insight CRUD
- KPI entry
- Error mapping
- Agent scores

## Phase 3: Calculations (Weeks 5-6)
- LSS engine (R², VSF, Pareto)
- 50/75 rule engine
- Background jobs

## Phase 4: Dashboards (Weeks 7-8)
- Main dashboard
- LOB views
- LSS visualizations

## Phase 5: Action Plans (Weeks 9-10)
- Action plan CRUD
- 5 Whys wizard
- Progress tracking

## Phase 6: Alerts (Week 11)
- Alert generation
- In-app notifications
- Email/push notifications

## Phase 7: Reports (Week 12)
- Weekly/monthly reports
- PDF/Excel export

## Phase 8: Launch (Weeks 13-14)
- Client portal
- Security audit
- UAT
- Go-live

---

# SUMMARY

This specification provides everything needed to build a production-ready Quality Operations Dashboard that:

✅ **Collects** weekly insight data from QAs
✅ **Calculates** LSS metrics and 50/75 rule automatically
✅ **Identifies** agents needing intervention within 2 weeks
✅ **Enables** action planning at AGENT level (not pillar)
✅ **Reports** pillar health to clients
✅ **Protects** data with BPO-grade security

**Hand this to any developer or AI coding assistant to build the complete system.**

---

*Document Version: 1.0*
*For: Atento Quality Operations*
