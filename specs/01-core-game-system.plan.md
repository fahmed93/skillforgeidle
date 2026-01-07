# Implementation Plan: Core Game System

**Spec Reference**: [01-core-game-system.md](01-core-game-system.md)  
**Status**: Ready for Implementation  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This document outlines the technical implementation plan for the Core Game System specification. The plan breaks down the specification into concrete technical components and provides an implementation roadmap.

## Current State Analysis

### ✅ Already Implemented
- **Type Definitions** (`src/types/index.ts`): Complete TypeScript interfaces for GameState, SkillState, Activity, etc.
- **XP Utilities** (`src/utils/xp.ts`): RuneScape-inspired XP calculation formulas
- **Skill Data** (`src/data/`): All 6 skills with 55+ activities defined
- **Data Access Layer** (`src/data/index.ts`): Helper functions for accessing skill/activity data

### 🚧 Needs Implementation
- State management store (Zustand)
- Game loop system
- Save/load persistence layer
- Training activity management
- Level-up detection and handling
- Resource inventory management
- UI components and screens
- Navigation setup

## Technical Architecture

### 1. State Management with Zustand

**Technology**: Zustand 4.4+  
**Location**: `src/store/gameStore.ts`

**Store Structure**:
```typescript
interface GameStore {
  // State
  gameState: GameState;
  isInitialized: boolean;
  
  // Computed getters
  getSkillState: (skillType: SkillType) => SkillState;
  getResourceCount: (resourceId: string) => number;
  canStartActivity: (activity: Activity) => boolean;
  
  // Training actions
  startTraining: (skillType: SkillType, activityId: string) => void;
  stopTraining: () => void;
  
  // Internal game loop actions
  updateTrainingProgress: (deltaTimeMs: number) => void;
  completeTrainingAction: () => void;
  
  // XP and leveling actions
  addExperience: (skillType: SkillType, amount: number) => void;
  checkLevelUp: (skillType: SkillType) => boolean;
  
  // Resource actions
  addResource: (resourceId: string, quantity: number) => void;
  removeResource: (resourceId: string, quantity: number) => boolean;
  hasResources: (requirements: ResourceRequirement[]) => boolean;
  
  // Persistence actions
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;
  initializeNewGame: () => void;
}
```

**Key Design Decisions**:
- Use Zustand for lightweight, performant state management
- Store entire GameState in a single store for simplicity
- Separate actions for game logic vs. persistence
- Computed selectors for derived state
- Middleware for auto-save functionality

### 2. Game Loop System

**Technology**: React hook with requestAnimationFrame  
**Location**: `src/hooks/useGameLoop.ts`

**Implementation Approach**:
- Custom React hook that runs the game loop
- Uses `requestAnimationFrame` for 60 FPS target
- Tracks delta time between frames
- Calls store actions to update training progress
- Handles activity completion and resource production
- Auto-saves at configurable intervals (default: 30 seconds)

**Core Logic**:
```typescript
function useGameLoop() {
  const updateTrainingProgress = useGameStore(state => state.updateTrainingProgress);
  const activeTraining = useGameStore(state => state.gameState.activeTraining);
  
  useEffect(() => {
    let lastTime = performance.now();
    let accumulatedTime = 0;
    let lastSaveTime = Date.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Update training progress
      if (activeTraining) {
        updateTrainingProgress(deltaTime);
      }
      
      // Auto-save check
      if (Date.now() - lastSaveTime > 30000) {
        saveGame();
        lastSaveTime = Date.now();
      }
      
      requestAnimationFrame(gameLoop);
    };
    
    const frameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameId);
  }, [activeTraining]);
}
```

### 3. Persistence Layer

**Technology**: AsyncStorage  
**Location**: `src/utils/save.ts`

**Save Format**:
```typescript
interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
  checksum?: string; // For data integrity validation
}
```

