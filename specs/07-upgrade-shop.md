# Spec: Upgrade Shop

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07  
**Implementation Plan**: [07-upgrade-shop.plan.md](07-upgrade-shop.plan.md)  
**Task Breakdown**: [07-upgrade-shop.tasks.md](07-upgrade-shop.tasks.md)

## Overview

The Upgrade Shop is a permanent progression system that allows players to purchase one-time upgrades for each skill. These upgrades provide percentage-based bonuses to training speed (reduced time) or resource production (increased items gained). The shop will be accessible through the Inventory tab in the sidebar and offers 6-8 upgrades per skill, unlocking at increasing level requirements.

## User Stories

### As a player:
- I want to spend my accumulated resources to purchase permanent upgrades for my skills
- I want to see what upgrades are available for each skill and their costs
- I want to clearly understand what benefit each upgrade provides
- I want to filter out upgrades I've already purchased to focus on available ones
- I want upgrades to immediately affect my training activities
- I want to feel meaningful progression beyond just leveling up

## Requirements

### Functional Requirements

#### 1. Upgrade Shop Access
- **Location**: Add "Upgrade Shop" option in the sidebar under the "Player" section, below "Inventory"
- **Navigation**: Clicking "Upgrade Shop" opens the Upgrade Shop screen
- **Visual**: Shows total upgrades purchased vs total available (e.g., "Upgrades (12/48)")

#### 2. Upgrade Types
Each upgrade falls into one of two categories:

**Time Reduction Upgrades**:
- Reduce the time required to complete training actions
- Example: "Oak Efficiency: -10% time for Oak Tree chopping"
- Applied multiplicatively to base duration
- Range: 5% to 25% reduction per upgrade

**Production Increase Upgrades**:
- Increase the quantity of resources produced per action
- Example: "Iron Abundance: +1 Iron Ore per mining action"
- Applied additively to base production
- Range: +1 to +3 items per upgrade

#### 3. Upgrade Definitions Per Skill

Each skill has 6-8 upgrades with:
- **Unique ID**: String identifier (e.g., "woodcutting_oak_speed")
- **Name**: Display name (e.g., "Oak Efficiency")
- **Description**: Clear explanation of benefit
- **Skill**: Associated skill type
- **Level Requirement**: Minimum skill level to unlock (1-95)
- **Cost**: Resource requirements (multiple resources possible)
- **Effect Type**: "time_reduction" or "production_increase"
- **Effect Value**: Numeric value (percentage for time, flat for production)
- **Applies To**: Specific activities or all activities in the skill

#### 4. Upgrade Shop Screen

**Header**:
- Title: "⚡ Upgrade Shop"
- Back button to return to previous screen
- Subtitle showing total purchases: "X/Y upgrades purchased"

