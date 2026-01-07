# GitHub Copilot Instructions for SkillForge Idle

## Project Overview

SkillForge Idle is an incremental idle game inspired by RuneScape and Melvor Idle, built with React Native. Players train various skills from level 1 to 99, with each skill offering 8-10 different training activities that unlock as they progress.

**Key Features:**
- 6 trainable skills: Woodcutting, Mining, Fishing, Cooking, Smithing, and Crafting
- 55+ training activities across all skills
- Level progression from 1-99 with exponential XP curves (RuneScape formula)
- Resource gathering and production mechanics
- Persistent progress with automatic saving

## Tech Stack

### Core Technologies
- **Framework:** React Native 0.73
- **Language:** TypeScript 5.3+
- **State Management:** Zustand 4.4+
- **Storage:** AsyncStorage for persistence
- **Navigation:** React Navigation v6

### Development Tools
- **Build System:** Metro bundler
- **Testing:** Jest with React Native Testing Library
- **Linting:** ESLint with React Native config
- **Formatting:** Prettier
- **Type Checking:** TypeScript strict mode

## SpecKit Integration

This project uses **GitHub SpecKit** for spec-driven development. All features follow a structured workflow:

### Spec-Driven Development Workflow

1. **Specify**: Define clear, user-oriented goals and requirements
2. **Plan**: Convert specifications into technical architecture and implementation details
3. **Task Breakdown**: Decompose plans into granular, actionable work items
4. **Implement**: Execute tasks while continuously validating against specifications

### SpecKit Directory Structure
```
.specify/
├── config.yml              # SpecKit configuration
├── memory/
│   └── constitution.md     # Project principles and standards
└── scripts/                # Automation scripts

specs/
├── 00-spec-kit-guide.md         # How to use SpecKit in this project
├── 01-core-game-system.md       # Game loop, state, save system
├── 02-skill-system.md           # Skill and activity definitions
├── 03-user-interface.md         # UI/UX specifications
└── future-features.md           # Feature roadmap
```

### Using SpecKit in Development

**Before implementing any feature:**
1. Check if a specification exists in `specs/` directory
2. Review `.specify/memory/constitution.md` for project principles
3. Ensure implementation aligns with existing specifications
4. For new features, create a specification document first

**Key SpecKit Principles:**
- Specifications are the source of truth
- All features start with clear specs before code
- Validate implementations against specifications
- Update specs when requirements evolve

## Coding Standards

### TypeScript Guidelines
- **Always use TypeScript** - no plain JavaScript files
- Enable strict type checking
- Define interfaces for all data structures
- Use type imports: `import type { ... }`
- Prefer `interface` over `type` for object shapes
- Use enums for fixed sets of values (e.g., `SkillType`)

### Naming Conventions
- **Variables and Functions:** camelCase (e.g., `gameState`, `calculateXp`)
- **Components:** PascalCase (e.g., `SkillCard`, `ActivityButton`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_LEVEL`, `BASE_XP`)
- **Types/Interfaces:** PascalCase (e.g., `GameState`, `Activity`)
- **Files:** kebab-case for utilities, PascalCase for components

### Code Style
- Use functional components with hooks (no class components)
- Prefer `const` over `let`, never use `var`
- Use arrow functions for callbacks
- Destructure props and state
- Single quotes for strings (enforced by Prettier)
- 2-space indentation (enforced by Prettier)
- Semicolons required (enforced by ESLint)

### Component Structure
```typescript
// 1. Imports (external, then internal)
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Activity } from '@/types';

// 2. Type definitions
interface ComponentProps {
  activity: Activity;
  onPress: () => void;
}

// 3. Component
export const ComponentName: React.FC<ComponentProps> = ({ activity, onPress }) => {
  // 4. Hooks
  const [state, setState] = useState(false);
  
  // 5. Event handlers
  const handlePress = () => {
    // implementation
  };
  
  // 6. Render
  return (
    <View>
      <Text>{activity.name}</Text>
    </View>
  );
};
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── skills/      # Skill-related components
│   ├── activities/  # Activity-related components
│   └── common/      # Shared components
├── screens/         # Screen components for navigation
│   ├── SkillsOverview.tsx
│   ├── SkillTraining.tsx
│   └── Settings.tsx
├── store/           # Zustand state management
│   ├── gameStore.ts
│   └── types.ts
├── hooks/           # Custom React hooks
│   ├── useGameLoop.ts
│   └── useSkillTraining.ts
├── data/            # Game data and configuration
│   ├── skills-gathering.ts
│   ├── skills-production.ts
│   └── index.ts
├── types/           # TypeScript type definitions
│   └── index.ts
└── utils/           # Utility functions
    ├── xp.ts        # XP calculations
    ├── save.ts      # Save/load logic
    └── format.ts    # Number/time formatting
```

## Game Logic and Formulas

### XP System (RuneScape-Inspired)
```typescript
// XP required for a specific level
xpForLevel(n) = floor(n + 300 * 2^(n/7)) / 4

// Total XP needed to reach a level
totalXpForLevel(n) = sum of xpForLevel(i) for i = 1 to n-1

