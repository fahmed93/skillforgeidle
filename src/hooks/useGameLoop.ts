import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

/**
 * Main game loop hook that manages training progress and auto-save
 */
export function useGameLoop() {
  const updateTrainingProgress = useGameStore(state => state.updateTrainingProgress);
  const saveGame = useGameStore(state => state.saveGame);
  const activeTraining = useGameStore(state => state.gameState.activeTraining);

  const lastSaveTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Update training progress if active
      if (activeTraining) {
        updateTrainingProgress(deltaTime);
      }

      // Auto-save check
      const now = Date.now();
      if (now - lastSaveTimeRef.current >= AUTO_SAVE_INTERVAL) {
        saveGame();
        lastSaveTimeRef.current = now;
      }

      frameId = requestAnimationFrame(gameLoop);
    };

    frameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeTraining, updateTrainingProgress, saveGame]);
}
