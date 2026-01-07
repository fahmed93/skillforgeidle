# Implementation Plan: Inventory System

**Based on**: [05-inventory-system.md](./05-inventory-system.md)  
**Version**: 1.0  
**Last Updated**: 2026-01-07

## Overview

This plan outlines the technical implementation approach for the inventory system, including data structures, components, state management, and integration with the existing codebase.

## Architecture Decisions

### 1. Data Layer
**Decision**: Create centralized item metadata registry  
**Rationale**: 
- Single source of truth for item properties
- Easy to maintain and update gold values
- Enables future features (item stats, rarity, etc.)
- Keeps item data separate from game state

**Implementation**:
- New file: `src/data/items-metadata.ts`
- Export `ITEMS_METADATA` object with all item definitions
- Export helper functions: `getItemMetadata()`, `getAllItems()`

### 2. State Management
**Decision**: Extend Zustand gameStore with inventory UI state  
**Rationale**:
- Consistent with existing state management pattern
- No need for separate inventory store
- Easy to persist search/sort preferences
- Direct access to inventory quantities

**Implementation**:
- Add `inventoryUIState` to gameStore
- Add inventory-specific actions and selectors
- Computed values for sorted/filtered items

### 3. Component Architecture
**Decision**: Dedicated inventory component hierarchy  
**Rationale**:
- Clean separation of concerns
- Reusable components
- Easy to test independently
- Scalable for future features

**Component Tree**:
```
InventoryView (container)
  ├── InventoryHeader
  │     ├── SearchBar
  │     └── SortControls
  ├── InventoryStats (total items, total value)
  └── InventoryGrid
        └── InventoryItemCard (repeated)
```

### 4. Navigation Strategy
**Decision**: Add "Player" section to sidebar, separate from "Skills"  
**Rationale**:
- Logical grouping (Skills vs Player info)
- Scalable for future player-related features
- Matches industry conventions
- Clear visual hierarchy

**Changes to Sidebar**:
- Add section divider/header between Skills and Player
- Add expandable/collapsible sections (future)
- Current: flat list with visual grouping

### 5. Sorting & Search
**Decision**: Client-side filtering and sorting  
**Rationale**:
- Fast performance with < 100 items
- No backend needed
- Instant feedback
- Simple implementation

**Optimization**:
- Use `useMemo` to cache filtered/sorted results
- Debounce search input (300ms) for better performance
- Sort functions are pure and testable

## Technical Implementation

### Phase 1: Item Metadata (Priority: High)

#### 1.1 Create Item Metadata Registry

**File**: `src/data/items-metadata.ts`

```typescript
import type { ItemMetadata } from '../types';

export const ITEMS_METADATA: Record<string, ItemMetadata> = {
  // Woodcutting (8 items)
  'regular-wood': {
    id: 'regular-wood',
    name: 'Regular Wood',
    description: 'Basic wood logs from regular trees. Used in crafting and construction.',
    icon: '🪵',
    goldValue: 5,
    category: 'wood',
  },
  'oak-wood': {
    id: 'oak-wood',
    name: 'Oak Wood',
    description: 'Sturdy oak logs. More valuable than regular wood.',
    icon: '🌳',
    goldValue: 12,
    category: 'wood',
  },
  // ... all 55+ items
};

// Helper functions
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

**Gold Values Strategy**:
- Base tier items: 5-10 gold
- Mid tier items: 10-50 gold
- High tier items: 50-200 gold
- End game items: 200-500 gold
- Balance considerations:
  - Higher level requirements = higher value
  - Longer gathering time = higher value
  - Production items > raw materials
  - Cooking roughly doubles raw fish value

#### 1.2 Update Type Definitions

**File**: `src/types/index.ts`

Add new types:
```typescript
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

### Phase 2: State Management (Priority: High)

#### 2.1 Extend GameStore

**File**: `src/store/gameStore.ts`

