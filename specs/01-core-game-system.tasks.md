# Task Breakdown: Core Game System

**Plan Reference**: [01-core-game-system.plan.md](01-core-game-system.plan.md)  
**Status**: Ready to Start  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This document breaks down the Core Game System implementation plan into granular, actionable tasks. Each task is designed to be completable independently and includes clear acceptance criteria.

## Task Organization

Tasks are organized by phase and include:
- **ID**: Unique task identifier
- **Title**: Brief task description
- **Priority**: High, Medium, or Low
- **Dependencies**: Other tasks that must be completed first
- **Estimated Effort**: Time estimate in hours
- **Acceptance Criteria**: How to verify task completion

---

## Phase 1: Core State Management

### Task 1.1: Install and Configure Zustand

**ID**: CORE-1.1  
**Priority**: High  
**Dependencies**: None  
**Estimated Effort**: 0.5 hours

**Description**:
Install Zustand package and set up basic configuration for the project.

**Steps**:
1. Run `npm install zustand`
2. Verify package is added to package.json
3. Create `src/store/` directory

**Acceptance Criteria**:
- [ ] Zustand is listed in package.json dependencies
- [ ] Package installs without errors
- [ ] src/store/ directory exists

---

### Task 1.2: Create Game Store Skeleton

**ID**: CORE-1.2  
**Priority**: High  
**Dependencies**: CORE-1.1  
**Estimated Effort**: 1 hour

**Description**:
Create the basic Zustand store structure with initial state and type definitions.

**Steps**:
1. Create `src/store/gameStore.ts`
2. Import GameState type from types/index.ts
3. Define store interface with initial state
4. Create store with create() function
5. Export store and hooks

**Implementation**:
```typescript
// src/store/gameStore.ts
import { create } from 'zustand';
import { GameState, SkillType } from '../types';

interface GameStore {
  gameState: GameState;
  isInitialized: boolean;
  
  // Actions to be implemented
  initializeNewGame: () => void;
  // ... other actions
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: {
    // Initial state
  },
  isInitialized: false,
  
  initializeNewGame: () => {
    // To be implemented
  },
}));
```

**Acceptance Criteria**:
- [ ] gameStore.ts file created with proper TypeScript types
- [ ] Store can be imported in other files without errors
- [ ] Initial state structure matches GameState interface
- [ ] useGameStore hook is exported

---

### Task 1.3: Implement Initialize New Game Action

**ID**: CORE-1.3  
**Priority**: High  
**Dependencies**: CORE-1.2  
**Estimated Effort**: 1.5 hours

**Description**:
Implement the action that creates a new game with default values for all skills and settings.

**Steps**:
1. Create helper function to generate initial skill state
2. Implement initializeNewGame action
3. Set default values for all 6 skills (level 1, 0 XP)
4. Initialize empty inventory
5. Set default game settings
6. Generate unique player ID

**Implementation Details**:
- All skills start at level 1, 0 XP
- No activities unlocked except level 1 activities
- Empty inventory (empty object)
- Settings: all notifications/sound enabled
- Player ID: use crypto.randomUUID() or timestamp

**Acceptance Criteria**:
- [ ] initializeNewGame() sets all skills to level 1
- [ ] Player object has valid id, createdAt, lastSave
- [ ] Inventory is initialized as empty object
- [ ] Settings have sensible defaults
- [ ] isInitialized flag is set to true

---

### Task 1.4: Implement Skill State Getters

**ID**: CORE-1.4  
**Priority**: High  
**Dependencies**: CORE-1.3  
**Estimated Effort**: 1 hour

**Description**:
Add selector functions for accessing skill state and related data.

**Steps**:
1. Add getSkillState(skillType) selector
2. Add getSkillLevel(skillType) selector
3. Add getSkillXp(skillType) selector
4. Add getUnlockedActivities(skillType) selector
5. Add tests for selectors

**Implementation**:
```typescript
getSkillState: (skillType: SkillType) => {
  return get().gameState.skills[skillType];
},

getSkillLevel: (skillType: SkillType) => {
  return get().gameState.skills[skillType].level;
},
```

**Acceptance Criteria**:
- [ ] All selector functions return correct values
- [ ] Selectors handle missing data gracefully
- [ ] TypeScript types are correct for return values
- [ ] Simple unit tests pass

