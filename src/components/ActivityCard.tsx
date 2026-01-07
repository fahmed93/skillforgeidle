/**
 * ActivityCard Component
 *
 * Displays a training activity with its details and a start/stop button.
 * Shows lock indicator for activities that don't meet level requirements.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { Activity } from '../types';
import { formatNumber } from '../utils/xp';

interface ActivityCardProps {
  activity: Activity;
  isLocked: boolean;
  isActive: boolean;
  progress?: number;
  timeRemaining?: number;
  onStartTraining: () => void;
  onStopTraining: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isLocked,
  isActive,
  progress = 0,
  timeRemaining = 0,
  onStartTraining,
  onStopTraining,
}) => {
  const hasRequirements = activity.requirements.length > 0;
  const hasProducts = activity.products.length > 0;

  return (
    <View style={[styles.card, isLocked && styles.cardLocked]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.activityName, isLocked && styles.lockedText]}>
          {activity.name}
        </Text>
        {isLocked && (
          <Text style={styles.lockIcon}>🔒</Text>
        )}
      </View>

      <Text style={[styles.description, isLocked && styles.lockedText]}>
        {activity.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, isLocked && styles.lockedText]}>
            Level Required:
          </Text>
          <Text style={[styles.detailValue, isLocked && styles.lockedText]}>
            {activity.levelRequired}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, isLocked && styles.lockedText]}>
            XP Gained:
          </Text>
          <Text style={[styles.detailValue, styles.xpValue, isLocked && styles.lockedText]}>
            {formatNumber(activity.xpGained)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, isLocked && styles.lockedText]}>
            Duration:
          </Text>
          <Text style={[styles.detailValue, isLocked && styles.lockedText]}>
            {(activity.durationMs / 1000).toFixed(1)}s
          </Text>
        </View>

        {hasRequirements && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isLocked && styles.lockedText]}>
              Requires:
            </Text>
            <Text style={[styles.detailValue, isLocked && styles.lockedText]}>
              {activity.requirements
                .map(req => `${req.quantity}x ${req.resourceId}`)
                .join(', ')}
            </Text>
          </View>
        )}

        {hasProducts && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isLocked && styles.lockedText]}>
              Produces:
            </Text>
            <Text style={[styles.detailValue, styles.productValue, isLocked && styles.lockedText]}>
              {activity.products
                .map(prod => `${prod.quantity}x ${prod.resourceId}`)
                .join(', ')}
            </Text>
          </View>
        )}
      </View>

      {isActive && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {progress.toFixed(1)}% - {Math.ceil(timeRemaining / 1000)}s remaining
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.actionButton,
          isLocked && styles.actionButtonDisabled,
          isActive && styles.actionButtonActive,
        ]}
        onPress={isActive ? onStopTraining : onStartTraining}
        disabled={isLocked}
      >
        <Text style={[
          styles.actionButtonText,
          isLocked && styles.actionButtonTextDisabled,
        ]}>
          {isLocked ? 'Locked' : isActive ? 'Stop Training' : 'Start Training'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  cardLocked: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  lockIcon: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  lockedText: {
    color: '#999',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  xpValue: {
    color: '#4a90e2',
    fontWeight: '600',
  },
  productValue: {
    color: '#4caf50',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  actionButtonActive: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextDisabled: {
    color: '#fff',
  },
});
