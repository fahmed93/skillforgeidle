import { useGameStore } from '../gameStore';
import { SkillType } from '../../types';

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGameStore.getState().initializeNewGame();
  });

  describe('initialization', () => {
    it('should initialize new game with default state', () => {
      const state = useGameStore.getState();
      state.initializeNewGame();

      expect(state.isInitialized).toBe(true);
      expect(state.gameState.player.id).toBeDefined();
      expect(state.gameState.skills[SkillType.WOODCUTTING].level).toBe(1);
      expect(state.gameState.skills[SkillType.WOODCUTTING].experience).toBe(0);
    });

    it('should unlock level 1 activities on initialization', () => {
      const state = useGameStore.getState();
      state.initializeNewGame();

      const woodcuttingUnlocked =
        state.gameState.skills[SkillType.WOODCUTTING].unlockedActivities;
      expect(woodcuttingUnlocked.length).toBeGreaterThan(0);
    });
  });

  describe('resource management', () => {
    it('should add resources to inventory', () => {
      const state = useGameStore.getState();
      state.addResource('logs', 10);

      expect(state.getResourceCount('logs')).toBe(10);
    });

    it('should accumulate resources', () => {
      const state = useGameStore.getState();
      state.addResource('logs', 10);
      state.addResource('logs', 5);

      expect(state.getResourceCount('logs')).toBe(15);
    });

    it('should remove resources from inventory', () => {
      const state = useGameStore.getState();
      state.addResource('logs', 10);
      const success = state.removeResource('logs', 5);

      expect(success).toBe(true);
      expect(state.getResourceCount('logs')).toBe(5);
    });

    it('should fail to remove more resources than available', () => {
      const state = useGameStore.getState();
      state.addResource('logs', 5);
      const success = state.removeResource('logs', 10);

      expect(success).toBe(false);
      expect(state.getResourceCount('logs')).toBe(5);
    });

    it('should check if player has required resources', () => {
      const state = useGameStore.getState();
      state.addResource('logs', 10);

      expect(state.hasResources([{resourceId: 'logs', quantity: 5}])).toBe(
        true,
      );
      expect(state.hasResources([{resourceId: 'logs', quantity: 15}])).toBe(
        false,
      );
    });
  });

  describe('XP and leveling', () => {
    it('should add experience to skill', () => {
      const state = useGameStore.getState();
      state.addExperience(SkillType.WOODCUTTING, 100);

      expect(state.getSkillXp(SkillType.WOODCUTTING)).toBe(100);
    });

    it('should level up when reaching XP threshold', () => {
      const state = useGameStore.getState();

      // Level 2 requires 83 XP
      state.addExperience(SkillType.WOODCUTTING, 83);

      expect(state.getSkillLevel(SkillType.WOODCUTTING)).toBe(2);
    });

    it('should unlock new activities on level up', () => {
      let state = useGameStore.getState();
      const initialActivities =
        state.gameState.skills[SkillType.WOODCUTTING].unlockedActivities
          .length;

      // Add enough XP to reach level 15 (oak tree unlocks at 15, requires 2328 XP)
      state.addExperience(SkillType.WOODCUTTING, 2400);

      // Get fresh state after adding experience
      state = useGameStore.getState();
      const newActivities =
        state.gameState.skills[SkillType.WOODCUTTING].unlockedActivities
          .length;

      expect(newActivities).toBeGreaterThan(initialActivities);
    });
  });

  describe('training', () => {
    it('should start training when requirements met', () => {
      const store = useGameStore.getState();
      const success = store.startTraining(SkillType.WOODCUTTING, 'regular_tree');

      expect(success).toBe(true);

      // Get fresh state after startTraining
      const currentState = useGameStore.getState();
      expect(currentState.gameState.activeTraining).not.toBeNull();
      expect(currentState.gameState.activeTraining?.skillType).toBe(
        SkillType.WOODCUTTING,
      );
    });

    it('should not start training if level requirement not met', () => {
      const store = useGameStore.getState();
      // Try to start a high-level activity
      const success = store.startTraining(SkillType.WOODCUTTING, 'magic_tree');

      expect(success).toBe(false);

      const currentState = useGameStore.getState();
      expect(currentState.gameState.activeTraining).toBeNull();
    });

    it('should stop training', () => {
      const store = useGameStore.getState();
      store.startTraining(SkillType.WOODCUTTING, 'regular_tree');
      store.stopTraining();

      const currentState = useGameStore.getState();
      expect(currentState.gameState.activeTraining).toBeNull();
    });

    it('should complete training action and award XP', () => {
      const store = useGameStore.getState();
      store.startTraining(SkillType.WOODCUTTING, 'regular_tree');

      const initialXp = store.getSkillXp(SkillType.WOODCUTTING);
      store.completeTrainingAction();

      const currentState = useGameStore.getState();
      const newXp = currentState.getSkillXp(SkillType.WOODCUTTING);
      expect(newXp).toBeGreaterThan(initialXp);
    });

    it('should produce resources on training completion', () => {
      const store = useGameStore.getState();
      store.startTraining(SkillType.WOODCUTTING, 'regular_tree');

      store.completeTrainingAction();

      const currentState = useGameStore.getState();
      expect(currentState.getResourceCount('regular_wood')).toBeGreaterThan(0);
    });
  });
});
