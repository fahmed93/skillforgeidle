# Spec: Skill System

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview
The skill system is the heart of SkillForge Idle. Players train various skills from level 1 to 99, with each skill offering multiple training activities that unlock as they progress.

## Skills Definition

### 1. Woodcutting
**Description**: Chop down trees to gather wood resources and gain XP.

**Training Activities**:
1. **Regular Tree** (Level 1)
   - XP per action: 25
   - Duration: 3 seconds
   - Resource: Regular Wood x1

2. **Oak Tree** (Level 15)
   - XP per action: 37.5
   - Duration: 4 seconds
   - Resource: Oak Wood x1

3. **Willow Tree** (Level 30)
   - XP per action: 67.5
   - Duration: 5 seconds
   - Resource: Willow Wood x1

4. **Maple Tree** (Level 45)
   - XP per action: 100
   - Duration: 6 seconds
   - Resource: Maple Wood x1

5. **Yew Tree** (Level 60)
   - XP per action: 175
   - Duration: 8 seconds
   - Resource: Yew Wood x1

6. **Magic Tree** (Level 75)
   - XP per action: 250
   - Duration: 10 seconds
   - Resource: Magic Wood x1

7. **Redwood Tree** (Level 90)
   - XP per action: 380
   - Duration: 12 seconds
   - Resource: Redwood x1

8. **Ancient Tree** (Level 95)
   - XP per action: 500
   - Duration: 15 seconds
   - Resource: Ancient Wood x1

### 2. Mining
**Description**: Extract ores and gems from rocks to gather valuable resources.

**Training Activities**:
1. **Copper Ore** (Level 1)
   - XP per action: 17.5
   - Duration: 2.5 seconds
   - Resource: Copper Ore x1

2. **Tin Ore** (Level 1)
   - XP per action: 17.5
   - Duration: 2.5 seconds
   - Resource: Tin Ore x1

3. **Iron Ore** (Level 15)
   - XP per action: 35
   - Duration: 3.5 seconds
   - Resource: Iron Ore x1

4. **Coal** (Level 30)
   - XP per action: 50
   - Duration: 4 seconds
   - Resource: Coal x1

5. **Silver Ore** (Level 40)
   - XP per action: 40
   - Duration: 4 seconds
   - Resource: Silver Ore x1

6. **Gold Ore** (Level 40)
   - XP per action: 65
   - Duration: 5 seconds
   - Resource: Gold Ore x1

7. **Mithril Ore** (Level 55)
   - XP per action: 80
   - Duration: 6 seconds
   - Resource: Mithril Ore x1

8. **Adamantite Ore** (Level 70)
   - XP per action: 95
   - Duration: 7 seconds
   - Resource: Adamantite Ore x1

9. **Runite Ore** (Level 85)
   - XP per action: 125
   - Duration: 10 seconds
   - Resource: Runite Ore x1

10. **Dragon Ore** (Level 92)
    - XP per action: 150
    - Duration: 12 seconds
    - Resource: Dragon Ore x1

### 3. Fishing
**Description**: Catch fish from various fishing spots for food and XP.

**Training Activities**:
1. **Shrimp** (Level 1)
   - XP per action: 10
   - Duration: 2 seconds
   - Resource: Raw Shrimp x1

2. **Sardines** (Level 5)
   - XP per action: 20
   - Duration: 2.5 seconds
   - Resource: Raw Sardines x1

3. **Herring** (Level 10)
   - XP per action: 30
   - Duration: 3 seconds
   - Resource: Raw Herring x1

4. **Trout** (Level 20)
   - XP per action: 50
   - Duration: 4 seconds
   - Resource: Raw Trout x1

5. **Salmon** (Level 30)
   - XP per action: 70
   - Duration: 5 seconds
   - Resource: Raw Salmon x1

6. **Tuna** (Level 35)
   - XP per action: 80
   - Duration: 5.5 seconds
   - Resource: Raw Tuna x1

7. **Lobster** (Level 40)
   - XP per action: 90
   - Duration: 6 seconds
   - Resource: Raw Lobster x1

8. **Swordfish** (Level 50)
   - XP per action: 100
   - Duration: 7 seconds
   - Resource: Raw Swordfish x1

9. **Shark** (Level 76)
   - XP per action: 110
   - Duration: 8 seconds
   - Resource: Raw Shark x1

10. **Whale** (Level 90)
    - XP per action: 140
    - Duration: 10 seconds
    - Resource: Raw Whale x1

### 4. Cooking
**Description**: Cook raw food into edible meals that restore health (future mechanic).

**Training Activities**:
1. **Shrimp** (Level 1)
   - XP per action: 30
   - Duration: 1.5 seconds
   - Requires: Raw Shrimp x1
   - Produces: Cooked Shrimp x1

2. **Sardines** (Level 5)
   - XP per action: 40
   - Duration: 1.5 seconds
   - Requires: Raw Sardines x1
   - Produces: Cooked Sardines x1

3. **Herring** (Level 10)
   - XP per action: 50
   - Duration: 2 seconds
   - Requires: Raw Herring x1
   - Produces: Cooked Herring x1

4. **Trout** (Level 15)
   - XP per action: 70
   - Duration: 2 seconds
   - Requires: Raw Trout x1
   - Produces: Cooked Trout x1

