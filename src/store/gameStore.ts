import { create } from 'zustand';
import { GameState, SkillType, SkillState, ResourceRequirement, ToastNotification, ToastType, UpgradeEffectType } from '../types';
import { getLevelFromXp } from '../utils/xp';
import { getSkillById, getActivityById } from '../data';
import { getUpgradeById, getUpgradesForActivity } from '../data/upgrades';
import { saveGameState, loadGameState } from '../utils/save';

interface GameStore {
  // State
  gameState: GameState;
  isInitialized: boolean;
  purchasedUpgrades: Set<string>; // Set for fast lookup

  // Initialization
  initializeNewGame: () => void;

  // Skill getters
  getSkillState: (skillType: SkillType) => SkillState;
  getSkillLevel: (skillType: SkillType) => number;
  getSkillXp: (skillType: SkillType) => number;
  getUnlockedActivities: (skillType: SkillType) => string[];

  // Resource management
  getResourceCount: (resourceId: string) => number;
  addResource: (resourceId: string, quantity: number) => void;
  removeResource: (resourceId: string, quantity: number) => boolean;
  hasResources: (requirements: ResourceRequirement[]) => boolean;

  // Training actions
  startTraining: (skillType: SkillType, activityId: string) => boolean;
  stopTraining: () => void;
  updateTrainingProgress: (deltaTimeMs: number) => void;
  completeTrainingAction: () => void;

  // XP and leveling
  addExperience: (skillType: SkillType, amount: number) => void;
  checkLevelUp: (skillType: SkillType) => boolean;

  // Upgrade management
  hasUpgrade: (upgradeId: string) => boolean;
  getPurchasedUpgrades: () => string[];
  purchaseUpgrade: (upgradeId: string) => boolean;
  calculateTimeReduction: (skillType: SkillType, activityId: string) => number;
  calculateProductionBonus: (skillType: SkillType, activityId: string) => number;

  // Toast notifications
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;

  // Persistence (will be implemented in Phase 2)
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;
}

// Helper to create initial skill state
function createInitialSkillState(): SkillState {
  return {
    level: 1,
    experience: 0,
    unlockedActivities: [],
  };
}

