/**
 * Arcly — App Entry Point
 * Wires all modules together and starts the render loop.
 */

import { loadActivities, saveActivities } from './storage.js';
import { drawClock } from './clock-renderer.js';
import { initDragHandler } from './drag-handler.js';
import { initModal, openModal } from './modal.js';
import { initActivityList, renderActivities } from './activity-list.js';

// ─── State ──────────────────────────────────────────
let activities = loadActivities();

const dragState = {
  dragging: false,
  startAngle: null,
  endAngle: null,
  category: 0,
};

// ─── DOM ────────────────────────────────────────────
const canvas  = document.getElementById('clockCanvas');
const ctx     = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');

// ─── Wire Modules ───────────────────────────────────

// Drag → opens modal
initDragHandler(canvas, tooltip, dragState, (startHour, endHour) => {
  openModal(startHour, endHour);
});

// Modal → saves activity
initModal((name, category, startH, endH) => {
  activities.push({
    id: Date.now(),
    name,
    category,
    startHour: startH,
    endHour: endH,
  });
  saveActivities(activities);
  renderActivities(activities);
  // Reset drag state
  dragState.startAngle = null;
  dragState.endAngle = null;
});

// Activity list → delete / clear
initActivityList(
  (id) => {
    activities = activities.filter(a => a.id !== id);
    saveActivities(activities);
    renderActivities(activities);
  },
  () => {
    activities = [];
    saveActivities(activities);
    renderActivities(activities);
  }
);

// ─── Render Loop ────────────────────────────────────
function tick() {
  drawClock(ctx, activities, dragState);
  requestAnimationFrame(tick);
}

// ─── Init ───────────────────────────────────────────
renderActivities(activities);
tick();