5. **Salmon** (Level 25)
   - XP per action: 90
   - Duration: 2.5 seconds
   - Requires: Raw Salmon x1
   - Produces: Cooked Salmon x1

6. **Tuna** (Level 30)
   - XP per action: 100
   - Duration: 2.5 seconds
   - Requires: Raw Tuna x1
   - Produces: Cooked Tuna x1

7. **Lobster** (Level 40)
   - XP per action: 120
   - Duration: 3 seconds
   - Requires: Raw Lobster x1
   - Produces: Cooked Lobster x1

8. **Swordfish** (Level 45)
   - XP per action: 140
   - Duration: 3 seconds
   - Requires: Raw Swordfish x1
   - Produces: Cooked Swordfish x1

9. **Shark** (Level 80)
   - XP per action: 210
   - Duration: 4 seconds
   - Requires: Raw Shark x1
   - Produces: Cooked Shark x1

### 5. Smithing
**Description**: Forge bars from ores and craft equipment.

**Training Activities**:
1. **Bronze Bar** (Level 1)
   - XP per action: 25
   - Duration: 2 seconds
   - Requires: Copper Ore x1, Tin Ore x1
   - Produces: Bronze Bar x1

2. **Iron Bar** (Level 15)
   - XP per action: 50
   - Duration: 3 seconds
   - Requires: Iron Ore x1
   - Produces: Iron Bar x1

3. **Steel Bar** (Level 30)
   - XP per action: 75
   - Duration: 3.5 seconds
   - Requires: Iron Ore x1, Coal x2
   - Produces: Steel Bar x1

4. **Silver Bar** (Level 40)
   - XP per action: 65
   - Duration: 3 seconds
   - Requires: Silver Ore x1
   - Produces: Silver Bar x1

5. **Gold Bar** (Level 40)
   - XP per action: 90
   - Duration: 3 seconds
   - Requires: Gold Ore x1
   - Produces: Gold Bar x1

6. **Mithril Bar** (Level 50)
   - XP per action: 120
   - Duration: 4 seconds
   - Requires: Mithril Ore x1, Coal x4
   - Produces: Mithril Bar x1

7. **Adamantite Bar** (Level 70)
   - XP per action: 175
   - Duration: 5 seconds
   - Requires: Adamantite Ore x1, Coal x6
   - Produces: Adamantite Bar x1

8. **Runite Bar** (Level 85)
   - XP per action: 225
   - Duration: 6 seconds
   - Requires: Runite Ore x1, Coal x8
   - Produces: Runite Bar x1

9. **Dragon Bar** (Level 92)
   - XP per action: 300
   - Duration: 8 seconds
   - Requires: Dragon Ore x1, Coal x10
   - Produces: Dragon Bar x1

### 6. Crafting
**Description**: Create items from various materials.

**Training Activities**:
1. **Leather Gloves** (Level 1)
   - XP per action: 13.75
   - Duration: 2 seconds
   - Requires: Leather x1
   - Produces: Leather Gloves x1

2. **Leather Boots** (Level 7)
   - XP per action: 16.25
   - Duration: 2 seconds
   - Requires: Leather x1
   - Produces: Leather Boots x1

3. **Leather Body** (Level 14)
   - XP per action: 25
   - Duration: 3 seconds
   - Requires: Leather x1
   - Produces: Leather Body x1

4. **Hard Leather Body** (Level 28)
   - XP per action: 35
   - Duration: 3.5 seconds
   - Requires: Hard Leather x1
   - Produces: Hard Leather Body x1

5. **Studded Body** (Level 41)
   - XP per action: 40
   - Duration: 4 seconds
   - Requires: Leather x1, Steel Studs x1
   - Produces: Studded Body x1

6. **Green Dragonhide Body** (Level 63)
   - XP per action: 186
   - Duration: 5 seconds
   - Requires: Green Dragonhide x3
   - Produces: Green D'hide Body x1

7. **Blue Dragonhide Body** (Level 71)
   - XP per action: 210
   - Duration: 5.5 seconds
   - Requires: Blue Dragonhide x3
   - Produces: Blue D'hide Body x1

8. **Red Dragonhide Body** (Level 77)
   - XP per action: 234
   - Duration: 6 seconds
   - Requires: Red Dragonhide x3
   - Produces: Red D'hide Body x1

9. **Black Dragonhide Body** (Level 84)
   - XP per action: 258
   - Duration: 6.5 seconds
   - Requires: Black Dragonhide x3
   - Produces: Black D'hide Body x1

## Technical Requirements

### Skill Data Structure
```typescript
interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  xpGained: number;
  durationMs: number;
  requirements: ResourceRequirement[];
  products: ResourceProduct[];
}

interface ResourceRequirement {
  resourceId: string;
  quantity: number;
}

interface ResourceProduct {
  resourceId: string;
  quantity: number;
}
```

## Acceptance Criteria
- [ ] All 6 skills are defined with complete data
- [ ] Each skill has 8-10 training activities
- [ ] Activities unlock at appropriate levels
- [ ] XP rates are balanced and progressive
- [ ] Resource requirements are logical
- [ ] UI displays all available activities for current level

## Future Skills
- Firemaking
- Prayer
- Magic
- Ranged
- Combat
- Slayer
- Farming
- Herblore
- Thieving
- Agility
