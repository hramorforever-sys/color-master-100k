import { useEffect, useMemo, useRef, useState } from 'react';
import { catalog, getIllustrationById, type Illustration, type Region } from './data/illustrations';

type Language = 'en' | 'es' | 'ar';
type ToolMode = 'draw' | 'fill' | 'number';
type Point = { x: number; y: number };
type Stroke = { color: string; size: number; points: Point[]; mode: 'draw' | 'erase' };

type ProgressState = {
  favorites: number[];
  completed: number[];
  saved: Record<number, { mode: ToolMode; strokes: Stroke[]; fills: Record<string, string>; regionStatus: Record<string, boolean> }>;
};

const STORAGE_KEY = 'color-master-100k-saves';
const DEFAULT_COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#f59e0b', '#111827'];

const dictionary = {
  en: {
    title: 'Color Master 100K',
    library: 'Illustration library',
    freeDrawing: 'Free drawing',
    fillArea: 'Fill area',
    colorByNumber: 'Color by number',
    brush: 'Brush',
    eraser: 'Eraser',
    undo: 'Undo',
    redo: 'Redo',
    zoom: 'Zoom',
    pan: 'Pan',
    save: 'Save',
    resume: 'Resume',
    export: 'Export PNG',
    favorites: 'Favorites',
    completed: 'Completed',
    rewards: 'Rewards',
    language: 'Language',
    progress: 'Progress',
    completedCount: 'Completed',
    empty: 'No saved state',
    savePrompt: 'Your artwork is saved locally.',
    favoritePrompt: 'Added to favorites.',
    color: 'Color',
    palette: 'Palette'
  },
  es: {
    title: 'Color Master 100K',
    library: 'Biblioteca',
    freeDrawing: 'Dibujo libre',
    fillArea: 'Rellenar áreas',
    colorByNumber: 'Colorear por números',
    brush: 'Pincel',
    eraser: 'Borrador',
    undo: 'Deshacer',
    redo: 'Rehacer',
    zoom: 'Zoom',
    pan: 'Mover',
    save: 'Guardar',
    resume: 'Continuar',
    export: 'Exportar PNG',
    favorites: 'Favoritos',
    completed: 'Completados',
    rewards: 'Recompensas',
    language: 'Idioma',
    progress: 'Progreso',
    completedCount: 'Completados',
    empty: 'Sin estado guardado',
    savePrompt: 'Tu arte se guarda localmente.',
    favoritePrompt: 'Añadido a favoritos.',
    color: 'Color',
    palette: 'Paleta'
  },
  ar: {
    title: 'Color Master 100K',
    library: 'المكتبة',
    freeDrawing: 'رسم حر',
    fillArea: 'تلوين المساحات',
    colorByNumber: 'التلوين بالأرقام',
    brush: 'فرشاة',
    eraser: 'ممحاة',
    undo: 'تراجع',
    redo: 'إعادة',
    zoom: 'تكبير',
    pan: 'تحريك',
    save: 'حفظ',
    resume: 'استمرار',
    export: 'تصدير PNG',
    favorites: 'المفضلة',
    completed: 'مكتمل',
    rewards: 'المكافآت',
    language: 'اللغة',
    progress: 'التقدم',
    completedCount: 'مكتمل',
    empty: 'لا يوجد حفظ',
    savePrompt: 'يتم حفظ عملك محلياً.',
    favoritePrompt: 'أضيف إلى المفضلة.',
    color: 'اللون',
    palette: 'اللوحة'
  }
} as const;

function getInitialProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { favorites: [], completed: [], saved: {} };
    }
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { favorites: [], completed: [], saved: {} };
  }
}

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedId, setSelectedId] = useState<number>(1);
  const [toolMode, setToolMode] = useState<ToolMode>('draw');
  const [selectedColor, setSelectedColor] = useState<string>('#f87171');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isEraser, setIsEraser] = useState(false);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<ProgressState>(() => getInitialProgress());
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [regionState, setRegionState] = useState<Record<string, boolean>>({});
  const [fills, setFills] = useState<Record<string, string>>({});
  const [rewardLevel, setRewardLevel] = useState<number>(0);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentIllustration = useMemo(() => getIllustrationById(selectedId) ?? catalog[0], [selectedId]);
  const isRTL = language === 'ar';
  const labels = dictionary[language];

  useEffect(() => {
    const saved = progress.saved[currentIllustration.id];
    if (saved) {
      setStrokes(saved.strokes ?? []);
      setFills(saved.fills ?? {});
      setRegionState(saved.regionStatus ?? {});
    } else {
      setStrokes([]);
      setFills({});
      setRegionState({});
    }
    setRedoStack([]);
  }, [currentIllustration.id, progress.saved]);

  useEffect(() => {
    setRewardLevel(Math.min(4, Math.floor(progress.completed.length / 25)));
  }, [progress.completed.length]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = 900;
      canvas.height = 900;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      strokes.forEach((stroke) => {
        if (stroke.points.length < 2) return;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = stroke.size;
        ctx.strokeStyle = stroke.mode === 'erase' ? '#ffffff' : stroke.color;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i += 1) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      });

      currentIllustration.regions.forEach((region) => {
        const color = fills[region.id] || region.targetColor;
        ctx.fillStyle = color;
        ctx.fillRect(region.x, region.y, region.w, region.h);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(region.number), region.x + region.w / 2, region.y + region.h / 2 + 6);
      });
    };

    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(currentIllustration.svg)}`;
  }, [currentIllustration, fills, strokes]);

  const saveProgress = () => {
    const nextProgress: ProgressState = {
      ...progress,
      saved: {
        ...progress.saved,
        [currentIllustration.id]: {
          mode: toolMode,
          strokes,
          fills,
          regionStatus: regionState
        }
      }
    };
    setProgress(nextProgress);
    setStatus(labels.savePrompt);
  };

  const toggleFavorite = () => {
    const hasFavorite = progress.favorites.includes(currentIllustration.id);
    const nextFavorites = hasFavorite ? progress.favorites.filter((item) => item !== currentIllustration.id) : [...progress.favorites, currentIllustration.id];
    setProgress((previous) => ({ ...previous, favorites: nextFavorites }));
    setStatus(labels.favoritePrompt);
  };

  const exportCurrentArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${currentIllustration.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setStatus('Artwork exported.');
  };

  const setRegionColor = (regionId: string, color: string) => {
    const region = currentIllustration.regions.find((item) => item.id === regionId);
    if (!region) return;

    const nextFills = { ...fills, [regionId]: color };
    const nextState = { ...regionState, [regionId]: true };
    setFills(nextFills);
    setRegionState(nextState);

    if (region.targetColor.toLowerCase() === color.toLowerCase()) {
      setProgress((previous) => ({
        ...previous,
        completed: previous.completed.includes(currentIllustration.id) ? previous.completed : [...previous.completed, currentIllustration.id]
      }));
    }
  };

  const undo = () => {
    setStrokes((previous) => {
      if (previous.length === 0) return previous;
      const last = previous[previous.length - 1];
      setRedoStack((redo) => [...redo, last]);
      return previous.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((previous) => {
      if (previous.length === 0) return previous;
      const nextStroke = previous[previous.length - 1];
      setStrokes((current) => [...current, nextStroke]);
      return previous.slice(0, -1);
    });
  };

  const screenToCanvas = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const drawStroke = (point: Point) => {
    setStrokes((previous) => {
      const lastStroke = previous[previous.length - 1];
      if (!lastStroke) {
        return [{ color: selectedColor, size: brushSize, mode: isEraser ? 'erase' : 'draw', points: [point] }];
      }
      return [
        ...previous.slice(0, -1),
        { ...lastStroke, points: [...lastStroke.points, point] }
      ];
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = screenToCanvas(event);

    if (isRTL && toolMode === 'pan') {
      // no-op, handled by move path below
    }

    if (toolMode === 'draw') {
      if (isEraser) {
        const eraserStroke: Stroke = { color: '#ffffff', size: brushSize, mode: 'erase', points: [point] };
        setRedoStack([]); setStrokes((previous) => [...previous, eraserStroke]);
      } else {
        const stroke: Stroke = { color: selectedColor, size: brushSize, mode: 'draw', points: [point] };
        setRedoStack([]); setStrokes((previous) => [...previous, stroke]);
      }
      return;
    }

    if (toolMode === 'fill') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const target = getPixel(imageData, point.x, point.y);
      const queue: Point[] = [point];
      const visited = new Set<string>();
      const validFillColor = hexToRgb(selectedColor);

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;
        const key = `${Math.round(current.x)},${Math.round(current.y)}`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (current.x < 0 || current.x >= canvas.width || current.y < 0 || current.y >= canvas.height) continue;

        const pixel = getPixel(imageData, current.x, current.y);
        if (isColorClose(pixel, target, 12) && !isColorClose(pixel, { r: 0, g: 0, b: 0, a: 255 })) {
          setPixel(imageData, current.x, current.y, validFillColor);
          queue.push({ x: current.x + 1, y: current.y });
          queue.push({ x: current.x - 1, y: current.y });
          queue.push({ x: current.x, y: current.y + 1 });
          queue.push({ x: current.x, y: current.y - 1 });
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return;
    }

    if (toolMode === 'number') {
      const region = currentIllustration.regions.find((item) => point.x >= item.x && point.x <= item.x + item.w && point.y >= item.y && point.y <= item.y + item.h);
      if (region) {
        setRegionColor(region.id, selectedColor);
      }
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (toolMode === 'draw' && strokes.length > 0) {
      const point = screenToCanvas(event);
      drawStroke(point);
      return;
    }

    if (toolMode === 'fill' || toolMode === 'number') {
      return;
    }

    if (toolMode === 'draw' && dragRef.current) {
      const point = screenToCanvas(event);
      const dx = point.x - dragRef.current.x;
      const dy = point.y - dragRef.current.y;
      dragRef.current = point;
      setPan((previous) => ({ x: previous.x + dx, y: previous.y + dy }));
    }
  };

  const startPan = (event: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = screenToCanvas(event);
  };

  const totalCompleted = progress.completed.length;
  const stats = {
    total: catalog.length,
    completed: totalCompleted,
    favoritesCount: progress.favorites.length,
    percent: Math.round((totalCompleted / catalog.length) * 100)
  };

  const currentSaved = progress.saved[currentIllustration.id];

  return (
    <div className={`app ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="topbar">
        <div>
          <p className="eyebrow">{labels.library}</p>
          <h1>{labels.title}</h1>
        </div>
        <div className="lang-switcher">
          {(['en', 'es', 'ar'] as Language[]).map((option) => (
            <button key={option} className={language === option ? 'active' : ''} onClick={() => setLanguage(option)}>
              {option.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <section className="panel">
            <h2>{labels.library}</h2>
            <div className="library-grid">
              {catalog.map((illustration) => (
                <button key={illustration.id} className={`library-card ${selectedId === illustration.id ? 'selected' : ''}`} onClick={() => setSelectedId(illustration.id)}>
                  <span className="badge">{illustration.category}</span>
                  <strong>{illustration.title}</strong>
                  <small>{illustration.level}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>{labels.rewards}</h2>
            <div className="reward-list">
              {[1, 2, 3, 4].map((level) => (
                <div key={level} className={`reward ${rewardLevel >= level ? 'unlocked' : ''}`}>
                  <span>🏆</span>
                  <div>
                    <strong>{`Reward ${level}`}</strong>
                    <small>{rewardLevel >= level ? 'Unlocked' : 'Locked'}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="workbench">
          <div className="toolbar panel">
            <div className="tool-group">
              {(['draw', 'fill', 'number'] as ToolMode[]).map((mode) => (
                <button key={mode} className={toolMode === mode ? 'active' : ''} onClick={() => setToolMode(mode)}>
                  {mode === 'draw' ? labels.freeDrawing : mode === 'fill' ? labels.fillArea : labels.colorByNumber}
                </button>
              ))}
            </div>

            <div className="tool-group inline">
              <label>
                {labels.color}
                <input type="color" value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)} />
              </label>
              <button onClick={() => setIsEraser((value) => !value)}>{isEraser ? labels.eraser : labels.brush}</button>
              <button onClick={undo}>{labels.undo}</button>
              <button onClick={redo}>{labels.redo}</button>
              <button onClick={() => setPan({ x: 0, y: 0 })}>{labels.pan}</button>
            </div>

            <div className="slider-group">
              <label htmlFor="brush-size">{labels.brush}</label>
              <input id="brush-size" type="range" min="4" max="38" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
              <label htmlFor="zoom-level">{labels.zoom}</label>
              <input id="zoom-level" type="range" min="0.8" max="1.8" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
            </div>
          </div>

          <div className="canvas-panel panel">
            <div className="canvas-header">
              <div>
                <h2>{currentIllustration.title}</h2>
                <small>{currentIllustration.category}</small>
              </div>
              <div className="meta-actions">
                <button onClick={saveProgress}>{labels.save}</button>
                <button onClick={() => setStatus(currentSaved ? 'Saved illustration loaded.' : 'No saved state available.')}>{labels.resume}</button>
                <button onClick={toggleFavorite}>{progress.favorites.includes(currentIllustration.id) ? '★' : '☆'} {labels.favorites}</button>
                <button onClick={exportCurrentArtwork}>{labels.export}</button>
              </div>
            </div>

            <div className="canvas-shell">
              <canvas
                ref={canvasRef}
                className="art-canvas"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}
                onPointerDown={(event) => {
                  if (toolMode === 'draw') {
                    handlePointerDown(event);
                  } else {
                    startPan(event);
                    handlePointerDown(event);
                  }
                }}
                onPointerMove={(event) => {
                  if (toolMode === 'draw') {
                    handlePointerMove(event);
                  } else {
                    if (dragRef.current) {
                      const point = screenToCanvas(event);
                      const dx = point.x - dragRef.current.x;
                      const dy = point.y - dragRef.current.y;
                      dragRef.current = point;
                      setPan((previous) => ({ x: previous.x + dx, y: previous.y + dy }));
                    }
                  }
                }}
                onPointerUp={() => { dragRef.current = null; }}
                onPointerLeave={() => { dragRef.current = null; }}
              />
            </div>
            {status ? <p className="status-message">{status}</p> : null}
          </div>
        </section>

        <aside className="sidebar right-panel">
          <section className="panel">
            <h2>{labels.progress}</h2>
            <div className="progress-bar">
              <span style={{ width: `${stats.percent}%` }} />
            </div>
            <p>{stats.completed} / {stats.total} {labels.completedCount}</p>
            <p>{stats.favoritesCount} {labels.favorites}</p>
          </section>

          <section className="panel">
            <h2>{labels.completed}</h2>
            <div className="mini-list">
              {progress.completed.length === 0 ? <span>{labels.empty}</span> : progress.completed.map((id) => <span key={id}>{getIllustrationById(id)?.title}</span>)}
            </div>
          </section>

          <section className="panel">
            <h2>{labels.palette}</h2>
            <div className="palette-grid">
              {DEFAULT_COLORS.map((color) => (
                <button key={color} className="swatch" style={{ background: color }} onClick={() => setSelectedColor(color)} />
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

function getPixel(imageData: ImageData, x: number, y: number) {
  const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
  return { r: imageData.data[index], g: imageData.data[index + 1], b: imageData.data[index + 2], a: imageData.data[index + 3] };
}

function setPixel(imageData: ImageData, x: number, y: number, color: { r: number; g: number; b: number; a: number }) {
  const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
  imageData.data[index] = color.r;
  imageData.data[index + 1] = color.g;
  imageData.data[index + 2] = color.b;
  imageData.data[index + 3] = color.a;
}

function isColorClose(a: { r: number; g: number; b: number; a: number }, b: { r: number; g: number; b: number; a: number }, tolerance: number) {
  return Math.abs(a.r - b.r) <= tolerance && Math.abs(a.g - b.g) <= tolerance && Math.abs(a.b - b.b) <= tolerance && Math.abs(a.a - b.a) <= tolerance;
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const normalized = clean.length === 3 ? clean.split('').map((char) => `${char}${char}`).join('') : clean;
  const value = Number.parseInt(normalized, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255, a: 255 };
}

export default App;
