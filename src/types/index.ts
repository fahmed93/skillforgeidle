// Core type definitions for SkillForge Idle

export enum SkillType {
  WOODCUTTING = 'woodcutting',
  MINING = 'mining',
  FISHING = 'fishing',
  COOKING = 'cooking',
  SMITHING = 'smithing',
  CRAFTING = 'crafting',
}

export interface ResourceRequirement {
  resourceId: string;
  quantity: number;
}

export interface ResourceProduct {
  resourceId: string;
  quantity: number;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  xpGained: number;
  durationMs: number;
  requirements: ResourceRequirement[];
  products: ResourceProduct[];
}

export interface Skill {
  id: SkillType;
  name: string;
  description: string;
  icon: string;
  activities: Activity[];
}

export interface SkillState {
  level: number;
  experience: number;
  unlockedActivities: string[];
}

export interface ActiveTraining {
  skillType: SkillType;
  activityId: string;
  startTime: number;
  duration: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface GameState {
  player: {
    id: string;
    createdAt: number;
    lastSave: number;
  };
  skills: Record<SkillType, SkillState>;
  inventory: Record<string, number>;
  activeTraining: ActiveTraining | null;
  settings: GameSettings;
  purchasedUpgrades: string[]; // Array for JSON serialization (converted to Set in store)
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  icon: string;
  goldValue?: number; // Optional - for future trading system
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'; // Optional - for future feature
}

export enum ToastType {
  XP_GAIN = 'xp_gain',
  ITEM_GAIN = 'item_gain',
  LEVEL_UP = 'level_up',
  ACTIVITY_UNLOCK = 'activity_unlock',
}

export interface ToastNotification {
  id: string;
  type: ToastType;
  skillType?: SkillType;
  message: string;
  details?: string[];
  icon?: string;
  duration?: number;
  timestamp: number;
}

export enum UpgradeEffectType {
  TIME_REDUCTION = 'time_reduction',
  PRODUCTION_INCREASE = 'production_increase',
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  skillType: SkillType;
  levelRequired: number;
  cost: ResourceRequirement[];
  effectType: UpgradeEffectType;
  effectValue: number; // 0.10 for 10% time reduction, or 1/2/3 for production increase
  appliesToActivities: string[]; // Empty array means applies to all activities in the skill
}
