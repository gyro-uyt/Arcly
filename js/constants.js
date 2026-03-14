/**
 * Arcly — Constants & Configuration
 */

// Activity categories with display properties
export const CATEGORIES = [
  { name: 'Study',    icon: '📚', color: '#6c5ce7' },
  { name: 'Work',     icon: '💼', color: '#0984e3' },
  { name: 'Exercise', icon: '🏃', color: '#00b894' },
  { name: 'Play',     icon: '🎮', color: '#e17055' },
  { name: 'Rest',     icon: '😴', color: '#636e72' },
  { name: 'Other',    icon: '✨', color: '#fdcb6e' },
];

// Clock canvas dimensions — extra padding for labels
export const SIZE    = 480;
export const CX      = SIZE / 2;
export const CY      = SIZE / 2;
export const OUTER_R = SIZE / 2 - 36;   // 204 — leaves 36px margin for labels
export const INNER_R = OUTER_R - 36;    // 168
export const ARC_R   = (OUTER_R + INNER_R) / 2;  // 186
export const ARC_W   = OUTER_R - INNER_R - 6;    // 30
