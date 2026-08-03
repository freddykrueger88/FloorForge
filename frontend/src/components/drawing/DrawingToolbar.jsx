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
  const { t, i18n } = useTranslation();
  const isDE = !i18n.language?.startsWith('en');

  return (
    <aside
      className={styles.toolbar}
      role="toolbar"
      aria-label={t('drawing.toolbarLabel')}
    >
      {/* ── Tools ── */}
      <div className={styles.group} role="radiogroup" aria-label={t('drawing.toolGroupLabel')}>
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
      <div className={styles.group} aria-label={t('drawing.colorGroupLabel')} role="radiogroup">
        {DEFAULT_COLORS.map(({ hex, label, labelEn }) => {
          const colorName = isDE ? label : (labelEn ?? label);
          return (
          <button
            key={hex}
            role="radio"
            aria-checked={activeColor === hex}
            className={`${styles.colorBtn} ${activeColor === hex ? styles.colorActive : ''}`}
            style={{ background: hex }}
            onClick={() => setActiveColor(hex)}
            title={colorName}
            aria-label={t('drawing.colorAriaLabel', { color: colorName })}
          />
          );
        })}
        {/* Custom Color Picker */}
        <label className={styles.colorPickerLabel} title={t('drawing.customColor')}>
          <span aria-hidden="true">🎨</span>
          <input
            type="color"
            className={styles.colorInput}
            value={activeColor}
            onChange={(e) => setActiveColor(e.target.value)}
            aria-label={t('drawing.customColorPick')}
          />
        </label>
      </div>

      <div className={styles.divider} role="separator" />

      {/* ── Linienstärke ── */}
      <div className={styles.group} aria-label={t('drawing.strokeGroupLabel')} role="radiogroup">
        {STROKE_WIDTHS.map(({ value, label, labelEn }) => {
          const widthName = isDE ? label : (labelEn ?? label);
          return (
          <button
            key={value}
            role="radio"
            aria-checked={strokeWidth === value}
            className={`${styles.strokeBtn} ${strokeWidth === value ? styles.active : ''}`}
            onClick={() => setStrokeWidth(value)}
            title={widthName}
            aria-label={t('drawing.strokeAriaLabel', { width: widthName })}
          >
            <span
              style={{ display: 'block', height: `${Math.min(value * 1.5, 8)}px`, background: 'currentColor', borderRadius: '9999px', width: '24px' }}
              aria-hidden="true"
            />
          </button>
          );
        })}
      </div>

      <div className={styles.divider} role="separator" />

      {/* ── Aktionen ── */}
      <div className={styles.group}>
        <button
          className={styles.actionBtn}
          onClick={onUndo}
          disabled={!canUndo}
          title={t('drawing.undoTitle')}
          aria-label={t('drawing.undo')}
        >↩</button>
        <button
          className={styles.actionBtn}
          onClick={onRedo}
          disabled={!canRedo}
          title={t('drawing.redoTitle')}
          aria-label={t('drawing.redo')}
        >↪</button>
        <button
          className={`${styles.actionBtn} ${styles.clearBtn}`}
          onClick={onClear}
          disabled={elementCount === 0}
          title={t('drawing.clearAll')}
          aria-label={t('drawing.clearAll')}
        >🗑</button>
      </div>
    </aside>
  );
}
