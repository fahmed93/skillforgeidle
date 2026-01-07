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
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  icon: string;
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
