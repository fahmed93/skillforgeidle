# Task Breakdown: Upgrade Shop

**Spec Reference**: [07-upgrade-shop.md](07-upgrade-shop.md)  
**Plan Reference**: [07-upgrade-shop.plan.md](07-upgrade-shop.plan.md)  
**Status**: Ready for Implementation  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This document breaks down the Upgrade Shop implementation into granular, actionable tasks. Each task is designed to be completed independently and tested before moving to the next.

---

## Phase 1: Type Definitions and Data Structures

### Task 1.1: Add Upgrade Types to Type Definitions
**File**: `src/types/index.ts`

**Subtasks**:
- [ ] Add `UpgradeEffectType` enum with TIME_REDUCTION and PRODUCTION_INCREASE
- [ ] Add `Upgrade` interface with all required fields
- [ ] Export new types
- [ ] Run TypeScript compiler to verify no errors

**Acceptance Criteria**:
- Types compile without errors
- Enum and interface match specification

**Estimated Time**: 15 minutes

---

### Task 1.2: Update GameState Interface
**File**: `src/types/index.ts`

**Subtasks**:
- [ ] Add `purchasedUpgrades: string[]` to GameState interface
- [ ] Add JSDoc comment explaining it's for serialization
- [ ] Verify no breaking changes to existing code

**Acceptance Criteria**:
- GameState interface updated
- No TypeScript errors

**Estimated Time**: 10 minutes

---

### Task 1.3: Create Woodcutting Upgrades
**File**: `src/data/upgrades.ts` (new file)

**Subtasks**:
- [ ] Create new file `src/data/upgrades.ts`
- [ ] Import required types
- [ ] Define woodcuttingUpgrades array with 8 upgrades
- [ ] Verify upgrade IDs are unique
- [ ] Verify costs use existing resource IDs
- [ ] Check level requirements are reasonable

**Upgrades to Create**:
1. Basic Axe Mastery (Level 1)
2. Oak Efficiency (Level 20)
3. Willow Swiftness (Level 35)
4. Forest Bounty (Level 40)
5. Maple Mastery (Level 50)
6. Yew Precision (Level 65)
7. Magic Attunement (Level 80)
8. Ancient Knowledge (Level 95)

**Acceptance Criteria**:
- 8 woodcutting upgrades defined
- All have valid resource IDs
- Level requirements progress logically
- Mix of time reduction and production increase

**Estimated Time**: 45 minutes

---

### Task 1.4: Create Mining Upgrades
**File**: `src/data/upgrades.ts`

**Subtasks**:
- [ ] Define miningUpgrades array with 8 upgrades
- [ ] Verify all upgrade IDs unique globally
- [ ] Verify costs use existing mining resource IDs

**Upgrades to Create**:
1. Basic Pickaxe Technique (Level 1)
2. Iron Focus (Level 20)
3. Coal Abundance (Level 35)
4. Precious Metal Finder (Level 45)
5. Mithril Mastery (Level 60)
6. Adamantite Excellence (Level 75)
7. Runite Discovery (Level 88)
8. Master Miner (Level 92)

**Acceptance Criteria**:
- 8 mining upgrades defined
- No duplicate IDs
- Valid resource references

**Estimated Time**: 30 minutes

---

### Task 1.5: Create Fishing Upgrades
**File**: `src/data/upgrades.ts`

**Subtasks**:
- [ ] Define fishingUpgrades array with 7 upgrades
- [ ] Verify all upgrade IDs unique globally

**Upgrades to Create**:
1. Shrimp Net Efficiency (Level 1)
2. Coastal Expertise (Level 15)
3. River Mastery (Level 25)
4. Deep Sea Knowledge (Level 45)
5. Swordfish Hunter (Level 60)
6. Shark Tamer (Level 80)
7. Bountiful Waters (Level 85)

**Acceptance Criteria**:
- 7 fishing upgrades defined
- Valid resource references

**Estimated Time**: 30 minutes

---

### Task 1.6: Create Cooking Upgrades
**File**: `src/data/upgrades.ts`

