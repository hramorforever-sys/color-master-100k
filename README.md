# Color Master 100K

Color Master 100K is a standalone interactive coloring game built as a Vite + React app. The current build includes 100 original, rights-cleared vector-style illustrations spanning 10 categories.

## Features
- Free drawing with brush, eraser, pan, zoom, undo and redo
- Fill-area coloring with boundary-aware flood fill
- Color-by-number mode with target palette and progress tracking
- Save, resume, favorites, export, completion tracking, rewards unlocks
- English, Spanish, and Arabic localization with RTL support
- Offline-ready PWA shell and localStorage-based progress persistence

## Included assets
The shipped library contains 100 original illustrations created for this project and released under the project license. The app does not provide 100,000 illustrations; the actual shipped library is 100 curated illustrations.

## Quick start
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Tests
```bash
npm test
```

## Notes
- Brush drawing, fill operations, and color-by-number all work on rasterized canvas content.
- Content is stored locally in the browser to support saving, favorites, and resume logic.
- A simple service worker enables offline access to the app shell after the first load.
