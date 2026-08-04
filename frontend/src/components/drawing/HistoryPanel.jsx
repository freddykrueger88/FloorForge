/**
 * HistoryPanel – Sichtbarer Undo/Redo-Verlauf (Issue #48)
 * Toggle-Button + Popover, zeigt vergangene/zukünftige Aktionen und
 * erlaubt, direkt zu einem beliebigen Punkt zu springen statt nur
 * schrittweise vor/zurück.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '../../constants/drawingConfig.js';
import styles from './HistoryPanel.module.css';

function actionLabel(t, isDE, action) {
  const tool = TOOLS[action];
  if (tool) return isDE ? tool.label : (tool.labelEn ?? tool.label);
  return t(`drawing.historyAction_${action}`, t('drawing.historyAction_change'));
}

export default function HistoryPanel({ undoStack = [], redoStack = [], onJump }) {
  const { t, i18n } = useTranslation();
  const isDE = !i18n.language?.startsWith('en');
  const [open, setOpen] = useState(false);

  const past = undoStack;
  const future = [...redoStack].reverse();
  const isEmpty = past.length === 0 && future.length === 0;

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.toggleBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('drawing.historyOpen')}
        title={t('drawing.historyOpen')}
      >
        🕘
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label={t('drawing.historyTitle')}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>{t('drawing.historyTitle')}</span>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label={t('shortcuts.close')}>✕</button>
          </div>

          {isEmpty ? (
            <p className={styles.emptyHint}>{t('drawing.historyEmpty')}</p>
          ) : (
            <ul className={styles.list}>
              {past.map((entry, i) => (
                <li key={`past-${i}`}>
                  <button
                    className={styles.entryBtn}
                    onClick={() => onJump(-(past.length - 1 - i))}
                  >
                    {actionLabel(t, isDE, entry.label)}
                  </button>
                </li>
              ))}
              <li className={styles.now} aria-current="true">{t('drawing.historyNow')}</li>
              {future.map((entry, j) => (
                <li key={`future-${j}`}>
                  <button
                    className={styles.entryBtn}
                    onClick={() => onJump(j + 1)}
                  >
                    {actionLabel(t, isDE, entry.label)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
