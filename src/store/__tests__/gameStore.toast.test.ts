/**
 * Toast Store Tests
 * 
 * Tests for toast notification functionality in the game store
 */

import { useGameStore } from '../gameStore';
import { ToastType } from '../../types';

describe('Toast Notifications', () => {
  describe('addToast', () => {
    it('should add a toast to the store', () => {
      const store = useGameStore.getState();
      const initialCount = store.toasts.length;
      
      store.addToast({
        type: ToastType.XP_GAIN,
        message: 'Test XP Toast',
        icon: '⚔️',
      });

      expect(store.toasts.length).toBe(initialCount + 1);
      const latestToast = store.toasts[store.toasts.length - 1];
      expect(latestToast.message).toBe('Test XP Toast');
      expect(latestToast.type).toBe(ToastType.XP_GAIN);
      
      // Cleanup
      store.removeToast(latestToast.id);
    });

    it('should generate unique ID for each toast', () => {
      const store = useGameStore.getState();
      
      store.addToast({
        type: ToastType.XP_GAIN,
        message: 'Toast 1',
      });
      
      store.addToast({
        type: ToastType.XP_GAIN,
        message: 'Toast 2',
      });

      const toast1 = store.toasts[store.toasts.length - 2];
      const toast2 = store.toasts[store.toasts.length - 1];
      
      expect(toast1.id).not.toBe(toast2.id);
      
      // Cleanup
      store.removeToast(toast1.id);
      store.removeToast(toast2.id);
    });

    it('should add timestamp to toast', () => {
      const store = useGameStore.getState();
      const beforeTime = Date.now();
      
      store.addToast({
        type: ToastType.XP_GAIN,
        message: 'Test Toast',
      });

      const afterTime = Date.now();
      const toast = store.toasts[store.toasts.length - 1];
      
      expect(toast.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(toast.timestamp).toBeLessThanOrEqual(afterTime);
      
      // Cleanup
      store.removeToast(toast.id);
    });

    it('should apply default duration of 3500ms', () => {
      const store = useGameStore.getState();
      
      store.addToast({
        type: ToastType.XP_GAIN,
        message: 'Test Toast',
      });

      const toast = store.toasts[store.toasts.length - 1];
      expect(toast.duration).toBe(3500);
      
      // Cleanup
      store.removeToast(toast.id);
    });

    it('should use custom duration when provided', () => {
      const store = useGameStore.getState();
      
      store.addToast({
        type: ToastType.LEVEL_UP,
        message: 'Level Up!',
        duration: 4000,
      });

      const toast = store.toasts[store.toasts.length - 1];
      expect(toast.duration).toBe(4000);
      
      // Cleanup
      store.removeToast(toast.id);
    });
  });

  describe('removeToast', () => {
    it('should remove toast by ID', () => {
      const store = useGameStore.getState();
      
      store.addToast({
        type: ToastType.XP_GAIN,
        message: 'Toast to Remove',
      });

      const toastToRemove = store.toasts[store.toasts.length - 1];
      const countBefore = store.toasts.length;
      
      store.removeToast(toastToRemove.id);

      expect(store.toasts.length).toBe(countBefore - 1);
      expect(store.toasts.find(t => t.id === toastToRemove.id)).toBeUndefined();
    });

    it('should not error when removing non-existent toast', () => {
      const store = useGameStore.getState();
      const countBefore = store.toasts.length;

      expect(() => {
        store.removeToast('non-existent-id');
      }).not.toThrow();

      expect(store.toasts.length).toBe(countBefore);
    });
  });

  describe('clearAllToasts', () => {
    it('should clear all toasts', () => {
      const store = useGameStore.getState();
      
      // Add multiple toasts
      store.addToast({ type: ToastType.XP_GAIN, message: 'Toast 1' });
      store.addToast({ type: ToastType.XP_GAIN, message: 'Toast 2' });
      store.addToast({ type: ToastType.XP_GAIN, message: 'Toast 3' });

      expect(store.toasts.length).toBeGreaterThanOrEqual(3);

      store.clearAllToasts();

      expect(store.toasts.length).toBe(0);
    });
  });

  describe('Toast types', () => {
    it('should create XP gain toast', () => {
      const store = useGameStore.getState();
      store.clearAllToasts(); // Clear before creating
      
      store.addToast({
        type: ToastType.XP_GAIN,
        skillType: 'woodcutting',
        message: '+25 Woodcutting XP',
        icon: '🪓',
        details: ['+1 logs'],
      });

      const toast = store.toasts[store.toasts.length - 1];
      expect(toast.type).toBe(ToastType.XP_GAIN);
      expect(toast.message).toContain('XP');
      expect(toast.details).toBeDefined();
      expect(toast.details?.length).toBeGreaterThan(0);
      
      store.clearAllToasts(); // Clean up after
    });

    it('should create level up toast with special styling', () => {
      const store = useGameStore.getState();
      store.clearAllToasts(); // Clear before creating
      
      store.addToast({
        type: ToastType.LEVEL_UP,
        skillType: 'woodcutting',
        message: 'Level 2 Woodcutting!',
        icon: '🎉',
        details: ['+1 logs'],
        duration: 4000,
      });
      
      const toast = store.toasts[store.toasts.length - 1];
      expect(toast.type).toBe(ToastType.LEVEL_UP);
      expect(toast.message).toContain('Level');
      expect(toast.icon).toBe('🎉');
      expect(toast.duration).toBe(4000);
      
      store.clearAllToasts(); // Clean up after
    });
  });
});
