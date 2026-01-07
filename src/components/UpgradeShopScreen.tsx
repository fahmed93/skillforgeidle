/**
 * UpgradeShopScreen Component
 *
 * Displays all available upgrades organized by skill with purchase functionality.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SkillType } from '../types';
import { useGameStore } from '../store/gameStore';
import { UpgradeCard } from './UpgradeCard';
import { getUpgradesBySkill, ALL_UPGRADES } from '../data/upgrades';
import { getAllSkills } from '../data';

interface UpgradeShopScreenProps {
  onClose: () => void;
}

export const UpgradeShopScreen: React.FC<UpgradeShopScreenProps> = ({ onClose }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillType>(SkillType.WOODCUTTING);
  const [hidePurchased, setHidePurchased] = useState(false);

  const purchasedUpgrades = useGameStore(state => state.purchasedUpgrades);
  const purchaseUpgrade = useGameStore(state => state.purchaseUpgrade);

  const allSkills = getAllSkills();

  // Calculate total upgrade counts
  const totalUpgrades = ALL_UPGRADES.length;
  const purchasedCount = purchasedUpgrades.size;

  // Get upgrades for selected skill
  const skillUpgrades = useMemo(() => {
    const upgrades = getUpgradesBySkill(selectedSkill);
    
    // Apply hide purchased filter
    if (hidePurchased) {
      return upgrades.filter(upgrade => !purchasedUpgrades.has(upgrade.id));
    }
    
    return upgrades;
  }, [selectedSkill, hidePurchased, purchasedUpgrades]);

  // Calculate upgrade counts per skill for tabs
  const getSkillUpgradeCount = (skillType: SkillType) => {
    const allForSkill = getUpgradesBySkill(skillType);
    const purchasedForSkill = allForSkill.filter(u => purchasedUpgrades.has(u.id)).length;
    return { purchased: purchasedForSkill, total: allForSkill.length };
  };

  const handlePurchase = (upgradeId: string) => {
    purchaseUpgrade(upgradeId);
  };

  const handleToggleHidePurchased = () => {
    setHidePurchased(!hidePurchased);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>⚡ Upgrade Shop</Text>
          <Text style={styles.headerSubtitle}>
            {purchasedCount}/{totalUpgrades} upgrades purchased
          </Text>
        </View>
      </View>

      {/* Filter toggle */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={handleToggleHidePurchased}
          activeOpacity={0.7}
        >
          <View style={[
            styles.checkbox,
            hidePurchased && styles.checkboxChecked,
          ]}>
            {hidePurchased && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.filterLabel}>Hide Purchased</Text>
        </TouchableOpacity>
      </View>

      {/* Skill tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {allSkills.map(skill => {
          const { purchased, total } = getSkillUpgradeCount(skill.id);
          const isActive = selectedSkill === skill.id;

          return (
            <TouchableOpacity
              key={skill.id}
              style={[
                styles.tab,
                isActive && styles.tabActive,
              ]}
              onPress={() => setSelectedSkill(skill.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{skill.icon}</Text>
              <Text style={[
                styles.tabName,
                isActive && styles.tabNameActive,
              ]}>
                {skill.name}
              </Text>
              <Text style={[
                styles.tabCount,
                isActive && styles.tabCountActive,
              ]}>
                {purchased}/{total}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Upgrade list */}
      <ScrollView
        style={styles.upgradesContainer}
        contentContainerStyle={styles.upgradesContent}
      >
        {skillUpgrades.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>
              {hidePurchased && purchasedCount > 0
                ? 'All upgrades purchased!'
                : 'No upgrades available'}
            </Text>
            <Text style={styles.emptyText}>
              {hidePurchased && purchasedCount > 0
                ? 'You own all upgrades for this skill.'
                : 'Level up to unlock upgrades!'}
            </Text>
          </View>
        ) : (
          skillUpgrades.map(upgrade => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              onPurchase={() => handlePurchase(upgrade.id)}
            />
          ))
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
  filterContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: 100,
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    minWidth: 90,
  },
  tabActive: {
    backgroundColor: '#4a90e2',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  tabNameActive: {
    color: '#fff',
  },
  tabCount: {
    fontSize: 11,
    color: '#666',
  },
  tabCountActive: {
    color: '#fff',
  },
  upgradesContainer: {
    flex: 1,
  },
  upgradesContent: {
    padding: 16,
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
});
