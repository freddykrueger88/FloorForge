/**
 * DrawingCoordinatesForm – Tastatur-Alternative zum Ziehen mit der Maus
 * (Issue #38 – WCAG 2.1.1 Keyboard). Nur sichtbar bei aktivem Zeichen-
 * Werkzeug (move/pass/shot/freehand) – select/eraser sind reine
 * Klick-Werkzeuge und nicht Teil dieses Formulars.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DrawingCoordinatesForm.module.css';

const ARROW_TOOLS = ['move', 'pass', 'shot'];

export default function DrawingCoordinatesForm({ activeTool, field, onAddArrow, onAddFreehand }) {
  const { t } = useTranslation();
  const maxX = field?.width ?? 40;
  const maxY = field?.height ?? 20;

  const [x1, setX1] = useState('');
  const [y1, setY1] = useState('');
  const [x2, setX2] = useState('');
  const [y2, setY2] = useState('');

  const [points, setPoints] = useState([]);
  const [pointX, setPointX] = useState('');
  const [pointY, setPointY] = useState('');

  if (!ARROW_TOOLS.includes(activeTool) && activeTool !== 'freehand') return null;

  const handleAddArrow = (e) => {
    e.preventDefault();
    const nx1 = parseFloat(x1), ny1 = parseFloat(y1), nx2 = parseFloat(x2), ny2 = parseFloat(y2);
    if ([nx1, ny1, nx2, ny2].some(Number.isNaN)) return;
    onAddArrow(activeTool, nx1, ny1, nx2, ny2);
    setX1(''); setY1(''); setX2(''); setY2('');
  };

  const handleAddPoint = (e) => {
    e.preventDefault();
    const nx = parseFloat(pointX), ny = parseFloat(pointY);
    if (Number.isNaN(nx) || Number.isNaN(ny)) return;
    setPoints((prev) => [...prev, [nx, ny]]);
    setPointX(''); setPointY('');
  };

  const handleRemovePoint = (index) => {
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveFreehand = () => {
    if (points.length < 2) return;
    onAddFreehand(points.flat());
    setPoints([]);
  };

  return (
    <section className={styles.panel} aria-label={t('drawing.coordinatesTitle')}>
      <h3 className={styles.title}>{t('drawing.coordinatesTitle')}</h3>
      <p className={styles.hint}>{t('drawing.coordinatesHint')}</p>

      {ARROW_TOOLS.includes(activeTool) ? (
        <form className={styles.form} onSubmit={handleAddArrow}>
          <div className={styles.row}>
            <label className={styles.field} htmlFor="coord-x1">
              {t('drawing.startX')}
              <input id="coord-x1" type="number" step="0.1" min={0} max={maxX} value={x1} onChange={(e) => setX1(e.target.value)} required />
            </label>
            <label className={styles.field} htmlFor="coord-y1">
              {t('drawing.startY')}
              <input id="coord-y1" type="number" step="0.1" min={0} max={maxY} value={y1} onChange={(e) => setY1(e.target.value)} required />
            </label>
          </div>
          <div className={styles.row}>
            <label className={styles.field} htmlFor="coord-x2">
              {t('drawing.endX')}
              <input id="coord-x2" type="number" step="0.1" min={0} max={maxX} value={x2} onChange={(e) => setX2(e.target.value)} required />
            </label>
            <label className={styles.field} htmlFor="coord-y2">
              {t('drawing.endY')}
              <input id="coord-y2" type="number" step="0.1" min={0} max={maxY} value={y2} onChange={(e) => setY2(e.target.value)} required />
            </label>
          </div>
          <button type="submit" className={styles.addBtn}>{t('drawing.addArrow')}</button>
        </form>
      ) : (
        <div className={styles.form}>
          {points.length > 0 && (
            <ul className={styles.pointList} aria-label={t('drawing.pointList')}>
              {points.map(([px, py], i) => (
                <li key={i} className={styles.pointItem}>
                  <span>{px.toFixed(1)} / {py.toFixed(1)}</span>
                  <button type="button" className={styles.removeBtn} onClick={() => handleRemovePoint(i)} aria-label={t('drawing.removePoint')}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form className={styles.row} onSubmit={handleAddPoint}>
            <label className={styles.field} htmlFor="coord-point-x">
              {t('drawing.freehandPointX')}
              <input id="coord-point-x" type="number" step="0.1" min={0} max={maxX} value={pointX} onChange={(e) => setPointX(e.target.value)} required />
            </label>
            <label className={styles.field} htmlFor="coord-point-y">
              {t('drawing.freehandPointY')}
              <input id="coord-point-y" type="number" step="0.1" min={0} max={maxY} value={pointY} onChange={(e) => setPointY(e.target.value)} required />
            </label>
            <button type="submit" className={styles.addBtn}>{t('drawing.addPoint')}</button>
          </form>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSaveFreehand}
            disabled={points.length < 2}
          >
            {t('drawing.saveFreehand')}
          </button>
        </div>
      )}
    </section>
  );
}
