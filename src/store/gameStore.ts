import { create } from 'zustand';
import {
  GameState,
  SkillType,
  SkillState,
  ResourceRequirement,
  InventoryItem,
  InventorySortOption,
  InventoryUIState,
} from '../types';
import { getLevelFromXp } from '../utils/xp';
import { getSkillById, getActivityById } from '../data';
import { getItemMetadata } from '../data/items-metadata';
import { saveGameState, loadGameState } from '../utils/save';

interface GameStore {
  // State
  gameState: GameState;
  isInitialized: boolean;

  // Inventory UI State
  inventoryUIState: InventoryUIState;

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

  // Inventory actions
  setInventorySortBy: (sortBy: InventorySortOption) => void;
  setInventorySearchQuery: (query: string) => void;
  getInventoryItems: () => InventoryItem[];
  getFilteredInventoryItems: () => InventoryItem[];
  getTotalInventoryValue: () => number;
  getInventoryItemCount: () => number;

  // Training actions
  startTraining: (skillType: SkillType, activityId: string) => boolean;
  stopTraining: () => void;
  updateTrainingProgress: (deltaTimeMs: number) => void;
  completeTrainingAction: () => void;

  // XP and leveling
  addExperience: (skillType: SkillType, amount: number) => void;
  checkLevelUp: (skillType: SkillType) => boolean;

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
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createInitialGameState(),
  isInitialized: false,

  // Inventory UI State
  inventoryUIState: {
    sortBy: InventorySortOption.ALPHABETICAL,
    searchQuery: '',
  },

  initializeNewGame: () => {
    set({
      gameState: createInitialGameState(),
      isInitialized: true,
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

    // Set active training
    set(currentState => ({
      gameState: {
        ...currentState.gameState,
        activeTraining: {
          skillType,
          activityId,
          startTime: Date.now(),
          duration: activity.durationMs,
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

    // Award XP
    state.addExperience(activeTraining.skillType, activity.xpGained);

    // Produce resources
    activity.products.forEach(product => {
      state.addResource(product.resourceId, product.quantity);
    });

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

  // Inventory Management
  setInventorySortBy: (sortBy: InventorySortOption) => {
    set(state => ({
      inventoryUIState: {
        ...state.inventoryUIState,
        sortBy,
      },
    }));
  },

  setInventorySearchQuery: (query: string) => {
    set(state => ({
      inventoryUIState: {
        ...state.inventoryUIState,
        searchQuery: query,
      },
    }));
  },

  getInventoryItems: () => {
    const state = get();
    const inventory = state.gameState.inventory;

    // Convert inventory quantities to InventoryItem objects
    const items: InventoryItem[] = Object.entries(inventory)
      .filter(([_, quantity]) => quantity > 0)
      .map(([resourceId, quantity]) => {
        const metadata = getItemMetadata(resourceId);
        if (!metadata) {
          // Fallback for items without metadata
          return {
            id: resourceId,
            name: resourceId,
            description: 'No description available',
            icon: '📦',
            goldValue: 0,
            category: 'other' as const,
            quantity,
            totalValue: 0,
          };
        }
        return {
          ...metadata,
          quantity,
          totalValue: metadata.goldValue * quantity,
        };
      });

    return items;
  },

  getFilteredInventoryItems: () => {
    const state = get();
    let items = state.getInventoryItems();

    // Apply search filter
    const query = state.inventoryUIState.searchQuery.toLowerCase();
    if (query) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sortBy = state.inventoryUIState.sortBy;
    switch (sortBy) {
      case InventorySortOption.ALPHABETICAL:
        items = items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case InventorySortOption.GOLD_VALUE:
        items = items.sort((a, b) => b.goldValue - a.goldValue);
        break;
      case InventorySortOption.ITEM_COUNT:
        items = items.sort((a, b) => b.quantity - a.quantity);
        break;
    }

    return items;
  },

  getTotalInventoryValue: () => {
    return get().getInventoryItems()
      .reduce((total, item) => total + item.totalValue, 0);
  },

  getInventoryItemCount: () => {
    return get().getInventoryItems().length;
  },

  // Persistence
  saveGame: async () => {
    try {
      const state = get().gameState;
      // Update lastSave timestamp
      const updatedState = {
        ...state,
        player: {
          ...state.player,
          lastSave: Date.now(),
        },
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
        set({
          gameState: loadedState,
          isInitialized: true,
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
}));
