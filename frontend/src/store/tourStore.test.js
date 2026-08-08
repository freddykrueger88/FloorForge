import { describe, it, expect, beforeEach } from 'vitest';
import useTourStore from './tourStore.js';

describe('useTourStore', () => {
  beforeEach(() => {
    useTourStore.setState({ active: false, stepIndex: 0 });
  });

  it('start() aktiviert die Tour bei Schritt 0', () => {
    useTourStore.getState().start();
    expect(useTourStore.getState()).toMatchObject({ active: true, stepIndex: 0 });
  });

  it('next() erhöht den Schritt-Index', () => {
    useTourStore.getState().start();
    useTourStore.getState().next();
    useTourStore.getState().next();
    expect(useTourStore.getState().stepIndex).toBe(2);
  });

  it('prev() verringert den Schritt-Index, aber nie unter 0', () => {
    useTourStore.getState().start();
    useTourStore.getState().next();
    useTourStore.getState().prev();
    expect(useTourStore.getState().stepIndex).toBe(0);
    useTourStore.getState().prev();
    expect(useTourStore.getState().stepIndex).toBe(0);
  });

  it('skip() deaktiviert die Tour und setzt den Schritt-Index zurück', () => {
    useTourStore.getState().start();
    useTourStore.getState().next();
    useTourStore.getState().skip();
    expect(useTourStore.getState()).toMatchObject({ active: false, stepIndex: 0 });
  });

  it('finish() deaktiviert die Tour und setzt den Schritt-Index zurück', () => {
    useTourStore.getState().start();
    useTourStore.getState().next();
    useTourStore.getState().next();
    useTourStore.getState().finish();
    expect(useTourStore.getState()).toMatchObject({ active: false, stepIndex: 0 });
  });
});
