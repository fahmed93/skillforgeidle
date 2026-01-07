/**
 * SkillTrainingView Component
 *
 * Displays all training activities for a selected skill.
 * Shows skill header with level and progress, plus list of activities.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SkillType } from '../types';
import { getSkillById } from '../data';
import { useGameStore } from '../store/gameStore';
import { useSkillTraining } from '../hooks/useSkillTraining';
import { getProgressToNextLevel, formatNumber } from '../utils/xp';
import { ActivityCard } from './ActivityCard';

interface SkillTrainingViewProps {
  skillType: SkillType;
}

export const SkillTrainingView: React.FC<SkillTrainingViewProps> = ({
  skillType,
}) => {
  const skill = getSkillById(skillType);
  const gameState = useGameStore(state => state.gameState);
  const skillState = gameState.skills[skillType];

  const {
    isTraining,
    currentActivity,
    progress,
    timeRemaining,
    startActivity,
    stopActivity,
  } = useSkillTraining();

  if (!skill) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Skill not found</Text>
      </View>
    );
  }

  const progressPercent = getProgressToNextLevel(
    skillState.experience,
    skillState.level
  );

  const handleStartTraining = (activityId: string) => {
    const success = startActivity(skillType, activityId);
    if (!success) {
      console.log('Failed to start training:', activityId);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Skill Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.skillIcon}>{skill.icon}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillDescription}>{skill.description}</Text>
          </View>
        </View>

        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>
            Level {skillState.level}
          </Text>
          <Text style={styles.xpText}>
            {formatNumber(skillState.experience)} XP
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progressPercent.toFixed(1)}% to next level
        </Text>
      </View>

      {/* Activities Section */}
      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>Training Activities</Text>

        {skill.activities.map(activity => {
          const isLocked = activity.levelRequired > skillState.level;
          const isActive =
            isTraining &&
            currentActivity?.id === activity.id;

          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isLocked={isLocked}
              isActive={isActive}
              progress={isActive ? progress : 0}
              timeRemaining={isActive ? timeRemaining : 0}
              onStartTraining={() => handleStartTraining(activity.id)}
              onStopTraining={stopActivity}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  skillIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  skillDescription: {
    fontSize: 14,
    color: '#666',
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  xpText: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  activitiesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
});