---

### Task 1.5: Implement Resource Getters and Setters

**ID**: CORE-1.5  
**Priority**: High  
**Dependencies**: CORE-1.3  
**Estimated Effort**: 2 hours

**Description**:
Add actions for managing the player's resource inventory.

**Steps**:
1. Implement getResourceCount(resourceId)
2. Implement addResource(resourceId, quantity)
3. Implement removeResource(resourceId, quantity)
4. Implement hasResources(requirements[])
5. Add input validation
6. Add unit tests

**Implementation Details**:
- getResourceCount returns 0 for missing resources
- addResource creates entry if doesn't exist
- removeResource returns false if insufficient
- hasResources checks all requirements

**Acceptance Criteria**:
- [ ] getResourceCount returns correct quantities
- [ ] addResource increases inventory correctly
- [ ] removeResource decreases inventory correctly
- [ ] removeResource returns false if insufficient
- [ ] hasResources validates all requirements
- [ ] Negative quantities are prevented
- [ ] Unit tests cover all edge cases

---

## Phase 2: Persistence Layer

### Task 2.1: Install AsyncStorage

**ID**: CORE-2.1  
**Priority**: High  
**Dependencies**: None  
**Estimated Effort**: 0.5 hours

**Description**:
Install React Native AsyncStorage package.

**Steps**:
1. Run `npm install @react-native-async-storage/async-storage`
2. Link native modules (if required)
3. Verify installation

**Acceptance Criteria**:
- [ ] Package listed in package.json
- [ ] Can import AsyncStorage without errors
- [ ] App builds successfully

---

### Task 2.2: Create Save Utilities Module

**ID**: CORE-2.2  
**Priority**: High  
**Dependencies**: CORE-2.1  
**Estimated Effort**: 2 hours

**Description**:
Create utility functions for saving and loading game state.

**Steps**:
1. Create `src/utils/save.ts`
2. Define SaveData interface
3. Implement saveGameState function
4. Implement loadGameState function
5. Add error handling
6. Add constants for storage keys

**Implementation**:
```typescript
// src/utils/save.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types';

const SAVE_KEY = '@SkillForgeIdle:save';
const SAVE_VERSION = '1.0.0';

export interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
}

export async function saveGameState(state: GameState): Promise<void> {
  // Implementation
}

export async function loadGameState(): Promise<GameState | null> {
  // Implementation
}
```

**Acceptance Criteria**:
- [ ] saveGameState serializes and stores data
- [ ] loadGameState retrieves and deserializes data
- [ ] Both functions handle errors gracefully
- [ ] Null is returned if no save exists
- [ ] Save format includes version and timestamp

---

### Task 2.3: Add Data Validation

**ID**: CORE-2.3  
**Priority**: Medium  
**Dependencies**: CORE-2.2  
**Estimated Effort**: 1.5 hours

**Description**:
Implement validation to ensure loaded save data is valid.

**Steps**:
1. Create validateSaveData function
2. Check required fields exist
3. Validate data types
4. Check version compatibility
5. Add comprehensive tests

**Validation Checks**:
- version is string
- timestamp is number
- gameState has required fields
- Skills data is valid
- No corrupted values

**Acceptance Criteria**:
- [ ] Function returns boolean
- [ ] Detects missing required fields
- [ ] Detects invalid data types
- [ ] Returns false for corrupted data
- [ ] Unit tests cover validation cases

---

### Task 2.4: Integrate Save/Load into Store

**ID**: CORE-2.4  
**Priority**: High  
**Dependencies**: CORE-2.2, CORE-1.3  
**Estimated Effort**: 1.5 hours

**Description**:
Add save and load actions to the Zustand store.

**Steps**:
1. Import save utilities into gameStore.ts
2. Implement saveGame action
3. Implement loadGame action
4. Handle save/load errors
5. Update lastSave timestamp on save
6. Test integration

**Implementation**:
```typescript
saveGame: async () => {
  try {
    const state = get().gameState;
    state.player.lastSave = Date.now();
    await saveGameState(state);
  } catch (error) {
    console.error('Failed to save game:', error);
  }
},

loadGame: async () => {
  try {
    const loadedState = await loadGameState();
    if (loadedState) {
      set({ gameState: loadedState, isInitialized: true });
    } else {
      get().initializeNewGame();
    }
  } catch (error) {
    console.error('Failed to load game:', error);
    get().initializeNewGame();
  }
},
```

