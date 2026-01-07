import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState } from '../types';

const SAVE_KEY = '@SkillForgeIdle:save';
const SAVE_VERSION = '1.0.0';

export interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
}

/**
 * Save game state to AsyncStorage
 */
export async function saveGameState(state: GameState): Promise<void> {
  try {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      gameState: state,
    };

    const serialized = JSON.stringify(saveData);
    await AsyncStorage.setItem(SAVE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save game state:', error);
    throw error;
  }
}

/**
 * Load game state from AsyncStorage
 */
export async function loadGameState(): Promise<GameState | null> {
  try {
    const serialized = await AsyncStorage.getItem(SAVE_KEY);

    if (!serialized) {
      return null; // No save exists
    }

    const saveData: SaveData = JSON.parse(serialized);

    // Validate save data
    if (!validateSaveData(saveData)) {
      console.warn('Invalid save data detected');
      return null;
    }

    return saveData.gameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Validate save data structure and integrity
 */
export function validateSaveData(data: any): data is SaveData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check required fields
  if (typeof data.version !== 'string') {
    return false;
  }

  if (typeof data.timestamp !== 'number') {
    return false;
  }

  if (!data.gameState || typeof data.gameState !== 'object') {
    return false;
  }

  const gameState = data.gameState;

  // Validate player data
  if (!gameState.player || typeof gameState.player !== 'object') {
    return false;
  }

  if (typeof gameState.player.id !== 'string' ||
      typeof gameState.player.createdAt !== 'number' ||
      typeof gameState.player.lastSave !== 'number') {
    return false;
  }

  // Validate skills
  if (!gameState.skills || typeof gameState.skills !== 'object') {
    return false;
  }

  // Validate inventory
  if (!gameState.inventory || typeof gameState.inventory !== 'object') {
    return false;
  }

  // Validate settings
  if (!gameState.settings || typeof gameState.settings !== 'object') {
    return false;
  }

  return true;
}

/**
 * Export save data as JSON string
 */
export async function exportSaveData(): Promise<string | null> {
  try {
    const serialized = await AsyncStorage.getItem(SAVE_KEY);
    return serialized;
  } catch (error) {
    console.error('Failed to export save data:', error);
    return null;
  }
}

/**
 * Import save data from JSON string
 */
export async function importSaveData(data: string): Promise<boolean> {
  try {
    const saveData: SaveData = JSON.parse(data);

    if (!validateSaveData(saveData)) {
      console.warn('Invalid import data');
      return false;
    }

    await AsyncStorage.setItem(SAVE_KEY, data);
    return true;
  } catch (error) {
    console.error('Failed to import save data:', error);
    return false;
  }
}

/**
 * Clear all save data (use with caution)
 */
export async function clearSaveData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.error('Failed to clear save data:', error);
    throw error;
  }
}