**Subtasks**:
- [ ] Define cookingUpgrades array with 6 upgrades
- [ ] Verify all upgrade IDs unique globally

**Upgrades to Create**:
1. Fire Control (Level 1)
2. Seasoned Chef (Level 25)
3. Master Chef (Level 50)
4. Bulk Cooking I (Level 35)
5. Bulk Cooking II (Level 65)
6. Perfect Technique (Level 90)

**Acceptance Criteria**:
- 6 cooking upgrades defined
- Valid resource references

**Estimated Time**: 25 minutes

---

### Task 1.7: Create Smithing Upgrades
**File**: `src/data/upgrades.ts`

**Subtasks**:
- [ ] Define smithingUpgrades array with 8 upgrades
- [ ] Verify all upgrade IDs unique globally

**Upgrades to Create**:
1. Bronze Efficiency (Level 1)
2. Iron Mastery (Level 18)
3. Steel Production (Level 35)
4. Gold Standard (Level 45)
5. Mithril Forge (Level 58)
6. Adamantite Smithing (Level 73)
7. Runite Forging (Level 88)
8. Efficient Smelting (Level 92)

**Acceptance Criteria**:
- 8 smithing upgrades defined
- Valid resource references

**Estimated Time**: 30 minutes

---

### Task 1.8: Create Crafting Upgrades
**File**: `src/data/upgrades.ts`

**Subtasks**:
- [ ] Define craftingUpgrades array with 7 upgrades
- [ ] Verify all upgrade IDs unique globally

**Upgrades to Create**:
1. Basic Craftsmanship (Level 1)
2. Leather Working (Level 20)
3. Jewelry Precision (Level 40)
4. Gem Cutting (Level 50)
5. Advanced Crafting (Level 65)
6. Mass Production (Level 75)
7. Master Artisan (Level 92)

**Acceptance Criteria**:
- 7 crafting upgrades defined
- Valid resource references

**Estimated Time**: 30 minutes

---

### Task 1.9: Create Upgrade Helper Functions
**File**: `src/data/upgrades.ts`

**Subtasks**:
- [ ] Export ALL_UPGRADES array (concatenate all skill upgrades)
- [ ] Implement `getUpgradeById(id: string): Upgrade | undefined`
- [ ] Implement `getUpgradesBySkill(skillType: SkillType): Upgrade[]`
- [ ] Implement `getUpgradesForActivity(skillType: SkillType, activityId: string): Upgrade[]`
- [ ] Add JSDoc comments to all functions
- [ ] Verify total is 48 upgrades

**Acceptance Criteria**:
- All helper functions work correctly
- Total of 48 upgrades in ALL_UPGRADES
- Functions return correct results
- No TypeScript errors

**Estimated Time**: 30 minutes

---

## Phase 2: State Management Integration

### Task 2.1: Add Upgrade State to GameStore
**File**: `src/store/gameStore.ts`

**Subtasks**:
- [ ] Add `purchasedUpgrades: Set<string>` to GameStore interface
- [ ] Initialize purchasedUpgrades as empty Set in initial state
- [ ] Update createInitialGameState to include empty Set

**Acceptance Criteria**:
- purchasedUpgrades added to store
- Initialized as empty Set
- No TypeScript errors

**Estimated Time**: 15 minutes

---

### Task 2.2: Implement hasUpgrade Getter
**File**: `src/store/gameStore.ts`

**Subtasks**:
- [ ] Add `hasUpgrade: (upgradeId: string) => boolean` to interface
- [ ] Implement function using Set.has()
- [ ] Add JSDoc comment

**Acceptance Criteria**:
- Function returns true if upgrade owned
- Function returns false if not owned
- No errors

**Estimated Time**: 10 minutes

---

### Task 2.3: Implement getPurchasedUpgrades Getter
**File**: `src/store/gameStore.ts`

**Subtasks**:
- [ ] Add `getPurchasedUpgrades: () => string[]` to interface
- [ ] Implement function using Array.from()
- [ ] Add JSDoc comment

