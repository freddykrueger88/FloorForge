import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '../../i18n/i18n.js';
import ErrorBoundary from './ErrorBoundary.jsx';

function Boom() {
  throw new Error('kaputt');
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React loggt gefangene Fehler zusätzlich selbst sehr ausführlich in
    // der Konsole (erwartetes Verhalten) – hier bewusst stummgeschaltet,
    // damit der Testlauf nicht durch Rauschen unübersichtlich wird.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rendert die Kinder normal, wenn kein Fehler auftritt', () => {
    render(<ErrorBoundary><p>Alles gut</p></ErrorBoundary>);
    expect(screen.getByText('Alles gut')).toBeInTheDocument();
  });

  it('fängt einen Rendering-Fehler ab und zeigt die Fallback-UI mit Neu-laden-Button', () => {
    render(<ErrorBoundary><Boom /></ErrorBoundary>);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('Alles gut')).not.toBeInTheDocument();

    const reloadBtn = screen.getByRole('button');
    expect(reloadBtn).toBeInTheDocument();
  });

  it('der Neu-laden-Button löst window.location.reload aus', () => {
    const reload = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', { value: { ...originalLocation, reload }, writable: true });

    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button'));

    expect(reload).toHaveBeenCalled();
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true });
  });
});
