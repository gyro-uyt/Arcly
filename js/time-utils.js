/**
 * Arcly — Time & Angle Utility Functions
 * Pure functions, no side effects.
 */

/** Convert angle (0 = top, clockwise, radians) to 24-hour decimal */
export function angleToHour(angle) {
  let h = (angle / (2 * Math.PI)) * 24;
  if (h < 0) h += 24;
  return h % 24;
}

/** Convert 24-hour decimal to angle (0 = top, clockwise, radians) */
export function hourToAngle(h) {
  return ((h % 24) / 24) * 2 * Math.PI;
}

/** Format decimal hour as "h:mm AM/PM" */
export function formatHour(h) {
  h = ((h % 24) + 24) % 24;
  const hr = Math.floor(h);
  const mn = Math.round((h - hr) * 60);
  const period = hr >= 12 ? 'PM' : 'AM';
  const display = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
  return `${display}:${mn.toString().padStart(2, '0')} ${period}`;
}

/** Snap decimal hour to nearest 15 minutes */
export function snapToQuarter(h) {
  return Math.round(h * 4) / 4;
}

/** Calculate clockwise arc span between two angles (radians) */
export function arcSpan(startAngle, endAngle) {
  let span = endAngle - startAngle;
  if (span < 0) span += 2 * Math.PI;
  return span;
}

/** Escape HTML to prevent XSS */
export function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
