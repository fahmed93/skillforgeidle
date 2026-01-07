/**
 * SortControls Component
 * 
 * Provides buttons to sort inventory items by different criteria:
 * - Alphabetical (A-Z)
 * - Gold Value (highest first)
 * - Item Count (most first)
 * 
 * Active sort option is visually highlighted.
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { InventorySortOption } from '../../types';

interface SortOption {
  value: InventorySortOption;
  label: string;
  icon: string;
}

const SORT_OPTIONS: SortOption[] = [
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
        {SORT_OPTIONS.map(option => {
          const isActive = sortBy === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.button,
                isActive && styles.buttonActive,
              ]}
              onPress={() => setSortBy(option.value)}
            >
              <Text style={styles.icon}>{option.icon}</Text>
              <Text style={[
                styles.buttonText,
                isActive && styles.buttonTextActive,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  buttonActive: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  buttonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  buttonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
