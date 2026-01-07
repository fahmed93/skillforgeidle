/**
 * UpgradeCard Component
 *
 * Displays a single upgrade with details, cost, and purchase button.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Upgrade } from '../types';
import { useGameStore } from '../store/gameStore';
import { getResourceById } from '../data';
import { formatNumber } from '../utils/xp';

interface UpgradeCardProps {
  upgrade: Upgrade;
  onPurchase: () => void;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  upgrade,
  onPurchase,
}) => {
  const getResourceCount = useGameStore(state => state.getResourceCount);
  const getSkillLevel = useGameStore(state => state.getSkillLevel);
  const hasUpgrade = useGameStore(state => state.hasUpgrade);

  const isPurchased = hasUpgrade(upgrade.id);
  const currentLevel = getSkillLevel(upgrade.skillType);
  const meetsLevelReq = currentLevel >= upgrade.levelRequired;
  
  // Check if player can afford
  const canAfford = upgrade.cost.every(req => 
    getResourceCount(req.resourceId) >= req.quantity
  );

  const canPurchase = !isPurchased && meetsLevelReq && canAfford;

  return (
    <View style={[
      styles.card,
      isPurchased && styles.cardPurchased,
    ]}>
      {/* Header with icon and name */}
      <View style={styles.header}>
        <Text style={styles.icon}>{upgrade.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name}>{upgrade.name}</Text>
          {isPurchased && (
            <View style={styles.purchasedBadge}>
              <Text style={styles.purchasedBadgeText}>✓ Purchased</Text>
            </View>
          )}
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{upgrade.description}</Text>

      {/* Level requirement */}
      <View style={styles.requirement}>
        <Text style={styles.requirementLabel}>Level Requirement:</Text>
        <View style={[
          styles.levelBadge,
          meetsLevelReq ? styles.levelBadgeUnlocked : styles.levelBadgeLocked,
        ]}>
          <Text style={[
            styles.levelText,
            meetsLevelReq ? styles.levelTextUnlocked : styles.levelTextLocked,
          ]}>
            {meetsLevelReq ? '✅' : '🔒'} Level {upgrade.levelRequired}
          </Text>
        </View>
      </View>

      {/* Cost */}
      <View style={styles.costContainer}>
        <Text style={styles.costLabel}>Cost:</Text>
        <View style={styles.costList}>
          {upgrade.cost.map((req, index) => {
            const resource = getResourceById(req.resourceId);
            const currentAmount = getResourceCount(req.resourceId);
            const hasEnough = currentAmount >= req.quantity;

            return (
              <View 
                key={req.resourceId}
                style={[
                  styles.costItem,
                  index > 0 && styles.costItemSpaced,
                ]}
              >
                <Text style={styles.costIcon}>{resource?.icon || '❓'}</Text>
                <Text style={[
                  styles.costText,
                  hasEnough ? styles.costTextAffordable : styles.costTextUnaffordable,
                ]}>
                  {formatNumber(currentAmount)} / {formatNumber(req.quantity)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Purchase button */}
      {isPurchased ? (
        <View style={styles.purchasedButton}>
          <Text style={styles.purchasedButtonText}>Owned</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            canPurchase ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={onPurchase}
          disabled={!canPurchase}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            canPurchase ? styles.buttonTextEnabled : styles.buttonTextDisabled,
          ]}>
            {!meetsLevelReq ? 'Level Required' : !canAfford ? 'Cannot Afford' : 'Purchase'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPurchased: {
    backgroundColor: '#f5f5f5',
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    fontSize: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  purchasedBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  purchasedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  requirement: {
    marginBottom: 12,
  },
  requirementLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  levelBadgeUnlocked: {
    backgroundColor: '#e8f5e9',
  },
  levelBadgeLocked: {
    backgroundColor: '#ffebee',
  },
  levelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  levelTextUnlocked: {
    color: '#2e7d32',
  },
  levelTextLocked: {
    color: '#c62828',
  },
  costContainer: {
    marginBottom: 16,
  },
  costLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  costList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  costItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  costItemSpaced: {
    marginLeft: 8,
  },
  costIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  costText: {
    fontSize: 13,
    fontWeight: '600',
  },
  costTextAffordable: {
    color: '#2e7d32',
  },
  costTextUnaffordable: {
    color: '#c62828',
  },
  button: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  buttonEnabled: {
    backgroundColor: '#4a90e2',
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextEnabled: {
    color: '#fff',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  purchasedButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4caf50',
  },
  purchasedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
