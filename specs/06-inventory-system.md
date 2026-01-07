# Spec: Inventory System

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview
Implement a comprehensive inventory system that allows players to view, search, and sort all items they have collected through skill training activities. The inventory will be accessible through the sidebar under a "Player" header and will provide detailed information about each resource.

## User Stories

### As a player:
- I want to access my inventory through a "Player" section in the sidebar
- I want to see all items I have collected with their quantities
- I want to search for specific items by name
- I want to sort items by different criteria (alphabet, gold value, item count)
- I want to see detailed information about each item
- I want an intuitive and visually appealing inventory interface

## Requirements

### Functional Requirements

#### 1. Sidebar Integration
- **Location**: Add a "Player" header section in the sidebar, below the "Skills" section
- **Items**:
  - "Inventory" option under "Player" header
  - Shows current total inventory count (e.g., "Inventory (42)")
  - Clicking navigates to Inventory screen
- **Visual**: Uses consistent styling with Skills section

#### 2. Inventory Screen
- **Header**: 
  - "Inventory" title with back button
  - Shows total unique items / total item count
- **Search Bar**:
  - Text input to filter items by name
  - Real-time filtering as user types
  - Clear button to reset search
  - Placeholder: "Search items..."
- **Sort Options**:
  - Dropdown or button group to select sort order:
    - **Alphabetical (A-Z)**: Sort by item name ascending
    - **Alphabetical (Z-A)**: Sort by item name descending
    - **Count (High-Low)**: Sort by quantity descending
    - **Count (Low-High)**: Sort by quantity ascending
    - **Value (High-Low)**: Sort by gold value descending (future feature)
    - **Value (Low-High)**: Sort by gold value ascending (future feature)
  - Default sort: Alphabetical (A-Z)
  - Selected sort option is highlighted
- **Item Grid/List**:
  - Display items in a grid (2-3 columns) or list view
  - Each item card shows:
    - Item icon/emoji
    - Item name
    - Quantity owned
    - Visual quality indicator (rarity color - future)
  - Empty state message when no items or no search results
- **Item Details**:
  - Tap on item to view detailed modal/screen:
    - Large icon
    - Full name and description
    - Quantity owned
    - Gold value (when implemented)
    - Source (which skill produces this)
    - Used in (which activities require this)

#### 3. Data Management
- **Resource Data Structure**:
  ```typescript
  interface Resource {
    id: string;
    name: string;
    description: string;
    icon: string;
    goldValue?: number; // Optional for future trading
    rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'; // Future feature
  }
  ```
- **Inventory State**: Already exists in gameStore as `Record<string, number>`
- **Resource Registry**: Central data file defining all resources in the game

#### 4. Resource Definitions
- **Woodcutting Resources**:
  - Regular Wood, Oak Wood, Willow Wood, Maple Wood, Yew Wood, Magic Wood
- **Mining Resources**:
  - Copper Ore, Tin Ore, Iron Ore, Coal, Gold Ore, Mithril Ore, Adamantite Ore, Runite Ore
- **Fishing Resources**:
  - Raw Shrimp, Raw Sardine, Raw Herring, Raw Trout, Raw Salmon, Raw Lobster, Raw Swordfish, Raw Shark
- **Cooking Products**:
  - Cooked Shrimp, Cooked Sardine, Cooked Herring, Cooked Trout, Cooked Salmon, Cooked Lobster, Cooked Swordfish, Cooked Shark
- **Smithing Products**:
  - Bronze Bar, Iron Bar, Steel Bar, Gold Bar, Mithril Bar, Adamantite Bar, Runite Bar
- **Crafting Products**:
  - Will be defined based on crafting activities

### Non-Functional Requirements

#### 1. Performance
- Search should filter instantly (< 100ms)
- Sorting should be efficient even with 100+ items
- Smooth scrolling through inventory list
- Lazy loading for large inventories (future optimization)

#### 2. Usability
- Clear visual hierarchy
- Intuitive search and sort controls
- Touch-friendly targets (minimum 44x44 points)
- Responsive to different screen sizes
- Empty states are informative and helpful

