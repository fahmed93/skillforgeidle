# Future Features Roadmap

**Version**: 1.0  
**Last Updated**: 2026-01-07

This document outlines potential future features for SkillForge Idle beyond the initial release.

## Phase 2: Core Gameplay Extensions

### Combat System
**Priority**: High  
**Estimated Effort**: Large

**Description**: Add combat mechanics allowing players to fight monsters using trained combat skills.

**Features**:
- Combat skills: Attack, Strength, Defence, Hitpoints
- Monster database with varying difficulty
- Combat formula based on skill levels and equipment
- Loot drops from defeated monsters
- Combat XP distribution

**Dependencies**: Equipment system, health mechanics

### Equipment System
**Priority**: High  
**Estimated Effort**: Medium

**Description**: Equippable items that provide stat bonuses and enable combat.

**Features**:
- Equipment slots: Head, Body, Legs, Weapon, Shield, etc.
- Stat bonuses (Attack, Defence, Strength, etc.)
- Equipment requirements (level, quest completion)
- Visual character representation with equipment
- Smithing/Crafting integration for item creation

**Dependencies**: Inventory system (exists), visual assets

### Bank Storage
**Priority**: Medium  
**Estimated Effort**: Medium

**Description**: Expanded storage system for managing large quantities of items.

**Features**:
- Tabs for organizing items by category
- Search and filter functionality
- Deposit/withdraw all options
- Bank PIN for security
- Placeholder system
- Item stacking

**Dependencies**: None

## Phase 3: Advanced Progression

### Achievement System
**Priority**: Medium  
**Estimated Effort**: Medium

**Description**: Unlockable achievements that reward players for completing milestones.

**Features**:
- 100+ achievements across all skills
- Tiered achievements (Easy, Medium, Hard, Elite)
- Achievement points system
- Rewards for completion (titles, cosmetics, XP lamps)
- Progress tracking
- Social sharing

**Dependencies**: Statistics tracking

### Quest System
**Priority**: Medium  
**Estimated Effort**: Large

**Description**: Story-driven quests that unlock new areas, items, and content.

**Features**:
- Linear quest storylines
- Quest requirements (skill levels, items, other quests)
- Dialogue system
- Quest rewards (XP, items, unlocks)
- Quest journal
- Quest completion tracking

**Dependencies**: NPC system, dialogue system

### Mastery System
**Priority**: Low  
**Estimated Effort**: Large

**Description**: Per-activity mastery levels similar to Melvor Idle.

**Features**:
- Individual mastery levels for each activity
- Mastery XP gained alongside regular XP
- Mastery bonuses (increased XP, reduced time, extra resources)
- Mastery pool per skill
- Mastery tokens for instant progress

**Dependencies**: None (extends existing skill system)

## Phase 4: Social & Competitive

### Leaderboards
**Priority**: Medium  
**Estimated Effort**: Small

**Description**: Global and friend leaderboards for competitive players.

**Features**:
- Overall level rankings
- Individual skill rankings
- Seasonal rankings
- Clan/guild leaderboards
- Achievement rankings

**Dependencies**: Backend server, user accounts

### Trading System
**Priority**: Low  
**Estimated Effort**: Large

**Description**: Player-to-player trading and marketplace.

**Features**:
- Direct trade interface
- Grand Exchange style marketplace
- Price tracking and history
- Trade limits for security
- Item flipping mechanics

**Dependencies**: Economy balancing, user accounts

### Clans/Guilds
**Priority**: Low  
**Estimated Effort**: Large

**Description**: Social groups with shared goals and benefits.

**Features**:
- Clan creation and management
- Clan chat
- Clan events and competitions
- Clan hall with shared storage
- Clan skills and achievements

**Dependencies**: User accounts, social infrastructure

## Phase 5: Content Expansion

### New Skills
**Priority**: Variable  
**Estimated Effort**: Medium each

**Planned Skills**:
1. **Firemaking** - Light fires with logs for XP
2. **Fletching** - Create bows and arrows from wood
3. **Herblore** - Create potions from herbs
4. **Farming** - Grow crops and herbs over time
5. **Thieving** - Pickpocket NPCs and steal from stalls
6. **Agility** - Complete obstacle courses for XP
7. **Slayer** - Complete monster assignments
8. **Runecrafting** - Create magic runes
9. **Prayer** - Bury bones for prayer points
10. **Magic** - Cast combat and utility spells

### Minigames
**Priority**: Low  
**Estimated Effort**: Medium each

**Description**: Special activities with unique rewards.

**Examples**:
- Fishing Trawler (group fishing activity)
- Blast Furnace (efficient smithing)
- Agility Pyramid (advanced agility course)
- Boss Rush (combat challenge mode)

**Dependencies**: Respective skill systems

### Prestige System
**Priority**: Low  
**Estimated Effort**: Medium

**Description**: Reset skills for permanent bonuses.

**Features**:
- Prestige levels per skill
- Permanent XP multipliers
- Exclusive prestige items
- Prestige-only content
- Visual prestige indicators

**Dependencies**: Mature game economy

## Phase 6: Quality of Life

### Offline Progress
**Priority**: High  
**Estimated Effort**: Medium

**Description**: Calculate progress made while app is closed.

**Features**:
- Offline XP calculation
- Offline resource gathering
- Configurable offline actions
- Offline time limits
- Offline efficiency bonuses

**Dependencies**: Save system (exists)

### Auto-training
**Priority**: Medium  
**Estimated Effort**: Small

**Description**: Automatically switch to next activity when leveled up.

**Features**:
- Auto-switch to highest available activity
- Customizable auto-training rules
- Smart resource management
- Activity queue system

**Dependencies**: None

### Notifications
**Priority**: Medium  
**Estimated Effort**: Small

**Description**: Mobile notifications for key events.

**Features**:
- Level up notifications
- Training complete notifications
- Resource full notifications
- Event reminders
- Customizable notification settings

**Dependencies**: Push notification infrastructure

## Technical Debt & Infrastructure

### Cloud Saves
**Priority**: High  
**Estimated Effort**: Medium

**Features**:
- Automatic cloud backup
- Multi-device sync
- Save versioning
- Conflict resolution

### Analytics
**Priority**: High  
**Estimated Effort**: Small

**Features**:
- Player behavior tracking
- Retention metrics
- Balance analytics
- Crash reporting

### Monetization (Optional)
**Priority**: TBD  
**Estimated Effort**: Medium

**Options**:
- One-time purchase
- Cosmetic items
- Ad removal
- Bank space expansion
- Offline time extension

**Note**: Avoid pay-to-win mechanics

## Review Schedule

This roadmap should be reviewed quarterly to:
- Assess progress on current phase
- Reprioritize features based on player feedback
- Add new feature ideas
- Adjust estimates based on learnings
