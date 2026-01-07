# Implementation Plan: Toast Notifications

**Spec Reference**: [05-toast-notifications.md](05-toast-notifications.md)  
**Status**: Ready for Implementation  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This document outlines the technical implementation plan for the Toast Notifications specification. The plan breaks down the feature into concrete implementation phases with specific files and code changes.

## Current State Analysis

### ✅ Already Implemented
- **Game Store** (`src/store/gameStore.ts`): State management with Zustand
- **Training System**: Action completion flow in `completeTrainingAction()`
- **XP System**: Level-up detection in `checkLevelUp()`
- **Type Definitions** (`src/types/index.ts`): Core type infrastructure
- **UI Components**: Base component structure

### 🚧 Needs Implementation
- Toast notification types and interfaces
- Toast state management in game store
- ToastContainer component
- Toast component with animations
- Integration with training completion flow
- Integration with level-up detection
- Toast queue management logic
- Tests for toast functionality

## Technical Architecture

### Phase 1: Type Definitions & Store Integration

**Location**: `src/types/index.ts`

Add new toast-related types:

```typescript
export enum ToastType {
  XP_GAIN = 'xp_gain',
  ITEM_GAIN = 'item_gain',
  LEVEL_UP = 'level_up',
  ACTIVITY_UNLOCK = 'activity_unlock',
}

export interface ToastNotification {
  id: string;
  type: ToastType;
  skillType?: SkillType;
  message: string;
  details?: string[];
  icon?: string;
  duration?: number;
  timestamp: number;
}
```

**Location**: `src/store/gameStore.ts`

Add toast state and actions:

```typescript
interface GameStore {
  // ... existing properties
  
  toasts: ToastNotification[];
  
  // Toast actions
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}
```

**Implementation Details**:
1. Add `toasts: []` to initial state
2. Implement `addToast`:
   - Generate unique ID: `Date.now() + '-' + Math.random()`
   - Add timestamp
   - Limit queue to reasonable size (e.g., max 10 pending)
   - Append to toasts array
3. Implement `removeToast`:
   - Filter out toast by ID
4. Implement `clearAllToasts`:
   - Reset toasts to empty array

### Phase 2: Toast Components

**Location**: `src/components/Toast.tsx`

Create individual toast component:

**Key Features**:
- Accept toast notification as prop
- Render based on toast type
- Apply appropriate styling
- Handle tap-to-dismiss
- Animate entry/exit using Animated API

**Component Structure**:
```typescript
interface ToastProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
  index: number; // for stacking offset
}

export const Toast: React.FC<ToastProps> = ({
  notification,
  onDismiss,
  index,
}) => {
  // Animated value for slide/fade
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Entry animation on mount
  // Exit animation on dismiss
  // Auto-dismiss timer
  // Render toast content
};
```

**Location**: `src/components/ToastContainer.tsx`

Create container component:

**Key Features**:
- Position absolutely at top of screen
- Get toasts from store
- Render up to 3 toasts
- Pass dismiss handler to each toast
- Handle z-index layering

**Component Structure**:
```typescript
export const ToastContainer: React.FC = () => {
  const toasts = useGameStore(state => state.toasts);
  const removeToast = useGameStore(state => state.removeToast);
  
  // Get only the first 3 toasts
  const visibleToasts = toasts.slice(0, 3);
  
  return (
    <View style={styles.container}>
      {visibleToasts.map((toast, index) => (
        <Toast
          key={toast.id}
          notification={toast}
          onDismiss={removeToast}
          index={index}
        />
      ))}
    </View>
  );
};
```

### Phase 3: Store Integration

**Location**: `src/store/gameStore.ts`

Modify existing functions to trigger toasts:

**3.1 Update `completeTrainingAction`**:
```typescript
completeTrainingAction: () => {
  const state = get();
  const activeTraining = state.gameState.activeTraining;
  
  if (!activeTraining) return;
  
  const activity = getActivityById(activeTraining.skillType, activeTraining.activityId);
  if (!activity) return;
  
  // Award XP
  const previousLevel = state.getSkillLevel(activeTraining.skillType);
  state.addExperience(activeTraining.skillType, activity.xpGained);
  const newLevel = state.getSkillLevel(activeTraining.skillType);
  
  // Produce resources
  activity.products.forEach(product => {
    state.addResource(product.resourceId, product.quantity);
  });
  
  // Create toast notification
  if (newLevel > previousLevel) {
    // Level up toast
    const skill = getSkillById(activeTraining.skillType);
    state.addToast({
      type: ToastType.LEVEL_UP,
      skillType: activeTraining.skillType,
      message: `Level ${newLevel} ${skill?.name}!`,
      icon: '🎉',
      details: activity.products.map(p => 
        `+${p.quantity} ${getResourceById(p.resourceId)?.name || p.resourceId}`
      ),
    });
  } else {
    // Regular XP gain toast
    const skill = getSkillById(activeTraining.skillType);
    state.addToast({
      type: ToastType.XP_GAIN,
      skillType: activeTraining.skillType,
      message: `+${activity.xpGained} ${skill?.name} XP`,
      icon: skill?.icon,
      details: activity.products.map(p => 
        `+${p.quantity} ${getResourceById(p.resourceId)?.name || p.resourceId}`
      ),
    });
  }
  
  // Reset training start time to auto-continue
  // ... existing logic
};
```

