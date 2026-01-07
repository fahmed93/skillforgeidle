# Spec Kit Implementation Guide

**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This document describes how GitHub Spec Kit is integrated into the SkillForge Idle project and how to use it for feature development.

## Directory Structure

### .specify/
Contains Spec Kit configuration and project memory.

```
.specify/
├── config.yml              # Project configuration
├── memory/
│   └── constitution.md    # Project constitution and principles
└── scripts/               # Automation scripts (future)
```

### specs/
Contains all feature specifications.

```
specs/
├── 01-core-game-system.md    # Core game mechanics
├── 02-skill-system.md        # Skill and activity definitions
├── 03-user-interface.md      # UI/UX specifications
└── future-features.md        # Feature roadmap
```

## Spec-Driven Development Workflow

### 1. Start with the Constitution
The [constitution](.specify/memory/constitution.md) defines the project's core principles:
- Game design philosophy
- Technical standards
- Development approach
- Code standards
- Success criteria

**When to reference**: Before starting any new feature to ensure alignment with project principles.

### 2. Create Feature Specifications

Each feature should have a specification document in `specs/` that includes:

**Required Sections**:
- **Overview**: What the feature is and why it exists
- **Requirements**: Functional and non-functional requirements
- **Technical Design**: Implementation details, data structures, algorithms
- **Dependencies**: What else is needed for this feature
- **Acceptance Criteria**: How to verify the feature works correctly
- **Future Enhancements**: Ideas for extending the feature later

**Example**: See [02-skill-system.md](02-skill-system.md)

### 3. Implement According to Spec

Once a spec is written:
1. Review the spec with team/stakeholders
2. Break down into implementation tasks
3. Implement one section at a time
4. Verify against acceptance criteria
5. Update spec if requirements change

### 4. Maintain Specs

Specs are living documents:
- Update when requirements change
- Add version history
- Mark sections as implemented
- Document deviations from original spec

## Specification Templates

### Feature Spec Template

```markdown
# Spec: [Feature Name]

**Status**: Draft | In Progress | Implemented  
**Version**: 1.0  
**Last Updated**: YYYY-MM-DD

## Overview
[Brief description of what this feature is and why it's needed]

## Requirements

### Functional Requirements
1. [Requirement 1]
2. [Requirement 2]

### Non-Functional Requirements
1. [Performance requirement]
2. [Security requirement]

## Technical Design

### Architecture
[High-level design]

### Data Structures
```typescript
// Type definitions
```

### Algorithms
[Key algorithms or formulas]

## Dependencies
- [Dependency 1]
- [Dependency 2]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Future Enhancements
- [Enhancement idea 1]
- [Enhancement idea 2]
```

## Current Implementation Status

### ✅ Completed Specs
- **Core Game System**: XP formulas, save system design
  - [Specification](01-core-game-system.md)
  - [Implementation Plan](01-core-game-system.plan.md) ✨ NEW
  - [Task Breakdown](01-core-game-system.tasks.md) ✨ NEW
- **Skill System**: All 6 skills with 8-10 activities each
- **User Interface**: Screen layouts and navigation
- **Future Features**: Roadmap through Phase 6

### 🚧 In Progress
- React Native project setup
- Basic game state management
- Skill data implementation
- Core Game System implementation (ready to start)

### 📋 Not Started
- Full UI implementation
- Game loop
- Save/load system
- Additional skills
- Advanced features from roadmap

## Using Slash Commands

If you have the Spec Kit CLI installed and an AI agent configured, you can use these commands:

### /speckit.constitution
Define or update project principles.

```
/speckit.constitution Focus on mobile performance and smooth 60 FPS gameplay
```

### /speckit.specify
Create a new feature specification.

```
/speckit.specify Build an achievement system that tracks player milestones
```

### /speckit.plan
Create technical implementation plan.

```
/speckit.plan Use Zustand for state management, AsyncStorage for persistence
```

### /speckit.tasks
Break down a spec into actionable tasks.

```
/speckit.tasks
```

### /speckit.implement
Execute implementation tasks.

```
/speckit.implement
```

## Best Practices

### For Specifications
1. **Write specs before code**: Define what you're building first
2. **Focus on "what" not "how"**: Specs describe outcomes, not implementation details
3. **Include examples**: Show concrete examples of data structures and user flows
4. **Keep specs updated**: When requirements change, update the spec first
5. **Version your specs**: Track changes over time

### For Implementation
1. **Read the spec first**: Understand requirements before coding
2. **Implement incrementally**: Build one requirement at a time
3. **Test against acceptance criteria**: Verify each criterion is met
4. **Document deviations**: If you need to deviate from spec, document why
5. **Update specs with learnings**: Capture insights during implementation

### For Collaboration
1. **Review specs together**: Get team input before implementation
2. **Reference specs in PRs**: Link to relevant spec sections
3. **Use specs for onboarding**: New team members read specs to understand features
4. **Discuss spec changes**: Changes to specs should be discussed, not silently made

## Benefits of Spec-Driven Development

### For This Project
1. **Clear Direction**: Every feature has defined goals and requirements
2. **Reduced Ambiguity**: Less time debating "what should it do?"
3. **Better Estimates**: Specs make it easier to estimate work
4. **Quality Assurance**: Acceptance criteria provide clear test cases
5. **Knowledge Base**: Specs document how the game works

### For AI-Assisted Development
1. **Better Context**: AI can reference specs for accurate implementation
2. **Consistency**: Specs ensure AI suggestions align with project principles
3. **Validation**: Specs provide criteria for validating AI-generated code
4. **Iterative Improvement**: Specs can be refined based on AI feedback

## Resources

- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [Spec Kit Documentation](https://github.github.io/spec-kit/)
- [Spec-Driven Development Blog Post](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)

## Next Steps

1. **Review existing specs**: Read through all specs in `specs/` directory
2. **Validate requirements**: Ensure all requirements are clear and testable
3. **Prioritize implementation**: Choose which specs to implement first
4. **Begin development**: Start with core game system
5. **Iterate**: Update specs based on implementation learnings
