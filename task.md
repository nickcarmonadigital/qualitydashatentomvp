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
- [x] **Verify Deployment**: Push execution.