// Helper to generate initial game state
function createInitialGameState(): GameState {
  const skills: Record<SkillType, SkillState> = {
    [SkillType.WOODCUTTING]: createInitialSkillState(),
    [SkillType.MINING]: createInitialSkillState(),
    [SkillType.FISHING]: createInitialSkillState(),
    [SkillType.COOKING]: createInitialSkillState(),
    [SkillType.SMITHING]: createInitialSkillState(),
    [SkillType.CRAFTING]: createInitialSkillState(),
  };

  // Unlock level 1 activities for each skill
  Object.keys(skills).forEach(skillTypeKey => {
    const skillType = skillTypeKey as SkillType;
    const skill = getSkillById(skillType);
    if (skill) {
      skills[skillType].unlockedActivities = skill.activities
        .filter(a => a.levelRequired <= 1)
        .map(a => a.id);
    }
  });

  return {
    player: {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      lastSave: Date.now(),
    },
    skills,
    inventory: {},
    activeTraining: null,
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      notificationsEnabled: true,
    },
    purchasedUpgrades: [], // Empty array for new game
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createInitialGameState(),
  isInitialized: false,
  toasts: [],
  purchasedUpgrades: new Set<string>(), // Initialize as empty Set

  initializeNewGame: () => {
    set({
      gameState: createInitialGameState(),
      isInitialized: true,
      purchasedUpgrades: new Set<string>(),
    });
  },

  // Skill getters
  getSkillState: (skillType: SkillType) => {
    return get().gameState.skills[skillType];
  },

  getSkillLevel: (skillType: SkillType) => {
    return get().gameState.skills[skillType].level;
  },

  getSkillXp: (skillType: SkillType) => {
    return get().gameState.skills[skillType].experience;
  },

  getUnlockedActivities: (skillType: SkillType) => {
    return get().gameState.skills[skillType].unlockedActivities;
  },

  // Resource management
  getResourceCount: (resourceId: string) => {
    return get().gameState.inventory[resourceId] || 0;
  },

  addResource: (resourceId: string, quantity: number) => {
    if (quantity <= 0) {return;}

    set(state => ({
      gameState: {
        ...state.gameState,
        inventory: {
          ...state.gameState.inventory,
          [resourceId]: (state.gameState.inventory[resourceId] || 0) + quantity,
        },
      },
    }));
  },

  removeResource: (resourceId: string, quantity: number) => {
    const currentQuantity = get().getResourceCount(resourceId);

    if (currentQuantity < quantity) {
      return false; // Not enough resources
    }

    set(state => ({
      gameState: {
        ...state.gameState,
        inventory: {
          ...state.gameState.inventory,
          [resourceId]: currentQuantity - quantity,
        },
      },
    }));

    return true;
  },

  hasResources: (requirements: ResourceRequirement[]) => {
    const store = get();
    return requirements.every(req =>
      store.getResourceCount(req.resourceId) >= req.quantity
    );
  },

  // Training actions
  startTraining: (skillType: SkillType, activityId: string) => {
    const state = get();
    const activity = getActivityById(skillType, activityId);

    if (!activity) {
      console.warn(`Activity ${activityId} not found for skill ${skillType}`);
      return false;
    }

    // Check level requirement
    const skillState = state.getSkillState(skillType);
    if (skillState.level < activity.levelRequired) {
      console.warn(`Level ${activity.levelRequired} required for ${activity.name}`);
      return false;
    }

    // Check resource requirements
    if (!state.hasResources(activity.requirements)) {
      console.warn(`Insufficient resources for ${activity.name}`);
      return false;
    }

    // Consume resources
    activity.requirements.forEach(req => {
      state.removeResource(req.resourceId, req.quantity);
    });

    // Calculate time reduction from upgrades
    const timeReduction = state.calculateTimeReduction(skillType, activityId);
    const actualDuration = activity.durationMs * (1 - timeReduction);

    // Set active training with reduced duration
    set(currentState => ({
      gameState: {
        ...currentState.gameState,
        activeTraining: {
          skillType,
          activityId,
          startTime: Date.now(),
          duration: actualDuration,
        },
      },
    }));

    return true;
  },

  stopTraining: () => {
    set(state => ({
      gameState: {
        ...state.gameState,
        activeTraining: null,
      },
    }));
  },

  updateTrainingProgress: (_deltaTimeMs: number) => {
    const state = get();
    const activeTraining = state.gameState.activeTraining;

    if (!activeTraining) {return;}

    const elapsed = Date.now() - activeTraining.startTime;

    // Check if training is complete
    if (elapsed >= activeTraining.duration) {
      state.completeTrainingAction();
    }
  },

  completeTrainingAction: () => {
    const state = get();
    const activeTraining = state.gameState.activeTraining;

    if (!activeTraining) {return;}

    const activity = getActivityById(activeTraining.skillType, activeTraining.activityId);
    if (!activity) {return;}

    // Capture current level before XP gain
    const previousLevel = state.getSkillLevel(activeTraining.skillType);

    // Award XP
    state.addExperience(activeTraining.skillType, activity.xpGained);

    // Get new level after XP gain
    const newLevel = state.getSkillLevel(activeTraining.skillType);

    // Calculate production bonus from upgrades
    const productionBonus = state.calculateProductionBonus(
      activeTraining.skillType,
      activeTraining.activityId
    );

    // Produce resources with bonus
    activity.products.forEach(product => {
      const actualQuantity = product.quantity + productionBonus;
      state.addResource(product.resourceId, actualQuantity);
    });

    // Create appropriate toast notification
    const skill = getSkillById(activeTraining.skillType);

    if (newLevel > previousLevel) {
      // Level up toast
      state.addToast({
        type: ToastType.LEVEL_UP,
        skillType: activeTraining.skillType,
        message: `Level ${newLevel} ${skill?.name}!`,
        icon: '🎉',
        details: activity.products.length > 0
          ? activity.products.map(p => {
              const actualQty = p.quantity + productionBonus;
              return `+${actualQty} ${p.resourceId}`;
            })
          : undefined,
        duration: 4000,
      });
    } else {
      // Regular XP gain toast
      state.addToast({
        type: ToastType.XP_GAIN,
        skillType: activeTraining.skillType,
        message: `+${activity.xpGained} ${skill?.name} XP`,
        icon: skill?.icon,
        details: activity.products.length > 0
          ? activity.products.map(p => {
              const actualQty = p.quantity + productionBonus;
              return `+${actualQty} ${p.resourceId}`;
            })
          : undefined,
      });
    }

    // Reset training start time to auto-continue
    set(currentState => ({
      gameState: {
        ...currentState.gameState,
        activeTraining: activeTraining ? {
          ...activeTraining,
          startTime: Date.now(),
        } : null,
      },
    }));
  },

  // XP and leveling
  addExperience: (skillType: SkillType, amount: number) => {
    if (amount <= 0) {return;}

    set(state => {
      const skills = { ...state.gameState.skills };
      const skill = { ...skills[skillType] };

      skill.experience += amount;
      skills[skillType] = skill;

      return {
        gameState: {
          ...state.gameState,
          skills,
        },
      };
    });

    // Check for level up
    get().checkLevelUp(skillType);
  },

  checkLevelUp: (skillType: SkillType) => {
    const state = get();
    const skill = state.gameState.skills[skillType];
    const newLevel = getLevelFromXp(skill.experience);

    if (newLevel > skill.level && newLevel <= 99) {
      // Level up occurred
      set(currentState => {
        const skills = { ...currentState.gameState.skills };
        const updatedSkill = { ...skills[skillType] };

        updatedSkill.level = newLevel;

        // Unlock new activities
        const skillData = getSkillById(skillType);
        const newlyUnlocked = skillData?.activities
          .filter(a => a.levelRequired <= newLevel)
          .map(a => a.id) || [];

        updatedSkill.unlockedActivities = newlyUnlocked;
        skills[skillType] = updatedSkill;

        return {
          gameState: {
            ...currentState.gameState,
            skills,
          },
        };
      });

      console.log(`Level up! ${skillType} is now level ${newLevel}`);
      return true;
    }

    return false;
  },

  // Upgrade management
  hasUpgrade: (upgradeId: string) => {
    return get().purchasedUpgrades.has(upgradeId);
  },

  getPurchasedUpgrades: () => {
    return Array.from(get().purchasedUpgrades);
  },

  purchaseUpgrade: (upgradeId: string) => {
    const state = get();
    const upgrade = getUpgradeById(upgradeId);

    if (!upgrade) {
      console.warn(`Upgrade ${upgradeId} not found`);
      return false;
    }

    // Check if already purchased
    if (state.purchasedUpgrades.has(upgradeId)) {
      console.warn(`Upgrade ${upgradeId} already purchased`);
      return false;
    }

    // Check level requirement
    const skillLevel = state.getSkillLevel(upgrade.skillType);
    if (skillLevel < upgrade.levelRequired) {
      console.warn(`Level ${upgrade.levelRequired} required for ${upgrade.name}`);
      return false;
    }

    // Check resources
    if (!state.hasResources(upgrade.cost)) {
      console.warn(`Insufficient resources for ${upgrade.name}`);
      return false;
    }

    // Deduct resources
    upgrade.cost.forEach(req => {
      state.removeResource(req.resourceId, req.quantity);
    });

    // Add to purchased upgrades (more efficient than spreading)
    set(currentState => {
      const newSet = new Set(currentState.purchasedUpgrades);
      newSet.add(upgradeId);
      return { purchasedUpgrades: newSet };
    });

    // Show success toast
    state.addToast({
      type: ToastType.ITEM_GAIN,
      message: `Purchased ${upgrade.name}!`,
      icon: '⚡',
      duration: 3000,
    });

    // Save game
    state.saveGame();

    console.log(`Purchased upgrade: ${upgrade.name}`);
    return true;
  },

  calculateTimeReduction: (skillType: SkillType, activityId: string) => {
    const state = get();
    const upgrades = getUpgradesForActivity(skillType, activityId);

    let totalReduction = 0;
    upgrades.forEach(upgrade => {
      if (
        upgrade.effectType === UpgradeEffectType.TIME_REDUCTION &&
        state.purchasedUpgrades.has(upgrade.id)
      ) {
        totalReduction += upgrade.effectValue;
      }
    });

    // Cap at 75% reduction to prevent zero-time actions
    return Math.min(totalReduction, 0.75);
  },

  calculateProductionBonus: (skillType: SkillType, activityId: string) => {
    const state = get();
    const upgrades = getUpgradesForActivity(skillType, activityId);

    let totalBonus = 0;
    upgrades.forEach(upgrade => {
      if (
        upgrade.effectType === UpgradeEffectType.PRODUCTION_INCREASE &&
        state.purchasedUpgrades.has(upgrade.id)
      ) {
        totalBonus += upgrade.effectValue;
      }
    });

    return totalBonus;
  },

  // Persistence
  saveGame: async () => {
    try {
      const state = get().gameState;
      const purchasedUpgrades = get().purchasedUpgrades;
      
      // Update lastSave timestamp and convert Set to Array
      const updatedState: GameState = {
        ...state,
        player: {
          ...state.player,
          lastSave: Date.now(),
        },
        purchasedUpgrades: Array.from(purchasedUpgrades),
      };

      set({ gameState: updatedState });
      await saveGameState(updatedState);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  },

  loadGame: async () => {
    try {
      const loadedState = await loadGameState();

      if (loadedState) {
        // Convert array to Set, with validation
        const upgradesArray = Array.isArray(loadedState.purchasedUpgrades) 
          ? loadedState.purchasedUpgrades 
          : [];
        const purchasedUpgrades = new Set(upgradesArray);
        
        set({
          gameState: loadedState,
          isInitialized: true,
          purchasedUpgrades,
        });
        console.log('Game loaded successfully');
      } else {
        // No save found, initialize new game
        get().initializeNewGame();
        console.log('No save found, starting new game');
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      // On error, initialize new game
      get().initializeNewGame();
    }
  },

  // Toast actions
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const timestamp = Date.now();

    set(state => {
      const newToast: ToastNotification = {
        ...toast,
        id,
        timestamp,
        duration: toast.duration || 3500,
      };

      // Limit queue to 10 toasts max (only first 3 are visible)
      const updatedToasts = [...state.toasts, newToast].slice(-10);

      return { toasts: updatedToasts };
    });
  },

  removeToast: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));
