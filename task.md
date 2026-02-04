# Quality Operations Dashboard (MVP) - Build Tasks

## Phase 1: Foundation & Infrastructure
- [ ] **Project Layout**
    - [x] Initialize Next.js 14 project (TS, Tailwind, App Router) <!-- id: 1 -->
    - [x] Configure `shadcn/ui` and install base components (Button, Card, Input, etc.) <!-- id: 2 -->
    - [x] Install dependencies (`recharts`, `zustand`, `lucide-react`, `tremor`, `next-auth`) <!-- id: 3 -->
    - [x] Setup folder structure (`components`, `lib`, `types`, `script`) <!-- id: 4 -->

- [ ] **Data Layer & Architecture** (Spec Part 3 & 4)
    - [x] Create Supabase wrapper client (`lib/supabase.ts`) <!-- id: 5 -->
    - [x] Define TypeScript interfaces for Entities (Agent, KPI, Insight, LSS, ActionPlan) <!-- id: 6 -->
    - [x] **Data Integrity**: Enums for Error Categories, **Voice Types**, & **KANO Categories** (Satisfier, Delighter etc.) <!-- id: 7 -->
    - [x] **Data Model Extension**: Add `is_official` flag to Scores (to separate "Low Perf" monitoring from "Official") <!-- id: 8 -->
    - [x] **Tenant Isolation**: Implement RLS Policies and Tenant Context Middleware (Hook Created) <!-- id: 9 -->
    - [x] **Soft Deletes**: Implement `deleted_at` logic in base queries/mutations <!-- id: 10 -->
    - [x] **Audit Logging**: Implement `log_audit` function and Table structure <!-- id: 11 -->
    - [x] **PII Security**: Create utility to **Mask/Pseudonymize PII** in logs (Spec Part 8) <!-- id: 12 -->
    - [x] **Caching/Rate Limiting**: Implement basic Rate Limiting Middleware (Redis stub) <!-- id: 13 -->
    - [x] **Mock Data Engine**: Create `scripts/seed_data.ts` to populate DB with "TikTok" context data <!-- id: 14 -->
    - [x] Execute Seed Script to verify data presence <!-- id: 15 -->

- [ ] **Authentication & Security** (Spec Part 5 & 8)
    - [x] Setup NextAuth.js (with Mock/Credentials provider) <!-- id: 16 -->
    - [x] **Security Config**: Enforce Password Policy (12 chars, special) & Session Timeout (8h) <!-- id: 17 -->
    - [ ] **MFA Support**: Implement 2FA enrollment/verification UI flow <!-- id: 18 -->
    - [ ] Implement Role-Based Access Control (RBAC) hooks/utils <!-- id: 19 -->
    - [x] Create Implementation Plan
    - [x] Define `CoachingAudit` interface
    - [x] Create `createCoachingAudit` in mock service
    - [x] Create Audit Form Page (`/coaching/[id]/audit`)
    - [x] Update Session Detail Page to link Audit
    - [ ] Implement SMART Goals Tracker (`/coaching/goals`)
    - [x] **50/75 Rule Updates**
    - [x] Split into Weekly Monitor vs Annual Trend
    - [x] Implement Tactical/Strategic logic
    - [x] Create Login Page (`/login`) <!-- id: 20 -->

## Phase 2: Core Components & UX
- [ ] **App Shell**
    - [x] Create `Sidebar` navigation with Role-based visibility <!-- id: 21 -->
    - [x] Create `TopNav` with "Atento/TikTok" branding & User Profile <!-- id: 22 -->
    - [x] Implement responsive layout wrapper (Mobile-First) <!-- id: 23 -->
    - [ ] **PWA & Offline**: Config `next-pwa` AND `zustand-persist` for offline state sync <!-- id: 24 -->
    - [ ] **Resilience**: Implement Global **Error Boundaries** (`error.tsx`) to prevent white-screens <!-- id: 25 -->

- [ ] **Dashboard Feature** (Spec Part 6)
    - [x] Create `KPICard` component (Trend, Value, Delta) <!-- id: 26 -->
    - [x] Create `TrendChart` component (using Recharts/Tremor) <!-- id: 27 -->
    - [x] **Trend Logic**: Implement Rules (R2 > 0.5 = Trend, **3-Point Rule** = Improvement) <!-- id: 28 -->
    - [x] Build Main Dashboard Page (`/dashboard`) <!-- id: 29 -->
    - [ ] **Realtime**: Implement Supabase Realtime subscriptions (WebSockets) for live updates <!-- id: 30 -->
    - [ ] **Client Portal**: Create simplified "Client Viewer" Dashboard View <!-- id: 31 -->
    - [x] Integrate Real/Mock data into Dashboard <!-- id: 32 -->

## Phase 3: Operations & Admin
- [ ] **Weekly Insights (Data Entry)**
    - [x] **Report Form**: Implement "Weekly Insight" Form (`/weekly-insight/new`) with 6 Sections: <!-- id: 33 -->
        - [x] 1. Primary KPI Movements (WoW) <!-- id: 34 -->
        - [x] 2. Correlated Issue Mapping (Patterns vs Anecdotes) <!-- id: 35 -->
        - [x] 3. New Hire Wave 30/60/90 <!-- id: 36 -->
        - [x] 4. Knowledge Gaps (Docs vs Execution) <!-- id: 37 -->
        - [x] 5. Bottom Quartile Focus (with **Audit Picker**) <!-- id: 37-c -->
        - [x] 6. Leadership Summary <!-- id: 37-d -->
    - [x] **Calculation Breakdown**: Show math behind values & allow **Manual Override** <!-- id: 36-b -->
    - [x] **Knowledge Gaps**: Implement specific UI section for identifying gaps <!-- id: 37-b -->
    - [x] **Workflow States**: Implement Draft -> Submit -> Approve logic/UI <!-- id: 38 -->
    - [x] **Validation logic for inputs**: Required Leadership Summary before Submit <!-- id: 39 -->

