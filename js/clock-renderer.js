/**
 * Arcly — Clock Canvas Renderer
 * Minimal & elegant style with always-visible, high-contrast labels.
 */

import { CATEGORIES, SIZE, CX, CY, OUTER_R, INNER_R, ARC_R, ARC_W } from './constants.js';
import { hourToAngle, arcSpan } from './time-utils.js';

/**
 * Render the full clock onto the canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} activities - list of activity objects
 * @param {{ dragging: boolean, startAngle: number|null, endAngle: number|null, category: number }} dragState
 */
export function drawClock(ctx, activities, dragState) {
  const dpr = window.devicePixelRatio || 1;
  const canvas = ctx.canvas;
  canvas.width = SIZE * dpr;
  canvas.height = SIZE * dpr;
  canvas.style.width = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, SIZE, SIZE);

  drawRing(ctx);
  drawHourMarkers(ctx);
  drawActivityArcs(ctx, activities);
  drawDragPreview(ctx, dragState);
  drawClockHands(ctx);
  drawCenter(ctx);
}

// ─── Ring ────────────────────────────────────────────
function drawRing(ctx) {
  ctx.beginPath();
  ctx.arc(CX, CY, OUTER_R, 0, 2 * Math.PI);
  ctx.arc(CX, CY, INNER_R, 0, 2 * Math.PI, true);
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  ctx.fill();

  // Outer circle
  ctx.beginPath();
  ctx.arc(CX, CY, OUTER_R, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Inner circle
  ctx.beginPath();
  ctx.arc(CX, CY, INNER_R, 0, 2 * Math.PI);
  ctx.stroke();
}

// ─── Hour ticks & always-visible labels ──────────────
function drawHourMarkers(ctx) {
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const isMain = i % 3 === 0;

    // Tick marks
    const tickOuter = OUTER_R - 1;
    const tickInner = isMain ? OUTER_R - 10 : OUTER_R - 6;

    ctx.beginPath();
    ctx.moveTo(CX + cos * tickOuter, CY + sin * tickOuter);
    ctx.lineTo(CX + cos * tickInner, CY + sin * tickInner);
    ctx.strokeStyle = isMain ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = isMain ? 1.5 : 1;
    ctx.stroke();

    // Labels — always visible, higher contrast
    if (isMain) {
      const labelR = OUTER_R + 16;
      ctx.save();
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i === 0 ? '0' : i.toString(), CX + cos * labelR, CY + sin * labelR);
      ctx.restore();
    }
  }
}

// ─── Activity arcs ──────────────────────────────────
function drawActivityArcs(ctx, activities) {
  activities.forEach(act => {
    const sA = hourToAngle(act.startHour) - Math.PI / 2;
    const eA = hourToAngle(act.endHour) - Math.PI / 2;
    const cat = CATEGORIES[act.category] || CATEGORIES[5];

    // Main arc
    ctx.beginPath();
    ctx.arc(CX, CY, ARC_R, sA, eA, false);
    ctx.strokeStyle = cat.color;
    ctx.lineWidth = ARC_W;
    ctx.lineCap = 'butt';
    ctx.globalAlpha = 0.55;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Glow
    ctx.beginPath();
    ctx.arc(CX, CY, ARC_R, sA, eA, false);
    ctx.strokeStyle = cat.color;
    ctx.lineWidth = ARC_W + 4;
    ctx.globalAlpha = 0.12;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Label on arc — each character follows the curvature
    const span = arcSpan(sA, eA);
    if (span > 0.35) {
      let label = act.name;
      // Truncate based on available arc length
      const maxChars = Math.floor(span * ARC_R / 7);
      if (label.length > maxChars) label = label.substring(0, maxChars - 1) + '…';

      drawTextOnArc(ctx, label, ARC_R, sA, eA);
    }
  });
}

