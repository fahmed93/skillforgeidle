/**
 * Training calculation utilities for time-based predictions
 */

import type { ResourceRequirement } from '../types';
import { totalXpForLevel } from './xp';

/**
 * Calculate time in milliseconds until reaching the next level
 * based on current training activity's XP rate and duration.
 *
 * @param currentXp - Current XP in the skill
 * @param currentLevel - Current skill level
 * @param activityXp - XP gained per action
 * @param activityDuration - Duration of one action in milliseconds
 * @returns Time in milliseconds until next level, or 0 if at max level
 */
export function calculateTimeToNextLevel(
  currentXp: number,
  currentLevel: number,
  activityXp: number,
  activityDuration: number
): number {
  // Max level reached
  if (currentLevel >= 99) {
    return 0;
  }

  // Calculate XP needed for next level
  const xpForNextLevel = totalXpForLevel(currentLevel + 1);
  const xpNeeded = xpForNextLevel - currentXp;

  // Calculate number of actions needed
  const actionsNeeded = Math.ceil(xpNeeded / activityXp);

  // Calculate total time
  const timeMs = actionsNeeded * activityDuration;

  return timeMs;
}

/**
 * Calculate time in milliseconds until running out of required materials.
 * Returns null for activities that don't require materials (gathering skills).
 *
 * @param requirements - Array of resource requirements for the activity
 * @param inventory - Current inventory state
 * @param activityDuration - Duration of one action in milliseconds
 * @returns Time in milliseconds until materials run out, or null if no requirements
 */
export function calculateTimeUntilOutOfMaterials(
  requirements: ResourceRequirement[],
  inventory: Record<string, number>,
  activityDuration: number
): number | null {
  // No materials required (gathering skill)
  if (requirements.length === 0) {
    return null;
  }

  // Calculate how many actions can be performed with each required resource
  const actionsPerResource = requirements.map(req => {
    const available = inventory[req.resourceId] || 0;
    return Math.floor(available / req.quantity);
  });

  // Find the bottleneck resource (minimum actions possible)
  const minActions = Math.min(...actionsPerResource);

  // If any resource is at 0, we're already out of materials
  if (minActions <= 0) {
    return 0;
  }

  // Calculate total time
  const timeMs = minActions * activityDuration;

  return timeMs;
}
