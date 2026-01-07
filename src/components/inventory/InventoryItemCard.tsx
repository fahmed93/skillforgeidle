/**
 * InventoryItemCard Component
 * 
 * Displays a single inventory item with all its details including:
 * - Icon and name
 * - Description
 * - Quantity
 * - Unit gold value
 * - Total value
 * - Category color indicator on left border
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { InventoryItem } from '../../types';
import { formatNumber } from '../../utils/xp';

interface InventoryItemCardProps {
  item: InventoryItem;
}

const CATEGORY_COLORS: Record<InventoryItem['category'], string> = {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    fontSize: 36,
    marginRight: 12,
    lineHeight: 40,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  stats: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 15,
    color: '#4a90e2',
    fontWeight: '700',
  },
});
