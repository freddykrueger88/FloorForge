/**
 * HistoryPanel – Sichtbarer Undo/Redo-Verlauf (Issue #48)
 * Toggle-Button + Popover, zeigt vergangene/zukünftige Aktionen und
 * erlaubt, direkt zu einem beliebigen Punkt zu springen statt nur
 * schrittweise vor/zurück.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { History, X } from 'lucide-react';
import { TOOLS } from '../../constants/drawingConfig.js';
import Button from '../common/Button.jsx';
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
      <Button
        variant="secondary"
        size="md"
        iconOnly
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('drawing.historyOpen')}
        title={t('drawing.historyOpen')}
      >
        <History size={18} aria-hidden="true" />
      </Button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label={t('drawing.historyTitle')}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>{t('drawing.historyTitle')}</span>
            <Button variant="ghost" size="sm" iconOnly onClick={() => setOpen(false)} aria-label={t('shortcuts.close')}><X size={18} aria-hidden="true" /></Button>
          </div>

          {isEmpty ? (
            <p className={styles.emptyHint}>{t('drawing.historyEmpty')}</p>
          ) : (
            <ul className={styles.list}>
              {past.map((entry, i) => (
                <li key={`past-${i}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.entryBtn}
                    onClick={() => onJump(-(past.length - 1 - i))}
                  >
                    {actionLabel(t, isDE, entry.label)}
                  </Button>
                </li>
              ))}
              <li className={styles.now} aria-current="true">{t('drawing.historyNow')}</li>
              {future.map((entry, j) => (
                <li key={`future-${j}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.entryBtn}
                    onClick={() => onJump(j + 1)}
                  >
                    {actionLabel(t, isDE, entry.label)}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
