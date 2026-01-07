/**
 * SearchBar Component
 * 
 * Provides a search input for filtering inventory items by name or description.
 * Features:
 * - Real-time search as user types
 * - Search icon on left
 * - Clear button on right (when text is present)
 * - Case-insensitive matching
 */

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
        <TouchableOpacity
          onPress={() => setSearchQuery('')}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    height: 44,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  clearText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});