**3.2 Update `checkLevelUp`** (optional - for activity unlocks):
```typescript
checkLevelUp: (skillType: SkillType) => {
  // ... existing logic
  
  if (newLevel > skill.level && newLevel <= 99) {
    // ... existing level up logic
    
    // Check for newly unlocked activities
    const previouslyUnlocked = skill.unlockedActivities;
    const skillData = getSkillById(skillType);
    const newlyUnlockedActivities = skillData?.activities
      .filter(a => 
        a.levelRequired <= newLevel && 
        a.levelRequired > (newLevel - 1) &&
        !previouslyUnlocked.includes(a.id)
      ) || [];
    
    if (newlyUnlockedActivities.length > 0) {
      get().addToast({
        type: ToastType.ACTIVITY_UNLOCK,
        skillType,
        message: 'New activities unlocked!',
        details: newlyUnlockedActivities.map(a => a.name),
      });
    }
    
    return true;
  }
  
  return false;
};
```

### Phase 4: App Integration

**Location**: `App.tsx`

Add ToastContainer to the app:

```typescript
import { ToastContainer } from './src/components/ToastContainer';

function App() {
  return (
    <>
      {/* Existing navigation/content */}
      <NavigationContainer>
        {/* ... */}
      </NavigationContainer>
      
      {/* Toast container - rendered on top */}
      <ToastContainer />
    </>
  );
}
```

The ToastContainer should be rendered as a sibling to the main navigation so it appears on top of all screens.

### Phase 5: Utility Functions (Optional)

**Location**: `src/utils/toast.ts`

Helper functions for creating toasts:

```typescript
export function createXpToast(
  skillType: SkillType,
  xpGained: number,
  itemsGained: ResourceProduct[]
): Omit<ToastNotification, 'id' | 'timestamp'> {
  const skill = getSkillById(skillType);
  return {
    type: ToastType.XP_GAIN,
    skillType,
    message: `+${xpGained} ${skill?.name} XP`,
    icon: skill?.icon,
    details: itemsGained.map(p => 
      `+${p.quantity} ${getResourceById(p.resourceId)?.name || p.resourceId}`
    ),
    duration: 3500,
  };
}

export function createLevelUpToast(
  skillType: SkillType,
  newLevel: number,
  itemsGained: ResourceProduct[]
): Omit<ToastNotification, 'id' | 'timestamp'> {
  const skill = getSkillById(skillType);
  return {
    type: ToastType.LEVEL_UP,
    skillType,
    message: `Level ${newLevel} ${skill?.name}!`,
    icon: '🎉',
    details: itemsGained.map(p => 
      `+${p.quantity} ${getResourceById(p.resourceId)?.name || p.resourceId}`
    ),
    duration: 4000,
  };
}
```

## Implementation Sequence

### Step 1: Type Definitions (15 minutes)
- Add ToastType enum to `src/types/index.ts`
- Add ToastNotification interface
- Export new types

### Step 2: Store Integration (30 minutes)
- Add toasts array to GameStore
- Implement addToast action
- Implement removeToast action
- Implement clearAllToasts action
- Test store actions in isolation

### Step 3: Toast Component (45 minutes)
- Create `src/components/Toast.tsx`
- Implement entry/exit animations
- Add tap-to-dismiss functionality
- Add auto-dismiss timer
- Style for different toast types
- Handle toast stacking offset

### Step 4: ToastContainer Component (20 minutes)
- Create `src/components/ToastContainer.tsx`
- Connect to store
- Render visible toasts
- Position absolutely at top

### Step 5: Training Integration (30 minutes)
- Modify `completeTrainingAction` to create toasts
- Capture level before XP gain
- Compare level after XP gain
- Create appropriate toast type
- Test with various activities

### Step 6: App Integration (10 minutes)
- Import ToastContainer in App.tsx
- Add to render tree
- Verify toast appears on top of all content

### Step 7: Testing & Polish (45 minutes)
- Add unit tests for toast creation
- Add integration tests for training flow
- Manual testing on iOS/Android
- Verify animations are smooth
- Adjust timings and styling
- Test edge cases (multiple toasts, rapid actions)

**Total Estimated Time**: 3-4 hours

## Testing Strategy

### Unit Tests

**File**: `src/store/__tests__/gameStore.toast.test.ts`

Test cases:
- Toast is added with unique ID and timestamp
- Toast is removed by ID
- All toasts are cleared
- Toast queue is limited (max 10)
- Toast contains correct data

**File**: `src/components/__tests__/Toast.test.tsx`

Test cases:
- Toast renders with correct content
- Toast auto-dismisses after duration
- Toast can be manually dismissed
- Toast animations run without errors

