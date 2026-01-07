# Implementation Tasks: Active Skill Training View

**Status**: Ready to Start  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Task Breakdown

### Task 1: Create Training Calculation Utilities
**File**: `src/utils/training-calculations.ts`

**Objective**: Implement helper functions for time-based calculations.

**Subtasks**:
- [ ] Create new file `src/utils/training-calculations.ts`
- [ ] Implement `calculateTimeToNextLevel` function
  - Import `totalXpForLevel` from `./xp`
  - Calculate XP needed for next level
  - Calculate number of actions needed
  - Return total time in milliseconds
- [ ] Implement `calculateTimeUntilOutOfMaterials` function
  - Handle case where no materials are required (return null)
  - Calculate actions possible with each required resource
  - Find minimum (bottleneck resource)
  - Return total time in milliseconds
- [ ] Add TypeScript type imports from `../types`
- [ ] Export both functions

**Acceptance Criteria**:
- Functions compile without TypeScript errors
- Functions handle edge cases (level 99, no resources, etc.)
- Functions return correct types

**Estimated Time**: 15 minutes

---

### Task 2: Create ActiveTrainingView Component
**File**: `src/components/ActiveTrainingView.tsx`

**Objective**: Build the main UI component for displaying active training status.

**Subtasks**:
- [ ] Create new file `src/components/ActiveTrainingView.tsx`
- [ ] Add necessary imports:
  - React, useMemo
  - React Native components (View, Text, TouchableOpacity, StyleSheet)
  - `useGameStore` from store
  - `useSkillTraining` hook
  - `getSkillById`, `getActivityById` from data
  - Utility functions from utils
  - Training calculation functions
- [ ] Implement component logic:
  - [ ] Check if training is active (return null if not)
  - [ ] Get active training from store
  - [ ] Get current activity details
  - [ ] Get current skill details
  - [ ] Get current skill state (level, XP)
  - [ ] Get inventory from store
  - [ ] Calculate progress percentage (using existing hook)
  - [ ] Calculate time to next level (useMemo)
  - [ ] Calculate time until out of materials (useMemo)
- [ ] Implement UI structure:
  - [ ] Container view with conditional rendering
  - [ ] Row 1: Skill icon + skill name + activity name
  - [ ] Row 2: Level and XP display
  - [ ] Row 3: Progress bar with percentage
  - [ ] Row 4: Time estimates + stop button
- [ ] Implement styling:
  - [ ] Container styles (background, padding, shadow)
  - [ ] Text styles (various sizes and weights)
  - [ ] Progress bar styles
  - [ ] Button styles
  - [ ] Layout styles (flexbox)
- [ ] Add stop training handler

**Acceptance Criteria**:
- Component compiles without errors
- Component returns null when not training
- All data displays correctly formatted
- Progress bar animates smoothly
- Stop button calls correct store function
- Styles match existing design language

**Estimated Time**: 45 minutes

---

### Task 3: Integrate Component into App.tsx
**File**: `App.tsx`

**Objective**: Add ActiveTrainingView to the main app layout.

**Subtasks**:
- [ ] Import `ActiveTrainingView` component at top of file
- [ ] Add `<ActiveTrainingView />` in render tree
  - Position: After `appHeader` view
  - Position: Before main content (SkillTrainingView or welcome screen)
- [ ] Verify layout still works correctly

**Acceptance Criteria**:
- Import statement is correct
- Component renders in correct position
- No layout issues (overlapping, misalignment)
- App still compiles and runs

**Estimated Time**: 5 minutes

---

### Task 4: Manual Testing - Gathering Skills
**Objective**: Verify component works correctly with gathering skills (no material requirements).

**Test Steps**:
- [ ] Start the app
- [ ] Navigate to Woodcutting skill
- [ ] Start training on any activity
- [ ] Verify ActiveTrainingView appears at top
- [ ] Verify skill name and activity name are correct
- [ ] Verify level and XP are correct
- [ ] Verify progress bar animates
- [ ] Verify "Time Until Next Level" shows reasonable value
- [ ] Verify "Time Until Out of Materials" shows "∞" or "No limit"
- [ ] Click stop button and verify training stops
- [ ] Verify component disappears when training stops

**Acceptance Criteria**:
- All displayed information is accurate
- Progress bar animation is smooth
- Stop button works
- Component appears/disappears correctly

**Estimated Time**: 10 minutes

---

### Task 5: Manual Testing - Production Skills
**Objective**: Verify component works correctly with production skills (material requirements).

