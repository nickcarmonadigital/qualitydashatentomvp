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
# Project Task List

## Phase 1: Navigation & Admin Structure
- [ ] **Admin Sidebar**: Add "Admin" link to the side menu (Items 8, 16).
- [ ] **Settings Merge**: Move all settings to `/admin/settings`, deprecate `/settings`, add InfoTooltips (Items 11, 12).
- [ ] **Action Plans**: Verify and fix "Back to Plans" button behavior (Item 2).
- [ ] **Responsive Check**: Ensure layouts work on smaller screens (Item 15).

## Phase 2: Feature Enhancements
- [ ] **Agents**: Ensure "Add Agent" works and adds to active list (Item 3).
- [ ] **Manager Dashboard**: Make summary cards clickable/expandable (Item 4).
- [ ] **LSS Dashboard**: Verify Team Filter (Item 6) & Add Tooltip to Audit Randomizer (Item 7).
- [ ] **Weekly Insights**: Show "Submitted Reports" list & Add Tooltips (Item 1).
- [ ] **Sessions**: Add Tooltips, Calibration Scores/Failing logic, Teach-back creation (Item 14).
- [ ] **Resources**: Modernize UI, Add Tooltips, Document View/Create (Item 13).

## Phase 3: Admin Features
- [ ] **Admin Users**: Fix "Invite User" button & Add Tooltips (Item 9).
- [ ] **Admin Audit**: Clarify purpose/UI for auditors (Item 10).
- [ ] **General**: Fix any other non-working buttons (Item 5).

## Phase 4: Documentation & Tour
- [ ] **Tour**: Update full onboarding tour (Item 17).
- [ ] **Manual**: Create "Platform User Manual" for leadership (Item 18).

## Completed
- [x] Initial Build & Deployment
- [x] Basic Page Structure
