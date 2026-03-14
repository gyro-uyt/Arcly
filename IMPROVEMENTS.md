# Arcly — Improvement Roadmap

## 🎨 UI & Design

### Clock Enhancements
- [ ] Add smooth animated transitions when arcs appear/disappear (fade + grow effect)
- [ ] Add a subtle pulsing glow on the current-time arc position
- [ ] Show the current time period highlighted with a faint "now" marker on the ring
- [ ] Add hover effect on existing arcs — highlight + show tooltip with full activity details
- [ ] Support resizing arcs by dragging their start/end handles (edit time range)
- [ ] Add an inner ring showing AM vs PM labels for easier orientation
- [ ] Smooth second-hand animation using CSS/canvas interpolation instead of tick-by-tick

### Visual Polish
- [ ] Add theme switcher (Dark / Light / Midnight / Neon)
- [ ] Improve glassmorphism depth — layered blur + subtle noise texture
- [ ] Add a gradient border glow on the clock panel (animated slow rotation)
- [ ] Custom SVG favicon matching the Arcly brand
- [ ] Loading animation / skeleton screen on first load
- [ ] Add particle or confetti effect when saving an activity (micro-celebration)
- [ ] Animate activity list items sliding in with staggered delay

### Responsive & Accessibility
- [ ] Make clock size responsive — scale down on mobile screens
- [ ] Add keyboard navigation for the clock (arrow keys to adjust time range)
- [ ] Add proper ARIA labels for screen reader support
- [ ] Support pinch-to-zoom on touch devices for the clock
- [ ] Test and fix layout on tablets and ultra-wide monitors

---

## ⚡ Features

### Core Functionality
- [ ] Edit existing activities (click an arc or list item → reopen modal with prefilled data)
- [ ] Drag to reposition existing arcs (change time range)
- [ ] Overlap detection — warn when an activity overlaps with another
- [ ] Undo/Redo support (Ctrl+Z / Ctrl+Y) for add/delete/edit actions
- [ ] Multi-day support — date picker to view/log activities for past/future days
- [ ] Custom categories — let users create their own categories with custom colors + icons
- [ ] Notes field in the modal — longer description beyond just the activity name

### Data & Analytics
- [ ] Daily summary view — total hours per category shown as a breakdown
- [ ] Weekly/Monthly view — see trends over time (bar chart or heatmap)
- [ ] Streak tracking — how many consecutive days the user has logged
- [ ] Export data as JSON / CSV for backup
- [ ] Import data from JSON file
- [ ] Shareable day image — generate a PNG snapshot of your clock for social media

### Productivity
- [ ] Timer mode — tap an arc to start a live timer for that activity
- [ ] Reminders / notifications — "You haven't logged anything for 3 hours"
- [ ] Goal setting — "I want to study 4 hours today" with progress tracking
- [ ] Pomodoro integration — break work arcs into 25-min pomodoro segments

---

## 🏗️ Technical & Architecture

### Performance
- [ ] Throttle canvas re-renders — only redraw when state changes (not every frame)
- [ ] Use OffscreenCanvas for the static parts (ring, labels) to avoid redrawing them
- [ ] Lazy-load Google Fonts to improve initial load time

### Code Quality
- [ ] Add JSDoc comments to all public module functions
- [ ] Set up ESLint with a consistent code style
- [ ] Add unit tests for `time-utils.js` (pure functions are easy to test)
- [ ] Add integration tests using Playwright for drag interactions
- [ ] Create a `README.md` with setup instructions, screenshots, and feature list

### Deployment & Distribution
- [ ] Set up GitHub Pages for free hosting (arcly.github.io)
- [ ] Add a PWA manifest + service worker for offline support & "Add to Home Screen"
- [ ] Add Open Graph meta tags for rich social media link previews
- [ ] Set up a custom domain (arcly.app or arcly.io)
- [ ] Add Google Analytics or Plausible for privacy-friendly usage tracking

### Data Layer
- [ ] Migrate from localStorage to IndexedDB for larger storage capacity
- [ ] Optional cloud sync — sign in with Google to sync across devices
- [ ] Auto-backup to local file every 24 hours
- [ ] Versioned data schema with migration support

---

## 🚀 Growth & Marketing

- [ ] Create a landing page with animated demo + feature highlights
- [ ] Product Hunt launch
- [ ] Share on Reddit (r/productivity, r/webdev, r/sideproject)
- [ ] Build a Chrome extension that shows Arcly as a new tab page
- [ ] Write a blog post about building a circular time tracker from scratch

---

## 📋 Priority Order (Suggested)

1. **README.md** — essential for GitHub presence
2. **Favicon** — looks unprofessional without one
3. **Edit activities** — most requested missing feature
4. **PWA + GitHub Pages** — makes it installable & accessible to anyone
5. **Theme switcher** — instant visual wow factor
6. **Overlap detection** — prevents data errors
7. **Daily summary** — gives users a reason to come back
8. **Responsive clock** — mobile users can't use it well currently
9. **Weekly view** — turns it from a toy into a real tool
10. **Export/Import** — builds user trust (their data isn't locked in)