```typescript
import { getItemMetadata } from '../data/items-metadata';
import type { InventoryItem, InventorySortOption, InventoryUIState } from '../types';

interface GameStore {
  // ... existing state ...
  
  // Inventory UI State
  inventoryUIState: InventoryUIState;
  
  // Inventory Actions
  setInventorySortBy: (sortBy: InventorySortOption) => void;
  setInventorySearchQuery: (query: string) => void;
  
  // Inventory Selectors
  getInventoryItems: () => InventoryItem[];
  getFilteredInventoryItems: () => InventoryItem[];
  getTotalInventoryValue: () => number;
  getInventoryItemCount: () => number;
}

// Implementation
export const useGameStore = create<GameStore>((set, get) => ({
  // ... existing state ...
  
  inventoryUIState: {
    sortBy: InventorySortOption.ALPHABETICAL,
    searchQuery: '',
  },
  
  setInventorySortBy: (sortBy: InventorySortOption) => {
    set(state => ({
      inventoryUIState: {
        ...state.inventoryUIState,
        sortBy,
      },
    }));
  },
  
  setInventorySearchQuery: (query: string) => {
    set(state => ({
      inventoryUIState: {
        ...state.inventoryUIState,
        searchQuery: query,
      },
    }));
  },
  
  getInventoryItems: () => {
    const state = get();
    const inventory = state.gameState.inventory;
    
    // Convert inventory quantities to InventoryItem objects
    const items: InventoryItem[] = Object.entries(inventory)
      .filter(([_, quantity]) => quantity > 0)
      .map(([resourceId, quantity]) => {
        const metadata = getItemMetadata(resourceId);
        if (!metadata) {
          // Fallback for items without metadata
          return {
            id: resourceId,
            name: resourceId,
            description: 'No description available',
            icon: '📦',
            goldValue: 0,
            category: 'other' as const,
            quantity,
            totalValue: 0,
          };
        }
        return {
          ...metadata,
          quantity,
          totalValue: metadata.goldValue * quantity,
        };
      });
    
    return items;
  },
  
  getFilteredInventoryItems: () => {
    const state = get();
    let items = state.getInventoryItems();
    
    // Apply search filter
    const query = state.inventoryUIState.searchQuery.toLowerCase();
    if (query) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    const sortBy = state.inventoryUIState.sortBy;
    switch (sortBy) {
      case InventorySortOption.ALPHABETICAL:
        items = items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case InventorySortOption.GOLD_VALUE:
        items = items.sort((a, b) => b.goldValue - a.goldValue);
        break;
      case InventorySortOption.ITEM_COUNT:
        items = items.sort((a, b) => b.quantity - a.quantity);
        break;
    }
    
    return items;
  },
  
  getTotalInventoryValue: () => {
    return get().getInventoryItems()
      .reduce((total, item) => total + item.totalValue, 0);
  },
  
  getInventoryItemCount: () => {
    return get().getInventoryItems().length;
  },
}));
```

### Phase 3: UI Components (Priority: High)

#### 3.1 InventoryView Component

**File**: `src/components/inventory/InventoryView.tsx`

Main container component that orchestrates the inventory display.

```typescript
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { SearchBar } from './SearchBar';
import { SortControls } from './SortControls';
import { InventoryItemCard } from './InventoryItemCard';
import { formatNumber } from '../../utils/xp';

export const InventoryView: React.FC = () => {
  const filteredItems = useGameStore(state => state.getFilteredInventoryItems());
  const totalValue = useGameStore(state => state.getTotalInventoryValue());
  const itemCount = useGameStore(state => state.getInventoryItemCount());
  const searchQuery = useGameStore(state => state.inventoryUIState.searchQuery);
  
  const isEmpty = itemCount === 0;
  const hasNoResults = !isEmpty && filteredItems.length === 0;
  
  return (
    <View style={styles.container}>
      {/* Header with stats */}
      <View style={styles.header}>
        <Text style={styles.title}>🎒 Inventory</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.statText}>
            Total Value: {formatNumber(totalValue)} 🪙
          </Text>
        </View>
      </View>
      
      {/* Search and Sort Controls */}
      {!isEmpty && (
        <View style={styles.controls}>
          <SearchBar />
          <SortControls />
        </View>
      )}
      
      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Your inventory is empty</Text>
            <Text style={styles.emptyText}>
              Start training skills to gather items!
            </Text>
          </View>
        ) : hasNoResults ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyText}>
              Try a different search term: "{searchQuery}"
            </Text>
          </View>
        ) : (
          <View style={styles.itemGrid}>
            {filteredItems.map(item => (
              <InventoryItemCard key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
```

#### 3.2 SearchBar Component

**File**: `src/components/inventory/SearchBar.tsx`

```typescript
import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';

export const SearchBar: React.FC = () => {
  const searchQuery = useGameStore(state => state.inventoryUIState.searchQuery);
  const setSearchQuery = useGameStore(state => state.setInventorySearchQuery);
  
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder="Search items..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

#### 3.3 SortControls Component

**File**: `src/components/inventory/SortControls.tsx`

```typescript
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { InventorySortOption } from '../../types';

const SORT_OPTIONS = [
  { value: InventorySortOption.ALPHABETICAL, label: 'A-Z', icon: '🔤' },
  { value: InventorySortOption.GOLD_VALUE, label: 'Value', icon: '🪙' },
  { value: InventorySortOption.ITEM_COUNT, label: 'Count', icon: '📊' },
];

