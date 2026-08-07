import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from './useDocumentTitle.js';

describe('useDocumentTitle', () => {
  beforeEach(() => { document.title = 'OpenFloorball'; });

  it('setzt den Tab-Titel mit dem Marken-Suffix', () => {
    renderHook(() => useDocumentTitle('Mein Board'));
    expect(document.title).toBe('Mein Board – OpenFloorball');
  });

  it('stellt beim Unmounten den vorherigen Titel wieder her', () => {
    document.title = 'Vorheriger Titel';
    const { unmount } = renderHook(() => useDocumentTitle('Mein Board'));
    expect(document.title).toBe('Mein Board – OpenFloorball');
    unmount();
    expect(document.title).toBe('Vorheriger Titel');
  });

  it('lässt den Titel unverändert, solange kein Wert übergeben wird', () => {
    document.title = 'OpenFloorball';
    renderHook(() => useDocumentTitle(null));
    expect(document.title).toBe('OpenFloorball');
  });
});