**Key Functions**:
- `saveGameState(state: GameState): Promise<void>` - Serialize and save to AsyncStorage
- `loadGameState(): Promise<GameState | null>` - Load and deserialize from AsyncStorage
- `validateSaveData(data: SaveData): boolean` - Validate save data integrity
- `migrateData(data: any, version: string): SaveData` - Handle save format migrations
- `exportSaveData(): Promise<string>` - Export save as JSON string
- `importSaveData(data: string): Promise<boolean>` - Import save from JSON string

**Error Handling**:
- Wrap all AsyncStorage calls in try-catch
- Log errors for debugging
- Return default state if load fails
- Create backup before overwriting saves

### 4. Training System

**Location**: `src/hooks/useSkillTraining.ts`

**Hook Interface**:
```typescript
interface UseSkillTrainingReturn {
  currentActivity: Activity | null;
  progress: number; // 0-100
  timeRemaining: number; // milliseconds
  canStartActivity: (activity: Activity) => boolean;
  startActivity: (skillType: SkillType, activityId: string) => void;
  stopActivity: () => void;
  activityStatus: 'idle' | 'training' | 'completing';
}
```

**Training Flow**:
1. User selects an activity
2. Validate requirements (level, resources)
3. Consume required resources
4. Store training state in GameStore
5. Game loop updates progress
6. On completion:
   - Award XP
   - Check for level up
   - Produce resources
   - Auto-start next iteration or stop

### 5. Level-Up System

**Location**: Integrated in `src/store/gameStore.ts`

**Detection Logic**:
- After each XP gain, check if level threshold exceeded
- Use `getLevelFromXp()` utility to calculate new level
- Compare with current stored level
- If increased, trigger level-up sequence

**Level-Up Sequence**:
1. Update skill level in state
2. Check for newly unlocked activities
3. Add unlocked activity IDs to `unlockedActivities` array
4. Show level-up notification (future: UI component)
5. Save game state
6. Return level-up event data for UI

### 6. Resource Management

**Location**: Integrated in `src/store/gameStore.ts`

**Inventory Operations**:
- `addResource(id, quantity)` - Add items to inventory
- `removeResource(id, quantity)` - Remove items if available
- `hasResources(requirements)` - Check if player has required resources
- `getResourceCount(id)` - Get current quantity of a resource

**Design Notes**:
- Use `Record<string, number>` for O(1) lookups
- Initialize missing resources to 0
- Prevent negative quantities
- Support batch operations for activity completion

## Implementation Phases

### Phase 1: Core State Management (Priority: High)
**Duration**: 2-3 days  
**Deliverables**:
- Zustand store setup
- Initial game state management
- Basic actions (initialize, save, load)
- Type-safe store hooks

**Acceptance Criteria**:
- Store can be created and accessed from components
- Game state can be initialized with default values
- State updates are reactive and trigger re-renders

### Phase 2: Persistence Layer (Priority: High)
**Duration**: 1-2 days  
**Deliverables**:
- Save/load utilities
- AsyncStorage integration
- Data validation and error handling
- Save format versioning

**Acceptance Criteria**:
- Game state persists across app restarts
- Invalid save data is handled gracefully
- Save operations don't block UI
- Data integrity is maintained

### Phase 3: Game Loop System (Priority: High)
**Duration**: 2-3 days  
**Deliverables**:
- useGameLoop hook
- requestAnimationFrame integration
- Delta time calculations
- Auto-save functionality

**Acceptance Criteria**:
- Loop runs at target 60 FPS
- Training progress updates smoothly
- Auto-save triggers every 30 seconds
- No memory leaks or performance degradation

### Phase 4: Training System (Priority: High)
**Duration**: 2-3 days  
**Deliverables**:
- useSkillTraining hook
- Start/stop training actions
- Resource consumption/production
- Activity completion handling

**Acceptance Criteria**:
- Players can start any unlocked activity
- Resources are consumed/produced correctly
- Progress is tracked and displayed
- Activities complete after specified duration