#### 3. Accessibility
- Search input has proper label
- Sort buttons are clearly labeled
- Item cards have semantic labels for screen readers
- High contrast for readability

## Technical Design

### Component Structure

```
App
├── Sidebar
│   ├── Skills Section (existing)
│   └── Player Section (NEW)
│       └── Inventory Link
└── InventoryScreen (NEW)
    ├── InventoryHeader
    ├── SearchBar
    ├── SortOptions
    ├── ItemGrid/ItemList
    │   └── ItemCard (multiple)
    └── ItemDetailModal (optional)
```

### Data Files

**src/data/resources.ts** (NEW):
```typescript
import { Resource } from '../types';

export const RESOURCES: Record<string, Resource> = {
  regular_wood: {
    id: 'regular_wood',
    name: 'Regular Wood',
    description: 'Basic wood from regular trees.',
    icon: '🪵',
    goldValue: 10,
  },
  // ... all other resources
};

export const getResourceById = (id: string): Resource | undefined => {
  return RESOURCES[id];
};

export const getAllResources = (): Resource[] => {
  return Object.values(RESOURCES);
};
```

### State Management

**Inventory State** (already exists in gameStore):
```typescript
inventory: Record<string, number>; // resourceId -> quantity
```

**UI State** (local component state):
```typescript
interface InventoryState {
  searchQuery: string;
  sortBy: 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc' | 'value-asc' | 'value-desc';
  selectedItem: string | null; // for detail modal
}
```

### Sorting and Filtering Logic

```typescript
// Filter items by search query
const filterItems = (items: [string, number][], query: string) => {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(([resourceId]) => {
    const resource = getResourceById(resourceId);
    return resource?.name.toLowerCase().includes(lowerQuery);
  });
};

// Sort items by selected criteria
const sortItems = (items: [string, number][], sortBy: string) => {
  return [...items].sort((a, b) => {
    const [idA, countA] = a;
    const [idB, countB] = b;
    const resourceA = getResourceById(idA);
    const resourceB = getResourceById(idB);
    
    switch (sortBy) {
      case 'name-asc':
        return (resourceA?.name || '').localeCompare(resourceB?.name || '');
      case 'name-desc':
        return (resourceB?.name || '').localeCompare(resourceA?.name || '');
      case 'count-asc':
        return countA - countB;
      case 'count-desc':
        return countB - countA;
      case 'value-asc':
        return (resourceA?.goldValue || 0) - (resourceB?.goldValue || 0);
      case 'value-desc':
        return (resourceB?.goldValue || 0) - (resourceA?.goldValue || 0);
      default:
        return 0;
    }
  });
};
```

### Styling

**Color Scheme**:
- Background: #f5f5f5 (light grey)
- Card background: #ffffff (white)
- Primary: #4a90e2 (blue)
- Text: #333 (dark grey)
- Secondary text: #666 (medium grey)
- Border: #e0e0e0 (light grey)

**Item Card**:
- Width: 48% (2 columns on mobile), 31% (3 columns on tablet)
- Padding: 12px
- Border-radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.12)
- Icon size: 48x48

**Search Bar**:
- Height: 44px
- Border-radius: 22px
- Padding: 0 16px
- Background: #f0f0f0

**Sort Buttons**:
- Height: 36px
- Border-radius: 18px
- Padding: 0 16px
- Active state: Primary color background, white text
- Inactive state: Light grey background, dark text

## Implementation Steps

### Phase 1: Resource Data Structure
1. Create `src/data/resources.ts` with all resource definitions
2. Add gold values to each resource (for future use)
3. Create helper functions: `getResourceById()`, `getAllResources()`
4. Update `src/types/index.ts` to include `Resource` interface (if not present)

### Phase 2: Sidebar Updates
1. Update `Sidebar.tsx` to add "Player" section
2. Add "Inventory" item under Player section
3. Show total item count badge
4. Update sidebar styling to accommodate new section

### Phase 3: Inventory Screen Component
1. Create `src/components/InventoryScreen.tsx`
2. Implement header with title and back button
3. Add search bar component with state management
4. Add sort options with button group
5. Implement item filtering and sorting logic
6. Create empty state display

