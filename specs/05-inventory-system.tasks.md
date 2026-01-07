# Tasks: Inventory System Implementation

**Based on**: [05-inventory-system.plan.md](./05-inventory-system.plan.md)  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Task Breakdown

### Phase 1: Foundation - Item Metadata

#### Task 1.1: Define Item Metadata Types
**Priority**: High  
**Estimated Time**: 15 minutes

**Description**: Add new TypeScript types for inventory items.

**Files to modify**:
- `src/types/index.ts`

**Changes**:
```typescript
// Add these interfaces and enum
export interface ItemMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  goldValue: number;
  category: 'wood' | 'ore' | 'fish' | 'food' | 'bar' | 'crafted' | 'other';
}

export interface InventoryItem extends ItemMetadata {
  quantity: number;
  totalValue: number;
}

export enum InventorySortOption {
  ALPHABETICAL = 'alphabetical',
  GOLD_VALUE = 'gold_value',
  ITEM_COUNT = 'item_count',
}

export interface InventoryUIState {
  sortBy: InventorySortOption;
  searchQuery: string;
}
```

**Acceptance**:
- [ ] Types compile without errors
- [ ] All fields are properly documented

---

#### Task 1.2: Create Item Metadata Registry
**Priority**: High  
**Estimated Time**: 2 hours

**Description**: Create comprehensive item metadata for all 55+ items with gold values, descriptions, and icons.

**Files to create**:
- `src/data/items-metadata.ts`

**Structure**:
```typescript
import type { ItemMetadata } from '../types';

export const ITEMS_METADATA: Record<string, ItemMetadata> = {
  // Woodcutting items (8)
  'regular-wood': { /* metadata */ },
  'oak-wood': { /* metadata */ },
  // ... all items
};

export function getItemMetadata(itemId: string): ItemMetadata | undefined {
  return ITEMS_METADATA[itemId];
}

export function getAllItemMetadata(): ItemMetadata[] {
  return Object.values(ITEMS_METADATA);
}

export function getItemsByCategory(category: string): ItemMetadata[] {
  return getAllItemMetadata().filter(item => item.category === category);
}
```

**Item Categories**:
- **Wood** (8): regular-wood, oak-wood, willow-wood, maple-wood, yew-wood, magic-wood, redwood, ancient-wood
- **Ore** (10): copper-ore, tin-ore, iron-ore, coal, silver-ore, gold-ore, mithril-ore, adamantite-ore, runite-ore, dragon-ore
- **Fish** (10): raw-shrimp, raw-sardines, raw-herring, raw-trout, raw-salmon, raw-tuna, raw-lobster, raw-swordfish, raw-shark, raw-whale
- **Food** (9): cooked-shrimp, cooked-sardines, cooked-herring, cooked-trout, cooked-salmon, cooked-tuna, cooked-lobster, cooked-swordfish, cooked-shark
- **Bar** (9): bronze-bar, iron-bar, steel-bar, silver-bar, gold-bar, mithril-bar, adamantite-bar, runite-bar, dragon-bar
- **Crafted** (9): leather-gloves, leather-boots, leather-body, hard-leather-body, studded-body, green-dhide-body, blue-dhide-body, red-dhide-body, black-dhide-body

**Gold Value Guidelines**:
- Level 1 items: 5-10 gold
- Level 15 items: 10-20 gold
- Level 30 items: 20-40 gold
- Level 45 items: 40-80 gold
- Level 60 items: 80-160 gold
- Level 75+ items: 160-500 gold
- Production items: 1.5-2x raw materials

**Acceptance**:
- [ ] All 55+ items have complete metadata
- [ ] Gold values are balanced and logical
- [ ] Icons are appropriate emojis
- [ ] Descriptions are clear and concise
- [ ] Categories are correct
- [ ] Helper functions work correctly

---

### Phase 2: State Management

#### Task 2.1: Extend GameStore with Inventory State
**Priority**: High  
**Estimated Time**: 1 hour

**Description**: Add inventory UI state and actions to gameStore.

**Files to modify**:
- `src/store/gameStore.ts`

