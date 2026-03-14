/**
 * Arcly — Drag Handler
 * Manages mouse/touch drag on the clock ring to select time ranges.
 */

import { SIZE, CX, CY, OUTER_R, INNER_R } from './constants.js';
import { angleToHour, formatHour, snapToQuarter } from './time-utils.js';

/**
 * Initialize drag handling on the clock canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} tooltip
 * @param {object} dragState - shared mutable drag state { dragging, startAngle, endAngle, category }
 * @param {(startHour: number, endHour: number) => void} onDragComplete - called when a valid drag finishes
 */
export function initDragHandler(canvas, tooltip, dragState, onDragComplete) {

  function getMouseAngle(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left - CX * (rect.width / SIZE);
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top  - CY * (rect.height / SIZE);
    let angle = Math.atan2(x, -y); // 0 at top, clockwise
    if (angle < 0) angle += 2 * Math.PI;
    return angle;
  }

  function isOnRing(e) {
    const rect = canvas.getBoundingClientRect();
    const scale = rect.width / SIZE;
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left - CX * scale;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top  - CY * scale;
    const dist = Math.sqrt(x * x + y * y) / scale;
    return dist >= INNER_R - 15 && dist <= OUTER_R + 15;
  }

  function updateTooltip(e) {
    const startH = snapToQuarter(angleToHour(dragState.startAngle));
    const endH   = snapToQuarter(angleToHour(dragState.endAngle));
    tooltip.textContent = `${formatHour(startH)} → ${formatHour(endH)}`;
    const rect = canvas.getBoundingClientRect();
    tooltip.style.left = ((e.clientX || e.touches?.[0]?.clientX) - rect.left + 14) + 'px';
    tooltip.style.top  = ((e.clientY || e.touches?.[0]?.clientY) - rect.top - 30) + 'px';
    tooltip.classList.add('visible');
  }

  // ── Pointer Down ──
  function onPointerDown(e) {
    if (!isOnRing(e)) return;
    e.preventDefault();
    dragState.dragging = true;
    dragState.startAngle = getMouseAngle(e);
    dragState.endAngle = dragState.startAngle;
    updateTooltip(e);
  }

  // ── Pointer Move ──
  function onPointerMove(e) {
    if (!dragState.dragging) {
      // Hover tooltip
      if (isOnRing(e)) {
        const angle = getMouseAngle(e);
        const hour = snapToQuarter(angleToHour(angle));
        tooltip.textContent = formatHour(hour);
        const rect = canvas.getBoundingClientRect();
        tooltip.style.left = ((e.clientX || e.touches?.[0]?.clientX) - rect.left + 14) + 'px';
        tooltip.style.top  = ((e.clientY || e.touches?.[0]?.clientY) - rect.top - 30) + 'px';
        tooltip.classList.add('visible');
      } else {
        tooltip.classList.remove('visible');
      }
      return;
    }
    e.preventDefault();
    dragState.endAngle = getMouseAngle(e);
    updateTooltip(e);
  }

  // ── Pointer Up ──
  function onPointerUp() {
    if (!dragState.dragging) return;
    dragState.dragging = false;
    tooltip.classList.remove('visible');

    const startHour = snapToQuarter(angleToHour(dragState.startAngle));
    const endHour   = snapToQuarter(angleToHour(dragState.endAngle));
    if (Math.abs(startHour - endHour) < 0.2) return; // too small

    onDragComplete(startHour, endHour);
  }

  // ── Attach Events ──
  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', (e) => onPointerDown(e), { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); onPointerMove(e); }, { passive: false });
  canvas.addEventListener('touchend', onPointerUp);
}
