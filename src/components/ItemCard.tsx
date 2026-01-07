/**
 * ItemCard Component
 *
 * Displays a single inventory item with icon, name, and quantity.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getResourceById } from '../data';
import { formatNumber } from '../utils/xp';

interface ItemCardProps {
  resourceId: string;
  quantity: number;
  onPress?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  resourceId,
  quantity,
  onPress,
}) => {
  const resource = getResourceById(resourceId);

  // Handle missing resource gracefully
  if (!resource) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
        <View style={styles.content}>
          <Text style={styles.icon}>❓</Text>
          <Text style={styles.name} numberOfLines={2}>
            Unknown Item
          </Text>
          <Text style={styles.quantity}>{formatNumber(quantity)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{resource.icon}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {resource.name}
        </Text>
        <Text style={styles.quantity}>{formatNumber(quantity)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 110,
    // Ensure touch target is at least 44x44
    minWidth: 44,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
