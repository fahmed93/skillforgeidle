# Implementation Plan: Active Skill Training View

**Status**: Ready for Implementation  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This document outlines the technical implementation plan for the Active Skill Training View feature as specified in `05-active-training-view.md`.

## Architecture Decisions

### Component Design
- **Approach**: Create a single, self-contained functional component
- **State Management**: Pull directly from Zustand store (no local state needed)
- **Updates**: Leverage existing game loop for automatic re-renders
- **Positioning**: Fixed position in App.tsx, conditionally rendered

### Performance Considerations
- Use `useMemo` for expensive calculations (time estimates)
- Component only renders when `activeTraining` exists
- Calculations occur once per game loop tick (already optimized)

## Implementation Steps

### Step 1: Create Utility Functions
**File**: `src/utils/training-calculations.ts` (new file)

Create helper functions for time calculations:

```typescript
/**
 * Calculate time in milliseconds until next level at current training rate
 */
export function calculateTimeToNextLevel(
  currentXp: number,
  currentLevel: number,
  activityXp: number,
  activityDuration: number
): number;

/**
 * Calculate time in milliseconds until running out of materials
 * Returns null for activities with no requirements (infinite)
 */
export function calculateTimeUntilOutOfMaterials(
  requirements: ResourceRequirement[],
  inventory: Record<string, number>,
  activityDuration: number
): number | null;
```

**Rationale**: Separate calculation logic from UI for testability and reusability.

### Step 2: Create ActiveTrainingView Component
**File**: `src/components/ActiveTrainingView.tsx` (new file)

Component responsibilities:
1. Check if training is active (early return if not)
2. Fetch current activity, skill, and inventory data from store
3. Calculate progress percentage for current action
4. Calculate time to next level using utility function
5. Calculate time until out of materials using utility function
6. Render compact UI with all information
7. Provide stop button

**Key Implementation Details**:
- Use `useSkillTraining` hook for training state
- Use `useGameStore` selectors for efficient re-renders
- Use `useMemo` for time calculations to avoid recalculating every render
- Format times with existing `formatDuration` utility
- Format numbers with existing `formatNumber` utility

### Step 3: Integrate Component into App.tsx
**File**: `App.tsx` (modify)

Add `ActiveTrainingView` import and render it between header and main content:

```typescript
import { ActiveTrainingView } from './src/components/ActiveTrainingView';

// In render:
<View style={styles.mainContainer}>
  <View style={styles.appHeader}>
    {/* Existing header */}
  </View>
  
  {/* NEW */}
  <ActiveTrainingView />
  
  {/* Existing content */}
</View>
```

**Rationale**: Positioning here ensures the view is always visible regardless of selected screen.

### Step 4: Styling
Add styles to match existing design language:
- Background: White with subtle shadow (consistent with other cards)
- Padding: 12-16px for compact design
- Colors: Match existing palette (blue for progress, gray for text)
- Height: ~80-100px to avoid obscuring too much content
- Progress bar: Use same style as existing progress bars

## File Changes Summary

### New Files
1. `src/utils/training-calculations.ts` - Time calculation utilities
2. `src/components/ActiveTrainingView.tsx` - Main component

### Modified Files
1. `App.tsx` - Add component import and render

### No Changes Needed
- Store (already has all needed data)
- Hooks (already have needed functionality)
- Types (no new types needed)

## Testing Strategy

### Manual Testing Checklist
1. Start training a gathering skill (Woodcutting)
   - Verify component appears
   - Verify "Materials: ∞" shows (no requirements)
   - Verify time to next level is calculated
   - Verify progress bar animates
   - Verify stop button works

2. Start training a production skill (Cooking)
   - Verify component appears
   - Verify time until out of materials shows real time
   - Verify countdown decreases as resources deplete
   - Verify component updates when resources run out

3. Navigate between screens while training
   - Verify component stays visible
   - Verify data remains consistent

4. Test edge cases
   - Level 99 (should show "Max Level")
   - Zero resources (should show "0s" for materials)
   - Very long times (should format correctly as hours/days)

### Unit Testing (Optional - Future Work)
- Test `calculateTimeToNextLevel` with various XP values
- Test `calculateTimeUntilOutOfMaterials` with various inventories
- Test component renders correctly with different data

## Dependencies

All dependencies are already in the project:
- React Native core components
- Zustand (already in use)
- Existing utility functions
- Existing type definitions

## Risk Assessment

**Low Risk**: This is a display-only component that:
- Doesn't modify game state (except stop button, which uses existing function)
- Uses existing, tested calculation methods
- Has minimal performance impact
- Can be easily disabled if issues arise

## Rollout Plan

1. Implement utilities and component
2. Test locally with various scenarios
3. Commit and push to feature branch
4. Request code review
5. Merge to main after approval

## Success Metrics

- Component renders without errors
- Calculations are accurate (verified manually)
- Performance remains at 60 FPS
- User feedback is positive (once deployed)