### Phase 4: Item Display Components
1. Create `src/components/ItemCard.tsx`
2. Display item icon, name, and quantity
3. Implement grid layout with responsive columns
4. Add tap interaction for item details
5. Create `src/components/ItemDetailModal.tsx` for detailed view

### Phase 5: Integration and Testing
1. Update `App.tsx` to include Inventory navigation
2. Connect inventory screen to game store
3. Test search functionality with various queries
4. Test all sort options
5. Test with empty inventory
6. Test with large inventory (50+ items)

### Phase 6: Polish and Optimization
1. Add loading states if needed
2. Optimize rendering for large lists
3. Add smooth transitions and animations
4. Ensure accessibility standards are met
5. Test on various device sizes

## Acceptance Criteria

### Sidebar Integration
- [ ] "Player" header is visible in sidebar below "Skills"
- [ ] "Inventory" option is listed under "Player"
- [ ] Inventory shows current item count (e.g., "Inventory (42)")
- [ ] Tapping Inventory navigates to Inventory screen
- [ ] Styling is consistent with Skills section

### Inventory Screen
- [ ] Screen displays with proper header and navigation
- [ ] Search bar filters items in real-time
- [ ] Search is case-insensitive
- [ ] Clear search button works correctly
- [ ] All sort options function correctly:
  - [ ] Alphabetical A-Z
  - [ ] Alphabetical Z-A
  - [ ] Count High-Low
  - [ ] Count Low-High
  - [ ] Value High-Low (with placeholder data)
  - [ ] Value Low-High (with placeholder data)
- [ ] Items display in grid/list format
- [ ] Each item shows icon, name, and quantity
- [ ] Empty state shows when no items
- [ ] "No results" message shows when search has no matches
- [ ] Tapping item shows detailed information

### Item Details
- [ ] Modal/screen displays item details
- [ ] Shows large icon and full description
- [ ] Shows quantity owned
- [ ] Shows gold value (when data available)
- [ ] Modal can be closed/dismissed

### Performance
- [ ] Search filters instantly without lag
- [ ] Sorting completes in < 500ms
- [ ] Smooth scrolling with 50+ items
- [ ] No memory leaks or crashes

### User Experience
- [ ] Interface is intuitive and easy to navigate
- [ ] All touch targets meet 44x44 minimum
- [ ] Visual feedback for all interactions
- [ ] Works on mobile and web platforms
- [ ] Responsive to different screen sizes

## Future Enhancements

### Phase 2 Features
- **Item Actions**: Use, drop, trade items
- **Item Comparison**: Compare similar items side-by-side
- **Favorites**: Mark frequently used items
- **Categories**: Filter by item type (resources, products, equipment)
- **Item Rarity**: Color-coded rarity system with visual indicators

### Phase 3 Features
- **Trading System**: Buy/sell items for gold
- **Bank/Storage**: Expanded storage beyond inventory
- **Item Stacks**: Smart stacking of similar items
- **Quick Stats**: Show total gold value of inventory
- **Export**: Export inventory data for sharing/backup

### Phase 4 Features
- **Item Sets**: Track collection completion
- **Item Encyclopedia**: Codex of all discovered items
- **Item Tooltips**: Hover for quick info
- **Bulk Actions**: Select multiple items for actions
- **Item History**: Track acquisition and usage

## Dependencies

- Core game system (implemented)
- Resource definitions from skill activities (implemented)
- Sidebar navigation (implemented)
- Game state management with Zustand (implemented)

## Related Specifications

- [01-core-game-system.md](./01-core-game-system.md) - Game state and inventory structure
- [02-skill-system.md](./02-skill-system.md) - Resources produced by skills
- [03-user-interface.md](./03-user-interface.md) - UI design guidelines
- [04-sidebar-navigation.md](./04-sidebar-navigation.md) - Sidebar structure and navigation

## Notes

- Gold values are included in resource definitions for future trading system
- Item rarity system is designed but not implemented in Phase 1
- Search and sort should be performant enough to handle 100+ unique items
- Consider adding pagination/virtual scrolling if inventory exceeds 200 items
