import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import '../i18n/i18n.js';
import { useDrawing } from './useDrawing.js';

const player = (id, x, y) => ({ id, role: 'C', team: 'home', x, y });

describe('useDrawing – vereinter Undo/Redo-Verlauf (Spieler + Elemente)', () => {
  it('movePlayer pusht Undo, undo() stellt die vorherige Position wieder her, redo() wendet sie erneut an', () => {
    const { result } = renderHook(() => useDrawing());

    act(() => { result.current.loadScene([player('h1', 2, 10)], []); });
    expect(result.current.canUndo).toBe(false);

    act(() => { result.current.movePlayer('h1', 5, 12); });
    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 5, y: 12 });
    expect(result.current.canUndo).toBe(true);

    act(() => { result.current.undo(); });
    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 2, y: 10 });
    expect(result.current.canRedo).toBe(true);

    act(() => { result.current.redo(); });
    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 5, y: 12 });
  });

  it('vereint Spieler- und Element-Aktionen in EINEM Verlauf – undo() macht immer die zeitlich letzte Aktion rückgängig', () => {
    const { result } = renderHook(() => useDrawing());

    act(() => { result.current.loadScene([player('h1', 2, 10)], []); });
    act(() => { result.current.movePlayer('h1', 5, 12); });
    act(() => { result.current.addArrowElement('pass', 0, 0, 1, 1); });

    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 5, y: 12 });
    expect(result.current.elements).toHaveLength(1);

    // Erstes undo: die zuletzt gepushte Aktion (Pfeil) rückgängig, Spieler bleibt verschoben
    act(() => { result.current.undo(); });
    expect(result.current.elements).toHaveLength(0);
    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 5, y: 12 });

    // Zweites undo: jetzt die Spieler-Verschiebung rückgängig
    act(() => { result.current.undo(); });
    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 2, y: 10 });
    expect(result.current.canUndo).toBe(false);

    // Redo in umgekehrter Reihenfolge: erst Spieler, dann Pfeil
    act(() => { result.current.redo(); });
    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 5, y: 12 });
    expect(result.current.elements).toHaveLength(0);

    act(() => { result.current.redo(); });
    expect(result.current.elements).toHaveLength(1);
  });

  it('jumpHistory() springt über mehrere gemischte Schritte korrekt', () => {
    const { result } = renderHook(() => useDrawing());

    act(() => { result.current.loadScene([player('h1', 0, 0)], []); });
    act(() => { result.current.movePlayer('h1', 1, 1); });
    act(() => { result.current.movePlayer('h1', 2, 2); });
    act(() => { result.current.addArrowElement('shot', 0, 0, 1, 1); });

    act(() => { result.current.jumpHistory(-2); });
    expect(result.current.elements).toHaveLength(0);
    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 1, y: 1 });

    act(() => { result.current.jumpHistory(2); });
    expect(result.current.elements).toHaveLength(1);
    expect(result.current.players.find((p) => p.id === 'h1')).toMatchObject({ x: 2, y: 2 });
  });

  it('loadScene() leert undoStack/redoStack (Frame-Wechsel/Feldtyp-Rescale)', () => {
    const { result } = renderHook(() => useDrawing());

    act(() => { result.current.loadScene([player('h1', 0, 0)], []); });
    act(() => { result.current.movePlayer('h1', 5, 5); });
    expect(result.current.canUndo).toBe(true);

    act(() => { result.current.loadScene([player('h1', 9, 9)], []); });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    expect(result.current.players).toEqual([player('h1', 9, 9)]);
  });

  it('setPlayersRaw (Namensänderung) pusht KEIN Undo', () => {
    const { result } = renderHook(() => useDrawing());

    act(() => { result.current.loadScene([player('h1', 0, 0)], []); });
    act(() => {
      result.current.setPlayersRaw((prev) => prev.map((p) => (p.id === 'h1' ? { ...p, name: 'Max' } : p)));
    });

    expect(result.current.players.find((p) => p.id === 'h1').name).toBe('Max');
    expect(result.current.canUndo).toBe(false);
  });

  it('applyFormation pusht Undo mit Label "formation"', () => {
    const { result } = renderHook(() => useDrawing());

    act(() => { result.current.loadScene([player('h1', 0, 0)], []); });
    act(() => { result.current.applyFormation([player('h1', 3, 3), player('h2', 4, 4)]); });

    expect(result.current.players).toHaveLength(2);
    expect(result.current.undoStack.at(-1).label).toBe('formation');

    act(() => { result.current.undo(); });
    expect(result.current.players).toEqual([player('h1', 0, 0)]);
  });
});