**Acceptance Criteria**:
- [ ] saveGame successfully persists state
- [ ] loadGame retrieves persisted state
- [ ] Errors are caught and logged
- [ ] lastSave timestamp is updated
- [ ] New game initialized if load fails

---

### Task 2.5: Add Export/Import Functionality

**ID**: CORE-2.5  
**Priority**: Low  
**Dependencies**: CORE-2.4  
**Estimated Effort**: 2 hours

**Description**:
Allow players to export their save as JSON and import saves.

**Steps**:
1. Create exportSaveData function
2. Create importSaveData function
3. Validate imported data
4. Add to store actions
5. Test with various save files

**Acceptance Criteria**:
- [ ] exportSaveData returns JSON string
- [ ] importSaveData validates input
- [ ] Invalid imports are rejected
- [ ] Valid imports restore game state
- [ ] Unit tests cover edge cases

---

## Phase 3: Game Loop System

### Task 3.1: Create useGameLoop Hook

**ID**: CORE-3.1  
**Priority**: High  
**Dependencies**: CORE-1.3  
**Estimated Effort**: 2 hours

**Description**:
Create a custom React hook that manages the game loop using requestAnimationFrame.

**Steps**:
1. Create `src/hooks/useGameLoop.ts`
2. Set up requestAnimationFrame loop
3. Calculate delta time between frames
4. Call update functions with delta time
5. Handle cleanup on unmount

**Implementation**:
```typescript
// src/hooks/useGameLoop.ts
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const updateTrainingProgress = useGameStore(
    state => state.updateTrainingProgress
  );
  const activeTraining = useGameStore(
    state => state.gameState.activeTraining
  );

  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (activeTraining) {
        updateTrainingProgress(deltaTime);
      }

      frameId = requestAnimationFrame(gameLoop);
    };

    frameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeTraining, updateTrainingProgress]);
}
```

**Acceptance Criteria**:
- [ ] Hook starts game loop when mounted
- [ ] Loop stops when component unmounts
- [ ] Delta time is calculated correctly
- [ ] No memory leaks
- [ ] Loop only runs when needed

---

### Task 3.2: Implement Training Progress Update

**ID**: CORE-3.2  
**Priority**: High  
**Dependencies**: CORE-3.1, CORE-1.3  
**Estimated Effort**: 2 hours

**Description**:
Add action to update training progress based on elapsed time.

**Steps**:
1. Add updateTrainingProgress action to store
2. Track elapsed time for current activity
3. Calculate progress percentage
4. Trigger completion when duration reached
5. Handle edge cases

**Implementation Logic**:
- Add deltaTime to accumulated time
- Calculate progress: (elapsedTime / totalDuration) * 100
- If progress >= 100%, call completeTrainingAction
- Update state with new progress value

**Acceptance Criteria**:
- [ ] Progress increases over time
- [ ] Progress stays between 0-100%
- [ ] Completion triggers at 100%
- [ ] Handles pausing/resuming correctly
- [ ] No drift in timing

---

### Task 3.3: Implement Training Completion Handler

**ID**: CORE-3.3  
**Priority**: High  
**Dependencies**: CORE-3.2, CORE-1.5  
**Estimated Effort**: 2 hours

**Description**:
Handle what happens when a training activity completes.

**Steps**:
1. Add completeTrainingAction to store
2. Award XP to relevant skill
3. Consume required resources
4. Produce output resources
5. Check for level up
6. Reset progress and restart activity

**Implementation Flow**:
1. Get current activity from activeTraining
2. Call addExperience with skill and XP amount
3. Call removeResource for each requirement
4. Call addResource for each product
5. Call checkLevelUp for the skill
6. Reset progress to 0
7. Keep activeTraining to auto-continue

**Acceptance Criteria**:
- [ ] XP is awarded correctly
- [ ] Resources are consumed
- [ ] Resources are produced
- [ ] Level up is checked
- [ ] Activity auto-continues
- [ ] Can be stopped by user

---

### Task 3.4: Add Auto-Save to Game Loop

