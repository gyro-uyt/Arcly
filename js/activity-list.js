/**
 * Arcly — Activity List
 * Renders the sidebar activity list with delete and clear-all support.
 */

import { CATEGORIES } from './constants.js';
import { formatHour, escHtml } from './time-utils.js';

const listEl  = () => document.getElementById('activityList');
const countEl = () => document.getElementById('activityCount');
const clearEl = () => document.getElementById('clearAllBtn');

/**
 * Initialize activity list event listeners.
 * @param {(id: number) => void} onDelete - called when an activity is deleted
 * @param {() => void} onClear - called when all activities are cleared
 */
export function initActivityList(onDelete, onClear) {
  listEl().addEventListener('click', (e) => {
    const btn = e.target.closest('.activity-delete');
    if (!btn) return;
    onDelete(Number(btn.dataset.id));
  });

  clearEl().addEventListener('click', () => {
    if (!confirm('Clear all activities?')) return;
    onClear();
  });
}

/**
 * Render the activity list.
 * @param {Array} activities
 */
export function renderActivities(activities) {
  const sorted = [...activities].sort((a, b) => a.startHour - b.startHour);
  countEl().textContent = sorted.length;
  clearEl().style.display = sorted.length > 0 ? 'block' : 'none';

  if (sorted.length === 0) {
    listEl().innerHTML = `<div class="empty-state">
      <div class="icon">🕐</div>
      <p>No activities yet.<br>Drag on the clock to get started!</p>
    </div>`;
    return;
  }

  listEl().innerHTML = '';
  sorted.forEach(act => {
    const cat = CATEGORIES[act.category] || CATEGORIES[5];
    const el = document.createElement('div');
    el.className = 'activity-item';
    el.innerHTML = `
      <div class="activity-dot" style="color:${cat.color};background:${cat.color}"></div>
      <div class="activity-info">
        <div class="activity-name">${escHtml(act.name)}</div>
        <div class="activity-time">${formatHour(act.startHour)} → ${formatHour(act.endHour)}</div>
      </div>
      <button class="activity-delete" data-id="${act.id}" title="Delete">✕</button>
    `;
    listEl().appendChild(el);
  });
}