**Acceptance Criteria**:
- Function returns array of upgrade IDs
- Works with empty Set
- No errors

**Estimated Time**: 10 minutes

---

### Task 2.4: Implement purchaseUpgrade Action
**File**: `src/store/gameStore.ts`

**Subtasks**:
- [ ] Add `purchaseUpgrade: (upgradeId: string) => boolean` to interface
- [ ] Get upgrade data using getUpgradeById
- [ ] Validate upgrade exists
- [ ] Validate not already purchased
- [ ] Validate player level meets requirement
- [ ] Validate player has sufficient resources
- [ ] Deduct resources using removeResource
- [ ] Add upgrade to purchasedUpgrades Set
- [ ] Show success toast notification
- [ ] Call saveGame()
- [ ] Return true on success, false on failure
- [ ] Add error handling and logging

**Acceptance Criteria**:
- All validations work correctly
- Resources deducted on purchase
- Upgrade added to Set
- Toast shown on success
- Game saved after purchase
- Returns appropriate boolean
- Cannot purchase same upgrade twice

**Estimated Time**: 45 minutes

---

### Task 2.5: Implement calculateTimeReduction Helper
**File**: `src/store/gameStore.ts`

**Subtasks**:
- [ ] Add `calculateTimeReduction: (skillType: SkillType, activityId: string) => number` to interface
- [ ] Get all upgrades for activity using getUpgradesForActivity
- [ ] Filter for TIME_REDUCTION upgrades that are owned
- [ ] Sum up all effectValue numbers
- [ ] Cap total reduction at 0.75 (75%)
- [ ] Return final reduction value
- [ ] Add JSDoc comment with examples

**Acceptance Criteria**:
- Returns 0 when no upgrades owned
- Returns correct sum of reductions
- Caps at 0.75
- Handles multiple upgrades
- No errors

**Estimated Time**: 30 minutes

---

### Task 2.6: Implement calculateProductionBonus Helper
**File**: `src/store/gameStore.ts`

**Subtasks**:
- [ ] Add `calculateProductionBonus: (skillType: SkillType, activityId: string) => number` to interface
- [ ] Get all upgrades for activity using getUpgradesForActivity
- [ ] Filter for PRODUCTION_INCREASE upgrades that are owned
- [ ] Sum up all effectValue numbers
- [ ] Return final bonus value
- [ ] Add JSDoc comment with examples

**Acceptance Criteria**:
- Returns 0 when no upgrades owned
- Returns correct sum of bonuses
- Handles multiple upgrades
- No errors

**Estimated Time**: 25 minutes

---

### Task 2.7: Update Save/Load for Upgrades
**File**: `src/utils/save.ts` or `src/store/gameStore.ts`

**Subtasks**:
- [ ] In saveGame: Convert Set to Array before serializing
- [ ] In loadGame: Convert Array to Set after deserializing
- [ ] Handle case where purchasedUpgrades is undefined (old saves)
- [ ] Test save and load cycle

**Acceptance Criteria**:
- Upgrades persist across save/load
- Old saves without upgrades load correctly
- Set conversion works both ways
- No data loss

**Estimated Time**: 30 minutes

---

## Phase 3: Apply Upgrade Effects to Training

### Task 3.1: Apply Time Reduction to Training Duration
**File**: `src/store/gameStore.ts` (in startTraining or completeTrainingAction)

**Subtasks**:
- [ ] Find where training duration is set
- [ ] Calculate time reduction using calculateTimeReduction
- [ ] Apply reduction: `finalTime = baseTime * (1 - reduction)`
- [ ] Ensure reduced time used for training
- [ ] Test with no upgrades (should be normal)
- [ ] Test with one upgrade (should reduce)
- [ ] Test with multiple upgrades (should stack)

**Acceptance Criteria**:
- Time reduction applies immediately
- Multiple upgrades stack correctly
- Training completes in reduced time
- No negative times possible

**Estimated Time**: 45 minutes

---