**ID**: CORE-3.4  
**Priority**: Medium  
**Dependencies**: CORE-3.1, CORE-2.4  
**Estimated Effort**: 1 hour

**Description**:
Trigger automatic save every 30 seconds during gameplay.

**Steps**:
1. Track time since last save
2. Add save interval constant (30000ms)
3. Call saveGame when interval reached
4. Reset timer after save
5. Don't block game loop

**Implementation**:
```typescript
let lastSaveTime = Date.now();
const SAVE_INTERVAL = 30000; // 30 seconds

const gameLoop = (currentTime: number) => {
  // ... existing code
  
  // Auto-save check
  const now = Date.now();
  if (now - lastSaveTime >= SAVE_INTERVAL) {
    saveGame();
    lastSaveTime = now;
  }
  
  // ... rest of loop
};
```

**Acceptance Criteria**:
- [ ] Save triggers every 30 seconds
- [ ] Doesn't block game loop
- [ ] Handles save errors gracefully
- [ ] Can be disabled in settings (future)

---

## Phase 4: Training System

### Task 4.1: Implement Start Training Action

**ID**: CORE-4.1  
**Priority**: High  
**Dependencies**: CORE-1.5  
**Estimated Effort**: 2 hours

**Description**:
Allow players to start training a specific activity.

**Steps**:
1. Add startTraining action to store
2. Validate skill and activity exist
3. Check level requirements
4. Check resource requirements
5. Set activeTraining state
6. Consume initial resources

**Validation Checks**:
- Skill exists
- Activity exists for that skill
- Player meets level requirement
- Player has required resources
- No other training is active

**Implementation**:
```typescript
startTraining: (skillType: SkillType, activityId: string) => {
  const state = get();
  const activity = getActivityById(skillType, activityId);
  
  if (!activity) return;
  
  const skillState = state.gameState.skills[skillType];
  if (skillState.level < activity.levelRequired) return;
  
  if (!state.hasResources(activity.requirements)) return;
  
  // Consume resources
  activity.requirements.forEach(req => {
    state.removeResource(req.resourceId, req.quantity);
  });
  
  // Set active training
  set(state => ({
    gameState: {
      ...state.gameState,
      activeTraining: {
        skillType,
        activityId,
        startTime: Date.now(),
        duration: activity.durationMs,
      }
    }
  }));
},
```

**Acceptance Criteria**:
- [ ] Can start valid activity
- [ ] Cannot start without requirements
- [ ] Resources are consumed on start
- [ ] activeTraining is set correctly
- [ ] Previous training is stopped

---

### Task 4.2: Implement Stop Training Action

**ID**: CORE-4.2  
**Priority**: High  
**Dependencies**: CORE-4.1  
**Estimated Effort**: 0.5 hours

**Description**:
Allow players to stop training at any time.

**Steps**:
1. Add stopTraining action
2. Clear activeTraining state
3. Reset progress
4. Save game state

**Implementation**:
```typescript
stopTraining: () => {
  set(state => ({
    gameState: {
      ...state.gameState,
      activeTraining: null,
    }
  }));
  get().saveGame();
},
```

**Acceptance Criteria**:
- [ ] Clears active training
- [ ] Can be called anytime
- [ ] Doesn't error if not training
- [ ] Game state is saved

---

### Task 4.3: Create useSkillTraining Hook

**ID**: CORE-4.3  
**Priority**: High  
**Dependencies**: CORE-4.1, CORE-4.2, CORE-3.2  
**Estimated Effort**: 1.5 hours

**Description**:
Create a custom hook that provides training-related state and actions for components.

**Steps**:
1. Create `src/hooks/useSkillTraining.ts`
2. Select training state from store
3. Provide convenience methods
4. Calculate derived values (progress, time remaining)
5. Export typed hook

**Implementation**:
```typescript
export function useSkillTraining() {
  const activeTraining = useGameStore(
    state => state.gameState.activeTraining
  );
  const startTraining = useGameStore(state => state.startTraining);
  const stopTraining = useGameStore(state => state.stopTraining);
  
  // Calculate current activity
  const currentActivity = activeTraining
    ? getActivityById(activeTraining.skillType, activeTraining.activityId)
    : null;
  
  // Calculate progress
  const progress = activeTraining
    ? calculateProgress(activeTraining)
    : 0;
  
  return {
    isTraining: !!activeTraining,
    currentActivity,
    progress,
    startActivity: startTraining,
    stopActivity: stopTraining,
  };
}
```

