import { useMemo, useState, useEffect } from 'react';
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

  // State for progress that updates every 50ms
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Get current activity
  const currentActivity = useMemo(() => {
    if (!activeTraining) {return null;}
    return getActivityById(activeTraining.skillType, activeTraining.activityId) || null;
  }, [activeTraining]);

  // Update progress and time remaining every 50ms when training is active
  useEffect(() => {
    if (!activeTraining) {
      setProgress(0);
      setTimeRemaining(0);
      return;
    }

    // Initial calculation
    const calculateProgress = () => {
      const elapsed = Date.now() - activeTraining.startTime;
      const progressPercent = (elapsed / activeTraining.duration) * 100;
      const remaining = activeTraining.duration - elapsed;

      setProgress(Math.min(progressPercent, 100));
      setTimeRemaining(Math.max(remaining, 0));
    };

    // Calculate immediately
    calculateProgress();

    // Update every 50ms
    const intervalId = setInterval(calculateProgress, 50);

    return () => {
      clearInterval(intervalId);
    };
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