### Task 3.2: Apply Production Bonus to Items Gained
**File**: `src/store/gameStore.ts` (in completeTrainingAction)

**Subtasks**:
- [ ] Find where products are added to inventory
- [ ] Calculate production bonus using calculateProductionBonus
- [ ] Apply bonus: `finalQuantity = baseQuantity + bonus`
- [ ] Update inventory with increased quantity
- [ ] Update toast message with correct quantity
- [ ] Test with no upgrades (should be normal)
- [ ] Test with one upgrade (should increase)
- [ ] Test with multiple upgrades (should stack)

**Acceptance Criteria**:
- Production bonus applies immediately
- Multiple upgrades stack correctly
- Correct quantity added to inventory
- Toast shows correct quantity
- Works for all resources

**Estimated Time**: 45 minutes

---

### Task 3.3: Test Upgrade Effects Integration
**File**: Manual testing

**Subtasks**:
- [ ] Start game with no upgrades
- [ ] Train an activity, record time and items
- [ ] Purchase a time reduction upgrade
- [ ] Train same activity, verify time reduced
- [ ] Purchase a production upgrade
- [ ] Train same activity, verify items increased
- [ ] Purchase multiple upgrades for same activity
- [ ] Verify effects stack correctly
- [ ] Save game, reload, verify effects persist

**Acceptance Criteria**:
- All upgrade types work correctly
- Effects visible in gameplay
- No bugs or crashes
- Effects persist

**Estimated Time**: 30 minutes

---

## Phase 4: Upgrade Card Component

### Task 4.1: Create UpgradeCard Component File
**File**: `src/components/UpgradeCard.tsx` (new file)

**Subtasks**:
- [ ] Create new file
- [ ] Add imports (React, React Native components, types)
- [ ] Define UpgradeCardProps interface
- [ ] Create functional component skeleton
- [ ] Export component

**Props Needed**:
- upgrade: Upgrade
- isPurchased: boolean
- canAfford: boolean
- meetsLevelReq: boolean
- onPurchase: () => void

**Acceptance Criteria**:
- File created
- Component compiles
- Props interface defined

**Estimated Time**: 15 minutes

---

### Task 4.2: Implement UpgradeCard Layout
**File**: `src/components/UpgradeCard.tsx`

**Subtasks**:
- [ ] Create card container View
- [ ] Add upgrade icon Text
- [ ] Add upgrade name Text
- [ ] Add upgrade description Text
- [ ] Add level requirement section
- [ ] Add resource cost section
- [ ] Add purchase button or purchased badge
- [ ] Create base styles

**Acceptance Criteria**:
- All elements visible
- Layout logical and clear
- Matches design spec

**Estimated Time**: 45 minutes

---

### Task 4.3: Implement Level Requirement Display
**File**: `src/components/UpgradeCard.tsx`

**Subtasks**:
- [ ] Show level requirement text
- [ ] Add locked icon if not met (🔒)
- [ ] Add unlocked icon if met (✅)
- [ ] Style differently based on met/not met
- [ ] Add conditional styling

**Acceptance Criteria**:
- Shows "Level X required"
- Visual indicator of locked/unlocked
- Clear color coding

**Estimated Time**: 20 minutes

---

### Task 4.4: Implement Resource Cost Display
**File**: `src/components/UpgradeCard.tsx`

**Subtasks**:
- [ ] Map over upgrade.cost array
- [ ] For each cost, show resource icon and quantity
- [ ] Get resource data using getResourceById
- [ ] Show in affordable green or unaffordable red
- [ ] Handle multiple resources (vertical stack or horizontal)

**Acceptance Criteria**:
- All resources shown with icons
- Quantities correct
- Color coding for affordability
- Clean layout

**Estimated Time**: 30 minutes

---

### Task 4.5: Implement Purchase Button
**File**: `src/components/UpgradeCard.tsx`

**Subtasks**:
- [ ] Add TouchableOpacity button
- [ ] Show "Purchase" text when available
- [ ] Show "Purchased" badge when owned
- [ ] Disable button when cannot purchase
- [ ] Add disabled styling
- [ ] Wire up onPurchase handler
- [ ] Add touch feedback

