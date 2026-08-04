/**
 * useDrawing – State-Management für alle Zeichen-Elemente
 *
 * Features:
 *   - Undo / Redo (bis zu 50 Schritte)
 *   - Elemente hinzufügen, aktualisieren, löschen
 *   - Freihand-Zeichnen (laufend Punkte hinzufügen)
 *   - Aktives Tool & Farbe verwalten
 *   - Tastaturkürzel (Strg+Z, Strg+Y, Entf)
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TOOLS, DEFAULT_COLORS, MAX_UNDO_STEPS } from '../constants/drawingConfig.js';
import useAnnounceStore from '../store/announceStore.js';

let _id = 0;
const uid = () => `el_${++_id}_${Date.now()}`;

export function useDrawing() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [elements,    setElements]    = useState([]);
  const [undoStack,   setUndoStack]   = useState([]);
  const [redoStack,   setRedoStack]   = useState([]);
  const [activeTool,  setActiveToolState]  = useState('move');
  const changeTool = useCallback((tool) => {
    const toolDef = TOOLS[tool];
    const label = (isEn ? toolDef?.labelEn : toolDef?.label) ?? tool;
    useAnnounceStore.getState().announce(t('drawing.announceTool', { tool: label }));
    setActiveToolState(tool);
  }, [isEn, t]);
  const [activeColor, setActiveColorState] = useState(DEFAULT_COLORS[0].hex);
  const [strokeWidth, setStrokeWidthState] = useState(3);
  const changeColor = useCallback((hex) => {
    const colorDef = DEFAULT_COLORS.find((c) => c.hex === hex);
    const label = (isEn ? colorDef?.labelEn : colorDef?.label) ?? hex;
    useAnnounceStore.getState().announce(t('drawing.announceColor', { color: label }));
    setActiveColorState(hex);
  }, [isEn, t]);
  const changeStrokeWidth = useCallback((width) => {
    useAnnounceStore.getState().announce(t('drawing.announceStrokeWidth', { width }));
    setStrokeWidthState(width);
  }, [t]);
  const [selectedId,  setSelectedId]  = useState(null);
  const [isDrawing,   setIsDrawing]   = useState(false);
  const currentElRef = useRef(null); // Laufendes Freihand-Element

  // ── Undo/Redo Helpers ──────────────────────────────────────────────
  const pushUndo = useCallback((prevElements) => {
    setUndoStack((s) => [...s.slice(-MAX_UNDO_STEPS + 1), prevElements]);
    setRedoStack([]);
  }, []);

  const undo = useCallback(() => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const newStack = [...prev];
      const snapshot = newStack.pop();
      setElements((cur) => {
        setRedoStack((r) => [...r, cur]);
        return snapshot;
      });
      return newStack;
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const newStack = [...prev];
      const snapshot = newStack.pop();
      setElements((cur) => {
        setUndoStack((u) => [...u, cur]);
        return snapshot;
      });
      return newStack;
    });
  }, []);

  // ── Element CRUD ───────────────────────────────────────────────────────
  const addElement = useCallback((el) => {
    setElements((prev) => {
      pushUndo(prev);
      return [...prev, { ...el, id: uid() }];
    });
  }, [pushUndo]);

  const updateElement = useCallback((id, patch) => {
    setElements((prev) => {
      pushUndo(prev);
      return prev.map((el) => el.id === id ? { ...el, ...patch } : el);
    });
  }, [pushUndo]);

  const deleteElement = useCallback((id) => {
    setElements((prev) => {
      pushUndo(prev);
      return prev.filter((el) => el.id !== id);
    });
    setSelectedId((s) => s === id ? null : s);
  }, [pushUndo]);

  // Elemente eines Frames übernehmen (z.B. bei Frame-Wechsel) – setzt Undo/Redo zurück
  const loadElements = useCallback((newElements = []) => {
    setElements(newElements);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedId(null);
  }, []);

  const clearAll = useCallback(() => {
    setElements((prev) => {
      if (prev.length === 0) return prev;
      pushUndo(prev);
      return [];
    });
    setSelectedId(null);
  }, [pushUndo]);

  // ── Zeichen-Events (Canvas-Koordinaten in Metern) ─────────────────────
  const handlePointerDown = useCallback((x_m, y_m) => {
    if (activeTool === 'select' || activeTool === 'eraser') return;
    const tool = TOOLS[activeTool];
    if (!tool) return;

    setIsDrawing(true);

    if (activeTool === 'freehand') {
      const el = {
        id: uid(),
        type: 'freehand',
        points: [x_m, y_m],
        color: activeColor,
        strokeWidth,
        dash: [],
        arrowHead: false,
      };
      currentElRef.current = el.id;
      setElements((prev) => {
        pushUndo(prev);
        return [...prev, el];
      });
    } else {
      // Pfeil/Linie: Startpunkt setzen, Endpunkt = Startpunkt (wird on-move aktualisiert)
      const el = {
        id: uid(),
        type: activeTool,
        x1: x_m, y1: y_m,
        x2: x_m, y2: y_m,
        color: activeColor,
        strokeWidth: tool.strokeWidth ?? strokeWidth,
        dash: tool.dash ?? [],
        arrowHead: tool.arrowHead ?? true,
      };
      currentElRef.current = el.id;
      setElements((prev) => {
        pushUndo(prev);
        return [...prev, el];
      });
    }
  }, [activeTool, activeColor, strokeWidth, pushUndo]);

  const handlePointerMove = useCallback((x_m, y_m) => {
    if (!isDrawing || !currentElRef.current) return;
    const id = currentElRef.current;

    setElements((prev) => prev.map((el) => {
      if (el.id !== id) return el;
      if (el.type === 'freehand') {
        return { ...el, points: [...el.points, x_m, y_m] };
      }
      return { ...el, x2: x_m, y2: y_m };
    }));
  }, [isDrawing]);

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
    currentElRef.current = null;
  }, []);

  // Fallback fürs Loslassen: das gerade gezeichnete Element (Pfeilspitze am
  // Cursor) liegt über dem unsichtbaren Hit-Rect und kann dessen
  // onMouseUp/onTouchEnd verdecken (Konva liefert das Event an das
  // oberste getroffene Shape) – window-Listener garantiert das Loslassen
  // unabhängig davon, welches Konva-Shape gerade getroffen wird
  useEffect(() => {
    if (!isDrawing) return undefined;
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    return () => {
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDrawing, handlePointerUp]);

  // Tastatur-Alternative zum Ziehen mit der Maus (Issue #38 – WCAG 2.1.1):
  // erzeugt exakt dieselbe Element-Form wie handlePointerDown/Move/Up,
  // nur direkt aus fertigen Koordinaten statt schrittweise per Drag.
  const addArrowElement = useCallback((tool, x1, y1, x2, y2) => {
    const toolDef = TOOLS[tool];
    if (!toolDef) return;
    const el = {
      id: uid(),
      type: tool,
      x1, y1, x2, y2,
      color: activeColor,
      strokeWidth: toolDef.strokeWidth ?? strokeWidth,
      dash: toolDef.dash ?? [],
      arrowHead: toolDef.arrowHead ?? true,
    };
    setElements((prev) => {
      pushUndo(prev);
      return [...prev, el];
    });
    useAnnounceStore.getState().announce(t('drawing.announceElementAdded'));
  }, [activeColor, strokeWidth, pushUndo, t]);

  const addFreehandElement = useCallback((points) => {
    const el = {
      id: uid(),
      type: 'freehand',
      points,
      color: activeColor,
      strokeWidth,
      dash: [],
      arrowHead: false,
    };
    setElements((prev) => {
      pushUndo(prev);
      return [...prev, el];
    });
    useAnnounceStore.getState().announce(t('drawing.announceElementAdded'));
  }, [activeColor, strokeWidth, pushUndo, t]);

  // Eraser: Element per Klick löschen
  const handleElementClick = useCallback((id) => {
    if (activeTool === 'eraser') {
      deleteElement(id);
    } else if (activeTool === 'select') {
      setSelectedId((prev) => prev === id ? null : id);
    }
  }, [activeTool, deleteElement]);

  // ── Tastaturkürzel ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); return; }

      // Tool-Shortcuts
      const key = e.key.toUpperCase();
      if (key === 'M')      changeTool('move');
      if (key === 'P')      changeTool('pass');
      if (key === 'S')      changeTool('shot');
      if (key === 'F')      changeTool('freehand');
      if (key === 'E')      changeTool('eraser');
      if (e.key === 'Escape') changeTool('select');

      // Ausgewähltes Element löschen
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        deleteElement(selectedId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedId, deleteElement, changeTool]);

  return {
    // State
    elements, selectedId, isDrawing,
    activeTool,  setActiveTool: changeTool,
    activeColor, setActiveColor: changeColor,
    strokeWidth, setStrokeWidth: changeStrokeWidth,
    // Undo/Redo
    undo, redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    // Aktionen
    addElement, updateElement, deleteElement, clearAll, loadElements,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleElementClick,
    addArrowElement, addFreehandElement,
  };
}
