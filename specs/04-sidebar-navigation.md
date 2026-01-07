# Spec: Sidebar Navigation for Skill Selection

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview
Implement a sidebar navigation system that allows players to select different skills and view their training activities. The sidebar provides quick access to all available skills and displays relevant training options for the selected skill.

## User Stories

### As a player:
- I want to see a list of all available skills in a sidebar
- I want to open and close the sidebar easily
- I want to select a skill and see its training activities
- I want to start training by clicking on an activity
- I want to see which activities are locked/unlocked based on my level

## Requirements

### Functional Requirements

#### 1. Sidebar Component
- **Display**: Collapsible sidebar that slides in from the left
- **Content**:
  - "Skills" header at the top
  - List of all 6 skills (Woodcutting, Mining, Fishing, Cooking, Smithing, Crafting)
  - Each skill shows: icon, name, current level
- **Interactions**:
  - Click/tap on a skill to select it
  - Close sidebar by clicking outside or close button
  - Visual indicator for currently selected skill

#### 2. Sidebar Toggle
- **Toggle Button**: Hamburger menu icon in the top-left of the app header
- **States**:
  - Open: Sidebar visible, overlay shown
  - Closed: Sidebar hidden, full screen available
- **Animation**: Smooth slide-in/out transition (300ms)

#### 3. Skill Training View
- **Display**: Main content area showing selected skill details
- **Content**:
  - Skill header (name, icon, level, XP progress)
  - List of training activities for the selected skill
  - Each activity card shows:
    - Activity name and icon/emoji
    - Level requirement
    - XP gained per action
    - Duration per action
    - Resource requirements (if any)
    - Resource products
    - Lock/unlock indicator
    - Start/Stop button
- **Behavior**:
  - Locked activities are greyed out with a lock icon
  - Only one activity can be active at a time
  - Active activity shows progress bar and timer
  - Clicking "Start" begins training that activity
  - Clicking "Stop" ends current training

#### 4. Training Activity Interaction
- **Start Training**:
  - Validate level requirements
  - Validate resource requirements (for production skills)
  - Begin activity loop (XP gain, resource production)
  - Update UI to show active state
- **Stop Training**:
  - End activity loop
  - Update UI to idle state
- **Auto-continue**: Activity repeats automatically until stopped

### Non-Functional Requirements

#### 1. Performance
- Sidebar animation should be smooth (60 FPS)
- Skill selection should update view instantly
- No lag when starting/stopping activities

#### 2. Usability
- Touch targets minimum 44x44 points
- Clear visual feedback for all interactions
- Intuitive navigation patterns
- Consistent with existing UI style

#### 3. Accessibility
- Proper semantic labels for screen readers
- High contrast for locked/unlocked states
- Keyboard navigation support (web)

## Technical Design

### Component Structure

```
App
├── Header (with sidebar toggle button)
├── Sidebar
│   ├── SidebarHeader ("Skills")
│   └── SkillList
│       └── SkillListItem (x6)
├── MainContent
│   └── SkillTrainingView
│       ├── SkillHeader
│       └── ActivityList
│           └── ActivityCard (x8-10)
```

### State Management

```typescript
interface UIState {
  sidebarOpen: boolean;
  selectedSkill: SkillType | null;
}

// Actions
toggleSidebar: () => void;
closeSidebar: () => void;
selectSkill: (skillType: SkillType) => void;
```

### Component Props

```typescript
// Sidebar.tsx
interface SidebarProps {
  isOpen: boolean;
  selectedSkill: SkillType | null;
  onClose: () => void;
  onSelectSkill: (skillType: SkillType) => void;
}

// SkillTrainingView.tsx
interface SkillTrainingViewProps {
  skillType: SkillType;
}

// ActivityCard.tsx
interface ActivityCardProps {
  activity: Activity;
  isLocked: boolean;
  isActive: boolean;
  onStartTraining: (activityId: string) => void;
  onStopTraining: () => void;
}
```

### Styling

**Sidebar**:
- Width: 280px (mobile), 320px (tablet)
- Background: White with subtle shadow
- Z-index: 1000
- Overlay: Semi-transparent black (rgba(0,0,0,0.5))

**Skill List Item**:
- Height: 64px
- Padding: 12px 16px
- Active state: Light blue background (#e3f2fd)
- Hover state: Light grey background (#f5f5f5)

**Activity Card**:
- Padding: 16px
- Margin: 8px 0
- Background: White
- Border-radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.12)
- Locked state: Opacity 0.5, grey overlay

**Colors**:
- Primary: #4a90e2 (blue)
- Success: #4caf50 (green)
- Disabled: #bdbdbd (grey)
- Text: #333 (dark grey)
- Secondary text: #666 (medium grey)

## Implementation Steps

### Phase 1: Sidebar Component
1. Create `src/components/Sidebar.tsx`
2. Create `src/components/SkillListItem.tsx`
3. Add sidebar state to App.tsx
4. Implement toggle button in header
5. Add overlay and click-outside-to-close

### Phase 2: Skill Training View
1. Create `src/components/SkillTrainingView.tsx`
2. Create `src/components/SkillHeader.tsx`
3. Create `src/components/ActivityCard.tsx`
4. Implement activity filtering (locked/unlocked)
5. Connect to useSkillTraining hook

### Phase 3: Integration
1. Update App.tsx to use new components
2. Connect skill selection to view updates
3. Test training flow end-to-end
4. Polish animations and transitions

## Acceptance Criteria

### Sidebar
- [ ] Sidebar opens and closes smoothly
- [ ] All 6 skills are listed under "Skills" header
- [ ] Each skill shows icon, name, and current level
- [ ] Clicking a skill selects it (visual indicator)
- [ ] Clicking outside sidebar closes it
- [ ] Toggle button in header works correctly

### Skill Training View
- [ ] Selected skill's activities are displayed
- [ ] Locked activities show lock indicator and are greyed out
- [ ] Unlocked activities show full details
- [ ] Start button begins training
- [ ] Stop button ends training
- [ ] Only one activity can train at a time
- [ ] Progress bar updates during training
- [ ] Resources are consumed/produced correctly

### User Experience
- [ ] Navigation is intuitive and smooth
- [ ] Visual feedback for all interactions
- [ ] No performance issues or lag
- [ ] Works on both mobile and web
- [ ] Consistent with existing UI style

## Future Enhancements
- Search/filter skills in sidebar
- Skill categories (gathering vs production)
- Favorites/bookmarks for skills
- Skill recommendations based on level
- Compact/expanded sidebar modes
- Swipe gestures on mobile
- Keyboard shortcuts for skill selection

## Related Specifications
- [01-core-game-system.md](./01-core-game-system.md) - Game state and training logic
- [02-skill-system.md](./02-skill-system.md) - Skill and activity definitions
- [03-user-interface.md](./03-user-interface.md) - Overall UI design guidelines