**Acceptance Criteria**:
- Button shows correct text
- Disabled when requirements not met
- Calls onPurchase when pressed
- Visual feedback on press
- 44x44 minimum touch target

**Estimated Time**: 25 minutes

---

### Task 4.6: Style UpgradeCard
**File**: `src/components/UpgradeCard.tsx`

**Subtasks**:
- [ ] Create StyleSheet
- [ ] Style card container (padding, margin, shadow)
- [ ] Style icon (size, position)
- [ ] Style text elements (sizes, weights, colors)
- [ ] Style button (colors, disabled state)
- [ ] Add responsive width
- [ ] Ensure consistent with app theme
- [ ] Test on different screen sizes

**Acceptance Criteria**:
- Card looks polished
- Consistent with app design
- Readable on all screen sizes
- Good contrast ratios

**Estimated Time**: 45 minutes

---

### Task 4.7: Add Accessibility to UpgradeCard
**File**: `src/components/UpgradeCard.tsx`

**Subtasks**:
- [ ] Add accessibilityLabel to card
- [ ] Add accessibilityHint for button
- [ ] Add accessibilityRole="button" to button
- [ ] Test with screen reader
- [ ] Ensure all text readable

**Acceptance Criteria**:
- Screen reader can read all info
- Button announced correctly
- Hint helpful

**Estimated Time**: 20 minutes

---

## Phase 5: Upgrade Shop Screen

### Task 5.1: Create UpgradeShopScreen Component File
**File**: `src/components/UpgradeShopScreen.tsx` (new file)

**Subtasks**:
- [ ] Create new file
- [ ] Add imports
- [ ] Define UpgradeShopScreenProps interface
- [ ] Create functional component skeleton
- [ ] Export component

**Props Needed**:
- onClose: () => void

**Acceptance Criteria**:
- File created
- Component compiles

**Estimated Time**: 15 minutes

---

### Task 5.2: Implement Screen Header
**File**: `src/components/UpgradeShopScreen.tsx`

**Subtasks**:
- [ ] Create header View
- [ ] Add back button
- [ ] Add title "⚡ Upgrade Shop"
- [ ] Add subtitle showing X/Y purchased
- [ ] Wire up onClose to back button
- [ ] Style header

**Acceptance Criteria**:
- Header displays correctly
- Back button works
- Count shows accurately
- Styled consistently

**Estimated Time**: 30 minutes

---

### Task 5.3: Implement Hide Purchased Filter
**File**: `src/components/UpgradeShopScreen.tsx`

**Subtasks**:
- [ ] Add state: `const [hidePurchased, setHidePurchased] = useState(false)`
- [ ] Create toggle switch or button
- [ ] Add label "Hide Purchased"
- [ ] Wire up toggle to state
- [ ] Style toggle area

**Acceptance Criteria**:
- Toggle works smoothly
- State updates correctly
- Clear label
- Good UX

**Estimated Time**: 25 minutes

---

### Task 5.4: Implement Skill Tabs
**File**: `src/components/UpgradeShopScreen.tsx`

**Subtasks**:
- [ ] Add state: `const [selectedSkill, setSelectedSkill] = useState(SkillType.WOODCUTTING)`
- [ ] Create horizontal ScrollView
- [ ] Map over all 6 skills
- [ ] Create tab button for each skill
- [ ] Show skill icon and name
- [ ] Show upgrade count (X/Y format)
- [ ] Highlight active tab
- [ ] Wire up tab selection
- [ ] Style tabs

**Acceptance Criteria**:
- All 6 skills shown
- Can select any skill
- Active tab highlighted
- Scrollable if needed
- Upgrade counts accurate

**Estimated Time**: 45 minutes

---

### Task 5.5: Implement Upgrade Filtering Logic
**File**: `src/components/UpgradeShopScreen.tsx`

