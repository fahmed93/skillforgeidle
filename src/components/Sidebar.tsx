/**
 * Sidebar Component
 *
 * Displays a collapsible sidebar with a list of all skills.
 * Users can select a skill to view its training activities.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { SkillType } from '../types';
import { getAllSkills } from '../data';
import { useGameStore } from '../store/gameStore';

interface SidebarProps {
  isOpen: boolean;
  selectedSkill: SkillType | null;
  selectedView: 'skills' | 'inventory';
  onClose: () => void;
  onSelectSkill: (skillType: SkillType) => void;
  onSelectView: (view: 'inventory') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  selectedSkill,
  selectedView,
  onClose,
  onSelectSkill,
  onSelectView,
}) => {
  const skills = getAllSkills();
  const gameState = useGameStore(state => state.gameState);

  const handleSelectSkill = (skillType: SkillType) => {
    onSelectSkill(skillType);
    onClose();
  };

  const handleSelectInventory = () => {
    onSelectView('inventory');
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* Sidebar content */}
        <View style={styles.sidebar}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Skills Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>SKILLS</Text>
              {skills.map(skill => {
                const skillState = gameState.skills[skill.id];
                const isSelected = selectedView === 'skills' && selectedSkill === skill.id;

                return (
                  <TouchableOpacity
                    key={skill.id}
                    style={[
                      styles.menuItem,
                      isSelected && styles.menuItemSelected,
                    ]}
                    onPress={() => handleSelectSkill(skill.id)}
                  >
                    <Text style={styles.menuIcon}>{skill.icon}</Text>
                    <View style={styles.menuInfo}>
                      <Text style={styles.menuText}>{skill.name}</Text>
                      <Text style={styles.menuSubtext}>Level {skillState.level}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Section Divider */}
            <View style={styles.sectionDivider} />

            {/* Player Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>PLAYER</Text>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  selectedView === 'inventory' && styles.menuItemSelected,
                ]}
                onPress={handleSelectInventory}
              >
                <Text style={styles.menuIcon}>🎒</Text>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuText}>Inventory</Text>
                </View>
                {selectedView === 'inventory' && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Overlay - closes sidebar when tapped */}
        <Pressable style={styles.overlay} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  menuItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 14,
    color: '#666',
  },
  selectedIndicator: {
    width: 4,
    height: 40,
    backgroundColor: '#4a90e2',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
});