// ─── Text along arc path ────────────────────────────
function drawTextOnArc(ctx, text, radius, startAngle, endAngle) {
  const span = arcSpan(startAngle, endAngle);
  const midAngle = startAngle + span / 2;

  // Normalize midAngle to [0, 2π]
  let mid = ((midAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // Bottom half of clock = text would be upside down if drawn on outer edge
  // In canvas coords (0=right, π/2=bottom, π=left, 3π/2=top):
  // Bottom half: midAngle roughly between 0 and π
  const isBottomHalf = mid > 0.05 && mid < Math.PI - 0.05;

  ctx.save();
  ctx.font = '600 11px Inter, sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.92;

  // Measure character widths
  const charWidths = [];
  let totalWidth = 0;
  for (const ch of text) {
    const w = ctx.measureText(ch).width;
    charWidths.push(w);
    totalWidth += w;
  }

  // Add letter spacing
  const letterSpacing = 1;
  totalWidth += letterSpacing * (text.length - 1);

  // Angle span the text occupies on the arc
  const textAngleSpan = totalWidth / radius;

  // Don't render if text is too large for the arc
  if (textAngleSpan > span * 0.85) {
    ctx.restore();
    ctx.globalAlpha = 1;
    return;
  }

  if (isBottomHalf) {
    // For the bottom half: render text on the inner side, reading left-to-right
    // Characters go counter-clockwise from right end
    let angle = midAngle + textAngleSpan / 2;

    for (let i = 0; i < text.length; i++) {
      const charW = charWidths[i] + letterSpacing;
      const charAngleSpan = charW / radius;
      angle -= charAngleSpan / 2;

      const x = CX + Math.cos(angle) * radius;
      const y = CY + Math.sin(angle) * radius;

      ctx.save();
      ctx.translate(x, y);
      // Character faces outward, rotated 90° CCW from radial + 180° flip
      ctx.rotate(angle + Math.PI / 2 + Math.PI);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();

      angle -= charAngleSpan / 2;
    }
  } else {
    // Top half: render text on the outer side, reading left-to-right
    let angle = midAngle - textAngleSpan / 2;

    for (let i = 0; i < text.length; i++) {
      const charW = charWidths[i] + letterSpacing;
      const charAngleSpan = charW / radius;
      angle += charAngleSpan / 2;

      const x = CX + Math.cos(angle) * radius;
      const y = CY + Math.sin(angle) * radius;

      ctx.save();
      ctx.translate(x, y);
      // Character faces inward, rotated 90° CW from radial
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();

      angle += charAngleSpan / 2;
    }
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

// ─── Drag preview arc ───────────────────────────────
function drawDragPreview(ctx, dragState) {
  if (!dragState.dragging || dragState.startAngle === null || dragState.endAngle === null) return;

  const sA = dragState.startAngle - Math.PI / 2;
  const eA = dragState.endAngle - Math.PI / 2;
  const cat = CATEGORIES[dragState.category];

  // Preview arc
  ctx.beginPath();
  ctx.arc(CX, CY, ARC_R, sA, eA, false);
  ctx.strokeStyle = cat.color;
  ctx.lineWidth = ARC_W;
  ctx.lineCap = 'butt';
  ctx.globalAlpha = 0.35;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Start/end markers
  [sA, eA].forEach(a => {
    ctx.beginPath();
    ctx.arc(CX + Math.cos(a) * ARC_R, CY + Math.sin(a) * ARC_R, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

// ─── Clock hands ────────────────────────────────────
function drawClockHands(ctx) {
  const now = new Date();
  const hrs  = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const mins = now.getMinutes() + now.getSeconds() / 60;
  const secs = now.getSeconds() + now.getMilliseconds() / 1000;

  // Hour hand (24h → full rotation)
  const hAngle = (hrs / 24) * 2 * Math.PI - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(CX, CY);
  ctx.lineTo(CX + Math.cos(hAngle) * (INNER_R - 30), CY + Math.sin(hAngle) * (INNER_R - 30));
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Minute hand
  const mAngle = (mins / 60) * 2 * Math.PI - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(CX, CY);
  ctx.lineTo(CX + Math.cos(mAngle) * (INNER_R - 16), CY + Math.sin(mAngle) * (INNER_R - 16));
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Second hand
  const sAngle = (secs / 60) * 2 * Math.PI - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(CX, CY);
  ctx.lineTo(CX + Math.cos(sAngle) * (INNER_R - 10), CY + Math.sin(sAngle) * (INNER_R - 10));
  ctx.strokeStyle = '#6c5ce7';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// ─── Center dot & digital time ──────────────────────
function drawCenter(ctx) {
  // Dot
  ctx.beginPath();
  ctx.arc(CX, CY, 4, 0, 2 * Math.PI);
  ctx.fillStyle = '#6c5ce7';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(CX, CY, 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Digital time
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  ctx.save();
  ctx.font = '600 16px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${hh}:${mm}`, CX, CY + 30);
  ctx.restore();
}
