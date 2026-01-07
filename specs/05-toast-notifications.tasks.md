# Task Breakdown: Toast Notifications

**Spec Reference**: [05-toast-notifications.md](05-toast-notifications.md)  
**Plan Reference**: [05-toast-notifications.plan.md](05-toast-notifications.plan.md)  
**Status**: Ready to Execute  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This document breaks down the Toast Notifications feature into granular, actionable tasks suitable for implementation. Each task is designed to be completed independently and includes clear acceptance criteria.

## Task Organization

Tasks are organized into phases that build on each other. Complete all tasks in a phase before moving to the next phase.

---

## Phase 1: Foundation - Type Definitions

### Task 1.1: Add Toast Type Definitions
**File**: `src/types/index.ts`

**Description**: Add TypeScript types and enums for toast notifications.

**Changes**:
```typescript
// Add at the end of the file

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

**Acceptance Criteria**:
- [ ] ToastType enum exported with 4 values
- [ ] ToastNotification interface exported
- [ ] All fields properly typed
- [ ] No TypeScript errors
- [ ] File compiles successfully

**Estimated Time**: 5 minutes

---

## Phase 2: Store Integration

### Task 2.1: Add Toast State to Game Store
**File**: `src/store/gameStore.ts`

**Description**: Add toast array to the GameStore interface and initial state.

**Changes**:
1. Import ToastNotification type at top:
   ```typescript
   import { GameState, SkillType, SkillState, ResourceRequirement, ToastNotification } from '../types';
   ```

2. Add to GameStore interface:
   ```typescript
   interface GameStore {
     // ... existing properties
     
     // Toast state
     toasts: ToastNotification[];
     
     // Toast actions
     addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
     removeToast: (id: string) => void;
     clearAllToasts: () => void;
   }
   ```

3. Add to initial store state:
   ```typescript
   export const useGameStore = create<GameStore>((set, get) => ({
     gameState: createInitialGameState(),
     isInitialized: false,
     toasts: [], // Add this line
     
     // ... rest of implementation
   ```

**Acceptance Criteria**:
- [ ] toasts array added to store
- [ ] Interface updated with toast actions
- [ ] No TypeScript errors
- [ ] Store initializes successfully

**Estimated Time**: 5 minutes

### Task 2.2: Implement addToast Action
**File**: `src/store/gameStore.ts`

**Description**: Implement the addToast action to add new toasts to the queue.

**Changes**:
Add implementation after `clearAllToasts` placeholder (or at the end before closing `}));`):

```typescript
  // Toast actions
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();
    
    set(state => {
      const newToast: ToastNotification = {
        ...toast,
        id,
        timestamp,
        duration: toast.duration || 3500,
      };
      
      // Limit queue to 10 toasts max
      const updatedToasts = [...state.toasts, newToast].slice(-10);
      
      return { toasts: updatedToasts };
    });
  },
```

**Acceptance Criteria**:
- [ ] Function generates unique ID
- [ ] Function adds timestamp
- [ ] Function applies default duration (3500ms)
- [ ] Function limits queue to 10 toasts
- [ ] Toast is added to state array
- [ ] No TypeScript errors

**Estimated Time**: 10 minutes

### Task 2.3: Implement removeToast Action
**File**: `src/store/gameStore.ts`

**Description**: Implement the removeToast action to dismiss toasts.

**Changes**:
```typescript
  removeToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },
```

**Acceptance Criteria**:
- [ ] Function removes toast by ID
- [ ] Function doesn't error if ID not found
- [ ] Other toasts remain in array
- [ ] No TypeScript errors

**Estimated Time**: 5 minutes

### Task 2.4: Implement clearAllToasts Action
**File**: `src/store/gameStore.ts`

**Description**: Implement the clearAllToasts action to clear all toasts.

**Changes**:
```typescript
  clearAllToasts: () => {
    set({ toasts: [] });
  },
```

**Acceptance Criteria**:
- [ ] Function clears all toasts
- [ ] State updates correctly
- [ ] No TypeScript errors

**Estimated Time**: 3 minutes

---

## Phase 3: Toast Components

### Task 3.1: Create Toast Component
**File**: `src/components/Toast.tsx` (new file)

**Description**: Create individual toast component with animations.

**Implementation**:
```typescript
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import type { ToastNotification } from '../types';
import { ToastType } from '../types';

