# Task Breakdown: Inventory System

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07  
**Related Spec**: [06-inventory-system.md](./06-inventory-system.md)  
**Related Plan**: [06-inventory-system.plan.md](./06-inventory-system.plan.md)

## Task List

### Phase 1: Resource Data Foundation

#### Task 1.1: Analyze Existing Resource IDs
**Priority**: High  
**Estimated Time**: 15 minutes

**Steps**:
1. Review `src/data/skills-gathering.ts` and extract all resource IDs from products
2. Review `src/data/skills-production.ts` and extract all resource IDs from requirements and products
3. Create a comprehensive list of all unique resource IDs
4. Note any patterns or naming conventions

**Deliverable**: List of all resource IDs used in the game

**Acceptance Criteria**:
- [ ] All resource IDs from woodcutting activities extracted
- [ ] All resource IDs from mining activities extracted
- [ ] All resource IDs from fishing activities extracted
- [ ] All resource IDs from cooking activities extracted
- [ ] All resource IDs from smithing activities extracted
- [ ] All resource IDs from crafting activities extracted
- [ ] No duplicate entries in list
- [ ] IDs match those used in activity definitions

---

#### Task 1.2: Create Resource Data File
**Priority**: High  
**Estimated Time**: 30 minutes

**Steps**:
1. Create `src/data/resources.ts`
2. Import `Resource` type from `../types`
3. Define RESOURCES object with all resource entries
4. Add icon (emoji) for each resource
5. Add descriptive name for each resource
6. Add description for each resource
7. Add placeholder gold values (based on level requirement or rarity)

**Deliverable**: Complete `resources.ts` file

**Acceptance Criteria**:
- [ ] File created at correct location
- [ ] All resources from Task 1.1 are defined
- [ ] Each resource has: id, name, description, icon, goldValue
- [ ] Icons are thematically appropriate emojis
- [ ] Names are properly formatted (Title Case)
- [ ] Descriptions are concise and helpful
- [ ] Gold values are reasonable placeholders

---

#### Task 1.3: Create Resource Helper Functions
**Priority**: High  
**Estimated Time**: 15 minutes

**Steps**:
1. In `resources.ts`, create `getResourceById(id: string)` function
2. Create `getAllResources()` function
3. Export both functions
4. Add TypeScript return types
5. Add JSDoc comments

**Deliverable**: Helper functions for resource access

**Acceptance Criteria**:
- [ ] `getResourceById` returns correct resource or undefined
- [ ] `getAllResources` returns array of all resources
- [ ] Functions are properly typed
- [ ] Functions are exported
- [ ] Functions have JSDoc documentation

---

#### Task 1.4: Update Data Index
**Priority**: High  
**Estimated Time**: 5 minutes

**Steps**:
1. Open `src/data/index.ts`
2. Export resources functions: `export { getResourceById, getAllResources } from './resources';`
3. Verify no circular dependencies

**Deliverable**: Updated index file

**Acceptance Criteria**:
- [ ] Resource functions are exported from index
- [ ] No TypeScript errors
- [ ] File builds successfully

---

### Phase 2: Sidebar Updates

#### Task 2.1: Add Player Section to Sidebar
**Priority**: High  
**Estimated Time**: 20 minutes

**Steps**:
1. Open `src/components/Sidebar.tsx`
2. After the Skills section, add a "Player" header
3. Add "Inventory" item under Player section
4. Calculate total item count from inventory
5. Display count next to "Inventory" label
6. Use consistent styling with Skills section
7. Add divider between Skills and Player sections

**Deliverable**: Updated Sidebar with Player section

**Acceptance Criteria**:
- [ ] "Player" header is visible below Skills
- [ ] "Inventory" item is listed under Player
- [ ] Item count is calculated correctly
- [ ] Count displays as "Inventory (X)" format
- [ ] Styling matches Skills section
- [ ] Divider separates sections visually

---

#### Task 2.2: Add Inventory Navigation Handler
**Priority**: High  
**Estimated Time**: 15 minutes

