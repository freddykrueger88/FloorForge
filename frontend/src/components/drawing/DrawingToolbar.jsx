/**
 * DrawingToolbar – Kompakte Werkzeug-Leiste
 * Platzierung: links neben dem Spielfeld (vertikal)
 */
import { useTranslation } from 'react-i18next';
import { TOOLS, TOOL_ORDER, DEFAULT_COLORS, STROKE_WIDTHS } from '../../constants/drawingConfig.js';
import styles from './DrawingToolbar.module.css';

export default function DrawingToolbar({
  activeTool,
  setActiveTool,
  activeColor,
  setActiveColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  onClear,
  canUndo = false,
  canRedo = false,
  elementCount = 0,
}) {
  const { i18n } = useTranslation();
  const isDE = !i18n.language?.startsWith('en');

  return (
    <aside
      className={styles.toolbar}
      role="toolbar"
      aria-label="Zeichen-Werkzeuge"
    >
      {/* ── Tools ── */}
      <div className={styles.group} role="radiogroup" aria-label="Werkzeug">
        {TOOL_ORDER.map((key) => {
          const tool = TOOLS[key];
          const label = isDE ? tool.label : (tool.labelEn ?? tool.label);
          return (
            <button
              key={key}
              role="radio"
              aria-checked={activeTool === key}
              className={`${styles.toolBtn} ${activeTool === key ? styles.active : ''}`}
              onClick={() => setActiveTool(key)}
              title={`${label} [${tool.shortcut}]`}
              aria-label={label}
            >
              <span className={styles.icon} aria-hidden="true">{tool.icon}</span>
              <span className={styles.shortcut}>{tool.shortcut}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.divider} role="separator" />

      {/* ── Farben ── */}
      <div className={styles.group} aria-label="Farbe" role="radiogroup">
        {DEFAULT_COLORS.map(({ hex, label }) => (
          <button
            key={hex}
            role="radio"
            aria-checked={activeColor === hex}
            className={`${styles.colorBtn} ${activeColor === hex ? styles.colorActive : ''}`}
            style={{ background: hex }}
            onClick={() => setActiveColor(hex)}
            title={label}
            aria-label={`Farbe: ${label}`}
          />
        ))}
        {/* Custom Color Picker */}
        <label className={styles.colorPickerLabel} title="Eigene Farbe">
          <span aria-hidden="true">🎨</span>
          <input
            type="color"
            className={styles.colorInput}
            value={activeColor}
            onChange={(e) => setActiveColor(e.target.value)}
            aria-label="Eigene Farbe wählen"
          />
        </label>
      </div>

      <div className={styles.divider} role="separator" />

      {/* ── Linienstärke ── */}
      <div className={styles.group} aria-label="Linienstärke" role="radiogroup">
        {STROKE_WIDTHS.map(({ value, label }) => (
          <button
            key={value}
            role="radio"
            aria-checked={strokeWidth === value}
            className={`${styles.strokeBtn} ${strokeWidth === value ? styles.active : ''}`}
            onClick={() => setStrokeWidth(value)}
            title={label}
            aria-label={`Linienstärke: ${label}`}
          >
            <span
              style={{ display: 'block', height: `${Math.min(value * 1.5, 8)}px`, background: 'currentColor', borderRadius: '9999px', width: '24px' }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      <div className={styles.divider} role="separator" />

      {/* ── Aktionen ── */}
      <div className={styles.group}>
        <button
          className={styles.actionBtn}
          onClick={onUndo}
          disabled={!canUndo}
          title="Rückgängig [Strg+Z]"
          aria-label="Rückgängig"
        >↩</button>
        <button
          className={styles.actionBtn}
          onClick={onRedo}
          disabled={!canRedo}
          title="Wiederherstellen [Strg+Y]"
          aria-label="Wiederherstellen"
        >↪</button>
        <button
          className={`${styles.actionBtn} ${styles.clearBtn}`}
          onClick={onClear}
          disabled={elementCount === 0}
          title="Alle Zeichnungen löschen"
          aria-label="Alle Zeichnungen löschen"
        >🗑</button>
      </div>
    </aside>
  );
}
