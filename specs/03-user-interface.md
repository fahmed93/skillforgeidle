# Spec: User Interface

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview
The UI provides an intuitive mobile-first interface for players to train skills, manage inventory, and track progress in SkillForge Idle.

## Screen Structure

### 1. Skills Overview Screen (Home)
**Purpose**: Main hub showing all skills and their current levels.

**Components**:
- Header with player name and total level
- Grid/list of skill cards
- Quick access to settings
- Navigation to other screens

**Skill Card**:
- Skill icon
- Skill name
- Current level (1-99)
- Progress bar showing XP to next level
- Tap to open skill training screen

### 2. Skill Training Screen
**Purpose**: Detailed view for training a specific skill.

**Components**:
- Skill header (name, level, XP progress)
- List of available training activities
- Current active training indicator
- Inventory quick view
- Back button to skills overview

**Activity Card**:
- Activity name and icon
- Level requirement (locked/unlocked indicator)
- XP per action
- Duration
- Resource requirements
- Resource products
- Start/Stop training button

### 3. Inventory Screen
**Purpose**: View and manage collected resources.

**Components**:
- Search/filter bar
- Grid of resource items
- Each item shows:
  - Icon
  - Name
  - Quantity owned
  - Tap for details/actions

### 4. Statistics Screen
**Purpose**: View detailed player statistics.

**Components**:
- Total level
- Total XP
- Time played
- Per-skill statistics:
  - XP gained
  - Actions completed
  - Time spent training
  - Resources gathered

### 5. Settings Screen
**Purpose**: Configure game settings and manage save data.

**Components**:
- Sound/music toggles
- Notification preferences
- Save/load options
- Import/export save
- Reset progress (with confirmation)
- About/credits

## Design Guidelines

### Visual Style
- **Theme**: Fantasy/Medieval inspired
- **Colors**: Earth tones with skill-specific accent colors
- **Typography**: Clear, readable fonts optimized for mobile
- **Icons**: Consistent style across all skills and resources

### Interaction Patterns
- **Tap**: Primary action (open details, start training)
- **Long press**: Secondary actions (view details)
- **Swipe**: Navigate between screens/tabs
- **Pull to refresh**: Update game state

### Responsive Design
- Support for phones (4.7" to 6.7")
- Support for tablets
- Portrait orientation primary
- Landscape mode supported

### Accessibility
- Minimum touch target size: 44x44 points
- High contrast mode option
- Screen reader support
- Scalable text

## Technical Requirements

### Navigation
```typescript
type RootStackParamList = {
  SkillsOverview: undefined;
  SkillTraining: { skillId: string };
  Inventory: undefined;
  Statistics: undefined;
  Settings: undefined;
};
```

### State Management
- Global state for game data
- Local state for UI interactions
- Persistent state for settings

### Performance
- Smooth 60 FPS scrolling
- Lazy loading for large lists
- Image optimization
- Minimal re-renders

## Acceptance Criteria
- [ ] All screens are implemented and functional
- [ ] Navigation works smoothly between screens
- [ ] UI is responsive on various device sizes
- [ ] Touch interactions feel natural
- [ ] Loading states are handled gracefully
- [ ] Error states are displayed clearly

## Future Enhancements
- Dark mode
- Custom themes
- Advanced filtering/sorting
- Skill comparison tools
- Achievement notifications
- Social features (leaderboards)
