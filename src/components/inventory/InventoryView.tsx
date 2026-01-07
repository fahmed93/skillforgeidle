/**
 * InventoryView Component
 * 
 * Main inventory display showing all player items with search and sort capabilities.
 * Features:
 * - Header with title and stats (item count, total value)
 * - Search bar for filtering items
 * - Sort controls for organizing items
 * - Scrollable grid of inventory item cards
 * - Empty state when inventory is empty
 * - No results state when search returns nothing
 */

import React from 'react';
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
      {/* Header with title and stats */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  controls: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  itemGrid: {
    // Items are rendered as a single column list
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
