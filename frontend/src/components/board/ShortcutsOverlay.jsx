/**
 * ShortcutsOverlay – Übersicht aller Tastaturkürzel im Board-Editor
 * (Issue #47). Öffnet sich per "?"-Taste (BoardEditorPage.jsx) oder über
 * den Hilfe-Button im Header.
 */
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import Button from '../common/Button.jsx';
import styles from './ShortcutsOverlay.module.css';

const GROUPS = [
  {
    titleKey: 'shortcuts.groupTools',
    items: [
      { keys: ['M'], labelKey: 'shortcuts.toolMove' },
      { keys: ['P'], labelKey: 'shortcuts.toolPass' },
      { keys: ['S'], labelKey: 'shortcuts.toolShot' },
      { keys: ['F'], labelKey: 'shortcuts.toolFreehand' },
      { keys: ['E'], labelKey: 'shortcuts.toolEraser' },
      { keys: ['Esc'], labelKey: 'shortcuts.toolSelect' },
    ],
  },
  {
    titleKey: 'shortcuts.groupEdit',
    items: [
      { keys: ['Ctrl', 'Z'], labelKey: 'shortcuts.undo' },
      { keys: ['Ctrl', 'Y'], labelKey: 'shortcuts.redo' },
      { keys: ['Entf'], labelKey: 'shortcuts.deleteElement' },
    ],
  },
  {
    titleKey: 'shortcuts.groupPlayers',
    items: [
      { keys: ['↑', '↓', '←', '→'], labelKey: 'shortcuts.movePlayer' },
      { keys: ['Esc'], labelKey: 'shortcuts.deselectPlayer' },
    ],
  },
  {
    titleKey: 'shortcuts.groupPlayback',
    items: [
      { keys: ['Leertaste'], labelKey: 'shortcuts.playPause' },
      { keys: ['←', '→'], labelKey: 'shortcuts.prevNextFrame' },
    ],
  },
];

export default function ShortcutsOverlay({ onClose }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onClose });

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 id="shortcuts-title" className={styles.modalTitle}>{t('shortcuts.title')}</h2>
          <Button variant="ghost" size="sm" iconOnly onClick={onClose} aria-label={t('shortcuts.close')}><X size={18} aria-hidden="true" /></Button>
        </header>

        <div className={styles.content}>
          {GROUPS.map((group) => (
            <section key={group.titleKey} className={styles.group}>
              <h3 className={styles.groupTitle}>{t(group.titleKey)}</h3>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item.labelKey} className={styles.row}>
                    <span className={styles.keys}>
                      {item.keys.map((k) => <kbd key={k} className={styles.kbd}>{k}</kbd>)}
                    </span>
                    <span className={styles.label}>{t(item.labelKey)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
