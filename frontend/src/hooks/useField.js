/**
 * useField – State-Management für ein einzelnes Board/Spielfeld
 * Verwaltet: Spielertyp, Grid-Einstellungen, Zoom
 */
import { useState, useCallback } from 'react';
import { IFF_FIELDS, GRID_SIZES } from '../constants/fieldConfig.js';

export function useField(initialFieldType = 'large') {
  const [fieldType, setFieldType]   = useState(initialFieldType);
  const [showGrid,  setShowGrid]    = useState(false);
  const [gridSize,  setGridSize]    = useState(1.0);
  const [zoom,      setZoom]        = useState(1.0);

  const field = IFF_FIELDS[fieldType] ?? IFF_FIELDS.large;

  const toggleGrid = useCallback(() => setShowGrid((v) => !v), []);

  const cycleGridSize = useCallback(() => {
    const sizes = GRID_SIZES.map((g) => g.value);
    const idx   = sizes.indexOf(gridSize);
    setGridSize(sizes[(idx + 1) % sizes.length]);
  }, [gridSize]);

  const resetZoom = useCallback(() => setZoom(1.0), []);

  return {
    field,
    fieldType, setFieldType,
    showGrid,  setShowGrid,  toggleGrid,
    gridSize,  setGridSize,  cycleGridSize,
    zoom,      setZoom,      resetZoom,
    availableFields: Object.values(IFF_FIELDS),
  };
}