export const SortControls: React.FC = () => {
  const sortBy = useGameStore(state => state.inventoryUIState.sortBy);
  const setSortBy = useGameStore(state => state.setInventorySortBy);
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sort by:</Text>
      <View style={styles.buttons}>
        {SORT_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              sortBy === option.value && styles.buttonActive,
            ]}
            onPress={() => setSortBy(option.value)}
          >
            <Text style={styles.icon}>{option.icon}</Text>
            <Text style={[
              styles.buttonText,
              sortBy === option.value && styles.buttonTextActive,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
```

#### 3.4 InventoryItemCard Component

**File**: `src/components/inventory/InventoryItemCard.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { InventoryItem } from '../../types';
import { formatNumber } from '../../utils/xp';

interface InventoryItemCardProps {
  item: InventoryItem;
}

const CATEGORY_COLORS = {
  wood: '#8B4513',
  ore: '#808080',
  fish: '#4169E1',
  food: '#FFD700',
  bar: '#C0C0C0',
  crafted: '#9370DB',
  other: '#666666',
};

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item }) => {
  const borderColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other;
  
  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{item.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Quantity:</Text>
          <Text style={styles.statValue}>{formatNumber(item.quantity)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Unit Value:</Text>
          <Text style={styles.statValue}>{item.goldValue} 🪙</Text>
        </View>
        <View style={[styles.statRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Value:</Text>
          <Text style={styles.totalValue}>{formatNumber(item.totalValue)} 🪙</Text>
        </View>
      </View>
    </View>
  );
};
```

### Phase 4: Sidebar Integration (Priority: High)

#### 4.1 Update Sidebar Component

**File**: `src/components/Sidebar.tsx`

Add "Player" section with "Inventory" option:

```typescript
// Add to Sidebar component after Skills section
<View style={styles.sectionDivider} />

<View style={styles.section}>
  <Text style={styles.sectionHeader}>Player</Text>
  <TouchableOpacity
    style={[
      styles.menuItem,
      selectedView === 'inventory' && styles.menuItemSelected,
    ]}
    onPress={() => handleSelectView('inventory')}
  >
    <Text style={styles.menuIcon}>🎒</Text>
    <Text style={styles.menuText}>Inventory</Text>
    {selectedView === 'inventory' && (
      <View style={styles.selectedIndicator} />
    )}
  </TouchableOpacity>
</View>
```

### Phase 5: App Integration (Priority: Medium)

#### 5.1 Update App.tsx

Add inventory view state and conditional rendering:

```typescript
const [selectedView, setSelectedView] = useState<'skills' | 'inventory'>('skills');
const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);

// In render:
{selectedView === 'inventory' ? (
  <InventoryView />
) : selectedSkill ? (
  <SkillTrainingView skillType={selectedSkill} />
) : (
  // Welcome screen
)}
```

## Testing Strategy

### Unit Tests
1. **Item Metadata**: Verify all items have required fields
2. **Sort Functions**: Test all three sort options
3. **Search Function**: Test case-insensitivity, partial matches
4. **Value Calculations**: Test totalValue computation

### Integration Tests
1. **Inventory Display**: Items appear after training
2. **Search Interaction**: Typing filters results
3. **Sort Interaction**: Clicking changes order
4. **Navigation**: Sidebar navigates to inventory

### Manual Testing
1. Empty inventory state
2. Single item inventory
3. Large inventory (50+ items)
4. Search with no results
5. Sort with ties (items with same value)
6. Mobile responsiveness
7. Web compatibility

## Performance Considerations

1. **Memoization**: Use `useMemo` for filtered/sorted lists
2. **Debouncing**: 300ms debounce on search input
3. **Virtualization**: Consider `FlatList` if 100+ items
4. **Pure Functions**: All sort/filter functions are pure
5. **No Re-renders**: Zustand selectors prevent unnecessary updates

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing item metadata | High | Provide fallback values, log warnings |
| Performance with many items | Medium | Implement virtualization if needed |
| Sort/search bugs | Medium | Comprehensive unit tests |
| Mobile layout issues | Low | Test on multiple screen sizes |

## Future Expansion Points

1. **Item Actions**: Designed for future "Use", "Drop" buttons
2. **Filtering**: Category filter easily added to controls
3. **Item Stats**: Metadata structure supports additional fields
4. **Bank Integration**: Inventory view can be reused for bank
5. **Item Tooltips**: Long-press/hover for detailed info

## Success Criteria

- All 55+ items have complete metadata
- Search and sort work flawlessly
- Performance is smooth with full inventory
- Navigation is intuitive
- Code follows project conventions
- No regression in existing features
