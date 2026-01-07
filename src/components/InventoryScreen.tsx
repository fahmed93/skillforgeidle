/**
 * InventoryScreen Component
 *
 * Displays player's inventory with search and sort functionality.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { ItemCard } from './ItemCard';
import { getResourceById } from '../data';

type SortOption = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc' | 'value-asc' | 'value-desc';

interface InventoryScreenProps {
  onClose: () => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({ onClose }) => {
  const inventory = useGameStore(state => state.gameState.inventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  // Filter and sort items
  const displayedItems = useMemo(() => {
    // Convert inventory to array of [id, quantity] pairs
    let items = Object.entries(inventory);

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(([resourceId]) => {
        const resource = getResourceById(resourceId);
        return resource?.name.toLowerCase().includes(lowerQuery);
      });
    }

    // Sort items
    items = [...items].sort((a, b) => {
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

    return items;
  }, [inventory, searchQuery, sortBy]);

  // Calculate stats
  const uniqueItems = Object.keys(inventory).length;
  const totalQuantity = Object.values(inventory).reduce((sum, qty) => sum + qty, 0);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const renderSortButton = (label: string, value: SortOption) => {
    const isActive = sortBy === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.sortButton, isActive && styles.sortButtonActive]}
        onPress={() => setSortBy(value)}
      >
        <Text style={[styles.sortButtonText, isActive && styles.sortButtonTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>🎒 Inventory</Text>
          <Text style={styles.headerSubtitle}>
            {uniqueItems} items, {totalQuantity} total
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Controls */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
          {renderSortButton('A-Z', 'name-asc')}
          {renderSortButton('Z-A', 'name-desc')}
          {renderSortButton('Count ↓', 'count-desc')}
          {renderSortButton('Count ↑', 'count-asc')}
          {renderSortButton('Value ↓', 'value-desc')}
          {renderSortButton('Value ↑', 'value-asc')}
        </ScrollView>
      </View>

      {/* Item Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {uniqueItems === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>Inventory is Empty</Text>
            <Text style={styles.emptyText}>
              Start training skills to collect resources and items!
            </Text>
          </View>
        ) : displayedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptyText}>
              Try a different search term
            </Text>
          </View>
        ) : (
          <View style={styles.itemGrid}>
            {displayedItems.map(([resourceId, quantity]) => (
              <View key={resourceId} style={styles.itemCardWrapper}>
                <ItemCard resourceId={resourceId} quantity={quantity} />
              </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#333',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f0f0f0',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#666',
  },
  sortContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  sortScroll: {
    flexDirection: 'row',
  },
  sortButton: {
    height: 36,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#4a90e2',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  itemCardWrapper: {
    width: '48%',
  },
});