**Acceptance Criteria**:
- [ ] Returns current training state
- [ ] Provides start/stop methods
- [ ] Calculates progress correctly
- [ ] Updates reactively
- [ ] Type-safe interface

---

### Task 4.4: Add Activity Validation Helper

**ID**: CORE-4.4  
**Priority**: Medium  
**Dependencies**: CORE-1.5  
**Estimated Effort**: 1 hour

**Description**:
Create helper function to check if player can start an activity.

**Steps**:
1. Add canStartActivity method to store
2. Check level requirements
3. Check resource requirements
4. Return boolean result
5. Optionally return reason if cannot start

**Implementation**:
```typescript
canStartActivity: (activity: Activity) => {
  const state = get();
  const skillState = state.getSkillState(activity.skillType);
  
  // Check level
  if (skillState.level < activity.levelRequired) {
    return false;
  }
  
  // Check resources
  if (!state.hasResources(activity.requirements)) {
    return false;
  }
  
  return true;
},
```

**Acceptance Criteria**:
- [ ] Returns true if can start
- [ ] Returns false if requirements not met
- [ ] Checks both level and resources
- [ ] Fast performance for UI updates

---

## Phase 5: XP and Leveling

### Task 5.1: Implement Add Experience Action

**ID**: CORE-5.1  
**Priority**: High  
**Dependencies**: CORE-1.3  
**Estimated Effort**: 1 hour

**Description**:
Add action to award experience points to a skill.

**Steps**:
1. Add addExperience action to store
2. Add XP to skill's current XP
3. Update skill state
4. Trigger level up check
5. Save game state

**Implementation**:
```typescript
addExperience: (skillType: SkillType, amount: number) => {
  set(state => {
    const skills = { ...state.gameState.skills };
    const skill = { ...skills[skillType] };
    
    skill.experience += amount;
    skills[skillType] = skill;
    
    return {
      gameState: {
        ...state.gameState,
        skills,
      }
    };
  });
  
  get().checkLevelUp(skillType);
},
```

**Acceptance Criteria**:
- [ ] XP is added correctly
- [ ] Multiple XP gains accumulate
- [ ] State updates trigger re-renders
- [ ] Level check is called
- [ ] Cannot add negative XP

---

### Task 5.2: Implement Level-Up Detection

**ID**: CORE-5.2  
**Priority**: High  
**Dependencies**: CORE-5.1  
**Estimated Effort**: 1.5 hours

**Description**:
Detect when a skill levels up and update the level.

**Steps**:
1. Add checkLevelUp action
2. Get current XP and level
3. Calculate level from XP
4. Compare with stored level
5. Update level if increased
6. Unlock new activities

**Implementation**:
```typescript
checkLevelUp: (skillType: SkillType) => {
  const state = get();
  const skill = state.gameState.skills[skillType];
  const newLevel = getLevelFromXp(skill.experience);
  
  if (newLevel > skill.level) {
    // Level up occurred
    set(currentState => {
      const skills = { ...currentState.gameState.skills };
      const updatedSkill = { ...skills[skillType] };
      
      updatedSkill.level = newLevel;
      
      // Unlock new activities
      const skillData = getSkillById(skillType);
      const newlyUnlocked = skillData?.activities
        .filter(a => a.levelRequired <= newLevel)
        .map(a => a.id) || [];
      
      updatedSkill.unlockedActivities = newlyUnlocked;
      skills[skillType] = updatedSkill;
      
      return {
        gameState: {
          ...currentState.gameState,
          skills,
        }
      };
    });
    
    return true; // Level up occurred
  }
  
  return false; // No level up
},
```

**Acceptance Criteria**:
- [ ] Correctly detects level increases
- [ ] Updates level in state
- [ ] Unlocks appropriate activities
- [ ] Returns boolean indicating if leveled
- [ ] Handles level 99 correctly

---

### Task 5.3: Add Level-Up Notification System

**ID**: CORE-5.3  
**Priority**: Low  
**Dependencies**: CORE-5.2  
**Estimated Effort**: 2 hours

