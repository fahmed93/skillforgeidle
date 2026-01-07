/**
 * ActiveTrainingView Component
 *
 * Displays a compact header showing current training activity status.
 * Always visible at the top of the screen when actively training.
 * Shows: current skill, activity, level, XP, progress, time estimates, and stop button.
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useSkillTraining } from '../hooks/useSkillTraining';
import { getSkillById, getActivityById } from '../data';
import { formatNumber, formatDuration } from '../utils/xp';
import {
  calculateTimeToNextLevel,
  calculateTimeUntilOutOfMaterials,
} from '../utils/training-calculations';

export const ActiveTrainingView: React.FC = () => {
  const activeTraining = useGameStore(state => state.gameState.activeTraining);
  const skills = useGameStore(state => state.gameState.skills);
  const inventory = useGameStore(state => state.gameState.inventory);

  const { progress, stopActivity } = useSkillTraining();

  // Get skill and activity details (need this before early return)
  const skillType = activeTraining?.skillType;
  const activityId = activeTraining?.activityId;
  const skill = skillType ? getSkillById(skillType) : null;
  const activity = skillType && activityId ? getActivityById(skillType, activityId) : null;
  const skillState = skillType ? skills[skillType] : null;

  // Calculate time to next level
  const timeToNextLevel = useMemo(() => {
    if (!skillState || !activity || skillState.level >= 99) {
      return 0;
    }

    return calculateTimeToNextLevel(
      skillState.experience,
      skillState.level,
      activity.xpGained,
      activity.durationMs
    );
  }, [skillState, activity]);

  // Calculate time until out of materials
  const timeUntilOutOfMaterials = useMemo(() => {
    if (!activity) {
      return null;
    }

    return calculateTimeUntilOutOfMaterials(
      activity.requirements,
      inventory,
      activity.durationMs
    );
  }, [activity, inventory]);

  // Early return AFTER all hooks
  if (!activeTraining || !skill || !activity || !skillState) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Row 1: Skill and Activity */}
      <View style={styles.headerRow}>
        <Text style={styles.skillIcon}>{skill.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.skillName} numberOfLines={1}>
            {skill.name}
          </Text>
          <Text style={styles.activityName} numberOfLines={1}>
            {activity.name}
          </Text>
        </View>
      </View>

      {/* Row 2: Level and XP */}
      <View style={styles.statsRow}>
        <Text style={styles.levelText}>
          Level {skillState.level}
        </Text>
        <Text style={styles.xpText}>
          {formatNumber(skillState.experience)} XP
        </Text>
      </View>

      {/* Row 3: Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress)}%
        </Text>
      </View>

      {/* Row 4: Time Estimates and Stop Button */}
      <View style={styles.bottomRow}>
        <View style={styles.timeEstimates}>
          {/* Time to Next Level */}
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Next Level:</Text>
            <Text style={styles.timeValue}>
              {skillState.level >= 99 ? 'Max' : formatDuration(timeToNextLevel)}
            </Text>
          </View>

          {/* Time Until Out of Materials */}
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Materials:</Text>
            <Text style={styles.timeValue}>
              {timeUntilOutOfMaterials === null
                ? '∞'
                : timeUntilOutOfMaterials === 0
                ? 'Out'
                : formatDuration(timeUntilOutOfMaterials)}
            </Text>
          </View>
        </View>

        {/* Stop Button */}
        <TouchableOpacity
          style={styles.stopButton}
          onPress={stopActivity}
          activeOpacity={0.7}
        >
          <Text style={styles.stopButtonText}>■</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  xpText: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeEstimates: {
    flexDirection: 'row',
    flex: 1,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeLabel: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
  },
  timeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a90e2',
  },
  stopButton: {
    backgroundColor: '#f44336',
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
