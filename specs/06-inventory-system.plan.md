# Implementation Plan: Inventory System

**Status**: Draft  
**Version**: 1.0  
**Last Updated**: 2026-01-07  
**Related Spec**: [06-inventory-system.md](./06-inventory-system.md)

## Overview
This plan outlines the technical approach to implementing the inventory system for SkillForge Idle. The implementation will be done in phases to ensure incremental progress and testability.

## Architecture Decisions

### 1. Data Layer
**Decision**: Create a centralized resource registry in `src/data/resources.ts`
**Rationale**: 
- Single source of truth for all resource definitions
- Easy to extend with new resources
- Consistent data structure across the application
- Simplifies resource lookups and validation

**Implementation**:
- Define all resources from existing skill activities
- Include gold values for future trading system
- Provide helper functions for resource access

### 2. Component Structure
**Decision**: Create standalone InventoryScreen component with composition pattern
**Rationale**:
- Keeps components small and focused
- Easier to test individual pieces
- Reusable sub-components (SearchBar, ItemCard)
- Follows existing codebase patterns (see SkillTrainingView, ActivityCard)

**Component Hierarchy**:
```
InventoryScreen
├── InventoryHeader (inline)
├── SearchBar (inline or separate)
├── SortControls (inline)
└── ItemList
    └── ItemCard (separate component)
```

### 3. State Management
**Decision**: Use local component state for UI concerns, leverage existing Zustand store for inventory data
**Rationale**:
- Inventory data already exists in gameStore
- Search query and sort preference are UI-only state
- No need to pollute global store with temporary UI state
- Follows React best practices

**State Location**:
- **Global (Zustand)**: `inventory: Record<string, number>`
- **Local (useState)**: `searchQuery`, `sortBy`, `selectedItem`

### 4. Navigation
**Decision**: Integrate inventory into sidebar under "Player" section
**Rationale**:
- Sidebar spec already defines this pattern (Skills section)
- Natural grouping for player-related features
- Consistent with existing navigation patterns
- Easy to discover for users

**Implementation**:
- Add "Player" header to Sidebar component
- Add inventory link with item count badge
- Update App.tsx to handle inventory navigation
- Show InventoryScreen when selected

### 5. Filtering and Sorting
**Decision**: Implement client-side filtering and sorting with memoization
**Rationale**:
- Inventory size is manageable (< 100 items expected)
- No server/database to query
- Instant feedback for user
- Use useMemo to prevent unnecessary recalculations

**Approach**:
```typescript
const filteredItems = useMemo(() => {
  const items = Object.entries(inventory);
  // Filter by search query
  const filtered = searchQuery 
    ? items.filter(([id]) => {
        const resource = getResourceById(id);
        return resource?.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : items;
  
  // Sort by selected criteria
  return filtered.sort((a, b) => {
    // Sort logic based on sortBy
  });
}, [inventory, searchQuery, sortBy]);
```

## Implementation Phases

### Phase 1: Resource Data Foundation (Priority: High)
**Estimated Time**: 1-2 hours

**Tasks**:
1. Create `src/data/resources.ts`
2. Define all resources from existing skills:
   - Woodcutting: 6 wood types
   - Mining: 8 ore types
   - Fishing: 8 raw fish types
   - Cooking: 8 cooked fish types
   - Smithing: 7 bar types
   - Crafting: TBD based on existing activities
3. Add gold values to each resource (placeholder values for now)
4. Create `getResourceById()` and `getAllResources()` helper functions
5. Export resource registry

**Deliverable**: Complete resource data file with all game resources defined

**Testing**:
- Verify all resources from skill activities are included
- Test helper functions return correct data
- Ensure resource IDs match those used in skill activities

### Phase 2: Sidebar Updates (Priority: High)
**Estimated Time**: 1 hour

**Tasks**:
1. Update `src/components/Sidebar.tsx`:
   - Add "Player" header section after Skills section
   - Add "Inventory" list item under Player
   - Calculate and display total item count
   - Add navigation handler for inventory selection
2. Update `App.tsx`:
   - Add state for tracking if inventory is selected
   - Render InventoryScreen when inventory is active
   - Pass necessary props to Sidebar

**Deliverable**: Sidebar with Player section and working Inventory navigation

**Testing**:
- Sidebar shows Player section
- Inventory displays correct item count
- Clicking Inventory switches view
- Sidebar closes after selection

### Phase 3: Item Card Component (Priority: High)
**Estimated Time**: 1 hour

**Tasks**:
1. Create `src/components/ItemCard.tsx`
2. Implement component with props:
   - `resourceId: string`
   - `quantity: number`
   - `onPress?: () => void`
3. Display:
   - Resource icon
   - Resource name (from resource registry)
   - Quantity with formatted number
4. Add styling consistent with ActivityCard
5. Add press interaction

**Deliverable**: Reusable ItemCard component

**Testing**:
- Card displays correct resource information
- Quantity is formatted properly
- Press handler is called correctly
- Styling matches design spec

### Phase 4: Inventory Screen Core (Priority: High)
**Estimated Time**: 2-3 hours

**Tasks**:
1. Create `src/components/InventoryScreen.tsx`
2. Implement basic layout:
   - Header with title
   - Back/close button
   - Item count summary
3. Fetch inventory from gameStore
4. Render ItemCard for each inventory item
5. Implement grid layout (2-3 columns responsive)
6. Add empty state when no items
7. Add ScrollView for long lists

**Deliverable**: Basic inventory screen showing all items

**Testing**:
- Screen displays all inventory items
- Grid layout is responsive
- Empty state shows when inventory is empty
- Scrolling works smoothly
- Back button returns to previous view

### Phase 5: Search Functionality (Priority: Medium)
**Estimated Time**: 1-2 hours

