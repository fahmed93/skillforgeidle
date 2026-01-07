# Spec: Toast Notifications

**Status**: Ready for Implementation  
**Version**: 1.0  
**Last Updated**: 2026-01-07  
**Implementation Plan**: [05-toast-notifications.plan.md](05-toast-notifications.plan.md)  
**Task Breakdown**: [05-toast-notifications.tasks.md](05-toast-notifications.tasks.md)

## Overview

Toast notifications provide real-time feedback to players when they complete training actions, gain experience, acquire items, or achieve milestones like leveling up. This feature enhances player engagement by making progress visible and rewarding.

## Requirements

### Functional Requirements

1. **Toast Display Triggers**
   - Display toast when a training action completes
   - Show experience gained with skill name
   - Show items/resources gained with quantities
   - Highlight level-up milestones
   - Show newly unlocked activities (optional)

2. **Toast Content**
   - Skill icon or resource icon
   - Primary message (e.g., "+50 Woodcutting XP")
   - Secondary messages for items (e.g., "+1 Oak Log")
   - Special styling for level-ups (e.g., "🎉 Level 45 Woodcutting!")
   - Support multiple items in a single toast

3. **Toast Behavior**
   - Auto-dismiss after 3-4 seconds
   - Support stacking multiple toasts (queue system)
   - Animate in from top or bottom
   - Tap to dismiss immediately
   - Maximum 3 toasts visible at once

4. **Toast Types**
   - **XP Gain**: Shows experience gained
   - **Item Gain**: Shows resources/items acquired
   - **Level Up**: Special celebration for level milestones
   - **Activity Unlock**: Notification when new activities unlock

### Non-Functional Requirements

1. **Performance**
   - Toast animations should be smooth (60 FPS)
   - Minimal impact on game loop performance
   - Efficient toast queue management
   - No memory leaks from unmounted toasts

2. **User Experience**
   - Non-intrusive - doesn't block game interaction
   - Clear, readable text
   - Appropriate animation timing
   - Consistent visual style
   - Accessible to screen readers

3. **Configurability**
   - Toast duration should be configurable
   - Option to disable toasts in settings (future)
   - Customizable position (top/bottom)

## Technical Design

### Data Structures

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
  duration?: number; // milliseconds, default 3500
  timestamp: number;
}

export interface ToastState {
  toasts: ToastNotification[];
  maxVisible: number;
}
```

### Store Integration

Add toast management to the game store:

```typescript
interface GameStore {
  // ... existing properties
  
  // Toast state
  toastState: ToastState;
  
