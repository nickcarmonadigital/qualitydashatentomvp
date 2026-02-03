# Alerts Implementation Plan

## Goal Description
Implement an alerting engine to detect failing metrics and notify users (Mock Email/In-App).

## Proposed Changes

### Logic
#### [NEW] [lib/alerts/engine.ts](file:///c:/Users/Nicholas/Desktop/Quality-Operations-Dashboard/lib/alerts/engine.ts)
- `checkAlerts(kpis: KPI[], scores: Score[])`: Function to scan for failures.
- Logic:
    - If Score < Target: Trigger "Performance Alert".
    - If VSF > 1.0 (calculated): Trigger "Variation Alert".

### Notifications
#### [NEW] [components/notifications/NotificationCenter.tsx](file:///c:/Users/Nicholas/Desktop/Quality-Operations-Dashboard/components/notifications/NotificationCenter.tsx)
- UI Component (Bell Icon in TopNav).
- Displays list of triggered alerts.

## Verification Plan
### Manual Verification
1. Open Dashboard.
2. Click Bell Icon.
3. Verify alerts exist for "mock failing" data.
