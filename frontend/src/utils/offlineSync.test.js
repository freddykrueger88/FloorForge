/**
 * offlineSync.test.js – testet nur die reine Konflikt-Entscheidungslogik
 * (ROADMAP Phase 4). syncOfflineQueue() selbst nutzt IndexedDB + fetch()
 * und bleibt bewusst ungetestet (manuell verifiziert) – siehe Kommentar
 * in offlineSync.js zu resolveConflictVerdict().
 */
import { describe, it, expect } from 'vitest';
import { resolveConflictVerdict } from './offlineSync.js';

const boardEntry = (baselineUpdatedAt) => ({
  method: 'PUT',
  baselineUpdatedAt,
  resourceId: null,
});

const frameEntry = (method, resourceId, baselineUpdatedAt) => ({
  method,
  resourceId,
  baselineUpdatedAt,
});

describe('resolveConflictVerdict', () => {
  it('meldet "resolved" für ein DELETE auf eine bereits gelöschte Ressource (404)', () => {
    const entry = { ...boardEntry('2026-01-01T00:00:00Z'), method: 'DELETE' };
    expect(resolveConflictVerdict({ status: 404, data: null }, entry)).toBe('resolved');
  });

  it('meldet "conflict" für ein PUT auf eine bereits gelöschte Ressource (404)', () => {
    const entry = boardEntry('2026-01-01T00:00:00Z');
    expect(resolveConflictVerdict({ status: 404, data: null }, entry)).toBe('conflict');
  });

  it('meldet "ok" für ein Board, dessen updatedAt seit dem Enqueuen unverändert ist', () => {
    const entry = boardEntry('2026-01-01T00:00:00Z');
    const data = { _id: 'board-1', updatedAt: '2026-01-01T00:00:00Z' };
    expect(resolveConflictVerdict({ status: 200, data }, entry)).toBe('ok');
  });

  it('meldet "conflict" für ein Board, dessen updatedAt sich geändert hat', () => {
    const entry = boardEntry('2026-01-01T00:00:00Z');
    const data = { _id: 'board-1', updatedAt: '2026-01-01T00:05:00Z' };
    expect(resolveConflictVerdict({ status: 200, data }, entry)).toBe('conflict');
  });

  it('meldet "ok" für ein Frame in der Liste, dessen updatedAt unverändert ist', () => {
    const entry = frameEntry('PUT', 'frame-2', '2026-01-01T00:00:00Z');
    const data = [
      { _id: 'frame-1', updatedAt: '2026-01-01T00:00:00Z' },
      { _id: 'frame-2', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    expect(resolveConflictVerdict({ status: 200, data }, entry)).toBe('ok');
  });

  it('meldet "conflict" für ein Frame in der Liste, dessen updatedAt sich geändert hat', () => {
    const entry = frameEntry('PUT', 'frame-2', '2026-01-01T00:00:00Z');
    const data = [
      { _id: 'frame-1', updatedAt: '2026-01-01T00:00:00Z' },
      { _id: 'frame-2', updatedAt: '2026-01-01T00:05:00Z' },
    ];
    expect(resolveConflictVerdict({ status: 200, data }, entry)).toBe('conflict');
  });

  it('meldet "resolved" für ein DELETE auf ein Frame, das nicht mehr in der Liste ist', () => {
    const entry = frameEntry('DELETE', 'frame-2', '2026-01-01T00:00:00Z');
    const data = [{ _id: 'frame-1', updatedAt: '2026-01-01T00:00:00Z' }];
    expect(resolveConflictVerdict({ status: 200, data }, entry)).toBe('resolved');
  });

  it('meldet "conflict" für ein PUT auf ein Frame, das nicht mehr in der Liste ist', () => {
    const entry = frameEntry('PUT', 'frame-2', '2026-01-01T00:00:00Z');
    const data = [{ _id: 'frame-1', updatedAt: '2026-01-01T00:00:00Z' }];
    expect(resolveConflictVerdict({ status: 200, data }, entry)).toBe('conflict');
  });
});