**Subtasks**:
- [ ] Get all upgrades for selected skill using getUpgradesBySkill
- [ ] Get purchasedUpgrades from store
- [ ] Use useMemo to filter upgrades
- [ ] Apply hidePurchased filter
- [ ] Sort by level requirement (ascending)
- [ ] Return filtered array

**Acceptance Criteria**:
- Filtering works correctly
- Updates when skill changes
- Updates when hidePurchased toggles
- Efficient (uses useMemo)

**Estimated Time**: 30 minutes

---

### Task 5.6: Implement Upgrade List
**File**: `src/components/UpgradeShopScreen.tsx`

**Subtasks**:
- [ ] Create ScrollView for list
- [ ] Map over filtered upgrades
- [ ] Render UpgradeCard for each
- [ ] Pass correct props to UpgradeCard
- [ ] Calculate isPurchased
- [ ] Calculate canAfford
- [ ] Calculate meetsLevelReq
- [ ] Wire up purchase handler
- [ ] Add padding/spacing

**Acceptance Criteria**:
- All upgrades displayed
- Cards show correct state
- Scrolling smooth
- Purchase works

**Estimated Time**: 45 minutes

---

### Task 5.7: Implement Empty States
**File**: `src/components/UpgradeShopScreen.tsx`

**Subtasks**:
- [ ] Check if displayedUpgrades is empty
- [ ] Show different message based on reason:
  - "No upgrades available yet" if level too low
  - "All upgrades purchased!" if all owned
  - "No upgrades available" if filtered out
- [ ] Style empty state
- [ ] Add helpful icon

**Acceptance Criteria**:
- Appropriate message shown
- Clear and helpful
- Well styled

**Estimated Time**: 25 minutes

---

### Task 5.8: Implement Purchase Flow
**File**: `src/components/UpgradeShopScreen.tsx`

**Subtasks**:
- [ ] Get purchaseUpgrade from store
- [ ] Create handlePurchase function
- [ ] Call store action
- [ ] Handle success/failure
- [ ] Pass handler to UpgradeCards

**Acceptance Criteria**:
- Purchase triggers correctly
- UI updates immediately
- Toast appears
- No errors

**Estimated Time**: 20 minutes

---

### Task 5.9: Style UpgradeShopScreen
**File**: `src/components/UpgradeShopScreen.tsx`

**Subtasks**:
- [ ] Create StyleSheet
- [ ] Style all sections
- [ ] Ensure responsive layout
- [ ] Test on various screen sizes
- [ ] Match app theme

**Acceptance Criteria**:
- Screen looks polished
- Consistent design
- Works on all sizes

**Estimated Time**: 45 minutes

---

## Phase 6: Sidebar and Navigation Integration

### Task 6.1: Add Upgrade Shop to Sidebar
**File**: `src/components/Sidebar.tsx`

**Subtasks**:
- [ ] Add onSelectUpgradeShop to props
- [ ] Add upgradeShopSelected to props
- [ ] Calculate total upgrade count
- [ ] Add "Upgrade Shop" item under Player section
- [ ] Show count (X/48)
- [ ] Wire up selection
- [ ] Add selection styling

**Acceptance Criteria**:
- "Upgrade Shop" visible in sidebar
- Shows correct count
- Clicking navigates
- Styled consistently

**Estimated Time**: 30 minutes

---

### Task 6.2: Add Navigation to App.tsx
**File**: `App.tsx`

**Subtasks**:
- [ ] Add state: `const [upgradeShopOpen, setUpgradeShopOpen] = useState(false)`
- [ ] Create handleSelectUpgradeShop function
- [ ] Pass props to Sidebar
- [ ] Conditionally render UpgradeShopScreen
- [ ] Handle screen switching
- [ ] Ensure state maintained

**Acceptance Criteria**:
- Can navigate to Upgrade Shop
- Can navigate back
- State preserved
- No crashes

**Estimated Time**: 25 minutes

---

## Phase 7: Testing and Polish

### Task 7.1: Test All Woodcutting Upgrades
**Subtasks**:
- [ ] Purchase each woodcutting upgrade
- [ ] Verify cost deducted
- [ ] Verify effect applies
- [ ] Verify persists after save/load