### Phase 5: XP and Leveling (Priority: Medium)
**Duration**: 1-2 days  
**Deliverables**:
- XP gain actions
- Level-up detection
- Activity unlock tracking
- Level-up notifications

**Acceptance Criteria**:
- XP is awarded correctly
- Levels increase at correct thresholds
- New activities unlock at appropriate levels
- Level-up events are detectable by UI

### Phase 6: UI Components (Priority: Medium)
**Duration**: 3-4 days  
**Deliverables**:
- Skills overview screen
- Skill training screen
- Activity selection components
- Progress bars and XP displays
- Resource inventory display

**Acceptance Criteria**:
- All core screens are functional
- UI updates reactively to state changes
- Touch interactions work correctly
- Layouts are responsive

### Phase 7: Testing and Polish (Priority: Medium)
**Duration**: 2-3 days  
**Deliverables**:
- Unit tests for game logic
- Integration tests for training flow
- Performance optimization
- Bug fixes

**Acceptance Criteria**:
- >80% code coverage on game logic
- All critical flows have tests
- No known bugs
- Performance meets targets

## Technical Dependencies

### Required Packages
```json
{
  "zustand": "^4.4.0",
  "@react-native-async-storage/async-storage": "^1.19.0",
  "react-navigation": "^6.0.0" (future - for navigation)
}
```

### Development Dependencies
```json
{
  "@testing-library/react-native": "^12.0.0",
  "@testing-library/jest-native": "^5.4.0"
}
```

## Performance Considerations

### Game Loop Optimization
- Use `deltaTime` for frame-rate independent timing
- Batch state updates where possible
- Avoid creating new objects in hot paths
- Use `useMemo` for expensive calculations

### State Management Optimization
- Use Zustand selectors to prevent unnecessary re-renders
- Split large components into smaller ones
- Memoize selector functions
- Consider using `shallow` equality for objects

### Persistence Optimization
- Debounce auto-save to reduce writes
- Compress save data if size becomes an issue
- Use async operations to avoid blocking
- Cache parsed save data

## Risk Mitigation

### Risk: Save Data Corruption
**Mitigation**:
- Implement checksums for data validation
- Create backup before overwriting
- Version save format for migrations
- Test with corrupted data scenarios

### Risk: Performance Degradation
**Mitigation**:
- Profile game loop with React DevTools
- Set performance budgets (50ms max frame time)
- Monitor bundle size
- Test on low-end devices

### Risk: State Management Complexity
**Mitigation**:
- Keep store actions focused and single-purpose
- Document complex state transitions
- Write tests for all state mutations
- Use TypeScript for type safety

## Testing Strategy

### Unit Tests
- XP calculation functions
- Resource management operations
- Level-up detection logic
- Save/load serialization

### Integration Tests
- Complete training activity flow
- Level progression from 1-99
- Resource production chains
- Save/load/restore cycle

### Manual Testing
- App restart with active training
- Multiple skills training sequentially
- Resource consumption edge cases
- UI responsiveness under load

## Success Metrics

### Functional Metrics
- All acceptance criteria from spec are met
- Zero data loss incidents in testing
- All 6 skills are trainable
- XP calculations match RuneScape formula exactly

### Performance Metrics
- Game loop maintains 60 FPS
- State updates complete in <50ms
- Save operations complete in <100ms
- App startup time <2 seconds

### Quality Metrics
- >80% code coverage on game logic
- Zero critical bugs
- TypeScript strict mode with no errors
- All ESLint rules passing

## Future Enhancements

These items are out of scope for initial implementation but should be considered in the architecture:

1. **Offline Progress**: Calculate XP/resources gained while app was closed
2. **Cloud Sync**: Sync save data across devices
3. **Statistics Tracking**: Track total XP gained, activities completed, etc.
4. **Achievement System**: Award achievements for milestones
5. **Prestige System**: Reset skills for permanent bonuses
6. **Multiple Save Slots**: Allow players to have multiple games

## References

- [Core Game System Spec](01-core-game-system.md)
- [Skill System Spec](02-skill-system.md)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