**Steps**:
1. In Sidebar component, add prop `onSelectInventory: () => void`
2. Add onPress handler to Inventory item
3. Call `onSelectInventory` and `onClose()` when pressed
4. Add visual indicator if inventory is selected (optional)

**Deliverable**: Clickable inventory navigation

**Acceptance Criteria**:
- [ ] Clicking Inventory calls onSelectInventory
- [ ] Sidebar closes after selection
- [ ] No TypeScript errors
- [ ] Props are properly typed

---

#### Task 2.3: Update App.tsx for Inventory Navigation
**Priority**: High  
**Estimated Time**: 20 minutes

**Steps**:
1. Open `App.tsx`
2. Add state: `const [inventoryOpen, setInventoryOpen] = useState(false);`
3. Add `onSelectInventory` handler to Sidebar props
4. Update main content area to show InventoryScreen when `inventoryOpen` is true
5. Import InventoryScreen (will create next)

**Deliverable**: App.tsx ready for inventory navigation

**Acceptance Criteria**:
- [ ] State variable for inventory added
- [ ] Handler connected to Sidebar
- [ ] Conditional rendering for InventoryScreen prepared
- [ ] No TypeScript errors

---

### Phase 3: Item Card Component

#### Task 3.1: Create ItemCard Component File
**Priority**: High  
**Estimated Time**: 30 minutes

**Steps**:
1. Create `src/components/ItemCard.tsx`
2. Define `ItemCardProps` interface:
   - `resourceId: string`
   - `quantity: number`
   - `onPress?: () => void`
3. Create functional component
4. Fetch resource data using `getResourceById`
5. Handle case where resource is not found
6. Create component JSX structure

**Deliverable**: ItemCard component file

**Acceptance Criteria**:
- [ ] File created at correct location
- [ ] Props interface defined
- [ ] Component structure created
- [ ] Resource lookup implemented
- [ ] Missing resource case handled

---

#### Task 3.2: Implement ItemCard Layout
**Priority**: High  
**Estimated Time**: 20 minutes

**Steps**:
1. Create layout with icon, name, and quantity
2. Use TouchableOpacity for press interaction
3. Format quantity with number formatting
4. Position elements appropriately
5. Ensure icon is large and visible

**Deliverable**: ItemCard with complete layout

**Acceptance Criteria**:
- [ ] Icon displays at appropriate size (48x48)
- [ ] Name displays on single or multiple lines
- [ ] Quantity displays formatted (e.g., 1,234)
- [ ] TouchableOpacity handles press events
- [ ] Layout is balanced and readable

---

#### Task 3.3: Style ItemCard Component
**Priority**: High  
**Estimated Time**: 20 minutes

**Steps**:
1. Create StyleSheet for ItemCard
2. Add card background, padding, border-radius
3. Add shadow/elevation for depth
4. Style icon container
5. Style text elements (name, quantity)
6. Add press state feedback
7. Ensure minimum touch target size (44x44)

**Deliverable**: Styled ItemCard component

**Acceptance Criteria**:
- [ ] Card has white background
- [ ] Card has rounded corners (8px)
- [ ] Card has subtle shadow
- [ ] Text is readable with good contrast
- [ ] Press feedback is visible
- [ ] Matches design spec colors
- [ ] Touch target meets accessibility standards

---

### Phase 4: Inventory Screen Core

#### Task 4.1: Create InventoryScreen Component File
**Priority**: High  
**Estimated Time**: 30 minutes

**Steps**:
1. Create `src/components/InventoryScreen.tsx`
2. Define component props (if any)
3. Set up basic component structure
4. Import necessary dependencies (useGameStore, etc.)
5. Fetch inventory from gameStore
6. Set up local state for UI controls

**Deliverable**: InventoryScreen component file

**Acceptance Criteria**:
- [ ] File created at correct location
- [ ] Component structure created
- [ ] Inventory data fetched from store
- [ ] Local state initialized
- [ ] Imports are correct

