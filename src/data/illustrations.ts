* { box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; font-family: Inter, system-ui, sans-serif; background: #f4f4f5; }
body { min-height: 100vh; }
button, input { font: inherit; }
button { cursor: pointer; }
.app { max-width: 1800px; margin: 0 auto; padding: 20px; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.eyebrow { margin: 0; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.72rem; }
.topbar h1 { margin: 0; font-size: clamp(2rem, 2vw, 3rem); }
.lang-switcher { display: flex; gap: 8px; }
.lang-switcher button, .tool-group button, .meta-actions button { background: #fff; border: 1px solid #d4d4d8; border-radius: 999px; padding: 8px 14px; }
.lang-switcher .active, .tool-group .active { background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; border-color: transparent; }
.layout { display: grid; grid-template-columns: 300px minmax(0, 1fr) 310px; gap: 20px; }
.panel { background: rgba(255,255,255,0.8); border: 1px solid rgba(148,163,184,0.5); border-radius: 22px; padding: 16px; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08); }
.sidebar, .workbench { display: flex; flex-direction: column; gap: 20px; }
.library-grid { display: grid; gap: 10px; max-height: 680px; overflow: auto; }
.library-card { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; width: 100%; text-align: left; border-radius: 14px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 12px; }
.library-card.selected { border-color: #8b5cf6; background: #f5f3ff; }
.badge { font-size: 0.7rem; padding: 4px 8px; background: #ecfeff; color: #0f766e; border-radius: 999px; }
.toolbar { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; }
.tool-group, .slider-group, .meta-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.inline { display: flex; }
.slider-group { align-items: center; }
.slider-group input[type='range'] { width: 120px; }
.canvas-panel { display: flex; flex-direction: column; gap: 12px; }
.canvas-header { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.canvas-header h2 { margin: 0; }
.canvas-shell { display: flex; justify-content: center; align-items: center; min-height: 780px; background: linear-gradient(135deg, #fdf2f8, #eff6ff); border: 1px solid #dbeafe; border-radius: 20px; overflow: hidden; }
.art-canvas { width: min(82vw, 820px); height: min(82vw, 820px); max-width: 820px; max-height: 820px; border-radius: 18px; background: #fff; touch-action: none; image-rendering: auto; }
.status-message { margin: 0; color: #0f766e; }
.progress-bar { position: relative; width: 100%; height: 12px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
.progress-bar span { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: linear-gradient(90deg, #ec4899, #8b5cf6); }
.palette-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
.swatch { width: 48px; height: 48px; border-radius: 12px; border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.12); }
.mini-list { display: flex; flex-direction: column; gap: 8px; }
.reward-list { display: flex; flex-direction: column; gap: 10px; }
.reward { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; }
.reward.unlocked { background: linear-gradient(135deg, #d1fae5, #ecfeff); border-color: #34d399; }
.rtl { direction: rtl; }
@media (max-width: 1100px) { .layout { grid-template-columns: 1fr; } .sidebar, .workbench { order: 2; } }
