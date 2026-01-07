/**
 * SkillForge Idle - Main App Component
 * 
 * This is a placeholder app component for the React Native game.
 * The full implementation will include:
 * - Navigation setup
 * - State management with Zustand
 * - Game screens (Skills Overview, Training, Inventory, etc.)
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>⚔️ SkillForge Idle</Text>
          <Text style={styles.subtitle}>
            An incremental idle game inspired by RuneScape and Melvor Idle
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 Game Features</Text>
          <Text style={styles.text}>✓ 6 Trainable Skills (1-99)</Text>
          <Text style={styles.text}>✓ 50+ Training Activities</Text>
          <Text style={styles.text}>✓ Resource Management</Text>
          <Text style={styles.text}>✓ Persistent Progress</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🪓 Gathering Skills</Text>
          <Text style={styles.text}>• Woodcutting (8 activities)</Text>
          <Text style={styles.text}>• Mining (10 activities)</Text>
          <Text style={styles.text}>• Fishing (10 activities)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔨 Production Skills</Text>
          <Text style={styles.text}>• Cooking (9 activities)</Text>
          <Text style={styles.text}>• Smithing (9 activities)</Text>
          <Text style={styles.text}>• Crafting (9 activities)</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            📋 Spec-driven development with GitHub Spec Kit
          </Text>
          <Text style={styles.footerText}>
            See specs/ directory for detailed feature specifications
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
  scrollView: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
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
