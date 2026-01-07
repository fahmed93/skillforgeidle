# Spec: Inventory System

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

The inventory system allows players to view, manage, and organize all items they have obtained through training activities. Players can access their inventory through a dedicated view in the sidebar under a "Player" section, providing easy access to item information including quantities, gold values, and descriptions.

## User Stories

### As a player:
- I want to see all items I've collected from training activities
- I want to search for specific items by name
- I want to sort items by different criteria (name, gold value, quantity)
- I want to see the gold value of each item
- I want to access the inventory easily from the sidebar
- I want to see item descriptions and icons

## Requirements

### Functional Requirements

#### 1. Inventory Access
- **Location**: Accessible from sidebar under a new "Player" section
- **Navigation**: 
  - Sidebar shows "Player" header separate from "Skills" header
  - Under "Player", show "Inventory" option
  - Clicking "Inventory" opens inventory view in main content area
- **Persistence**: Inventory state (sort order, search) persists during session

#### 2. Inventory Display
- **Item List**: Shows all items with quantity > 0
- **Item Information**:
  - Item icon/emoji
  - Item name
  - Item description
  - Current quantity
  - Gold value (per item)
  - Total gold value (quantity × unit value)
- **Empty State**: Shows friendly message when inventory is empty
- **Layout**: Grid or list view with clear visual hierarchy

#### 3. Search Functionality
- **Search Bar**: Always visible at top of inventory
- **Search Behavior**:
  - Real-time filtering as user types
  - Case-insensitive matching
  - Searches item names and descriptions
  - Shows count of matching items
- **Clear Button**: Quick way to clear search query

#### 4. Sort Functionality
- **Sort Options**:
  1. **Alphabetical** (A-Z): Sort by item name ascending
  2. **Gold Value**: Sort by unit gold value descending
  3. **Item Count**: Sort by quantity descending
- **Sort UI**: Dropdown or toggle buttons
- **Default**: Alphabetical sort on first load
- **Persistence**: Remember sort preference during session

### Non-Functional Requirements

#### 1. Performance
- Inventory should load instantly (< 100ms)
- Search should feel responsive (< 50ms delay)
- Sort operations should be instant
- Support for 100+ unique items without lag

#### 2. Usability
- Clear visual feedback for active sort option
- Search placeholder text guides users
- Item cards are easy to read and scan
- Touch targets minimum 44x44 points on mobile

#### 3. Data Integrity
- Gold values are defined per item type
- Item metadata is immutable (defined in data files)
- Quantities sync with game state inventory

## Technical Design

### Data Structures

```typescript
// Extend Resource type to include metadata
export interface ItemMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  goldValue: number;
  category: 'wood' | 'ore' | 'fish' | 'food' | 'bar' | 'crafted' | 'other';
}

// Inventory item combines metadata with current quantity
export interface InventoryItem extends ItemMetadata {
  quantity: number;
  totalValue: number; // goldValue * quantity
}

// Sort options
export enum InventorySortOption {
  ALPHABETICAL = 'alphabetical',
  GOLD_VALUE = 'gold_value',
  ITEM_COUNT = 'item_count',
}

// Inventory UI state
export interface InventoryUIState {
  sortBy: InventorySortOption;
  searchQuery: string;
}
```

### Component Structure

```
Sidebar
├── SkillsSection (existing)
│   └── [Skills list]
└── PlayerSection (NEW)
    └── InventoryOption

MainContent
└── InventoryView (NEW)
    ├── InventoryHeader
    │   ├── SearchBar
    │   └── SortControls
    └── InventoryGrid
        └── InventoryItemCard (multiple)
```

### State Management

```typescript
// Add to gameStore
interface GameStore {
  // ... existing state ...
  
  inventoryUIState: InventoryUIState;
  
  // Inventory actions
  setInventorySortBy: (sortBy: InventorySortOption) => void;
  setInventorySearchQuery: (query: string) => void;
  getInventoryItems: () => InventoryItem[];
  searchInventory: (query: string) => InventoryItem[];
  sortInventory: (items: InventoryItem[], sortBy: InventorySortOption) => InventoryItem[];
}
```

### Item Metadata Data

All items will have metadata defined in:
- `src/data/items-metadata.ts` - Central item definitions
- Includes all resources from gathering and production skills
- Each item has: id, name, description, icon, goldValue, category

Example:
```typescript
export const ITEMS_METADATA: Record<string, ItemMetadata> = {
  'regular-wood': {
    id: 'regular-wood',
    name: 'Regular Wood',
    description: 'Basic wood logs from regular trees.',
    icon: '🪵',
    goldValue: 5,
    category: 'wood',
  },
  'oak-wood': {
    id: 'oak-wood',
    name: 'Oak Wood',
    description: 'Sturdy oak logs from oak trees.',
    icon: '🌳',
    goldValue: 12,
    category: 'wood',
  },
  // ... more items
};
```

### Sorting & Search Logic