// Example progression:
// Level 2: 83 XP
// Level 50: 101,333 XP
// Level 99: 13,034,431 XP
```

**Important:** Always use the utility functions in `src/utils/xp.ts`:
- `xpForLevel(level)` - XP for a specific level
- `totalXpForLevel(level)` - Total XP to reach that level
- `getLevelFromXp(xp)` - Calculate level from XP
- `getProgressToNextLevel(xp)` - Get % progress to next level

### Skill Training
- Skills level from 1 to 99
- Each skill has 8-10 activities with varying:
  - Level requirements (when they unlock)
  - XP rewards per action
  - Duration per action (in milliseconds)
  - Resource requirements (for production skills)
  - Resource products (what you receive)

### Resource Management
- **Gathering Skills** (Woodcutting, Mining, Fishing): Produce raw resources
- **Production Skills** (Cooking, Smithing, Crafting): Consume raw resources, produce processed items
- Resources are stored in player inventory
- Production activities require specific resources as inputs

## State Management with Zustand

Use Zustand for global game state. Structure should include:

```typescript
interface GameStore {
  // Game state
  gameState: GameState;
  
  // Skills
  skills: Record<SkillType, SkillState>;
  
  // Resources
  resources: Record<string, number>;
  
  // Current training
  currentActivity: Activity | null;
  trainingProgress: number;
  
  // Actions
  startTraining: (activity: Activity) => void;
  stopTraining: () => void;
  updateProgress: (deltaTime: number) => void;
  gainXp: (skillId: SkillType, amount: number) => void;
  
  // Persistence
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;
}
```

## Development Guidelines

### Before Writing Code
1. **Check specifications** in `specs/` directory
2. **Review constitution** in `.specify/memory/constitution.md`
3. **Understand the XP system** - it's core to the game
4. **Check existing data structures** in `src/types/` and `src/data/`

### When Adding Features
1. Create or update specification in `specs/` first
2. Define TypeScript types for new data structures
3. Implement game logic (state management, calculations)
4. Build UI components
5. Add tests for game logic
6. Update documentation if needed

### When Working with Skills/Activities
- All skill data is in `src/data/skills-gathering.ts` and `src/data/skills-production.ts`
- Use helper functions from `src/data/index.ts`:
  - `getAllSkills()` - Get all skills
  - `getSkillById(id)` - Get specific skill
  - `getActivityById(skillId, activityId)` - Get specific activity
- Never hardcode skill data in components

### Performance Considerations
- Game loop should run efficiently (aim for 60 FPS)
- Debounce save operations to AsyncStorage
- Memoize expensive calculations with `useMemo`
- Use `React.memo` for components that re-render frequently
- Optimize large lists with `FlatList` or `VirtualizedList`

## Testing Standards

### Unit Tests
- Test game logic functions (XP calculations, resource management)
- Test Zustand store actions and state updates
- Mock AsyncStorage for save/load tests
- Aim for >80% coverage on game logic

### Integration Tests
- Test complete user flows (start training, gain XP, level up)
- Test skill unlocks and activity requirements
- Test resource production and consumption chains

### Test File Naming
- Place tests next to source files: `ComponentName.test.tsx`
- Or in `__tests__` directory: `__tests__/ComponentName.test.tsx`

## Error Handling

- Always handle AsyncStorage errors (save/load failures)
- Validate activity requirements before starting training
- Handle edge cases (level 99, insufficient resources, etc.)
- Provide meaningful error messages to users
- Log errors for debugging but don't crash the app

## Accessibility

- Use semantic component names and labels
- Ensure touch targets are at least 44x44 points
- Support screen readers with appropriate labels
- Maintain good color contrast (WCAG AA minimum)
- Test on both iOS and Android

## Comments and Documentation

### When to Comment
- Complex game formulas (XP calculations, drop rates)
- Non-obvious business logic
- Performance optimizations
- Workarounds for known issues

### When NOT to Comment
- Self-explanatory code
- Obvious implementations
- Redundant descriptions of what code does

### Documentation
- Update README.md for user-facing changes
- Update specs for feature additions
- Document public APIs and utility functions
- Keep PROJECT_SUMMARY.md current

## Common Patterns

### Activity Training Flow
```typescript
// 1. Validate requirements (level, resources)
// 2. Start activity timer
// 3. Update UI to show progress
// 4. On completion:
//    - Grant XP
//    - Check for level up
//    - Consume/produce resources
//    - Save game state
// 5. Auto-start next iteration or stop
```

### XP Gain and Level Up
```typescript
// 1. Add XP to skill
// 2. Calculate new level
// 3. If level increased:
//    - Show level up notification
//    - Check for newly unlocked activities
//    - Save game state
```

## Security and Privacy

- Never store sensitive data in AsyncStorage unencrypted
- Don't log personally identifiable information
- Validate all user inputs
- Sanitize data before saving to storage

## Git Commit Guidelines

- Use conventional commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commits focused and atomic
- Reference issue numbers when applicable

## Resources

### Project Documentation
- [Constitution](./.specify/memory/constitution.md)
- [Core Game System](../specs/01-core-game-system.md)
- [Skill System](../specs/02-skill-system.md)
- [UI Specification](../specs/03-user-interface.md)

### External Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [GitHub SpecKit](https://github.com/github/spec-kit)

## Quick Reference

### Build Commands
```bash
npm install          # Install dependencies
npm run android      # Run on Android
npm run ios          # Run on iOS (Mac only)
npm start            # Start Metro bundler
npm test             # Run tests
npm run lint         # Run ESLint
```

### Common File Paths
- Types: `src/types/index.ts`
- XP Utils: `src/utils/xp.ts`
- Skill Data: `src/data/skills-gathering.ts`, `src/data/skills-production.ts`
- Store: `src/store/gameStore.ts`

---

**Remember:** This is a spec-driven project. Always start with specifications before implementing features, and ensure all code aligns with the project constitution and existing specs.