---

#### Task 4.2: Implement InventoryScreen Header
**Priority**: High  
**Estimated Time**: 20 minutes

**Steps**:
1. Create header view with title "Inventory"
2. Add back/close button
3. Calculate and display total unique items count
4. Calculate and display total quantity count
5. Style header consistently with app design
6. Connect close button to navigation

**Deliverable**: Inventory screen header

**Acceptance Criteria**:
- [ ] Header displays "Inventory" title
- [ ] Back button is visible and functional
- [ ] Shows count: "X items, Y total"
- [ ] Styling matches app header design
- [ ] Header is fixed at top

---

#### Task 4.3: Implement Item Grid Layout
**Priority**: High  
**Estimated Time**: 30 minutes

**Steps**:
1. Create FlatList or ScrollView for items
2. Convert inventory object to array of [id, quantity] pairs
3. Render ItemCard for each item
4. Implement 2-column grid on mobile, 3-column on tablet
5. Add appropriate padding and spacing
6. Extract item count and use as `key` prop

**Deliverable**: Grid display of inventory items

**Acceptance Criteria**:
- [ ] Items display in grid format
- [ ] 2 columns on mobile screens
- [ ] 3 columns on larger screens (optional)
- [ ] Proper spacing between items
- [ ] ScrollView allows seeing all items
- [ ] No key warnings in console

---

#### Task 4.4: Implement Empty State
**Priority**: High  
**Estimated Time**: 15 minutes

**Steps**:
1. Check if inventory is empty
2. Display helpful message when no items
3. Add icon or emoji to empty state
4. Style empty state centered on screen
5. Provide suggestion (e.g., "Start training to collect items")

**Deliverable**: Empty state display

**Acceptance Criteria**:
- [ ] Empty state shows when inventory is empty
- [ ] Message is helpful and friendly
- [ ] Layout is centered and attractive
- [ ] Suggests action to get items

---

#### Task 4.5: Test Basic Inventory Display
**Priority**: High  
**Estimated Time**: 15 minutes

**Steps**:
1. Run app in development mode
2. Navigate to inventory
3. Verify items display correctly
4. Test with empty inventory
5. Test with various item counts
6. Check scrolling behavior
7. Test back navigation

**Deliverable**: Verified working basic inventory

**Acceptance Criteria**:
- [ ] Inventory screen displays
- [ ] Items show with correct data
- [ ] Empty state works
- [ ] Scrolling is smooth
- [ ] Back button returns to previous screen
- [ ] No console errors

---

### Phase 5: Search Functionality

#### Task 5.1: Add Search Bar UI
**Priority**: Medium  
**Estimated Time**: 20 minutes

**Steps**:
1. Add TextInput for search query
2. Position search bar below header
3. Add search icon/placeholder text
4. Add clear button (X) to reset search
5. Style search bar with rounded corners
6. Make search bar stick below header

**Deliverable**: Search bar UI

**Acceptance Criteria**:
- [ ] Search bar is visible below header
- [ ] Placeholder text: "Search items..."
- [ ] Clear button appears when text is entered
- [ ] Styling matches design spec
- [ ] Search icon is visible (optional)

---

#### Task 5.2: Implement Search State
**Priority**: Medium  
**Estimated Time**: 15 minutes

**Steps**:
1. Add `searchQuery` state: `useState('')`
2. Connect TextInput to searchQuery state
3. Implement onChange handler
4. Implement clear button handler
5. Ensure state updates trigger re-render

**Deliverable**: Search state management

**Acceptance Criteria**:
- [ ] Typing updates searchQuery state
- [ ] Clear button resets searchQuery
- [ ] State changes trigger re-render
- [ ] No lag when typing

---

#### Task 5.3: Implement Search Filter Logic
**Priority**: Medium  
**Estimated Time**: 30 minutes

**Steps**:
1. Create filter function:
   ```typescript
   const filterItems = (items: [string, number][], query: string) => {
     if (!query) return items;
     return items.filter(([id]) => {
       const resource = getResourceById(id);
       return resource?.name.toLowerCase().includes(query.toLowerCase());
     });
   };
   ```
