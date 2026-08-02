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
import { TOOLS, DEFAULT_COLORS, MAX_UNDO_STEPS } from '../constants/drawingConfig.js';

let _id = 0;
const uid = () => `el_${++_id}_${Date.now()}`;

export function useDrawing() {
  const [elements,    setElements]    = useState([]);
  const [undoStack,   setUndoStack]   = useState([]);
  const [redoStack,   setRedoStack]   = useState([]);
  const [activeTool,  setActiveTool]  = useState('move');
  const [activeColor, setActiveColor] = useState(DEFAULT_COLORS[0].hex);
  const [strokeWidth, setStrokeWidth] = useState(3);
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
      if (key === 'M')      setActiveTool('move');
      if (key === 'P')      setActiveTool('pass');
      if (key === 'S')      setActiveTool('shot');
      if (key === 'F')      setActiveTool('freehand');
      if (key === 'E')      setActiveTool('eraser');
      if (e.key === 'Escape') setActiveTool('select');

      // Ausgewähltes Element löschen
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        deleteElement(selectedId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedId, deleteElement]);

  return {
    // State
    elements, selectedId, isDrawing,
    activeTool,  setActiveTool,
    activeColor, setActiveColor,
    strokeWidth, setStrokeWidth,
    // Undo/Redo
    undo, redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    // Aktionen
    addElement, updateElement, deleteElement, clearAll, loadElements,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleElementClick,
  };
}
