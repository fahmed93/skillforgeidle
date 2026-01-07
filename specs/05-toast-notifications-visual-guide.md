# Toast Notification Visual Guide

## Overview

This document provides visual descriptions of the toast notification system implemented in SkillForge Idle.

## Toast Types

### 1. XP Gain Toast (Regular Action Completion)

**Appearance:**
```
┌─────────────────────────────────────┐
│ 🪓  +25 Woodcutting XP              │
│     +1 Oak Log                       │
└─────────────────────────────────────┘
```

**Styling:**
- Background: White (95% opacity)
- Border: 2px solid blue (#4a90e2)
- Text: Dark gray (#333)
- Duration: 3.5 seconds
- Animation: Slides in from top, fades in

**Triggered by:**
- Completing any training action without leveling up
- Shows skill name, XP gained, and resources/items acquired

---

### 2. Level Up Toast (Milestone Achievement)

**Appearance:**
```
┌─────────────────────────────────────┐
│ 🎉  Level 45 Woodcutting!           │
│     +1 Oak Log                       │
└─────────────────────────────────────┘
```

**Styling:**
- Background: Gold (#FFD700)
- Border: 3px solid orange (#FFA500)
- Text: Dark brown (#654321)
- Duration: 4 seconds
- Animation: Slides in from top, fades in
- Special glow effect

**Triggered by:**
- Completing a training action that causes a level up
- Shows new level, skill name, celebration icon, and any items gained

---

### 3. Item Gain Toast (Future - Not Yet Implemented)

**Appearance:**
```
┌─────────────────────────────────────┐
│ 📦  +5 Oak Logs                     │
│     +2 Willow Logs                   │
└─────────────────────────────────────┘
```

**Styling:**
- Background: White (95% opacity)
- Border: 2px solid green (#4CAF50)
- Text: Dark gray (#333)
- Duration: 3.5 seconds

**Triggered by:**
- Mass item collection or special events (future feature)

---

### 4. Activity Unlock Toast (Future - Not Yet Implemented)

**Appearance:**
```
┌─────────────────────────────────────┐
│ 🔓  New activities unlocked!        │
│     • Oak Tree                       │
│     • Willow Tree                    │
└─────────────────────────────────────┘
```

**Styling:**
- Background: White (95% opacity)
- Border: 2px solid purple (#9C27B0)
- Text: Dark gray (#333)
- Duration: 3.5 seconds

**Triggered by:**
- Leveling up when new activities become available
- Shows list of newly unlocked activities

---

## Toast Behavior

### Positioning
```
┌──────────────────────────────────┐
│        App Header                │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │ Toast 1 (newest)             │ │ ← 16px from top
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Toast 2                      │ │ ← 68px offset
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Toast 3                      │ │ ← 68px offset
│ └──────────────────────────────┘ │
│                                  │
│      Main Content Area           │
│                                  │
└──────────────────────────────────┘
```

- Toasts appear at the top of the screen
- 16px margin from edges
- Maximum 3 toasts visible at once
- Stacked vertically with 68px offset
- Older toasts pushed down by newer ones

### Queueing
- Up to 10 toasts can be queued
- When 11th toast is added, oldest is removed
- Only first 3 are visible
- As toasts dismiss, queue advances

### Animations

**Entry (250ms):**
```
Frame 1:  translateY(-100), opacity(0)  ← Off-screen, invisible
Frame 2:  translateY(-50),  opacity(0.5) ← Sliding in, fading in
Frame 3:  translateY(0),    opacity(1)   ← Final position, fully visible
```

**Exit (200ms):**
```
Frame 1:  translateY(0),    opacity(1)   ← Visible
Frame 2:  translateY(-50),  opacity(0.5) ← Sliding up, fading out
Frame 3:  translateY(-100), opacity(0)   ← Off-screen, invisible
```

### Interaction

**Tap to Dismiss:**
- Tap anywhere on toast
- Triggers exit animation immediately
- Toast removed from queue

**Auto-Dismiss:**
- Regular toasts: 3.5 seconds
- Level-up toasts: 4 seconds
- Timer starts when toast appears
- Triggers exit animation when timer completes

---

## Example Scenarios

### Scenario 1: Single Action
```
Player completes cutting Normal Tree

Toast appears:
┌─────────────────────────────────────┐
│ 🪓  +25 Woodcutting XP              │
│     +1 Logs                          │
└─────────────────────────────────────┘

Toast auto-dismisses after 3.5 seconds
```

### Scenario 2: Level Up
```
Player completes action that levels up

Toast appears:
┌─────────────────────────────────────┐
│ 🎉  Level 15 Woodcutting!           │
│     +1 Oak Log                       │
└─────────────────────────────────────┘

Toast stays for 4 seconds (longer celebration)
```

### Scenario 3: Multiple Actions (Queue)
```
Player completes 3 actions rapidly

Toast 1 appears at top:
┌─────────────────────────────────────┐
│ 🪓  +25 Woodcutting XP              │
│     +1 Logs                          │
└─────────────────────────────────────┘

Toast 2 appears below:
┌─────────────────────────────────────┐
│ 🪓  +25 Woodcutting XP              │
│     +1 Logs                          │
└─────────────────────────────────────┘

Toast 3 appears below:
┌─────────────────────────────────────┐
│ 🪓  +25 Woodcutting XP              │
│     +1 Logs                          │
└─────────────────────────────────────┘

As Toast 1 dismisses, Toast 2 and 3 remain visible
Next toast (if any) slides in at bottom
```

### Scenario 4: Level Up + New Unlock
```
Player levels up AND unlocks new activity

Toast 1 (Level Up):
┌─────────────────────────────────────┐
│ 🎉  Level 15 Woodcutting!           │
│     +1 Oak Log                       │
└─────────────────────────────────────┘

Toast 2 (Activity Unlock):
┌─────────────────────────────────────┐
│ 🔓  New activities unlocked!        │
│     • Oak Tree                       │
└─────────────────────────────────────┘

Both toasts visible simultaneously
Level-up toast dismisses first (4s)
Unlock toast dismisses next (3.5s from its appearance)
```

---

## Technical Details

### Component Structure
```
ToastContainer (absolute, z-index: 9999)
└── Toast (animated, positioned)
    ├── Icon (28px emoji/icon)
    ├── Message (16px bold)
    └── Details[] (14px regular)
```

### State Flow
```
Action Completion
    ↓
completeTrainingAction()
    ↓
Calculate XP, items, level
    ↓
addToast()
    ↓
Store updates toasts array
    ↓
ToastContainer re-renders
    ↓
Toast component mounts
    ↓
Entry animation plays
    ↓
Auto-dismiss timer starts
    ↓
Timer completes OR user taps
    ↓
Exit animation plays
    ↓
onDismiss callback
    ↓
removeToast()
    ↓
Toast removed from store
```

---

## Accessibility

### Screen Readers
- Toasts have `accessibilityRole="alert"`
- Message announced when toast appears
- Details array announced sequentially

### Text Size
- Respects system text size settings
- Scales appropriately for larger text

### Color Contrast
- All text meets WCAG AA standards
- Minimum 4.5:1 contrast ratio

---

## Performance

### Optimization Techniques
- Native driver for animations (GPU-accelerated)
- `React.memo` on Toast component
- `useCallback` for dismiss handlers
- Proper timer cleanup on unmount
- Queue limit prevents memory issues

### Target Metrics
- 60 FPS animations
- <5ms overhead per toast creation
- <10MB memory for toast system
- No memory leaks after 1000+ toasts

---

## Future Enhancements

See specification document `05-toast-notifications.md` for complete roadmap.

### Phase 2
- Settings toggle to disable
- Configurable position (top/bottom)
- Toast history view
- Sound effects

### Phase 3
- Achievement celebrations
- Rare item drops
- Milestone notifications
- Filters by type

### Phase 4
- Custom themes
- Animated icons
- Progress indicators
- Interactive actions