```typescript
// Sort function
function sortInventory(
  items: InventoryItem[], 
  sortBy: InventorySortOption
): InventoryItem[] {
  switch (sortBy) {
    case InventorySortOption.ALPHABETICAL:
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    case InventorySortOption.GOLD_VALUE:
      return [...items].sort((a, b) => b.goldValue - a.goldValue);
    case InventorySortOption.ITEM_COUNT:
      return [...items].sort((a, b) => b.quantity - a.quantity);
    default:
      return items;
  }
}

// Search function
function searchInventory(
  items: InventoryItem[], 
  query: string
): InventoryItem[] {
  if (!query.trim()) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery)
  );
}
```

### Styling

**InventoryView**:
- Full-width main content area
- Background: Light grey (#f5f5f5)
- Padding: 16px

**SearchBar**:
- Full-width input with icon
- Border-radius: 8px
- Background: White
- Height: 44px minimum
- Clear button on right

**SortControls**:
- Horizontal button group or dropdown
- Active sort option highlighted
- Clear visual distinction

**InventoryItemCard**:
- Background: White
- Padding: 16px
- Border-radius: 8px
- Shadow: Subtle
- Layout: Icon + Info + Value
- Border-left: 4px colored by category

**Colors**:
- Wood: #8B4513 (brown)
- Ore: #808080 (grey)
- Fish: #4169E1 (blue)
- Food: #FFD700 (gold)
- Bar: #C0C0C0 (silver)
- Crafted: #9370DB (purple)

## Implementation Steps

### Phase 1: Data Foundation
1. Create `src/data/items-metadata.ts` with all item definitions
2. Add gold values for all resources (55+ items)
3. Export helper function `getItemMetadata(resourceId: string)`

### Phase 2: Types & State
1. Add new types to `src/types/index.ts`
2. Extend gameStore with inventory UI state
3. Add inventory helper functions to gameStore

### Phase 3: UI Components
1. Create `src/components/inventory/InventoryView.tsx`
2. Create `src/components/inventory/InventoryItemCard.tsx`
3. Create `src/components/inventory/SearchBar.tsx`
4. Create `src/components/inventory/SortControls.tsx`

### Phase 4: Sidebar Integration
1. Update Sidebar component to add "Player" section
2. Add "Inventory" option under Player
3. Handle inventory selection and navigation

### Phase 5: Main App Integration
1. Add inventory state to App.tsx
2. Conditionally render InventoryView when selected
3. Handle navigation between Skills and Inventory

### Phase 6: Polish
1. Add empty state illustrations
2. Add loading states if needed
3. Test on mobile and web
4. Add animations/transitions

## Acceptance Criteria

### Display
- [ ] Inventory is accessible from sidebar under "Player" section
- [ ] All items with quantity > 0 are displayed
- [ ] Each item shows: icon, name, description, quantity, gold value, total value
- [ ] Empty inventory shows friendly message

### Search
- [ ] Search bar is always visible
- [ ] Search filters items in real-time
- [ ] Search is case-insensitive
- [ ] Search matches both name and description
- [ ] Clear button resets search

### Sort
- [ ] Three sort options available: Alphabetical, Gold Value, Item Count
- [ ] Alphabetical sorts A-Z by name
- [ ] Gold Value sorts by unit price descending
- [ ] Item Count sorts by quantity descending
- [ ] Active sort option is visually indicated
- [ ] Sort preference persists during session

### Navigation
- [ ] Sidebar shows "Player" section separate from "Skills"
- [ ] Clicking "Inventory" under Player opens inventory view
- [ ] Can navigate back to Skills training view
- [ ] Selected view is visually indicated in sidebar

### Performance
- [ ] Inventory loads instantly
- [ ] Search feels responsive
- [ ] No lag with 50+ items
- [ ] Works smoothly on mobile and web

## Future Enhancements

### Phase 2 Features
- **Item Actions**: Use, drop, examine buttons per item
- **Item Filtering**: Filter by category (wood, ore, fish, etc.)
- **Favorites**: Pin important items to top
- **Item Comparison**: Compare stats of similar items

### Advanced Features
- **Bank System**: Separate storage with tabs and organization
- **Item Sets**: Group related items (e.g., full armor sets)
- **Trade History**: Track where items came from
- **Item Tooltips**: Detailed hover/press information
- **Bulk Actions**: Select multiple items for actions
- **Value Calculations**: Show total inventory value

### Statistics
- **Item Statistics**: Track total obtained, times used, etc.
- **Value Tracking**: Chart inventory value over time
- **Rarity System**: Common, uncommon, rare, epic items
- **Collections**: Achievement-like item collections

## Related Specifications

- [01-core-game-system.md](./01-core-game-system.md) - Game state and inventory storage
- [02-skill-system.md](./02-skill-system.md) - Items obtained from skill training
- [04-sidebar-navigation.md](./04-sidebar-navigation.md) - Sidebar structure and navigation
- [future-features.md](./future-features.md) - Bank system and advanced inventory features

## Dependencies

- Existing inventory system in gameStore (quantity tracking)
- Sidebar component for navigation
- Resource production from training activities
- Item metadata needs to be defined for all 55+ items

## Success Metrics

- Players can find items quickly using search
- Sort functionality is intuitive and useful
- Inventory provides clear overview of player wealth
- Zero performance issues with full inventory
- Navigation feels natural and accessible