**Description**:
Track level-up events so UI can display notifications.

**Steps**:
1. Add levelUpEvents array to store
2. Push event when level up occurs
3. Add method to clear events
4. Include skill and new level in event

**Implementation**:
```typescript
interface LevelUpEvent {
  skillType: SkillType;
  oldLevel: number;
  newLevel: number;
  timestamp: number;
}

// In store
levelUpEvents: [] as LevelUpEvent[],

// In checkLevelUp
levelUpEvents.push({
  skillType,
  oldLevel: skill.level,
  newLevel,
  timestamp: Date.now(),
});

clearLevelUpEvents: () => {
  set({ levelUpEvents: [] });
},
```

**Acceptance Criteria**:
- [ ] Events are recorded on level up
- [ ] Events include relevant data
- [ ] UI can consume events
- [ ] Events can be cleared
- [ ] Multiple events are tracked

---

## Phase 6: UI Components

### Task 6.1: Create Skills Overview Screen

**ID**: CORE-6.1  
**Priority**: Medium  
**Dependencies**: CORE-1.3  
**Estimated Effort**: 3 hours

**Description**:
Build the main screen showing all skills and their progress.

**Steps**:
1. Create `src/screens/SkillsOverview.tsx`
2. Display all 6 skills in grid/list
3. Show current level and XP for each
4. Show progress bar to next level
5. Make skills tappable to enter training

**Acceptance Criteria**:
- [ ] All skills are displayed
- [ ] Shows correct level and XP
- [ ] Progress bars update reactively
- [ ] Can navigate to skill training
- [ ] Responsive layout

---

### Task 6.2: Create Skill Training Screen

**ID**: CORE-6.2  
**Priority**: Medium  
**Dependencies**: CORE-4.3  
**Estimated Effort**: 4 hours

**Description**:
Build the screen for training a specific skill.

**Steps**:
1. Create `src/screens/SkillTraining.tsx`
2. Display all activities for the skill
3. Show which are unlocked
4. Display activity details (XP, time, requirements)
5. Add start/stop training buttons
6. Show current training progress

**Acceptance Criteria**:
- [ ] Lists all activities for skill
- [ ] Shows locked/unlocked status
- [ ] Displays activity requirements
- [ ] Can start/stop training
- [ ] Progress updates in real-time

---

### Task 6.3: Create Activity Card Component

**ID**: CORE-6.3  
**Priority**: Medium  
**Dependencies**: None  
**Estimated Effort**: 2 hours

**Description**:
Build reusable component for displaying an activity.

**Steps**:
1. Create `src/components/ActivityCard.tsx`
2. Display activity name and description
3. Show level requirement
4. Show XP gained and duration
5. Show resource requirements/products
6. Handle locked/unlocked state styling

**Acceptance Criteria**:
- [ ] Displays all activity info
- [ ] Visual distinction for locked activities
- [ ] Shows resource icons/counts
- [ ] Properly styled and laid out
- [ ] Reusable across screens

---

### Task 6.4: Create Progress Bar Component

**ID**: CORE-6.4  
**Priority**: Medium  
**Dependencies**: None  
**Estimated Effort**: 1.5 hours

**Description**:
Build reusable progress bar for XP and training.

**Steps**:
1. Create `src/components/ProgressBar.tsx`
2. Accept progress percentage (0-100)
3. Display filled bar with color
4. Show percentage or values text
5. Animate changes smoothly

**Acceptance Criteria**:
- [ ] Displays progress visually
- [ ] Accepts custom colors
- [ ] Shows text labels
- [ ] Animates smoothly
- [ ] Responsive to width

---

### Task 6.5: Create Resource Display Component

**ID**: CORE-6.5  
**Priority**: Low  
**Dependencies**: CORE-1.5  
**Estimated Effort**: 2 hours

**Description**:
Build component to show resource inventory.

**Steps**:
1. Create `src/components/ResourceInventory.tsx`
2. Display all non-zero resources
3. Show resource name and count
4. Group by category if needed
5. Make scrollable for many resources

**Acceptance Criteria**:
- [ ] Shows all player resources
- [ ] Updates reactively
- [ ] Formatted numbers
- [ ] Scrollable layout
- [ ] Clean visual design

---