2. Apply filter to inventory items
3. Use useMemo to optimize filtering
4. Display filtered results in grid
5. Show "No results" when filtered list is empty

**Deliverable**: Working search filter

**Acceptance Criteria**:
- [ ] Search filters items in real-time
- [ ] Search is case-insensitive
- [ ] Partial matches work (e.g., "wood" finds "Oak Wood")
- [ ] Empty query shows all items
- [ ] "No results" message shows when appropriate
- [ ] Performance is good (< 100ms)

---

#### Task 5.4: Test Search Functionality
**Priority**: Medium  
**Estimated Time**: 15 minutes

**Steps**:
1. Test with various search queries
2. Test with partial matches
3. Test with no matches
4. Test clear button
5. Verify case-insensitivity
6. Check performance with many items

**Deliverable**: Verified search functionality

**Acceptance Criteria**:
- [ ] All search queries work correctly
- [ ] Clear button resets search
- [ ] No results message appears appropriately
- [ ] Search is instant
- [ ] No console errors

---

### Phase 6: Sort Functionality

#### Task 6.1: Add Sort Controls UI
**Priority**: Medium  
**Estimated Time**: 30 minutes

**Steps**:
1. Add sort control section below search bar
2. Create button group or dropdown for sort options:
   - Name (A-Z)
   - Name (Z-A)
   - Count (High-Low)
   - Count (Low-High)
   - Value (High-Low) [future]
   - Value (Low-High) [future]
3. Style buttons to show active state
4. Position controls appropriately

**Deliverable**: Sort controls UI

**Acceptance Criteria**:
- [ ] Sort controls are visible
- [ ] All sort options are listed
- [ ] Active sort is visually highlighted
- [ ] Buttons are properly sized (44x44)
- [ ] Layout is clean and organized

---

#### Task 6.2: Implement Sort State
**Priority**: Medium  
**Estimated Time**: 15 minutes

**Steps**:
1. Add `sortBy` state with type:
   ```typescript
   type SortOption = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc' | 'value-asc' | 'value-desc';
   const [sortBy, setSortBy] = useState<SortOption>('name-asc');
   ```
2. Connect buttons to setSortBy
3. Ensure state updates trigger re-render

**Deliverable**: Sort state management

**Acceptance Criteria**:
- [ ] Sort state is properly typed
- [ ] Default sort is name-asc
- [ ] Clicking buttons updates state
- [ ] State changes trigger re-render

---

#### Task 6.3: Implement Sort Logic
**Priority**: Medium  
**Estimated Time**: 30 minutes

