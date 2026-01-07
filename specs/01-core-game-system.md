# Spec: Core Game System

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview
The core game system manages the fundamental mechanics of SkillForge Idle, including game loop, state management, and player progression tracking.

## Requirements

### Functional Requirements
1. **Game State Management**
   - Persist player progress across sessions
   - Track all skill levels and experience points
   - Store unlocked training activities
   - Maintain resource inventories

2. **Game Loop**
   - Background tick system (processes every 100ms)
   - Calculate XP gains from active training
   - Update skill levels when XP thresholds reached
   - Process resource generation/consumption

3. **Save System**
   - Auto-save every 30 seconds
   - Manual save option
   - Cloud save support (future)
   - Import/export save data

### Non-Functional Requirements
1. **Performance**
   - Game loop must run at 60 FPS
   - State updates should be batched
   - Maximum 50ms latency for UI updates

2. **Reliability**
   - No data loss on app crash
   - Validate save data integrity
   - Graceful degradation if features unavailable

## Technical Design

### State Structure
```typescript
interface GameState {
  player: {
    id: string;
    createdAt: number;
    lastSave: number;
  };
  skills: Record<SkillType, SkillState>;
  inventory: Record<string, number>;
  activeTraining: ActiveTraining | null;
  settings: GameSettings;
}

interface SkillState {
  level: number;
  experience: number;
  unlockedActivities: string[];
}

interface ActiveTraining {
  skillType: SkillType;
  activityId: string;
  startTime: number;
  duration: number;
}
```

### XP Calculation Formula
```
xpForLevel(n) = floor(n + 300 * 2^(n/7)) / 4
totalXPForLevel(n) = sum(xpForLevel(i) for i = 1 to n-1)
```

This formula creates an exponential curve similar to RuneScape:
- Level 2: 83 XP
- Level 50: 101,333 XP
- Level 99: 13,034,431 XP

## Dependencies
- React Native AsyncStorage for persistence
- Redux/Zustand for state management
- TypeScript for type safety

## Acceptance Criteria
- [ ] Player can start training any unlocked activity
- [ ] XP gains are calculated correctly
- [ ] Level-ups trigger when XP threshold reached
- [ ] Game state persists across app restarts
- [ ] Auto-save works reliably
- [ ] No performance degradation after extended play

## Future Enhancements
- Offline progress calculation
- Prestige system
- Achievement tracking
- Statistics dashboard
