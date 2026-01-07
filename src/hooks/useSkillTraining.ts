import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { getActivityById } from '../data';
import type { Activity, SkillType } from '../types';

interface UseSkillTrainingReturn {
  isTraining: boolean;
  currentActivity: Activity | null;
  progress: number;
  timeRemaining: number;
  startActivity: (skillType: SkillType, activityId: string) => boolean;
  stopActivity: () => void;
  canStartActivity: (activity: Activity, skillType: SkillType) => boolean;
}

/**
 * Hook for managing skill training
 */
export function useSkillTraining(): UseSkillTrainingReturn {
  const activeTraining = useGameStore(state => state.gameState.activeTraining);
  const startTraining = useGameStore(state => state.startTraining);
  const stopTraining = useGameStore(state => state.stopTraining);
  const getSkillLevel = useGameStore(state => state.getSkillLevel);
  const hasResources = useGameStore(state => state.hasResources);

  // Get current activity
  const currentActivity = useMemo(() => {
    if (!activeTraining) {return null;}
    return getActivityById(activeTraining.skillType, activeTraining.activityId) || null;
  }, [activeTraining]);

  // Calculate progress percentage (0-100)
  const progress = useMemo(() => {
    if (!activeTraining) {return 0;}

    const elapsed = Date.now() - activeTraining.startTime;
    const progressPercent = (elapsed / activeTraining.duration) * 100;

    return Math.min(progressPercent, 100);
  }, [activeTraining]);

  // Calculate time remaining in milliseconds
  const timeRemaining = useMemo(() => {
    if (!activeTraining) {return 0;}

    const elapsed = Date.now() - activeTraining.startTime;
    const remaining = activeTraining.duration - elapsed;

    return Math.max(remaining, 0);
  }, [activeTraining]);

  // Check if player can start an activity
  const canStartActivity = (activity: Activity, skillType: SkillType): boolean => {
    const skillLevel = getSkillLevel(skillType);

    // Check level requirement
    if (skillLevel < activity.levelRequired) {
      return false;
    }

    // Check resource requirements
    if (!hasResources(activity.requirements)) {
      return false;
    }

    return true;
  };

  return {
    isTraining: !!activeTraining,
    currentActivity,
    progress,
    timeRemaining,
    startActivity: startTraining,
    stopActivity: stopTraining,
    canStartActivity,
  };
}