  // Toast actions
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}
```

### Component Structure

**ToastContainer Component**:
- Positioned absolutely at top or bottom of screen
- Renders list of active toasts
- Manages toast animations
- Handles auto-dismiss timers

**Toast Component**:
- Displays individual toast content
- Handles tap-to-dismiss
- Animates in/out
- Different styling based on toast type

### Toast Creation Flow

1. **When training action completes**:
   ```typescript
   completeTrainingAction: () => {
     // ... existing logic
     
     // Calculate what was gained
     const xpGained = activity.xpGained;
     const itemsGained = activity.products;
     const leveledUp = checkLevelUp(skillType);
     
     // Create toast notification
     if (leveledUp) {
       addToast({
         type: ToastType.LEVEL_UP,
         skillType,
         message: `Level ${newLevel} ${skillName}!`,
         icon: '🎉',
       });
     } else {
       const details = itemsGained.map(p => 
         `+${p.quantity} ${getResourceName(p.resourceId)}`
       );
       addToast({
         type: ToastType.XP_GAIN,
         skillType,
         message: `+${xpGained} ${skillName} XP`,
         details,
         icon: skillIcon,
       });
     }
   }
   ```

2. **When activities unlock**:
   ```typescript
   checkLevelUp: (skillType) => {
     // ... existing logic
     
     if (newActivitiesUnlocked.length > 0) {
       addToast({
         type: ToastType.ACTIVITY_UNLOCK,
         skillType,
         message: 'New activities unlocked!',
         details: newActivitiesUnlocked.map(a => a.name),
       });
     }
   }
   ```

### Animation Specifications

- **Entry Animation**: Slide in from top with fade (250ms)
- **Exit Animation**: Fade out and slide up (200ms)
- **Stacking**: Each toast offset by 10px vertically
- **Interaction**: Tap anywhere on toast to dismiss

### Styling Guidelines

**XP Gain Toast**:
- Background: Semi-transparent white (#ffffffee)
- Text: Dark gray (#333)
- Border: Skill-specific accent color (2px)
- Shadow: Subtle drop shadow

**Level Up Toast**:
- Background: Gold gradient (#ffd700 to #ffed4e)
- Text: Dark brown (#654321)
- Border: Gold (#ffd700, 3px)
- Shadow: Prominent glow effect
- Icon: Celebration emoji or star

**Item Gain Toast**:
- Background: Semi-transparent white (#ffffffee)
- Text: Dark gray (#333)
- Border: Green (#4caf50, 2px)
- Item list: Bullet points or icons

## Dependencies

### Existing System Components
- Game store (`src/store/gameStore.ts`)
- Type definitions (`src/types/index.ts`)
- Skill data (`src/data/`)
- XP utilities (`src/utils/xp.ts`)

### New Components Needed
- `ToastContainer.tsx`: Main container component
- `Toast.tsx`: Individual toast component
- Toast types in `src/types/index.ts`
- Toast utilities in `src/utils/toast.ts`

### External Dependencies
- React Native Animated API (built-in)
- No additional npm packages required

## Acceptance Criteria

- [ ] Toast appears when training action completes
- [ ] Toast shows correct XP amount and skill name
- [ ] Toast shows all items gained with quantities
- [ ] Level-up toast has special styling and celebration
- [ ] Toast auto-dismisses after 3-4 seconds
- [ ] Multiple toasts queue properly (max 3 visible)
- [ ] Toast can be dismissed by tapping
- [ ] Animations are smooth and non-janky
- [ ] Toast doesn't block game interaction
- [ ] Toast persists across component re-renders
- [ ] No console errors or warnings
- [ ] Works on both iOS and Android
- [ ] Accessible to screen readers

## Future Enhancements

### Phase 2
- Settings toggle to disable toasts
- Configurable toast position (top/bottom/side)
- Toast history view (last 10 notifications)
- Sound effects for different toast types
- Customizable toast duration per type

### Phase 3
- Achievement toasts with special animations
- Combat notifications (when combat is added)
- Rare item drop celebrations
- Milestone toasts (e.g., "1M total XP!")
- Toast filters (show only level-ups, etc.)

### Phase 4
- Toast themes/skins
- Animated skill icons in toasts
- Progress indicators in toasts
- Interactive toasts (e.g., tap to view details)
- Toast sound customization

## Testing Strategy

### Unit Tests
- Toast creation and queuing
- Toast auto-dismiss timing
- Toast removal logic
- Maximum visible toast limit

### Integration Tests
- Toast triggered on action completion
- Toast content matches gained XP/items
- Level-up toast triggers correctly
- Multiple actions create multiple toasts

### Manual Testing
- Visual appearance on various devices
- Animation smoothness
- Touch interaction responsiveness
- Accessibility with screen readers
- Performance during extended play sessions

## Implementation Notes

### Best Practices
1. Use React Native's Animated API for smooth animations
2. Implement toast queue to prevent overwhelming the user
3. Generate unique IDs for each toast (timestamp + random)
4. Clean up timers on component unmount
5. Memoize toast components to prevent unnecessary re-renders

### Performance Considerations
- Limit maximum visible toasts to 3
- Remove dismissed toasts from array promptly
- Use `useCallback` for dismiss handlers
- Optimize re-renders with `React.memo`
- Avoid creating toasts in render cycles

### Accessibility
- Add `accessibilityLabel` to toasts
- Use `accessibilityRole="alert"` for important toasts
- Ensure text contrast meets WCAG AA standards
- Support larger text sizes
- Test with VoiceOver (iOS) and TalkBack (Android)

## References

- [React Native Animated API](https://reactnative.dev/docs/animated)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- UI Specification: [03-user-interface.md](03-user-interface.md)
- Core Game System: [01-core-game-system.md](01-core-game-system.md)