- [ ] **Agent Performance**
    - [x] Agent List View (`/agents`) with **Pagination** & Filtering <!-- id: 39-b -->
    - [x] Agent Detail View (`/agents/[id]`) showing historical trends <!-- id: 40 -->
    - [x] **Version History**: UI to view history of changes (Audit Log viewer) <!-- id: 41 -->
    - [x] "Intervention Needed" / Bottom Quartile logic <!-- id: 42 -->

- [ ] **Action Plans & Strategy** (Spec Part 4 & 6 + LSS Intro)
    - [x] Action Plan List & Detail View (`/action-plans`) <!-- id: 43 -->
    - [x] **CTX Tree**: UI to map Voice -> Expectation -> CTX (KPI) -> Causal Factor <!-- id: 44 -->
    - [x] **Fishbone**: UI with 6 Categories (Tech, Methods, People, Environment, Measure, Mgmt) <!-- id: 45 -->
    - [x] **5 Whys Interlink**: Allow drilling down from a Fishbone Branch into a '5 Whys' session <!-- id: 46 -->

- [ ] **Admin Management** (Spec Part 6 - Admin)
    - [x] User Management Page (`/admin/users`) <!-- id: 47 -->
    - [x] Global Audit Log (`/admin/audit`) <!-- id: 48 -->
    - [x] System Settings (`/admin/settings`) <!-- id: 49 -->
    - [ ] LOB/Team Configuration Page (`/admin/lobs`) <!-- id: 49 -->
    - [ ] **Tenant Settings**: UI to configure Tenant/Client settings (JSONB field) <!-- id: 50 -->

## Phase 4: Analysis & Computations
- [ ] **LSS Operations** (Spec Part 7 + LSS Intro)
    - [x] Implement `R-Squared` Trend Analysis logic & chart <!-- id: 51 -->
    - [x] **Unit Tests**: Write Vitest/Jest tests for R2 Calculation Engine (Critical prevention) <!-- id: 52 -->
    - [x] Implement `VSF` (Variation) Calculation: `(StdDev * 6) / Avg` with Thresholds (>1.0 = Red) <!-- id: 53 -->
    - [x] Implement `Pareto` Chart containing **Both Bar (Count) and Line (Cumulative %)** <!-- id: 54 -->
    - [x] **Correlation**: Scatter Plot with interpretation rules (R2 > 0.5 = Correlated) <!-- id: 55 -->
    - [x] **Distributions**: Implement **Box Plot** and **Histogram** charts for statistical analysis (LSS Intro) <!-- id: 56 -->

- [x] **50/75 Rule** (Spec Part 7)
    - [x] Implement `FiftySeventyFive` rule evaluation logic <!-- id: 57 -->
    - [x] Create dedicated page to view Agents split by "Apprentice" (Incapable) vs "Expert" (Inconsistent) vs "Master" (Capable) <!-- id: 58 -->
    - [x] Create 50/75 Dashboard View (`/fifty-seventy-five`) <!-- id: 59 -->

- [x] **Alerts & Background Jobs** (Spec Part 9)
    - [x] Create `lib/alerts/engine.ts` to process rules <!-- id: 60 -->
    - [x] Create Alerts UI (Notification Bell/List) <!-- id: 61 -->
    - [ ] **Push Notifications**: Setup VAPID/Service Worker for mobile alerts <!-- id: 63 -->
    - [x] Basic Export functionality (CSV/PDF) <!-- id: 64 -->

## Phase 5: MVP Polish
- [ ] **Verification**
    - [ ] **UX Review**: Verify "< 3 clicks to action" constraint <!-- id: 65 -->
    - [ ] Walkthrough to verify "TikTok" data flows correctly <!-- id: 66 -->
    - [ ] Verify Tenant Isolation (ensure no data leaks between "Clients") <!-- id: 67 -->
    - [ ] Final UI Polish (Colors, spacing, fonts) <!-- id: 68 -->

## Phase 6: COPC Compliance Upgrade
- [x] **QA & Training Sessions Module**
    - [x] Create types (`types/sessions.ts`)
    - [x] Create `/sessions` page with Calibration & Teach-back views
    - [x] Add sidebar navigation
- [x] **Critical Alerts & Anomaly Detection**
    - [x] Add Audit Source dropdown (Random, NPS Detractor, Escalation)
    - [x] Add Critical Error checkbox with alert toast
    - [x] Update `CoachingAudit` interface
- [x] **Data Integrity (CSV Exports)**
    - [x] Create `DownloadCSVButton` component
    - [x] Add export to Coaching Sessions page
    - [x] Add export to Action Plans page
- [x] **Settings Page**
    - [x] Create `/settings` with SLA configuration
- [x] **Resources Page**
    - [x] Create `/resources` for SOP hosting

