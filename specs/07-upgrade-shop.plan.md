# Implementation Plan: Upgrade Shop

**Spec Reference**: [07-upgrade-shop.md](07-upgrade-shop.md)  
**Status**: Ready for Implementation  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This document outlines the technical implementation plan for the Upgrade Shop feature. The implementation follows a bottom-up approach: data structures → state management → UI components → integration.

## Architecture Decisions

### 1. State Management Strategy
- Use Zustand store for upgrade state (consistent with existing patterns)
- Store purchased upgrades as a Set for O(1) lookup performance
- Serialize to Array for AsyncStorage persistence
- Calculate upgrade effects on-the-fly during training actions

### 2. Data Organization
- Centralized upgrade definitions in `src/data/upgrades.ts`
- Each skill has 6-8 upgrades defined statically
- Effects applied via helper functions during training calculations
- No dynamic upgrade generation (all pre-defined)

### 3. UI Component Structure
- UpgradeShopScreen as container component
- UpgradeCard as reusable presentation component
- Tab-based navigation for skill filtering
- Local state for filter toggle (doesn't persist)

### 4. Effect Application
- Time reductions applied multiplicatively: `finalTime = baseTime * (1 - totalReduction)`
- Production increases applied additively: `finalProduction = baseProduction + totalBonus`
- Multiple upgrades for same activity stack
- Effects calculated every training action completion

## Implementation Phases

### Phase 1: Type Definitions and Data Structures

**Goal**: Define all TypeScript types and create upgrade data

**Files to Modify**:
- `src/types/index.ts`

**Files to Create**:
- `src/data/upgrades.ts`

**Tasks**:
1. Add `UpgradeEffectType` enum to types
2. Add `Upgrade` interface to types
3. Create upgrades data file with all 48 upgrades
4. Implement helper functions: `getUpgradeById`, `getUpgradesBySkill`, `getUpgradesForActivity`
5. Validate all upgrades have reasonable costs and level requirements

**Acceptance Criteria**:
- [ ] All type definitions compile without errors
- [ ] Upgrade data file exports 48 total upgrades
- [ ] Each skill has 6-8 upgrades
- [ ] Helper functions return correct results
- [ ] No TypeScript errors

**Estimated Time**: 2-3 hours

---

### Phase 2: State Management Integration

**Goal**: Add upgrade state to game store with purchase and effect calculation logic

**Files to Modify**:
- `src/store/gameStore.ts`
- `src/types/index.ts` (add to GameState)
- `src/utils/save.ts` (for serialization)

**Tasks**:
1. Add `purchasedUpgrades: Set<string>` to GameStore
2. Implement `purchaseUpgrade(upgradeId: string): boolean` action
3. Implement `hasUpgrade(upgradeId: string): boolean` getter
4. Implement `getPurchasedUpgrades(): string[]` getter
5. Implement `calculateTimeReduction(skillType, activityId): number` helper
6. Implement `calculateProductionBonus(skillType, activityId): number` helper
7. Add purchasedUpgrades to GameState interface
8. Update save/load logic to serialize Set to Array and back
9. Add validation in purchaseUpgrade (level, resources, not already owned)

**Acceptance Criteria**:
- [ ] Can purchase upgrade when requirements met
- [ ] Cannot purchase same upgrade twice
- [ ] Cannot purchase without sufficient resources
- [ ] Cannot purchase without required level
- [ ] Resources deducted on purchase
- [ ] Upgrades persist across save/load
- [ ] Effect calculation functions return correct values
- [ ] Multiple upgrades for same activity stack correctly

**Estimated Time**: 2-3 hours

---

### Phase 3: Apply Upgrade Effects to Training

**Goal**: Integrate upgrade effects into existing training action completion

**Files to Modify**:
- `src/store/gameStore.ts` (completeTrainingAction)
- `src/hooks/useGameLoop.ts` (if needed)

**Tasks**:
1. Calculate time reduction when starting training
2. Apply time reduction to activity duration
3. Calculate production bonus when completing action
4. Apply production bonus to activity products
5. Ensure upgrades affect both continuous training and one-off actions
6. Add toast notification on upgrade purchase
7. Test with multiple upgrades active

**Acceptance Criteria**:
- [ ] Time reduction upgrades reduce action duration
- [ ] Production upgrades increase items gained
- [ ] Effects apply immediately after purchase
- [ ] Effects persist across training sessions
- [ ] Stacking works correctly (multiple upgrades)
- [ ] Toast notification appears on purchase

**Estimated Time**: 2-3 hours

---

### Phase 4: Upgrade Card Component

**Goal**: Create reusable component for displaying individual upgrades

**Files to Create**:
- `src/components/UpgradeCard.tsx`

**Tasks**:
1. Create UpgradeCard component with props interface
2. Display upgrade icon, name, description
3. Show level requirement (with locked/unlocked indicator)
4. Show resource costs with icons and quantities
5. Display "Purchase" button or "Purchased" badge
6. Show if player can afford (green) or cannot (gray/red)
7. Disable button if requirements not met
8. Add onPress handler for purchase
9. Style card with consistent design language
10. Add accessibility labels

**Acceptance Criteria**:
- [ ] Card displays all upgrade information clearly
- [ ] Level requirement shows locked/unlocked status
- [ ] Resource costs show with proper icons
- [ ] Affordable upgrades highlighted in green
- [ ] Unaffordable upgrades grayed out
- [ ] Purchased upgrades show "Purchased" badge
- [ ] Button disabled when can't purchase
- [ ] Touch target meets 44x44 minimum
- [ ] Accessible to screen readers

**Estimated Time**: 2-3 hours

---

### Phase 5: Upgrade Shop Screen

**Goal**: Create main upgrade shop screen with tabs and filtering

**Files to Create**:
- `src/components/UpgradeShopScreen.tsx`

**Files to Modify**:
- `src/components/Sidebar.tsx` (add link)
- `App.tsx` (add navigation)

**Tasks**:
1. Create UpgradeShopScreen component
2. Add header with title and back button
3. Implement "Hide Purchased" toggle filter
4. Create skill tabs component (horizontal scroll)
5. Display upgrade count for each skill
6. Filter upgrades by selected skill
7. Apply "Hide Purchased" filter
8. Render list of UpgradeCards
9. Handle empty states (no upgrades, all purchased)
10. Add ScrollView for upgrade list
11. Handle upgrade purchase flow
12. Show success toast on purchase
13. Style screen consistently with app theme

**Acceptance Criteria**:
- [ ] Screen displays with proper header
- [ ] Back button navigates to previous screen
- [ ] Skill tabs show all 6 skills
- [ ] Tapping tab filters upgrades
- [ ] "Hide Purchased" toggle works correctly
- [ ] Upgrade count shown per skill (X/Y format)
- [ ] Empty states display appropriately
- [ ] Scrolling works smoothly
- [ ] Purchase flow works end-to-end
- [ ] Success toast appears on purchase

**Estimated Time**: 3-4 hours

---

### Phase 6: Sidebar and Navigation Integration

**Goal**: Add Upgrade Shop entry point in sidebar and wire up navigation

**Files to Modify**:
- `src/components/Sidebar.tsx`
- `App.tsx`

**Tasks**:
1. Add "Upgrade Shop" option to Sidebar under Player section
2. Show total upgrade count (purchased/total)
3. Add onSelectUpgradeShop prop and handler
4. Update App.tsx to manage upgradeShopOpen state
5. Render UpgradeShopScreen when upgradeShopOpen is true
6. Handle navigation between screens
7. Ensure state persists correctly when switching screens

**Acceptance Criteria**:
- [ ] "Upgrade Shop" appears in sidebar under Player
- [ ] Shows correct upgrade count (X/48)
- [ ] Clicking navigates to Upgrade Shop screen
- [ ] Back button returns to previous view
- [ ] Sidebar closes when navigating
- [ ] State maintained when switching screens

**Estimated Time**: 1-2 hours

---

### Phase 7: Testing and Polish

**Goal**: Comprehensive testing and UI polish

**Tasks**:
1. Test purchasing upgrades for all skills
2. Verify time reduction effects work correctly
3. Verify production increase effects work correctly
4. Test with multiple upgrades active
5. Test filter toggle in various states
6. Test with no resources (cannot purchase)
7. Test with low level (locked upgrades)
8. Test persistence (save, reload, verify upgrades still owned)
9. Test on web platform
10. Verify all animations smooth
11. Check accessibility with screen reader
12. Verify all touch targets meet minimum size
13. Test empty states
14. Optimize performance if needed

**Acceptance Criteria**:
- [ ] All upgrade purchases work correctly
- [ ] All upgrade effects apply correctly
- [ ] Filter works in all scenarios
- [ ] No crashes or errors
- [ ] Smooth performance on web
- [ ] Accessible to screen readers
- [ ] All visual polish complete
- [ ] No console warnings or errors

**Estimated Time**: 2-3 hours

---

## Technical Implementation Details

### Type Definitions

```typescript
// src/types/index.ts

export enum UpgradeEffectType {
  TIME_REDUCTION = 'time_reduction',
  PRODUCTION_INCREASE = 'production_increase',
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  skillType: SkillType;
  levelRequired: number;
  cost: ResourceRequirement[];
  effectType: UpgradeEffectType;
  effectValue: number;
  appliesToActivities: string[];
}

// Add to GameState
export interface GameState {
  // ... existing properties
  purchasedUpgrades: string[]; // For serialization
}
```

### Store Actions

```typescript
// src/store/gameStore.ts

purchaseUpgrade: (upgradeId: string): boolean => {
  const state = get();
  const upgrade = getUpgradeById(upgradeId);
  
  if (!upgrade) return false;
  
  // Validate not already purchased
  if (state.purchasedUpgrades.has(upgradeId)) return false;
  
  // Validate level requirement
  const skillLevel = state.getSkillLevel(upgrade.skillType);
  if (skillLevel < upgrade.levelRequired) return false;
  
  // Validate resources
  if (!state.hasResources(upgrade.cost)) return false;
  
  // Deduct resources
  upgrade.cost.forEach(req => {
    state.removeResource(req.resourceId, req.quantity);
  });
  
  // Mark as purchased
  set(state => ({
    purchasedUpgrades: new Set([...state.purchasedUpgrades, upgradeId])
  }));
  
  // Show toast
  state.addToast({
    type: ToastType.ITEM_GAIN,
    message: `Purchased ${upgrade.name}!`,
    icon: '⚡',
  });
  
  // Save game
  state.saveGame();
  
  return true;
},

calculateTimeReduction: (skillType: SkillType, activityId: string): number => {
  const state = get();
  const upgrades = getUpgradesForActivity(skillType, activityId);
  
  let totalReduction = 0;
  upgrades.forEach(upgrade => {
    if (
      upgrade.effectType === UpgradeEffectType.TIME_REDUCTION &&
      state.purchasedUpgrades.has(upgrade.id)
    ) {
      totalReduction += upgrade.effectValue;
    }
  });
  
  return Math.min(totalReduction, 0.75); // Cap at 75% reduction
},

calculateProductionBonus: (skillType: SkillType, activityId: string): number => {
  const state = get();
  const upgrades = getUpgradesForActivity(skillType, activityId);
  
  let totalBonus = 0;
  upgrades.forEach(upgrade => {
    if (
      upgrade.effectType === UpgradeEffectType.PRODUCTION_INCREASE &&
      state.purchasedUpgrades.has(upgrade.id)
    ) {
      totalBonus += upgrade.effectValue;
    }
  });
  
  return totalBonus;
},
```

### Effect Application

```typescript
// In completeTrainingAction or startTraining

// Get base values
const baseTime = activity.durationMs;
const baseProducts = activity.products;

// Calculate and apply time reduction
const timeReduction = get().calculateTimeReduction(skillType, activity.id);
const actualTime = baseTime * (1 - timeReduction);

// Calculate and apply production bonus
const productionBonus = get().calculateProductionBonus(skillType, activity.id);
const actualProducts = baseProducts.map(p => ({
  ...p,
  quantity: p.quantity + productionBonus,
}));
```

### Component Structure

```typescript
// UpgradeShopScreen.tsx

interface UpgradeShopScreenProps {
  onClose: () => void;
}

export const UpgradeShopScreen: React.FC<UpgradeShopScreenProps> = ({ onClose }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillType>(SkillType.WOODCUTTING);
  const [hidePurchased, setHidePurchased] = useState(false);
  
  const skillLevel = useGameStore(state => state.getSkillLevel(selectedSkill));
  const purchasedUpgrades = useGameStore(state => state.purchasedUpgrades);
  const purchaseUpgrade = useGameStore(state => state.purchaseUpgrade);
  
  const allUpgrades = getUpgradesBySkill(selectedSkill);
  const displayedUpgrades = useMemo(() => {
    return allUpgrades.filter(upgrade => {
      if (hidePurchased && purchasedUpgrades.has(upgrade.id)) {
        return false;
      }
      return true;
    });
  }, [allUpgrades, hidePurchased, purchasedUpgrades]);
  
  // ... render logic
};
```

## Dependencies

### External
- None (all existing dependencies sufficient)

### Internal
- Core game system (implemented)
- Inventory system (implemented)
- Skill system (implemented)
- Resource data (implemented)
- Toast notifications (implemented)
- Sidebar navigation (implemented)

## Risk Assessment

### Low Risk
- Type definitions - straightforward additions
- Data creation - static data, no complex logic
- UI components - similar to existing patterns

### Medium Risk
- State management - need to ensure Set serialization works correctly
- Effect calculations - must handle edge cases (multiple upgrades, stacking)
- Purchase validation - multiple conditions to check

### High Risk
- None identified

### Mitigation Strategies
- Test save/load with upgrades extensively
- Write unit tests for effect calculation functions
- Manual testing of all purchase scenarios
- Validate upgrade costs against available resources in game

## Testing Strategy

### Unit Tests
- Upgrade data helper functions
- Purchase validation logic
- Effect calculation functions
- Set to Array serialization

### Integration Tests
- Purchase flow end-to-end
- Effect application during training
- Filter functionality
- Save/load with upgrades

### Manual Tests
- Purchase all 48 upgrades
- Verify effects for each upgrade
- Test with multiple upgrades active
- Test persistence across sessions
- Test on web platform
- Accessibility testing

## Performance Considerations

- Use Set for O(1) upgrade ownership lookup
- Memoize displayed upgrades list
- Optimize effect calculations (called every action)
- Consider caching effect values if needed
- Ensure smooth scrolling with many upgrades

## Accessibility Requirements

- All buttons have accessible labels
- Upgrade cards readable by screen readers
- Color contrast meets WCAG AA
- Touch targets minimum 44x44
- Keyboard navigation on web

## Documentation Updates

Files to update:
- README.md (mention upgrade shop feature)
- PROJECT_SUMMARY.md (add to features list)

## Rollout Plan

1. Create specification (this document)
2. Implement Phase 1-7 in order
3. Test thoroughly on web platform
4. Deploy to staging
5. Final testing
6. Deploy to production
7. Monitor for issues

## Success Metrics

- All 48 upgrades purchasable
- Effects apply correctly 100% of the time
- No crashes or errors
- Smooth UI performance
- Positive user feedback
- Increased player engagement with resource collection

## Timeline Estimate

- Phase 1: 2-3 hours
- Phase 2: 2-3 hours
- Phase 3: 2-3 hours
- Phase 4: 2-3 hours
- Phase 5: 3-4 hours
- Phase 6: 1-2 hours
- Phase 7: 2-3 hours

**Total**: 14-21 hours of development time

## Next Steps

1. Review and approve this plan
2. Create task breakdown document
3. Begin Phase 1 implementation
4. Proceed phase by phase with testing
5. Deploy and monitor
