# Project Execution Task List

## Phase 1: UI Structure (Sidebar & Help)
- [x] **Refactor Sidebar**: Implement collapsible accordion sections to reduce crowding.
- [x] **Audit PageGuides**: Add Help Circles to:
    - [x] Admin Dashboard
    - [x] Settings Page
    - [x] Action Plans List & Detail
    - [x] Weekly Insight Form
    - [x] Coaching Goals

## Phase 2: Functional Fixes
- [x] **Action Plan Editing**: Implement `action-plans/[id]/edit` page and wire button.
- [x] **Admin Flow**: Redesign Admin page into a card-based dashboard.

## Phase 3: Connected Experience (Onboarding)
- [x] **Onboarding Tour**: Create `TourGuide` component following CI Checklist order:
    1. Dashboard
    2. LSS Tools
    3. 50/75 Analysis
    4. Coaching
    5. Action Plans
- [x] **Integration**: Launch tour from a "Start Guide" button or permanent help menu.

- [x] **Dashboard Metric**: Add 'Sample Adherence' (Compliance %) card to Dashboard to match the Tour narrative.
- [x] **Expand Tour**: Update `OnboardingTour` to cover:
    - Weekly Insight (Input)
    - Full LSS Workflow
    - Relationship mappings.
- [x] **LSS Tab Switching**: Enable deep linking in `lss-tools/page.tsx` (e.g., `?tab=randomizer`) so the tour shows the correct content.
- [x] **Modular Tours**: Refactor `OnboardingTour` to support section-specific flows (Performance, Coaching, Ops).
- [x] **Sidebar Tour Buttons**: Add "Play" buttons to Sidebar Group Headers.
- [x] **Fix Tour Flashing**: Resolve navigation loop in Performance Tour (Weekly Insight step).
- [x] **Fix Coaching Loading**: Debug infinite loading state in `/coaching/sessions` (or equivalent).
- [x] **Architecture Plan**: Document Multi-Tenant / Multi-Contract strategy.
- [x] **Verify Fixes**: Ensure tour is stable and pages load.
- [x] **Fix "Session Not Found"**: Added hardcoded active session `CS-FIXED-001` to mock data.
- [x] **Editable Coaching**: Created `/coaching/[id]/edit` and added UI entry point.
- [x] **Universal Editability**:
    - [x] **Agents**: Create `/agents/[id]/edit` and link from Detail page.
    - [x] **Weekly Insights**: Create `/weekly-insight/[id]/edit` (if applicable) or ensure "New" form handles edits.
    - [x] **Action Plans**: Verified `/action-plans/[id]/edit` exists.
    - [x] **KPI Targets**: Verified Admin Settings allow editing.
- [x] **Verify All**: Validating all edit flows.

## UX Feedback & Enhancements
- [x] **Weekly Insights**:
    - [x] **Submitted Reports**: List already exists on main page (mocked).
    - [x] **Tooltips**: Added via Audit PageGuides previously.
- [x] **Action Plans**: Fix "Back to Plans" button in New Action Plan.
- [x] **Agents**: Implement "Add New Agent" flow.
- [x] **Manager Dashboard**: Make summary cards clickable/expandable.
- [x] **LSS Dashboard**: Implement Team filtering on click.
- [x] **Coaching Detail**: Wire up "Actions" buttons (Follow-up, etc).
