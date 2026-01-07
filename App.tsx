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
} from 'react-native';
import { useGameStore } from './src/store/gameStore';
import { useGameLoop } from './src/hooks/useGameLoop';
import { useSkillTraining } from './src/hooks/useSkillTraining';
import { SkillType } from './src/types';
import { formatNumber, getProgressToNextLevel } from './src/utils/xp';

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const loadGame = useGameStore(state => state.loadGame);
  const saveGame = useGameStore(state => state.saveGame);
  const skills = useGameStore(state => state.gameState.skills);
  const inventory = useGameStore(state => state.gameState.inventory);
  const isInitialized = useGameStore(state => state.isInitialized);

  const { isTraining, currentActivity, progress, timeRemaining, startActivity, stopActivity } = useSkillTraining();

  // Initialize game loop
  useGameLoop();

  // Load game on mount
  useEffect(() => {
    loadGame().finally(() => setIsLoading(false));
  }, [loadGame]);

  // Test function to start woodcutting
  const testStartWoodcutting = () => {
    const success = startActivity(SkillType.WOODCUTTING, 'regular_tree');
    if (!success) {
      console.log('Failed to start woodcutting');
    }
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>⚔️ SkillForge Idle</Text>
          <Text style={styles.subtitle}>Core Game System - Implemented!</Text>
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

        {/* Training Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚒️ Training Status</Text>
          {isTraining && currentActivity ? (
            <>
              <Text style={styles.text}>Training: {currentActivity.name}</Text>
              <Text style={styles.text}>
                Progress: {progress.toFixed(1)}%
              </Text>
              <Text style={styles.text}>
                Time Remaining: {Math.ceil(timeRemaining / 1000)}s
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    styles.trainingProgress,
                    {width: `${progress}%`},
                  ]}
                />
              </View>
              <Button title="Stop Training" onPress={stopActivity} color="#f44336" />
            </>
          ) : (
            <>
              <Text style={styles.text}>Not training</Text>
              <Button title="Test: Start Woodcutting" onPress={testStartWoodcutting} />
            </>
          )}
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            📋 Core game system fully implemented
          </Text>
          <Text style={styles.footerText}>
            See specs/01-core-game-system.md for details
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4caf50',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '600',
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
  trainingProgress: {
    backgroundColor: '#4caf50',
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textAlign: 'right',
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e8f4f8',
    borderRadius: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default App;