interface ToastProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
  index: number;
}

export const Toast: React.FC<ToastProps> = ({
  notification,
  onDismiss,
  index,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss timer
    dismissTimerRef.current = setTimeout(() => {
      handleDismiss();
    }, notification.duration || 3500);

    // Cleanup
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  const handleDismiss = () => {
    // Exit animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(notification.id);
    });
  };

  const getToastStyle = () => {
    switch (notification.type) {
      case ToastType.LEVEL_UP:
        return styles.levelUpToast;
      case ToastType.XP_GAIN:
        return styles.xpGainToast;
      case ToastType.ITEM_GAIN:
        return styles.itemGainToast;
      case ToastType.ACTIVITY_UNLOCK:
        return styles.activityUnlockToast;
      default:
        return styles.defaultToast;
    }
  };

  const getTextStyle = () => {
    switch (notification.type) {
      case ToastType.LEVEL_UP:
        return styles.levelUpText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getToastStyle(),
        {
          opacity,
          transform: [
            { translateY },
            { translateY: index * 68 }, // Stack offset
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleDismiss}
        style={styles.touchable}
      >
        <View style={styles.content}>
          {notification.icon && (
            <Text style={styles.icon}>{notification.icon}</Text>
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.message, getTextStyle()]}>
              {notification.message}
            </Text>
            {notification.details && notification.details.length > 0 && (
              <View style={styles.detailsContainer}>
                {notification.details.map((detail, idx) => (
                  <Text key={idx} style={[styles.detail, getTextStyle()]}>
                    {detail}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    width: width - 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  touchable: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsContainer: {
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  defaultToast: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  xpGainToast: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  levelUpToast: {
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#FFA500',
  },
  itemGainToast: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  activityUnlockToast: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#9C27B0',
  },
  defaultText: {
    color: '#333',
  },
  levelUpText: {
    color: '#654321',
  },
});
```

**Acceptance Criteria**:
- [ ] Component renders without errors
- [ ] Entry animation works smoothly
- [ ] Exit animation works smoothly
- [ ] Auto-dismiss timer works
- [ ] Manual dismiss (tap) works
- [ ] Different styles for different toast types
- [ ] Details array renders correctly
- [ ] Icon displays if provided
- [ ] Timer cleans up on unmount
- [ ] No memory leaks

**Estimated Time**: 45 minutes

### Task 3.2: Create ToastContainer Component
**File**: `src/components/ToastContainer.tsx` (new file)

**Description**: Create container component to manage and display toasts.

**Implementation**:
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const toasts = useGameStore(state => state.toasts);
  const removeToast = useGameStore(state => state.removeToast);

  // Show only the first 3 toasts
  const visibleToasts = toasts.slice(0, 3);

  return (
    <View style={styles.container} pointerEvents="box-none">
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
```

**Acceptance Criteria**:
- [ ] Component renders without errors
- [ ] Subscribes to toast store
- [ ] Limits visible toasts to 3
- [ ] Passes removeToast to children
- [ ] Positioned absolutely with high z-index
- [ ] pointerEvents="box-none" allows interaction below

**Estimated Time**: 15 minutes

---

## Phase 4: Integration with Game Logic

### Task 4.1: Integrate Toast with Training Completion
**File**: `src/store/gameStore.ts`

**Description**: Modify completeTrainingAction to create toast notifications.

**Changes**:
Update the `completeTrainingAction` method:

```typescript
  completeTrainingAction: () => {
    const state = get();
    const activeTraining = state.gameState.activeTraining;

    if (!activeTraining) {return;}

    const activity = getActivityById(activeTraining.skillType, activeTraining.activityId);
    if (!activity) {return;}

    // Capture current level before XP gain
    const previousLevel = state.getSkillLevel(activeTraining.skillType);

    // Award XP
    state.addExperience(activeTraining.skillType, activity.xpGained);

    // Get new level after XP gain
    const newLevel = state.getSkillLevel(activeTraining.skillType);

    // Produce resources
    activity.products.forEach(product => {
      state.addResource(product.resourceId, product.quantity);
    });

    // Create appropriate toast notification
    const skill = getSkillById(activeTraining.skillType);
    
    if (newLevel > previousLevel) {
      // Level up toast
      state.addToast({
        type: 'level_up' as any, // Will use ToastType.LEVEL_UP
        skillType: activeTraining.skillType,
        message: `Level ${newLevel} ${skill?.name}!`,
        icon: '🎉',
        details: activity.products.length > 0 
          ? activity.products.map(p => `+${p.quantity} ${p.resourceId}`)
          : undefined,
        duration: 4000,
      });
    } else {
      // Regular XP gain toast
      state.addToast({
        type: 'xp_gain' as any, // Will use ToastType.XP_GAIN
        skillType: activeTraining.skillType,
        message: `+${activity.xpGained} ${skill?.name} XP`,
        icon: skill?.icon,
        details: activity.products.length > 0
          ? activity.products.map(p => `+${p.quantity} ${p.resourceId}`)
          : undefined,
      });
    }

    // Reset training start time to auto-continue
    set(currentState => ({
      gameState: {
        ...currentState.gameState,
        activeTraining: activeTraining ? {
          ...activeTraining,
          startTime: Date.now(),
        } : null,
      },
    }));
  },
```

**Acceptance Criteria**:
- [ ] Toast created on every action completion
- [ ] Level up toast created when leveling up
- [ ] Regular XP toast created when not leveling up
- [ ] Toast shows correct XP amount
- [ ] Toast shows correct items gained
- [ ] Toast shows correct skill name and icon
- [ ] Level up toast has longer duration (4000ms)
- [ ] No errors when completing actions

**Estimated Time**: 30 minutes

### Task 4.2: Import ToastType Properly
**File**: `src/store/gameStore.ts`

**Description**: Import and use ToastType enum in addToast calls.

**Changes**:
1. Update import at top:
   ```typescript
   import { GameState, SkillType, SkillState, ResourceRequirement, ToastNotification, ToastType } from '../types';
   ```

2. Update toast creation in completeTrainingAction:
   ```typescript
   // Replace 'level_up' as any with:
   type: ToastType.LEVEL_UP,
   
   // Replace 'xp_gain' as any with:
   type: ToastType.XP_GAIN,
   ```

**Acceptance Criteria**:
- [ ] ToastType imported correctly
- [ ] All toast types use enum values
- [ ] No TypeScript errors
- [ ] Type safety maintained

**Estimated Time**: 5 minutes

---

## Phase 5: App Integration

### Task 5.1: Add ToastContainer to App
**File**: `App.tsx`

**Description**: Integrate ToastContainer into the main app component.

**Changes**:
1. Import ToastContainer:
   ```typescript
   import { ToastContainer } from './src/components/ToastContainer';
   ```

2. Add to render tree (after NavigationContainer):
   ```typescript
   return (
     <>
       {/* Existing navigation/content */}
       <NavigationContainer>
         {/* ... existing code ... */}
       </NavigationContainer>
       
       {/* Toast container - renders on top of everything */}
       <ToastContainer />
     </>
   );
   ```

**Acceptance Criteria**:
- [ ] ToastContainer imported
- [ ] ToastContainer added to render tree
- [ ] ToastContainer renders on top of all content
- [ ] App compiles without errors
- [ ] No runtime errors

**Estimated Time**: 10 minutes

---

## Phase 6: Testing

### Task 6.1: Manual Testing - Basic Toast
**Description**: Verify toast appears and functions correctly.

**Test Steps**:
1. Start the app
2. Navigate to a skill training screen
3. Start a training activity
4. Wait for action to complete
5. Observe toast appears at top
6. Verify toast shows correct XP amount
7. Verify toast shows correct items
8. Wait for toast to auto-dismiss
9. Verify toast disappears

**Acceptance Criteria**:
- [ ] Toast appears on action completion
- [ ] Toast shows correct data
- [ ] Toast auto-dismisses after ~3.5 seconds
- [ ] Animation is smooth
- [ ] No errors in console

**Estimated Time**: 10 minutes

### Task 6.2: Manual Testing - Level Up Toast
**Description**: Verify level-up toast has special styling.

**Test Steps**:
1. Find a low-level skill
2. Train activity to gain XP
3. Complete enough actions to level up
4. Observe level-up toast appears
5. Verify gold background
6. Verify celebration icon (🎉)
7. Verify toast shows new level
8. Verify toast stays longer (~4 seconds)

**Acceptance Criteria**:
- [ ] Level-up toast has gold background
- [ ] Level-up toast shows celebration icon
- [ ] Level-up toast shows correct new level
- [ ] Level-up toast duration is longer
- [ ] Still shows items gained

**Estimated Time**: 10 minutes

### Task 6.3: Manual Testing - Multiple Toasts
**Description**: Verify toast queue works correctly.

**Test Steps**:
1. Choose fast activity (short duration)
2. Let multiple actions complete rapidly
3. Observe multiple toasts appear
4. Verify max 3 toasts visible
5. Verify toasts stack vertically
6. Verify older toasts dismiss first
7. Tap a toast to dismiss manually
8. Verify manual dismiss works

**Acceptance Criteria**:
- [ ] Multiple toasts can appear
- [ ] Maximum 3 toasts visible
- [ ] Toasts stack with proper offset
- [ ] Toasts don't overlap
- [ ] Manual dismiss (tap) works
- [ ] Auto-dismiss queue works properly

**Estimated Time**: 15 minutes

### Task 6.4: Manual Testing - Edge Cases
**Description**: Test edge cases and error scenarios.

**Test Steps**:
1. Test with very long activity names
2. Test with many items gained (5+)
3. Test with no items gained
4. Test rapid start/stop training
5. Navigate away during toast display
6. Return and verify toast still works

**Acceptance Criteria**:
- [ ] Long text doesn't break layout
- [ ] Many items display correctly
- [ ] Toast works with no items
- [ ] No errors with rapid actions
- [ ] Toasts work after navigation

**Estimated Time**: 15 minutes

---

## Phase 7: Documentation & Cleanup

### Task 7.1: Add Code Comments
**Files**: 
- `src/components/Toast.tsx`
- `src/components/ToastContainer.tsx`
- `src/store/gameStore.ts` (toast sections)

**Description**: Add JSDoc comments to toast-related code.

**Acceptance Criteria**:
- [ ] Toast component has description comment
- [ ] ToastContainer has description comment
- [ ] Toast actions in store have comments
- [ ] Complex logic has inline comments

**Estimated Time**: 10 minutes

### Task 7.2: Update Project Documentation
**File**: `PROJECT_SUMMARY.md`

**Description**: Add toast notification feature to project summary.

**Changes**:
Add to features section:
```markdown
- **Toast Notifications**: Real-time feedback popups showing XP gains, items acquired, and level-up celebrations
```

**Acceptance Criteria**:
- [ ] Toast feature documented
- [ ] Description is clear and concise

**Estimated Time**: 5 minutes

---

## Summary

### Total Tasks: 18
- Phase 1: 1 task (5 min)
- Phase 2: 4 tasks (23 min)
- Phase 3: 2 tasks (60 min)
- Phase 4: 2 tasks (35 min)
- Phase 5: 1 task (10 min)
- Phase 6: 4 tasks (50 min)
- Phase 7: 2 tasks (15 min)

### Total Estimated Time: ~3 hours 18 minutes

### Prerequisites
- React Native development environment set up
- App runs successfully
- Training system working

### Completion Checklist
- [ ] All Phase 1 tasks complete
- [ ] All Phase 2 tasks complete
- [ ] All Phase 3 tasks complete
- [ ] All Phase 4 tasks complete
- [ ] All Phase 5 tasks complete
- [ ] All Phase 6 tasks complete
- [ ] All Phase 7 tasks complete
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] All manual tests passed
- [ ] Code reviewed
- [ ] Documentation updated

### Post-Implementation
After completing all tasks:
1. Run full test suite
2. Test on both iOS and Android
3. Create PR with screenshots
4. Update spec status to "Implemented"
5. Update plan status to "Complete"