**Steps**:
1. Create sort function:
   ```typescript
   const sortItems = (items: [string, number][], sortBy: SortOption) => {
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
2. Apply sort after filter
3. Use useMemo to optimize
4. Ensure stable sort (consistent ordering)

**Deliverable**: Working sort logic

**Acceptance Criteria**:
- [ ] Name sorts work correctly (A-Z, Z-A)
- [ ] Count sorts work correctly (High-Low, Low-High)
- [ ] Value sorts work correctly (High-Low, Low-High)
- [ ] Sort is stable
- [ ] Sort works with filtered results
- [ ] Performance is good (< 500ms)

---

#### Task 6.4: Test Sort Functionality
**Priority**: Medium  
**Estimated Time**: 20 minutes

**Steps**:
1. Test each sort option
2. Verify correct ordering
3. Test with search + sort combination
4. Test with edge cases (same values)
5. Check performance

**Deliverable**: Verified sort functionality

**Acceptance Criteria**:
- [ ] All sort options work correctly
- [ ] Active sort is visually indicated
- [ ] Sort persists during search
- [ ] Edge cases handled properly
- [ ] No console errors

---

### Phase 7: Polish and Testing (Optional)

#### Task 7.1: Add Item Detail Modal (Optional)
**Priority**: Low  
**Estimated Time**: 1 hour

**Steps**:
1. Create `ItemDetailModal.tsx` component
2. Show modal when item card is pressed
3. Display full resource information
4. Add close button
5. Style modal

**Deliverable**: Item detail modal

**Acceptance Criteria**:
- [ ] Modal opens on item press
- [ ] Shows complete item information
- [ ] Modal can be closed
- [ ] Styling is polished

---

#### Task 7.2: Add Loading and Error States
**Priority**: Low  
**Estimated Time**: 20 minutes

**Steps**:
1. Add loading state if needed
2. Add error boundaries
3. Handle missing resource definitions gracefully
4. Show helpful error messages

**Deliverable**: Robust error handling

**Acceptance Criteria**:
- [ ] Loading states display when appropriate
- [ ] Errors don't crash the app
- [ ] Error messages are helpful
- [ ] Missing resources show placeholder

---

#### Task 7.3: Optimize Performance
**Priority**: Low  
**Estimated Time**: 30 minutes

**Steps**:
1. Use React.memo on ItemCard if needed
2. Verify useMemo is working correctly
3. Profile with React DevTools
4. Optimize any bottlenecks
5. Test with large inventory (100+ items)

**Deliverable**: Optimized performance

**Acceptance Criteria**:
- [ ] No unnecessary re-renders
- [ ] Search and sort are instant
- [ ] Scrolling is smooth
- [ ] Works well with 100+ items

---

#### Task 7.4: Accessibility Review
**Priority**: Low  
**Estimated Time**: 20 minutes

**Steps**:
1. Add aria-labels to inputs and buttons
2. Verify touch target sizes
3. Check color contrast ratios
4. Test tab navigation (web)
5. Test with screen reader if possible

**Deliverable**: Accessible inventory system

**Acceptance Criteria**:
- [ ] All interactive elements have labels
- [ ] Touch targets meet 44x44 minimum
- [ ] Contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

#### Task 7.5: Cross-Platform Testing
**Priority**: Low  
**Estimated Time**: 30 minutes

**Steps**:
1. Test on web browser
2. Test on Android (if available)
3. Test on iOS (if available)
4. Verify responsive behavior
5. Check different screen sizes

**Deliverable**: Cross-platform verified

**Acceptance Criteria**:
- [ ] Works on web
- [ ] Works on Android
- [ ] Works on iOS
- [ ] Responsive to screen size
- [ ] No platform-specific bugs

---

## Summary

**Total Tasks**: 25  
**Estimated Total Time**: 10-13 hours

**Task Distribution by Phase**:
- Phase 1 (Foundation): 4 tasks, ~1 hour
- Phase 2 (Sidebar): 3 tasks, ~1 hour
- Phase 3 (ItemCard): 3 tasks, ~1.5 hours
- Phase 4 (Core Screen): 5 tasks, ~2 hours
- Phase 5 (Search): 4 tasks, ~1.5 hours
- Phase 6 (Sort): 4 tasks, ~1.5 hours
- Phase 7 (Polish): 5 tasks, ~2.5 hours (optional)

**Minimum Viable Product**: Phases 1-4 (5.5 hours)  
**Full Functional Implementation**: Phases 1-6 (8.5 hours)  
**Production Ready**: Phases 1-7 (11 hours)

## Next Steps

1. ✅ Review task breakdown
2. ⬜ Begin with Phase 1, Task 1.1
3. ⬜ Complete tasks sequentially
4. ⬜ Test after each phase
5. ⬜ Update progress in this document
6. ⬜ Commit after each phase completion

## Progress Tracking

Use this checklist to track overall progress:

- [ ] Phase 1: Resource Data Foundation
- [ ] Phase 2: Sidebar Updates
- [ ] Phase 3: Item Card Component
- [ ] Phase 4: Inventory Screen Core
- [ ] Phase 5: Search Functionality
- [ ] Phase 6: Sort Functionality
- [ ] Phase 7: Polish and Testing (Optional)
