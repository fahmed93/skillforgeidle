// XP calculation utilities based on RuneScape formula

/**
 * Calculate XP required for a specific level
 * Formula: floor(level + 300 * 2^(level/7)) / 4
 */
export function xpForLevel(level: number): number {
  if (level <= 1) {return 0;}
  return Math.floor(level + 300 * Math.pow(2, level / 7)) / 4;
}

/**
 * Calculate total XP required to reach a level from level 1
 */
export function totalXpForLevel(level: number): number {
  if (level <= 1) {return 0;}

  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return Math.floor(total);
}

/**
 * Calculate level from total XP
 */
export function getLevelFromXp(xp: number): number {
  if (xp <= 0) {return 1;}

  let level = 1;
  while (level < 99 && totalXpForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

/**
 * Calculate progress percentage to next level
 */
export function getProgressToNextLevel(currentXp: number, currentLevel: number): number {
  if (currentLevel >= 99) {return 100;}

  const xpForCurrentLevel = totalXpForLevel(currentLevel);
  const xpForNextLevel = totalXpForLevel(currentLevel + 1);
  const xpIntoLevel = currentXp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

  return (xpIntoLevel / xpNeededForLevel) * 100;
}

/**
 * Format large numbers with abbreviations (k, m, b)
 */
export function formatNumber(num: number): string {
  if (num < 1000) {return num.toString();}
  if (num < 1000000) {return (num / 1000).toFixed(1) + 'k';}
  if (num < 1000000000) {return (num / 1000000).toFixed(1) + 'm';}
  return (num / 1000000000).toFixed(1) + 'b';
}

/**
 * Format time duration in milliseconds to readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {return `${seconds}s`;}

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {return `${minutes}m ${remainingSeconds}s`;}

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