### Integration Tests

**File**: `src/store/__tests__/gameStore.integration.test.ts`

Test cases:
- Toast created on training completion
- Toast shows correct XP amount
- Toast shows correct items gained
- Level-up toast created when leveling up
- Activity unlock toast created when unlocking activities

### Manual Testing Checklist

- [ ] Toast appears when action completes
- [ ] Toast shows correct XP and skill
- [ ] Toast shows all items with quantities
- [ ] Level-up toast has special styling
- [ ] Toast auto-dismisses after 3-4 seconds
- [ ] Tap dismisses toast immediately
- [ ] Multiple toasts stack properly
- [ ] Maximum 3 toasts visible
- [ ] Animations are smooth
- [ ] Toast doesn't block interaction
- [ ] Works on iOS simulator
- [ ] Works on Android emulator
- [ ] Accessible with VoiceOver/TalkBack

## Design Specifications

### Toast Dimensions
- Width: Screen width - 32px (16px padding on each side)
- Height: Auto (min 60px)
- Border radius: 12px
- Padding: 12px 16px

### Spacing
- Top margin from safe area: 16px
- Vertical spacing between toasts: 8px
- Icon to text spacing: 12px

### Typography
- Primary message: 16px, semi-bold (600)
- Details: 14px, regular (400)
- Line height: 1.4

### Colors

**XP Gain Toast**:
- Background: `rgba(255, 255, 255, 0.95)`
- Text: `#333333`
- Border: Skill-specific (Woodcutting: `#8B4513`)
- Shadow: `rgba(0, 0, 0, 0.15)`

**Level Up Toast**:
- Background: Linear gradient `#FFD700` to `#FFED4E`
- Text: `#654321`
- Border: `#FFD700` (3px)
- Shadow: `rgba(255, 215, 0, 0.5)` (glow effect)

**Item Gain Toast**:
- Background: `rgba(255, 255, 255, 0.95)`
- Text: `#333333`
- Border: `#4CAF50` (2px)
- Shadow: `rgba(0, 0, 0, 0.15)`

### Animation Timings
- Entry duration: 250ms
- Exit duration: 200ms
- Easing: `easeOutCubic` for entry, `easeInCubic` for exit
- Auto-dismiss delay: 3500ms (XP), 4000ms (level-up)

## Potential Challenges & Solutions

### Challenge 1: Performance with Rapid Actions
**Problem**: Player performs many actions quickly, creating too many toasts.

**Solution**: 
- Limit toast queue to 10 maximum
- Consider batching toasts that occur within 500ms
- Only show first 3, queue the rest

### Challenge 2: Toast Overlap with UI Elements
**Problem**: Toast might cover important UI like buttons.

**Solution**:
- Position at top of screen by default
- Ensure proper z-index layering
- Make toasts semi-transparent
- Consider alternative: bottom position option

### Challenge 3: Animation Performance
**Problem**: Multiple simultaneous animations could be janky.

**Solution**:
- Use native driver for animations
- Limit simultaneous animations to 3
- Use transform and opacity only (GPU-accelerated)
- Test on lower-end devices

### Challenge 4: Memory Leaks from Timers
**Problem**: Auto-dismiss timers might not clean up properly.

**Solution**:
- Clear timers in useEffect cleanup
- Use refs for timer IDs
- Remove toast from store when component unmounts
- Test for leaks with React DevTools

## Dependencies

### No New External Dependencies Required
- Use built-in React Native Animated API
- Use built-in React hooks
- Use existing Zustand store
- Use existing TypeScript types

### Internal Dependencies
- `src/store/gameStore.ts` - State management
- `src/types/index.ts` - Type definitions
- `src/data/index.ts` - Resource/skill data access
- `src/utils/xp.ts` - Level calculations

## Rollout Plan

### Phase 1: Basic Toast (MVP)
- Simple toast with message only
- Single toast at a time
- Basic fade in/out animation
- Auto-dismiss only

### Phase 2: Enhanced Toasts (This Implementation)
- Multiple toast types with styling
- Toast queue (3 visible)
- Details array for items
- Tap to dismiss
- Slide animations

### Phase 3: Advanced Features (Future)
- Settings toggle
- Sound effects
- Toast history
- Configurable position
- Customizable duration

## Success Metrics

### User Experience Metrics
- Toast visibility: >95% of toasts fully visible
- Animation smoothness: 60 FPS target
- Dismiss rate: <30% manual dismiss (most auto-dismiss)
- No user complaints about intrusiveness

### Technical Metrics
- Performance: <5ms overhead per toast creation
- Memory: <10MB for toast system
- No memory leaks after 1000+ toasts
- 100% test coverage for toast logic

## References

- Specification: [05-toast-notifications.md](05-toast-notifications.md)
- React Native Animated: https://reactnative.dev/docs/animated
- React Native Accessibility: https://reactnative.dev/docs/accessibility
- Zustand Documentation: https://docs.pmnd.rs/zustand