**Tasks**:
1. Add search bar to InventoryScreen header
2. Implement search input with state
3. Add real-time filtering logic
4. Add clear button to reset search
5. Show "No results" message when search has no matches
6. Optimize with useMemo for performance

**Deliverable**: Working search functionality

**Testing**:
- Search filters items in real-time
- Search is case-insensitive
- Clear button resets search
- "No results" message appears appropriately
- Search is performant (no lag)

### Phase 6: Sort Functionality (Priority: Medium)
**Estimated Time**: 1-2 hours

**Tasks**:
1. Add sort control buttons/dropdown
2. Implement sort state management
3. Create sort logic for each option:
   - Name (A-Z, Z-A)
   - Count (High-Low, Low-High)
   - Value (High-Low, Low-High)
4. Update filtered items with sorting
5. Add visual indicator for active sort
6. Optimize with useMemo

**Deliverable**: Working sort functionality with all options

**Testing**:
- Each sort option works correctly
- Active sort is visually indicated
- Sorting is stable (consistent results)
- Sorting is performant
- Sort persists during search

### Phase 7: Item Details (Priority: Low)
**Estimated Time**: 1-2 hours

**Tasks**:
1. Create `src/components/ItemDetailModal.tsx` (optional)
2. Add modal/screen for detailed item view
3. Display:
   - Large icon
   - Full name and description
   - Quantity owned
   - Gold value
   - Source information
4. Add close/dismiss functionality
5. Style modal appropriately

**Deliverable**: Item detail view (optional)

**Testing**:
- Modal opens when item is tapped
- All information displays correctly
- Modal can be closed
- Modal doesn't block other functionality

### Phase 8: Polish and Optimization (Priority: Low)
**Estimated Time**: 1-2 hours

**Tasks**:
1. Add animations/transitions
2. Optimize rendering with React.memo if needed
3. Add loading states if applicable
4. Ensure accessibility (labels, contrast)
5. Test on different screen sizes
6. Add any missing error handling
7. Code cleanup and documentation

**Deliverable**: Polished, production-ready inventory system

**Testing**:
- All acceptance criteria met
- Performance is acceptable on all devices
- Accessibility standards met
- No console errors or warnings

## Technical Considerations

### Performance
- **Memoization**: Use `useMemo` for filtered/sorted lists
- **React.memo**: Wrap ItemCard if re-rendering is an issue
- **Virtual Lists**: Consider if inventory exceeds 200 items (future)
- **Debouncing**: Not needed for search (instant filtering is acceptable)

### Error Handling
- **Missing Resources**: Handle case where inventory has resource ID not in registry
- **Invalid Data**: Validate resource data on load
- **Empty States**: Show helpful messages when inventory is empty or no results

### Accessibility
- **Labels**: Add proper aria-labels to search input and sort buttons
- **Touch Targets**: Ensure all buttons meet 44x44 minimum
- **Contrast**: Maintain WCAG AA contrast ratios
- **Screen Readers**: Test with screen reader (if possible)

### Testing Strategy
- **Unit Tests**: Test filtering and sorting logic in isolation
- **Component Tests**: Test ItemCard and InventoryScreen rendering
- **Integration Tests**: Test full user flow (search, sort, select)
- **Manual Testing**: Test on web and mobile platforms

## Dependencies

### Required Before Starting
- ✅ Core game system with inventory state
- ✅ Skill activities defining resource IDs
- ✅ Sidebar component structure
- ✅ Zustand store with inventory

### External Dependencies
- None (uses existing project dependencies)

## Risk Mitigation

### Risk: Resource IDs mismatch between activities and resource registry
**Mitigation**: 
- Extract resource IDs from existing skill data files
- Create validation script to check consistency
- Add runtime warning when unknown resource ID is encountered

### Risk: Performance issues with large inventories
**Mitigation**:
- Start with basic implementation and measure performance
- Use React DevTools Profiler to identify bottlenecks
- Add optimizations (memoization, virtual lists) only if needed

### Risk: UI doesn't work well on all screen sizes
**Mitigation**:
- Use responsive grid with percentage widths
- Test on multiple device sizes early
- Use flexbox for flexible layouts

## Success Metrics

### Functionality
- [ ] All items in inventory are displayed
- [ ] Search filters correctly
- [ ] All sort options work
- [ ] Item details show when tapped
- [ ] Empty states are helpful

### Performance
- [ ] Search filters in < 100ms
- [ ] Sort completes in < 500ms
- [ ] Smooth scrolling (60 FPS)
- [ ] No memory leaks

### Code Quality
- [ ] Components are well-structured
- [ ] Code is documented
- [ ] No TypeScript errors
- [ ] Follows project conventions
- [ ] Passes ESLint

### User Experience
- [ ] Interface is intuitive
- [ ] Navigation is smooth
- [ ] Visual feedback is clear
- [ ] Works on mobile and web

## Timeline Estimate

**Total Estimated Time**: 10-15 hours

**Minimum Viable Product (MVP)**:
- Phase 1-4: 5-7 hours
- Results in: Basic inventory display with navigation

**Full Implementation**:
- Phase 1-6: 8-12 hours
- Results in: Complete inventory with search and sort

**Polished Release**:
- Phase 1-8: 10-15 hours
- Results in: Production-ready inventory system

## Next Steps

1. Review this plan with stakeholders
2. Begin Phase 1: Resource Data Foundation
3. Commit after each phase completion
4. Update task breakdown as implementation progresses
5. Document any deviations from plan

## References

- [Specification: 06-inventory-system.md](./06-inventory-system.md)
- [Project Constitution](.specify/memory/constitution.md)
- [Sidebar Navigation Spec](./04-sidebar-navigation.md)
- [User Interface Spec](./03-user-interface.md)
