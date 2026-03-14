/**
 * Arcly — Modal Controller
 * Handles activity logging modal: open, close, category selection, save.
 */

import { CATEGORIES } from './constants.js';
import { formatHour } from './time-utils.js';

let selectedCategory = 0;
let currentStartH = 0;
let currentEndH = 0;

const overlay   = () => document.getElementById('modalOverlay');
const timeEl    = () => document.getElementById('modalTime');
const inputEl   = () => document.getElementById('activityInput');
const gridEl    = () => document.getElementById('categoryGrid');

/**
 * Initialize modal event listeners.
 * @param {(name: string, category: number, startH: number, endH: number) => void} onSave
 */
export function initModal(onSave) {
  document.getElementById('btnCancel').addEventListener('click', closeModal);

  document.getElementById('btnSave').addEventListener('click', () => {
    const name = inputEl().value.trim();
    if (!name) { inputEl().focus(); return; }
    onSave(name, selectedCategory, currentStartH, currentEndH);
    closeModal();
  });

  inputEl().addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btnSave').click();
    if (e.key === 'Escape') closeModal();
  });

  overlay().addEventListener('click', (e) => {
    if (e.target === overlay()) closeModal();
  });
}

/** Open the modal for a given time range */
export function openModal(startH, endH) {
  currentStartH = startH;
  currentEndH = endH;
  timeEl().textContent = `${formatHour(startH)} → ${formatHour(endH)}`;
  inputEl().value = '';
  selectedCategory = 0;
  renderCategoryButtons();
  overlay().classList.add('active');
  setTimeout(() => inputEl().focus(), 200);
}

/** Close the modal */
export function closeModal() {
  overlay().classList.remove('active');
}

/** Render category selection buttons */
function renderCategoryButtons() {
  const grid = gridEl();
  grid.innerHTML = '';
  CATEGORIES.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'category-btn' + (i === selectedCategory ? ' selected' : '');
    btn.style.setProperty('--cat-color', cat.color);
    btn.style.setProperty('--cat-bg', cat.color + '20');
    btn.innerHTML = `<span class="cat-icon">${cat.icon}</span>${cat.name}`;
    btn.addEventListener('click', () => {
      selectedCategory = i;
      renderCategoryButtons();
    });
    grid.appendChild(btn);
  });
}
