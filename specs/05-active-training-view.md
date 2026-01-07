# Spec: Active Skill Training View

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

The Active Skill Training View is a persistent header component that displays at the top of the application whenever a player is actively training a skill. It provides at-a-glance information about the current training session, including progress, estimated times, and resource availability.

This feature enhances the player experience by:
- Providing constant visibility of training status regardless of which screen the player is on
- Showing predictive information (time to next level, time until materials run out)
- Offering quick access to training controls

## Requirements

### Functional Requirements

1. **Display Condition**: The active training view MUST be visible only when `activeTraining` state is not null
2. **Position**: The component MUST be displayed at the top of the screen, below the app header but above all other content
3. **Current Skill Training**: Display the skill name and current training activity name
4. **Current Level**: Display the current skill level
5. **Current XP**: Display current XP with formatted numbers (k, m, b notation)
6. **Progress Bar**: Visual progress bar showing completion of current training action
7. **Time Until Next Level**: Calculate and display estimated time to reach next level based on current training activity
8. **Time Until Out of Materials**: For production skills, calculate and display how long the player can continue training before running out of required resources
9. **Compact Design**: The view should be space-efficient to not obscure too much content
10. **Quick Stop**: Provide a button to stop the current training session

### Non-Functional Requirements

1. **Performance**: Updates should not cause noticeable performance degradation
2. **Responsive**: Should adapt to different screen widths
3. **Visual Consistency**: Should match the existing design language of the app
4. **Accessibility**: All text should be readable with appropriate contrast ratios

## Technical Design

### Component Structure

```typescript
interface ActiveTrainingViewProps {
  // No props needed - pulls directly from store
}

export const ActiveTrainingView: React.FC<ActiveTrainingViewProps> = () => {
  // Implementation
};
```

### Data Requirements

The component needs access to:
- `activeTraining` from game store
- Current skill state (level, XP)
- Current activity details
- Inventory (for material calculations)
- Game loop time for progress updates

### Calculation Algorithms

#### Time Until Next Level

```typescript
// Pseudo-code
function calculateTimeToNextLevel(
  currentXp: number,
  currentLevel: number,
  activityXp: number,
  activityDuration: number
): number {
  const xpNeeded = totalXpForLevel(currentLevel + 1) - currentXp;
  const actionsNeeded = Math.ceil(xpNeeded / activityXp);
  const timeMs = actionsNeeded * activityDuration;
  return timeMs;
}
```

#### Time Until Out of Materials

```typescript
// Pseudo-code
function calculateTimeUntilOutOfMaterials(
  requirements: ResourceRequirement[],
  inventory: Record<string, number>,
  activityDuration: number
): number | null {
  if (requirements.length === 0) {
    return null; // Infinite (no materials needed)
  }
  
  const actionsUntilDepleted = requirements.map(req => {
    const available = inventory[req.resourceId] || 0;
    return Math.floor(available / req.quantity);
  });
  
  const minActions = Math.min(...actionsUntilDepleted);
  return minActions * activityDuration;
}
```

### UI Layout

```
┌─────────────────────────────────────────────┐
│ 🪓 Woodcutting - Chopping Yew Trees         │
│ Level 72 | 1.2m XP                          │
│ ████████████░░░░░░░░░░ 60%                  │
│ ⏱️ Next Level: 2h 15m | Materials: 45m  [■] │
└─────────────────────────────────────────────┘
```

Components:
1. **Line 1**: Skill icon + Skill name + Activity name
2. **Line 2**: Level + XP (formatted)
3. **Line 3**: Progress bar showing current action progress
4. **Line 4**: Time estimates + Stop button

### Integration Points

The component will be added to `App.tsx` directly below the app header:

```typescript
// In App.tsx
<View style={styles.mainContainer}>
  <View style={styles.appHeader}>
    {/* Existing header content */}
  </View>
  
  {/* NEW: Active Training View */}
  <ActiveTrainingView />
  
  {/* Existing content */}
  {selectedSkill ? (
    <SkillTrainingView skillType={selectedSkill} />
  ) : (
    // ... existing home content
  )}
</View>
```

## Data Structures

No new types needed. Uses existing:
- `ActiveTraining` from types
- `Activity` from types
- `SkillState` from types

## Dependencies

- Existing `useGameStore` hook
- Existing `useSkillTraining` hook
- Existing `formatNumber` and `formatDuration` utilities from `src/utils/xp.ts`
- Existing `getActivityById` from `src/data`

## Acceptance Criteria

- [ ] Component is visible when actively training a skill
- [ ] Component is hidden when not training
- [ ] Displays correct skill name and activity name
- [ ] Displays current level and XP with proper formatting
- [ ] Shows progress bar that updates in real-time
- [ ] Calculates and displays time until next level
- [ ] Calculates and displays time until out of materials (or "∞" for gathering)
- [ ] Stop button successfully stops training
- [ ] Component positioning is correct (below header, above content)
- [ ] Component is responsive to different screen sizes
- [ ] Performance remains smooth (60 FPS) with component active

## Future Enhancements

- Expandable/collapsible view for more details
- Training history/statistics
- Tap to navigate to skill training screen
- Visual notification when level up is imminent
- Sound/haptic feedback on completion
- Multi-skill training queue display
- Offline progress calculator
