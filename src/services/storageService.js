import { INITIAL_MISSIONS } from '../data/sampleMissions';
import { SAMPLE_PERSONAS, DEFAULT_CURRENT_USER_ID } from '../data/samplePersonas';

const STORAGE_KEYS = {
  MISSIONS: 'peerbridge_missions_v1',
  CURRENT_USER_ID: 'peerbridge_current_user_id_v1',
  CUSTOM_PERSONAS: 'peerbridge_custom_personas_v1',
};

/**
 * Initialize and retrieve missions from LocalStorage.
 * Seeds with INITIAL_MISSIONS if nothing exists yet.
 */
export function getStoredMissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(INITIAL_MISSIONS));
      return INITIAL_MISSIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(INITIAL_MISSIONS));
      return INITIAL_MISSIONS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading missions from LocalStorage:', err);
    return INITIAL_MISSIONS;
  }
}

/**
 * Save updated missions list to LocalStorage.
 */
export function saveStoredMissions(missions) {
  try {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  } catch (err) {
    console.error('Error writing missions to LocalStorage:', err);
  }
}

/**
 * Get active student persona ID.
 */
export function getStoredCurrentUserId() {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, DEFAULT_CURRENT_USER_ID);
      return DEFAULT_CURRENT_USER_ID;
    }
    return id;
  } catch (err) {
    console.error('Error reading current user ID from LocalStorage:', err);
    return DEFAULT_CURRENT_USER_ID;
  }
}

/**
 * Save active student persona ID.
 */
export function saveStoredCurrentUserId(userId) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  } catch (err) {
    console.error('Error writing current user ID to LocalStorage:', err);
  }
}

/**
 * Reset all local storage data back to the clean initial demo state.
 */
export function resetStorageToDefaults() {
  try {
    localStorage.removeItem(STORAGE_KEYS.MISSIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(INITIAL_MISSIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, DEFAULT_CURRENT_USER_ID);
    return {
      missions: INITIAL_MISSIONS,
      currentUserId: DEFAULT_CURRENT_USER_ID
    };
  } catch (err) {
    console.error('Error resetting LocalStorage:', err);
    return {
      missions: INITIAL_MISSIONS,
      currentUserId: DEFAULT_CURRENT_USER_ID
    };
  }
}