**Estimated Time**: 20 minutes

---

### Task 7.2: Test All Mining Upgrades
**Subtasks**:
- [ ] Purchase each mining upgrade
- [ ] Verify effects
- [ ] Test multiple upgrades together

**Estimated Time**: 20 minutes

---

### Task 7.3: Test All Other Skills' Upgrades
**Subtasks**:
- [ ] Test Fishing upgrades
- [ ] Test Cooking upgrades
- [ ] Test Smithing upgrades
- [ ] Test Crafting upgrades

**Estimated Time**: 40 minutes

---

### Task 7.4: Test Filter Functionality
**Subtasks**:
- [ ] Toggle filter on/off multiple times
- [ ] Verify correct upgrades hidden/shown
- [ ] Test with no purchased upgrades
- [ ] Test with all purchased
- [ ] Test with mix

**Estimated Time**: 15 minutes

---

### Task 7.5: Test Edge Cases
**Subtasks**:
- [ ] Try to purchase with insufficient resources
- [ ] Try to purchase below required level
- [ ] Try to purchase same upgrade twice
- [ ] Test with empty inventory
- [ ] Test with level 1 character
- [ ] Test with maxed skills

**Estimated Time**: 30 minutes

---

### Task 7.6: Test Persistence
**Subtasks**:
- [ ] Purchase several upgrades
- [ ] Save game
- [ ] Reload page
- [ ] Verify upgrades still owned
- [ ] Verify effects still apply
- [ ] Verify can purchase more

**Estimated Time**: 15 minutes

---

### Task 7.7: Web Platform Testing
**Subtasks**:
- [ ] Build for web: `npm run build:web`
- [ ] Start web server: `npm run web`
- [ ] Test all functionality on web
- [ ] Check responsive design
- [ ] Verify no console errors

**Estimated Time**: 30 minutes

---

### Task 7.8: Accessibility Testing
**Subtasks**:
- [ ] Test with screen reader on web
- [ ] Verify all elements announced
- [ ] Check keyboard navigation
- [ ] Verify contrast ratios
- [ ] Test with large text

**Estimated Time**: 25 minutes

---

### Task 7.9: Performance Testing
**Subtasks**:
- [ ] Open Upgrade Shop multiple times
- [ ] Switch between skills rapidly
- [ ] Toggle filter rapidly
- [ ] Purchase many upgrades quickly
- [ ] Monitor for lag or jank
- [ ] Check memory usage

**Estimated Time**: 20 minutes

---

### Task 7.10: Visual Polish Pass
**Subtasks**:
- [ ] Review all screens for visual consistency
- [ ] Adjust spacing if needed
- [ ] Verify icons render correctly
- [ ] Check animations smooth
- [ ] Ensure hover states work (web)
- [ ] Fix any visual bugs

**Estimated Time**: 30 minutes

---

### Task 7.11: Code Review and Cleanup
**Subtasks**:
- [ ] Run linter: `npm run lint`
- [ ] Fix any linting errors
- [ ] Remove console.logs
- [ ] Add comments where needed
- [ ] Verify all TypeScript types correct
- [ ] Remove unused imports

**Estimated Time**: 20 minutes

---

### Task 7.12: Documentation Updates
**File**: `README.md`, `PROJECT_SUMMARY.md`

**Subtasks**:
- [ ] Add Upgrade Shop to features list
- [ ] Update PROJECT_SUMMARY.md
- [ ] Document any new commands or setup
- [ ] Update version number if needed

**Estimated Time**: 15 minutes

---

## Summary

**Total Tasks**: 70+  
**Estimated Total Time**: 16-22 hours  
**Priority**: Medium-High  
**Complexity**: Medium

## Task Completion Tracking

Track progress by checking off tasks as completed. Each phase should be completed and tested before moving to the next phase.

## Notes

- Test frequently after each task
- Commit code after each completed phase
- Don't skip testing tasks
- Ask for help if stuck on any task
- Update this document if new tasks discovered
