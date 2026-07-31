/**
 * FieldContainer – responsiver Wrapper für FloorballField
 * Misst die verfügbare Größe via ResizeObserver und übergibt
 * width/height an FloorballField.
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import FloorballField from './FloorballField.jsx';
import styles from './FieldContainer.module.css';

export default function FieldContainer({
  fieldType = 'large',
  showGrid  = false,
  gridSize  = 1.0,
  theme     = 'dark',
  readonly  = false,
  minHeight = 320,
}) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 500 });

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setSize({
      width:  Math.max(300, clientWidth),
      height: Math.max(minHeight, clientHeight),
    });
  }, [minHeight]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ minHeight }}
      role="region"
      aria-label="Spielfeld-Canvas"
    >
      <FloorballField
        fieldType={fieldType}
        width={size.width}
        height={size.height}
        showGrid={showGrid}
        gridSize={gridSize}
        theme={theme}
        readonly={readonly}
      />
    </div>
  );
}