## Phase 7: Testing and Polish

### Task 7.1: Write Unit Tests for XP System

**ID**: CORE-7.1  
**Priority**: Medium  
**Dependencies**: CORE-5.1, CORE-5.2  
**Estimated Effort**: 2 hours

**Description**:
Comprehensive tests for XP calculations and leveling.

**Test Cases**:
- XP correctly awards to skills
- Level up detection at thresholds
- Activity unlocks at correct levels
- Edge cases (level 1, level 99, overflow)

**Acceptance Criteria**:
- [ ] All XP functions have tests
- [ ] Tests pass consistently
- [ ] Edge cases covered
- [ ] >90% coverage on XP utils

---

### Task 7.2: Write Unit Tests for Resource Management

**ID**: CORE-7.2  
**Priority**: Medium  
**Dependencies**: CORE-1.5  
**Estimated Effort**: 1.5 hours

**Description**:
Test resource inventory operations.

**Test Cases**:
- Add resources increases count
- Remove resources decreases count
- Cannot remove more than available
- hasResources validates correctly

**Acceptance Criteria**:
- [ ] All resource functions tested
- [ ] Edge cases covered
- [ ] Tests pass consistently
- [ ] >90% coverage on resource code

---

### Task 7.3: Write Integration Test for Training Flow

**ID**: CORE-7.3  
**Priority**: Medium  
**Dependencies**: CORE-4.3, CORE-5.1  
**Estimated Effort**: 2 hours

**Description**:
Test complete training flow from start to level up.

**Test Scenario**:
1. Initialize new game
2. Start training activity
3. Simulate time passing
4. Verify XP gain
5. Verify resource production
6. Continue until level up
7. Verify new activities unlock

**Acceptance Criteria**:
- [ ] Complete flow test passes
- [ ] XP gains correctly
- [ ] Resources produced correctly
- [ ] Level up happens at threshold
- [ ] Activities unlock correctly

---

### Task 7.4: Write Integration Test for Save/Load

**ID**: CORE-7.4  
**Priority**: High  
**Dependencies**: CORE-2.4  
**Estimated Effort**: 1.5 hours

**Description**:
Test that game state persists correctly.

**Test Scenario**:
1. Initialize game with progress
2. Train activity
3. Gain resources
4. Save game
5. Clear state
6. Load game
7. Verify all state restored

**Acceptance Criteria**:
- [ ] State persists correctly
- [ ] All data restored accurately
- [ ] No data loss
- [ ] Handles corrupted saves

---

### Task 7.5: Performance Testing and Optimization

**ID**: CORE-7.5  
**Priority**: Medium  
**Dependencies**: CORE-3.1  
**Estimated Effort**: 3 hours

**Description**:
Profile game loop and optimize bottlenecks.

**Steps**:
1. Profile with React DevTools
2. Measure frame time
3. Identify slow components
4. Add memoization where needed
5. Optimize re-renders
6. Test on lower-end devices

**Performance Targets**:
- 60 FPS during training
- <50ms frame time
- <2s app startup
- <100ms save operation

**Acceptance Criteria**:
- [ ] Meets all performance targets
- [ ] No memory leaks
- [ ] Optimized re-renders
- [ ] Smooth on target devices

---

## Summary

**Total Tasks**: 35  
**High Priority**: 20 tasks  
**Medium Priority**: 13 tasks  
**Low Priority**: 2 tasks  

**Estimated Total Effort**: 60-70 hours

### Recommended Implementation Order:
1. Phase 1: Core State Management (5-6 hours)
2. Phase 2: Persistence Layer (5-6 hours)
3. Phase 3: Game Loop System (6-7 hours)
4. Phase 4: Training System (5-6 hours)
5. Phase 5: XP and Leveling (4-5 hours)
6. Phase 6: UI Components (12-15 hours)
7. Phase 7: Testing and Polish (10-12 hours)

### Critical Path:
CORE-1.1 → CORE-1.2 → CORE-1.3 → CORE-2.1 → CORE-2.2 → CORE-2.4 → CORE-3.1 → CORE-3.2 → CORE-3.3 → CORE-4.1 → CORE-4.3 → CORE-5.1 → CORE-5.2

This critical path represents the minimum viable implementation for a functional game loop with training and progression.
