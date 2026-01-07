/**
 * SkillForge Idle - Main App Component
 *
 * Core game system with state management, persistence, and game loop
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from './src/store/gameStore';
import { useGameLoop } from './src/hooks/useGameLoop';
import { SkillType } from './src/types';
import { formatNumber, getProgressToNextLevel } from './src/utils/xp';
import { Sidebar } from './src/components/Sidebar';
import { SkillTrainingView } from './src/components/SkillTrainingView';
import { ToastContainer } from './src/components/ToastContainer';
import { ActiveTrainingView } from './src/components/ActiveTrainingView';

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);

  const loadGame = useGameStore(state => state.loadGame);
  const saveGame = useGameStore(state => state.saveGame);
  const skills = useGameStore(state => state.gameState.skills);
  const inventory = useGameStore(state => state.gameState.inventory);
  const isInitialized = useGameStore(state => state.isInitialized);

  // Initialize game loop
  useGameLoop();

  // Load game on mount
  useEffect(() => {
    loadGame().finally(() => setIsLoading(false));
  }, [loadGame]);

  const handleSelectSkill = (skillType: SkillType) => {
    setSelectedSkill(skillType);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          selectedSkill={selectedSkill}
          onClose={() => setSidebarOpen(false)}
          onSelectSkill={handleSelectSkill}
        />

        <View style={styles.mainContainer}>
          {/* Header with menu button */}
          <View style={styles.appHeader}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.appTitle}>⚔️ SkillForge Idle</Text>
          </View>

          {/* Main Content */}
          {selectedSkill ? (
            <SkillTrainingView skillType={selectedSkill} />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Welcome to SkillForge Idle!</Text>
                <Text style={styles.welcomeText}>
                  Tap the menu button (☰) in the top-left corner to select a skill and start training.
                </Text>
              </View>
        {/* Active Training View - Always visible when training */}
        <ActiveTrainingView />

        {/* Main Content */}
        {selectedSkill ? (
          <SkillTrainingView skillType={selectedSkill} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome to SkillForge Idle!</Text>
              <Text style={styles.welcomeText}>
                Tap the menu button (☰) in the top-left corner to select a skill and start training.
              </Text>
            </View>

              {/* Game Status */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎮 Game Status</Text>
                <Text style={styles.text}>✓ State Management (Zustand)</Text>
                <Text style={styles.text}>✓ Persistence (AsyncStorage)</Text>
                <Text style={styles.text}>✓ Game Loop (60 FPS)</Text>
                <Text style={styles.text}>✓ Auto-save (30s)</Text>
                <Text style={styles.text}>Game Initialized: {isInitialized ? '✓' : '✗'}</Text>
              </View>

              {/* Skills Overview */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Skills</Text>
                {Object.entries(skills).map(([skillType, skillState]) => {
                  const progressPercent = getProgressToNextLevel(skillState.experience, skillState.level);
                  return (
                    <View key={skillType} style={styles.skillRow}>
                      <Text style={styles.skillName}>
                        {skillType.charAt(0).toUpperCase() + skillType.slice(1)}
                      </Text>
                      <Text style={styles.skillLevel}>
                        Lv {skillState.level} ({formatNumber(skillState.experience)} XP)
                      </Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{progressPercent.toFixed(1)}%</Text>
                    </View>
                  );
                })}
              </View>

              {/* Inventory */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎒 Inventory</Text>
                {Object.keys(inventory).length === 0 ? (
                  <Text style={styles.text}>Empty</Text>
                ) : (
                  Object.entries(inventory).map(([resourceId, quantity]) => (
                    <Text key={resourceId} style={styles.text}>
                      {resourceId}: {quantity}
                    </Text>
                  ))
                )}
              </View>

              {/* Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💾 Actions</Text>
                <Button title="Manual Save" onPress={saveGame} />
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>

      {/* Toast container - renders on top of everything */}
      <ToastContainer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    flex: 1,
  },
  appHeader: {
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
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 28,
    color: '#333',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeSection: {
    backgroundColor: '#e8f4f8',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  skillRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  skillLevel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textAlign: 'right',
  },
});

export default App;
