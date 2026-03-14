/**
 * Arcly — LocalStorage Abstraction
 */

const STORAGE_KEY = 'arcly_activities';

/** Load activities from localStorage */
export function loadActivities() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Save activities to localStorage */
export function saveActivities(activities) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}