**Test Steps**:
- [ ] Gather some raw fish (e.g., 20 raw shrimp)
- [ ] Navigate to Cooking skill
- [ ] Start cooking raw shrimp
- [ ] Verify ActiveTrainingView shows material time countdown
- [ ] Watch as materials deplete
- [ ] Verify time countdown decreases
- [ ] Wait until out of materials
- [ ] Verify training stops when materials run out

**Acceptance Criteria**:
- Material time calculation is accurate
- Countdown updates as resources deplete
- Training stops when out of materials

**Estimated Time**: 15 minutes

---

### Task 6: Cross-Screen Testing
**Objective**: Verify component persists across screen navigation.

**Test Steps**:
- [ ] Start training a skill
- [ ] Navigate to different skill in sidebar
- [ ] Verify ActiveTrainingView still shows at top
- [ ] Verify data is still correct
- [ ] Return to home screen (deselect skill)
- [ ] Verify ActiveTrainingView still shows
- [ ] Stop training from any screen
- [ ] Verify component disappears

**Acceptance Criteria**:
- Component visible on all screens when training
- Data remains consistent across navigation
- Stop button works from any screen

**Estimated Time**: 10 minutes

---

### Task 7: Edge Case Testing
**Objective**: Test edge cases and unusual scenarios.

**Test Cases**:
- [ ] Test with level 99 skill (if achievable)
  - Should show "Max Level" or similar message
- [ ] Test with very high XP numbers
  - Should format correctly (k, m, b notation)
- [ ] Test with zero resources
  - Should show "0s" or "Out of materials"
- [ ] Test with exactly 1 action worth of resources
  - Should show correct remaining time
- [ ] Test very long times (>1 hour)
  - Should format as hours/minutes

**Acceptance Criteria**:
- All edge cases handled gracefully
- No crashes or errors
- Displayed information makes sense

**Estimated Time**: 15 minutes

---

### Task 8: Visual Polish & Responsive Testing
**Objective**: Ensure component looks good on different screen sizes.

**Test Steps**:
- [ ] Test on narrow screen (phone portrait)
- [ ] Test on wide screen (tablet landscape)
- [ ] Verify text doesn't overflow
- [ ] Verify progress bar scales correctly
- [ ] Verify all information is readable
- [ ] Adjust styles if needed

**Acceptance Criteria**:
- Component looks good on all screen sizes
- No text overflow or layout issues
- Maintains consistent spacing

**Estimated Time**: 10 minutes

---

### Task 9: Performance Verification
**Objective**: Ensure component doesn't degrade performance.

**Test Steps**:
- [ ] Start training
- [ ] Monitor app performance (should feel smooth)
- [ ] Watch for any frame drops or stuttering
- [ ] Check browser/React Native debugger for warnings
- [ ] Verify component re-renders are reasonable (not excessive)

**Acceptance Criteria**:
- App maintains smooth 60 FPS
- No excessive re-renders
- No performance warnings

**Estimated Time**: 5 minutes

---

### Task 10: Documentation & Cleanup
**Objective**: Update documentation and ensure code quality.

**Subtasks**:
- [ ] Add JSDoc comments to utility functions
- [ ] Add component documentation comment
- [ ] Update PROJECT_SUMMARY.md if needed
- [ ] Verify all code follows project style guidelines
- [ ] Remove any console.logs used for debugging
- [ ] Run linter and fix any issues

**Acceptance Criteria**:
- Code is well-documented
- No linting errors
- Documentation is updated

**Estimated Time**: 10 minutes

---

## Total Estimated Time
~2.5 hours

## Task Dependencies

```
Task 1 (Utilities)
  ↓
Task 2 (Component) ← Task 3 (Integration)
  ↓
Task 4, 5, 6, 7, 8 (Testing - can be done in parallel)
  ↓
Task 9 (Performance)
  ↓
Task 10 (Documentation)
```

## Implementation Order

1. Task 1: Create utilities (prerequisite for Task 2)
2. Task 2: Create component
3. Task 3: Integrate into App
4. Tasks 4-8: Testing (iterative, may require going back to Task 2 for fixes)
5. Task 9: Performance check
6. Task 10: Documentation and cleanup

## Risk Mitigation

- **Risk**: Time calculations might be incorrect
  - **Mitigation**: Test with known values manually first
  
- **Risk**: Component might cause performance issues
  - **Mitigation**: Use useMemo for calculations, test early
  
- **Risk**: Layout might break on some screens
  - **Mitigation**: Test on multiple screen sizes during development

## Success Criteria

All tasks completed with their acceptance criteria met:
- ✅ Utilities implemented and working
- ✅ Component renders correctly
- ✅ Integration successful
- ✅ All tests pass
- ✅ Performance is acceptable
- ✅ Documentation is complete