**Changes**:
1. Import new types
2. Add `inventoryUIState` to state
3. Add inventory actions:
   - `setInventorySortBy`
   - `setInventorySearchQuery`
4. Add inventory selectors:
   - `getInventoryItems`
   - `getFilteredInventoryItems`
   - `getTotalInventoryValue`
   - `getInventoryItemCount`

**Implementation details in**: [05-inventory-system.plan.md](./05-inventory-system.plan.md#21-extend-gamestore)

**Acceptance**:
- [ ] Store compiles without errors
- [ ] Default state is correct (alphabetical sort, empty search)
- [ ] Actions update state properly
- [ ] Selectors return correct data
- [ ] No existing functionality breaks

---

### Phase 3: UI Components

#### Task 3.1: Create InventoryView Component
**Priority**: High  
**Estimated Time**: 1.5 hours

**Description**: Main inventory container component with header, stats, and item grid.

**Files to create**:
- `src/components/inventory/InventoryView.tsx`

**Features**:
- Header with title and icon
- Stats (item count, total value)
- Search and sort controls section
- Scrollable item grid
- Empty state (no items)
- No results state (search returned nothing)

**Styling**:
- Full-width container
- Header: white background, shadow
- Stats: row layout, right-aligned values
- Content: scrollable with padding
- Empty state: centered, grey text, large icon

**Acceptance**:
- [ ] Component renders without errors
- [ ] Empty state shows when inventory is empty
- [ ] No results state shows when search has no matches
- [ ] Stats display correctly
- [ ] Responsive layout works on mobile and web

---

#### Task 3.2: Create SearchBar Component
**Priority**: High  
**Estimated Time**: 45 minutes

**Description**: Search input with clear button.

**Files to create**:
- `src/components/inventory/SearchBar.tsx`

**Features**:
- Text input with placeholder
- Search icon (🔍) on left
- Clear button (✕) on right (only when text present)
- Updates store on change
- Controlled input (value from store)

**Styling**:
- Height: 44px minimum
- Border-radius: 8px
- Background: white
- Border: 1px solid #e0e0e0
- Padding: 0 16px
- Icon and clear button: 32px width

**Acceptance**:
- [ ] Input updates store on change
- [ ] Clear button appears when text exists
- [ ] Clear button resets search
- [ ] Placeholder is visible when empty
- [ ] Accessible (proper labels)

---

#### Task 3.3: Create SortControls Component
**Priority**: High  
**Estimated Time**: 45 minutes

**Description**: Button group for sort options.

**Files to create**:
- `src/components/inventory/SortControls.tsx`

**Features**:
- Three buttons: Alphabetical (🔤), Gold Value (🪙), Item Count (📊)
- Active button highlighted
- Updates store on click
- "Sort by:" label

**Styling**:
- Horizontal button group
- Buttons: 44px height minimum
- Active: blue background (#4a90e2), white text
- Inactive: white background, grey text
- Border-radius: 8px
- Gap: 8px between buttons

**Acceptance**:
- [ ] Three buttons render correctly
- [ ] Active button is highlighted
- [ ] Clicking changes sort in store
- [ ] Visual feedback on press
- [ ] Icons and labels are clear

---

#### Task 3.4: Create InventoryItemCard Component
**Priority**: High  
**Estimated Time**: 1 hour

**Description**: Individual item card showing all item details.

**Files to create**:
- `src/components/inventory/InventoryItemCard.tsx`

**Features**:
- Item icon (large emoji)
- Item name (bold)
- Item description (2 lines max)
- Quantity with label
- Unit gold value with coin icon
- Total value (bold) with coin icon
- Category color indicator (left border)

**Category Colors**:
- Wood: #8B4513 (brown)
- Ore: #808080 (grey)
- Fish: #4169E1 (blue)
- Food: #FFD700 (gold)
- Bar: #C0C0C0 (silver)
- Crafted: #9370DB (purple)
- Other: #666666 (dark grey)

**Styling**:
- Background: white
- Padding: 16px
- Border-radius: 8px
- Border-left: 4px solid (category color)
- Shadow: subtle
- Margin-bottom: 12px

**Acceptance**:
- [ ] All item properties display correctly
- [ ] Category colors show on left border
- [ ] Numbers formatted with commas
- [ ] Description truncates at 2 lines
- [ ] Layout is clean and readable

---

### Phase 4: Sidebar Integration

#### Task 4.1: Update Sidebar with Player Section
**Priority**: High  
**Estimated Time**: 1 hour

**Description**: Add "Player" section to sidebar with "Inventory" option.

**Files to modify**:
- `src/components/Sidebar.tsx`

**Changes**:
1. Add section divider after Skills list
2. Add "Player" section header
3. Add "Inventory" menu item with:
   - Icon: 🎒
   - Text: "Inventory"
   - Selected indicator when active
4. Update `onSelectSkill` prop to also handle view selection (or add new `onSelectView` prop)

**New Props** (if needed):
```typescript
interface SidebarProps {
  // ... existing props
  selectedView?: 'skills' | 'inventory';
  onSelectView?: (view: 'skills' | 'inventory') => void;
}
```

**Styling**:
- Section divider: 1px grey line, 16px margin
- Section header: grey text, 12px font, uppercase, padding
- Menu item: same style as skill items
- Selected: light blue background

**Acceptance**:
- [ ] "Player" section appears below "Skills"
- [ ] "Inventory" option is clickable
- [ ] Selected state shows visual indicator
- [ ] Clicking closes sidebar (existing behavior)
- [ ] No layout issues

---

### Phase 5: App Integration

#### Task 5.1: Integrate Inventory into App Navigation
**Priority**: High  
**Estimated Time**: 1 hour

**Description**: Update App.tsx to support inventory view selection and navigation.

**Files to modify**:
- `App.tsx`

**Changes**:
1. Add state for selected view: `'skills' | 'inventory'`
2. Update sidebar props to pass view state and handler
3. Add conditional rendering for InventoryView
4. Import InventoryView component
5. Handle view switching logic

**State Management**:
```typescript
const [selectedView, setSelectedView] = useState<'skills' | 'inventory'>('skills');

// When inventory is selected, show InventoryView
// When skills is selected, show SkillTrainingView or welcome screen
```

**Conditional Rendering**:
```typescript
{selectedView === 'inventory' ? (
  <InventoryView />
) : selectedSkill ? (
  <SkillTrainingView skillType={selectedSkill} />
) : (
  // Welcome screen
)}
```

**Acceptance**:
- [ ] Selecting "Inventory" in sidebar shows InventoryView
- [ ] Selecting a skill shows SkillTrainingView
- [ ] Navigation between views works smoothly
- [ ] State persists during session
- [ ] No console errors

---

### Phase 6: Testing & Validation

#### Task 6.1: Test Inventory Display
**Priority**: High  
**Estimated Time**: 30 minutes

**Description**: Manually test inventory with various states.

**Test Cases**:
1. Empty inventory
2. Single item
3. Multiple items (5-10)
4. Large inventory (30+ items)
5. Items from different categories
6. Items with varying quantities

**Validation**:
- [ ] Empty state shows correct message
- [ ] All items display correctly
- [ ] Stats are accurate
- [ ] Layout is clean and organized
- [ ] Scrolling works smoothly

---

#### Task 6.2: Test Search Functionality
**Priority**: High  
**Estimated Time**: 30 minutes

**Description**: Test search with various queries.

**Test Cases**:
1. Empty search (shows all items)
2. Partial name match ("oak")
3. Description match
4. Case insensitive ("WOOD")
5. No results ("xyz")
6. Clear button functionality

**Validation**:
- [ ] Search filters results in real-time
- [ ] Case insensitive matching works
- [ ] Searches both name and description
- [ ] No results state shows when appropriate
- [ ] Clear button resets search

---

#### Task 6.3: Test Sort Functionality
**Priority**: High  
**Estimated Time**: 30 minutes

**Description**: Test all sort options.

**Test Cases**:
1. Alphabetical sort (A-Z)
2. Gold value sort (highest first)
3. Item count sort (most first)
4. Sort persistence during session
5. Sort with search filter active

**Validation**:
- [ ] Alphabetical sorts correctly (case-insensitive)
- [ ] Gold value sorts by unit price
- [ ] Item count sorts by quantity
- [ ] Active sort is highlighted
- [ ] Sort works with filtered results

---

#### Task 6.4: Test Navigation
**Priority**: High  
**Estimated Time**: 20 minutes

**Description**: Test navigation between views.

**Test Cases**:
1. Open sidebar, select Inventory
2. From inventory, select a skill
3. From skill, return to inventory
4. Sidebar closes after selection
5. Selected view shows indicator in sidebar

**Validation**:
- [ ] Navigation is smooth (no flicker)
- [ ] Views render correctly
- [ ] State persists (search, sort)
- [ ] Sidebar behavior is consistent
- [ ] No console errors

---

### Phase 7: Polish & Documentation

#### Task 7.1: Web Platform Testing
**Priority**: Medium  
**Estimated Time**: 30 minutes

**Description**: Test inventory on web platform.

**Test Areas**:
1. Layout responsiveness
2. Mouse interactions (hover, click)
3. Keyboard navigation
4. Touch events (if applicable)
5. Search input behavior

**Validation**:
- [ ] Layout looks good on desktop
- [ ] Interactions work with mouse
- [ ] No console errors
- [ ] Performance is smooth

---

#### Task 7.2: Code Review & Cleanup
**Priority**: Medium  
**Estimated Time**: 30 minutes

**Description**: Review all code for quality and consistency.

**Checks**:
1. Remove console.logs
2. Add missing TypeScript types
3. Add component comments/documentation
4. Check for unused imports
5. Verify naming conventions
6. Ensure code formatting (Prettier)

**Validation**:
- [ ] No linting errors
- [ ] All types are defined
- [ ] Code follows project conventions
- [ ] Comments are helpful
- [ ] No debug code remains

---

#### Task 7.3: Update Documentation
**Priority**: Low  
**Estimated Time**: 20 minutes

**Description**: Update project documentation.

**Files to update**:
- `PROJECT_SUMMARY.md` - Add inventory system section
- `README.md` - Update features list (if needed)

**Content**:
- Describe inventory features
- Mention search and sort capabilities
- Note Player section in sidebar
- Add any new dependencies (none expected)

**Validation**:
- [ ] PROJECT_SUMMARY.md updated
- [ ] Documentation is clear and accurate
- [ ] No broken links

---

## Summary

**Total Tasks**: 15  
**Estimated Total Time**: 12-14 hours  
**Critical Path**: Tasks 1.1 → 1.2 → 2.1 → 3.1-3.4 → 4.1 → 5.1 → Testing

**Dependencies**:
- Task 1.2 requires 1.1 (types)
- Task 2.1 requires 1.1, 1.2 (types, data)
- Tasks 3.1-3.4 require 1.1, 2.1 (types, store)
- Task 4.1 can be done in parallel with 3.x
- Task 5.1 requires 3.1, 4.1 (components)
- Testing requires all above tasks

**High Priority Tasks** (Must Complete):
1. Task 1.1: Types
2. Task 1.2: Item Metadata
3. Task 2.1: GameStore
4. Task 3.1: InventoryView
5. Task 3.2: SearchBar
6. Task 3.3: SortControls
7. Task 3.4: InventoryItemCard
8. Task 4.1: Sidebar
9. Task 5.1: App Integration
10. Tasks 6.1-6.4: Testing

**Medium Priority Tasks**:
- Task 7.1: Web Testing

**Low Priority Tasks**:
- Task 7.2: Code Review (but important!)
- Task 7.3: Documentation

## Risk Mitigation

**Risk**: Item metadata takes longer than expected  
**Mitigation**: Start with a subset (10-15 items) to test integration, then complete remaining items

**Risk**: Sort/search has bugs  
**Mitigation**: Write pure functions, test with various data sets, add unit tests if time allows

**Risk**: Mobile layout issues  
**Mitigation**: Test frequently on mobile viewport, use flexbox and percentages, avoid fixed widths

**Risk**: Performance issues with many items  
**Mitigation**: Use `useMemo` for computed values, consider `FlatList` if needed, profile with React DevTools