**Filter Options**:
- Toggle switch: "Hide Purchased"
  - Default: Off (show all upgrades)
  - When On: Only show unpurchased upgrades
  - Persist state in component (doesn't need to be saved)

**Skill Tabs**:
- Horizontal scrollable tab bar showing all 6 skills
- Each tab shows skill icon and name
- Active tab is highlighted
- Shows count of available upgrades in that skill (e.g., "Woodcutting (3/8)")

**Upgrade List**:
- Scrollable list of upgrades for selected skill
- Each upgrade card shows:
  - Upgrade icon (emoji/symbol)
  - Upgrade name
  - Description of effect
  - Level requirement (with indicator if unlocked)
  - Resource cost (with icons and quantities)
  - "Purchase" button or "Purchased" status
  - Visual indicator if player can afford it

**Empty States**:
- "No upgrades available yet" if skill level too low
- "All upgrades purchased!" if all owned and filter is off
- "No upgrades available" if filter is on and all are purchased

#### 5. Upgrade Purchase Flow

1. **Validation**:
   - Check if player meets level requirement
   - Check if player has sufficient resources
   - Check if upgrade already purchased

2. **Purchase Action**:
   - Deduct resources from inventory
   - Mark upgrade as purchased
   - Show success toast notification
   - Update UI to reflect new status
   - Save game state

3. **Effect Application**:
   - Upgrades take effect immediately
   - Applied automatically during training calculations
   - Stacks with multiple upgrades for same activity
   - Persists across game sessions

#### 6. Upgrade Effects on Training

**Time Reduction**:
```typescript
// Applied multiplicatively
const baseTime = activity.durationMs;
const timeReduction = calculateTimeReduction(skillType, activityId);
const finalTime = baseTime * (1 - timeReduction);

// Example: Oak Tree (4000ms), 10% + 15% reductions
// finalTime = 4000 * (1 - 0.10) * (1 - 0.15) = 3060ms
```

**Production Increase**:
```typescript
// Applied additively
const baseProduction = activity.products[0].quantity;
const productionBonus = calculateProductionBonus(skillType, activityId);
const finalProduction = baseProduction + productionBonus;

// Example: Iron Ore (1), +1 + +2 bonuses
// finalProduction = 1 + 1 + 2 = 4 Iron Ore per action
```

### Non-Functional Requirements

#### 1. Performance
- Upgrade list should render smoothly (< 100ms)
- Filter toggle should be instant
- Tab switching should be smooth
- Purchase action should complete in < 200ms
- Efficient calculation of upgrade effects

#### 2. Usability
- Clear visual hierarchy
- Obvious which upgrades are affordable
- Clear indication of purchased upgrades
- Easy navigation between skills
- Responsive to different screen sizes
- Touch targets minimum 44x44 points

#### 3. Balance
- Upgrades should feel meaningful but not overpowered
- Costs scale appropriately with benefit
- Level requirements match skill progression
- Mix of early, mid, and late-game upgrades
- Reasonable resource sinks for end-game players

#### 4. Accessibility
- High contrast for readability
- Screen reader support for all elements
- Clear labels on all interactive elements
- Keyboard navigation (web platform)

## Technical Design

### Data Structures

```typescript
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
  effectValue: number; // 0.10 for 10% time reduction, or 1/2/3 for production
  appliesToActivities: string[]; // Empty array = applies to all activities
}

export interface UpgradeState {
  purchasedUpgrades: Set<string>; // Set of upgrade IDs
}
```

### Component Structure

```
App
├── Sidebar
│   └── Player Section
│       ├── Inventory Link (existing)
│       └── Upgrade Shop Link (NEW)
└── UpgradeShopScreen (NEW)
    ├── Header
    ├── FilterToggle
    ├── SkillTabs
    └── UpgradeList
        └── UpgradeCard (multiple)
```

### Data File

**src/data/upgrades.ts** (NEW):
```typescript
import { Upgrade, SkillType, UpgradeEffectType } from '../types';

// Woodcutting upgrades (8 total)
const woodcuttingUpgrades: Upgrade[] = [
  {
    id: 'wc_regular_speed',
    name: 'Basic Axe Mastery',
    description: 'Chop regular trees 10% faster',
    icon: '🪓',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 1,
    cost: [{ resourceId: 'regular_wood', quantity: 100 }],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.10,
    appliesToActivities: ['regular_tree'],
  },
  {
    id: 'wc_oak_speed',
    name: 'Oak Efficiency',
    description: 'Chop oak trees 15% faster',
    icon: '🪓',
    skillType: SkillType.WOODCUTTING,
    levelRequired: 20,
    cost: [
      { resourceId: 'oak_wood', quantity: 150 },
      { resourceId: 'regular_wood', quantity: 300 }
    ],
    effectType: UpgradeEffectType.TIME_REDUCTION,
    effectValue: 0.15,
    appliesToActivities: ['oak_tree'],
  },
  // ... more upgrades
];

export const ALL_UPGRADES: Upgrade[] = [
  ...woodcuttingUpgrades,
  // ... other skill upgrades
];

export const getUpgradeById = (id: string): Upgrade | undefined => {
  return ALL_UPGRADES.find(u => u.id === id);
};

export const getUpgradesBySkill = (skillType: SkillType): Upgrade[] => {
  return ALL_UPGRADES.filter(u => u.skillType === skillType);
};

export const getUpgradesForActivity = (
  skillType: SkillType,
  activityId: string
): Upgrade[] => {
  return ALL_UPGRADES.filter(
    u => u.skillType === skillType &&
         (u.appliesToActivities.length === 0 || 
          u.appliesToActivities.includes(activityId))
  );
};
```

### State Management

Add to `gameStore.ts`:

```typescript
interface GameStore {
  // ... existing properties
  
  // Upgrade state
  purchasedUpgrades: Set<string>;
  
  // Upgrade actions
  purchaseUpgrade: (upgradeId: string) => boolean;
  hasUpgrade: (upgradeId: string) => boolean;
  getPurchasedUpgrades: () => string[];
  
  // Upgrade effect calculations
  calculateTimeReduction: (skillType: SkillType, activityId: string) => number;
  calculateProductionBonus: (skillType: SkillType, activityId: string) => number;
}
```

### Upgrade Effect Application

```typescript
// In completeTrainingAction
const baseTime = activity.durationMs;
const timeReduction = calculateTimeReduction(skillType, activity.id);
const actualTime = baseTime * (1 - timeReduction);

const baseProducts = activity.products;
const productionBonus = calculateProductionBonus(skillType, activity.id);
const actualProducts = baseProducts.map(p => ({
  ...p,
  quantity: p.quantity + productionBonus
}));
```

### Persistence

Add upgrades to game state serialization:

```typescript
interface GameState {
  // ... existing properties
  purchasedUpgrades: string[]; // Array for JSON serialization
}

// Convert Set to Array for saving
const saveGameState = (state: GameState) => {
  const serialized = {
    ...state,
    purchasedUpgrades: Array.from(state.purchasedUpgrades),
  };
  // ... save logic
};

// Convert Array to Set when loading
const loadGameState = () => {
  const loaded = // ... load logic
  return {
    ...loaded,
    purchasedUpgrades: new Set(loaded.purchasedUpgrades || []),
  };
};
```

## Upgrade Definitions

### Woodcutting (8 upgrades)

1. **Basic Axe Mastery** (Level 1)
   - Cost: 100 Regular Wood
   - Effect: -10% time for Regular Trees
   
2. **Oak Efficiency** (Level 20)
   - Cost: 150 Oak Wood, 300 Regular Wood
   - Effect: -15% time for Oak Trees
   
3. **Willow Swiftness** (Level 35)
   - Cost: 200 Willow Wood, 150 Oak Wood
   - Effect: -15% time for Willow Trees
   
4. **Forest Bounty** (Level 40)
   - Cost: 300 Willow Wood, 200 Oak Wood
   - Effect: +1 wood for all trees
   
5. **Maple Mastery** (Level 50)
   - Cost: 250 Maple Wood, 300 Willow Wood
   - Effect: -20% time for Maple Trees
   
6. **Yew Precision** (Level 65)
   - Cost: 200 Yew Wood, 300 Maple Wood
   - Effect: -20% time for Yew Trees
   
7. **Magic Attunement** (Level 80)
   - Cost: 150 Magic Wood, 250 Yew Wood
   - Effect: -25% time for Magic Trees
   
8. **Ancient Knowledge** (Level 95)
   - Cost: 100 Ancient Wood, 200 Magic Wood
   - Effect: +2 wood for all trees level 60+

### Mining (8 upgrades)

1. **Basic Pickaxe Technique** (Level 1)
   - Cost: 150 Copper Ore, 150 Tin Ore
   - Effect: -10% time for Copper and Tin
   
2. **Iron Focus** (Level 20)
   - Cost: 200 Iron Ore, 100 Coal
   - Effect: -15% time for Iron Ore
   
3. **Coal Abundance** (Level 35)
   - Cost: 300 Coal, 200 Iron Ore
   - Effect: +1 Coal per mining action
   
4. **Precious Metal Finder** (Level 45)
   - Cost: 150 Silver Ore, 150 Gold Ore
   - Effect: -15% time for Silver and Gold
   
5. **Mithril Mastery** (Level 60)
   - Cost: 200 Mithril Ore, 300 Coal
   - Effect: -20% time for Mithril
   
6. **Adamantite Excellence** (Level 75)
   - Cost: 150 Adamantite Ore, 250 Mithril Ore
   - Effect: -20% time for Adamantite
   
7. **Runite Discovery** (Level 88)
   - Cost: 100 Runite Ore, 200 Adamantite Ore
   - Effect: -25% time for Runite
   
8. **Master Miner** (Level 92)
   - Cost: 150 Runite Ore, 300 Adamantite Ore
   - Effect: +1 ore for all rocks

### Fishing (7 upgrades)

1. **Shrimp Net Efficiency** (Level 1)
   - Cost: 150 Raw Shrimp
   - Effect: -10% time for Shrimp
   
2. **Coastal Expertise** (Level 15)
   - Cost: 200 Raw Sardine, 150 Raw Herring
   - Effect: -15% time for Sardines and Herring
   
3. **River Mastery** (Level 25)
   - Cost: 200 Raw Trout, 200 Raw Salmon
   - Effect: -15% time for Trout and Salmon
   
4. **Deep Sea Knowledge** (Level 45)
   - Cost: 250 Raw Lobster, 300 Raw Salmon
   - Effect: -20% time for Lobsters
   
5. **Swordfish Hunter** (Level 60)
   - Cost: 200 Raw Swordfish, 250 Raw Lobster
   - Effect: -20% time for Swordfish
   
6. **Shark Tamer** (Level 80)
   - Cost: 150 Raw Shark, 250 Raw Swordfish
   - Effect: -25% time for Sharks
   
7. **Bountiful Waters** (Level 85)
   - Cost: 200 Raw Shark, 300 Raw Swordfish
   - Effect: +1 fish for all fishing spots

### Cooking (6 upgrades)

1. **Fire Control** (Level 1)
   - Cost: 100 Cooked Shrimp, 100 Regular Wood
   - Effect: -10% cooking time for all fish
   
2. **Seasoned Chef** (Level 25)
   - Cost: 200 Cooked Trout, 150 Oak Wood
   - Effect: -15% cooking time for all fish
   
3. **Master Chef** (Level 50)
   - Cost: 250 Cooked Lobster, 200 Willow Wood
   - Effect: -20% cooking time for all fish
   
4. **Bulk Cooking I** (Level 35)
   - Cost: 200 Cooked Herring, 150 Coal
   - Effect: +1 cooked fish per action (basic fish)
   
5. **Bulk Cooking II** (Level 65)
   - Cost: 200 Cooked Swordfish, 200 Maple Wood
   - Effect: +1 cooked fish per action (advanced fish)
   
6. **Perfect Technique** (Level 90)
   - Cost: 250 Cooked Shark, 200 Magic Wood
   - Effect: -25% cooking time for all fish

### Smithing (8 upgrades)

1. **Bronze Efficiency** (Level 1)
   - Cost: 150 Bronze Bar, 100 Coal
   - Effect: -10% smelting time for Bronze
   
2. **Iron Mastery** (Level 18)
   - Cost: 200 Iron Bar, 150 Coal
   - Effect: -15% smelting time for Iron
   
3. **Steel Production** (Level 35)
   - Cost: 200 Steel Bar, 200 Coal
   - Effect: -15% smelting time for Steel
   
4. **Gold Standard** (Level 45)
   - Cost: 150 Gold Bar
   - Effect: -20% smelting time for Gold
   
5. **Mithril Forge** (Level 58)
   - Cost: 200 Mithril Bar, 300 Coal
   - Effect: -20% smelting time for Mithril
   
6. **Adamantite Smithing** (Level 73)
   - Cost: 150 Adamantite Bar, 250 Mithril Bar
   - Effect: -20% smelting time for Adamantite
   
7. **Runite Forging** (Level 88)
   - Cost: 100 Runite Bar, 200 Adamantite Bar
   - Effect: -25% smelting time for Runite
   
8. **Efficient Smelting** (Level 92)
   - Cost: 150 Runite Bar, 400 Coal
   - Effect: +1 bar for all smelting

### Crafting (7 upgrades)

1. **Basic Craftsmanship** (Level 1)
   - Cost: 100 Bronze Bar, 100 Regular Wood
   - Effect: -10% crafting time for basic items
   
2. **Leather Working** (Level 20)
   - Cost: 200 Oak Wood, 150 Iron Bar
   - Effect: -15% crafting time for leather items
   
3. **Jewelry Precision** (Level 40)
   - Cost: 100 Gold Bar, 100 Silver Ore
   - Effect: -15% crafting time for jewelry
   
4. **Gem Cutting** (Level 50)
   - Cost: 200 Gold Bar, 150 Mithril Bar
   - Effect: -20% crafting time for gems
   
5. **Advanced Crafting** (Level 65)
   - Cost: 200 Adamantite Bar, 200 Yew Wood
   - Effect: -20% crafting time for advanced items
   
6. **Mass Production** (Level 75)
   - Cost: 150 Runite Bar, 200 Magic Wood
   - Effect: +1 item for all crafting
   
7. **Master Artisan** (Level 92)
   - Cost: 200 Runite Bar, 200 Ancient Wood
   - Effect: -25% crafting time for all items

## Dependencies

- Core game system (implemented)
- Inventory system (implemented)
- Skill system (implemented)
- Resource definitions (implemented)
- Sidebar navigation (implemented)
- Game state management with Zustand (implemented)

## Acceptance Criteria

### Specification & Planning
- [ ] Specification document created and reviewed
- [ ] Implementation plan document created
- [ ] Task breakdown document created

### Data & Types
- [ ] Upgrade types added to type definitions
- [ ] Upgrade data file created with all 48 upgrades
- [ ] Upgrades properly distributed across 6 skills (6-8 each)
- [ ] Reasonable costs and level requirements

### State Management
- [ ] Upgrade state added to game store
- [ ] Purchase upgrade action implemented and working
- [ ] Has upgrade getter working correctly
- [ ] Upgrade effects calculate correctly
- [ ] Upgrades persist across game sessions

### UI Components
- [ ] Upgrade Shop screen displays correctly
- [ ] Skill tabs show all 6 skills
- [ ] Upgrade cards show all information clearly
- [ ] "Hide Purchased" filter works correctly
- [ ] Purchase button disabled when requirements not met
- [ ] Success toast shows on purchase
- [ ] Empty states display appropriately

### Navigation
- [ ] "Upgrade Shop" appears in sidebar under Player section
- [ ] Shows upgrade count (purchased/total)
- [ ] Clicking navigates to Upgrade Shop screen
- [ ] Back button returns to previous screen

### Integration
- [ ] Upgrades apply to training activities immediately
- [ ] Time reduction upgrades reduce action duration
- [ ] Production upgrades increase items gained
- [ ] Multiple upgrades stack correctly
- [ ] Upgrades only apply to relevant activities
- [ ] Resource costs deducted on purchase

### Testing
- [ ] Can purchase upgrades when requirements met
- [ ] Cannot purchase without sufficient resources
- [ ] Cannot purchase without required level
- [ ] Cannot purchase same upgrade twice
- [ ] Filter toggle works correctly
- [ ] All skill tabs work
- [ ] Scrolling works smoothly
- [ ] Works on web platform

## Future Enhancements

### Phase 2
- **Prestige Upgrades**: Ultra-rare upgrades that require prestige
- **Combo Upgrades**: Upgrades that affect multiple skills
- **Upgrade Tiers**: Higher tiers of existing upgrades
- **Refund System**: Option to refund upgrades (partial cost)
- **Upgrade Preview**: See effect before purchasing

### Phase 3
- **Upgrade Sets**: Bonus for completing upgrade sets
- **Time-Limited Upgrades**: Special seasonal upgrades
- **Achievement-Locked Upgrades**: Require achievements
- **Dynamic Pricing**: Costs scale with player progress
- **Upgrade Suggestions**: Recommend upgrades based on playstyle

### Phase 4
- **Upgrade Path Visualization**: Tree showing upgrade progression
- **Upgrade Statistics**: Track value gained from each upgrade
- **Upgrade Trading**: Trade upgrades with other players
- **Custom Upgrade Creator**: Create custom upgrades (limited)
- **Upgrade Challenges**: Complete challenges to unlock upgrades

## Related Specifications

- [01-core-game-system.md](./01-core-game-system.md) - Game state and persistence
- [02-skill-system.md](./02-skill-system.md) - Skill definitions and training
- [06-inventory-system.md](./06-inventory-system.md) - Resource management
- [04-sidebar-navigation.md](./04-sidebar-navigation.md) - Navigation structure

## Notes

- Upgrades are intentionally designed to be permanent to avoid player regret
- Costs should require meaningful gameplay but not excessive grinding
- Time reductions should be noticeable but not trivialize progression
- Production increases should feel rewarding but balanced
- Level requirements ensure players have experienced the activity before upgrading
- Filter option helps end-game players focus on remaining upgrades
- All costs use resources from the same or related skills
