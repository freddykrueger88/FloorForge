/**
 * BoardSidePanelTabs – Zeichnen/Lines/Formationen/Export/Notizen/Einstellungen
 * als Tab-Leiste unter der Frame-Timeline statt als lange Scroll-Liste
 * seitlich neben dem Feld.
 *
 * Standardmäßig eingeklappt (nur die schmale Tab-Leiste sichtbar) – der
 * Fokus soll auf dem Spielfeld bleiben, nicht auf dem Menü darunter.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BoardSidePanelTabs.module.css';

export default function BoardSidePanelTabs({ tabs }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (tabs.length === 0) return null;

  const handleTabClick = (id) => {
    if (expanded && id === activeId) {
      setExpanded(false);
    } else {
      setActiveId(id);
      setExpanded(true);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.tabBar} role="tablist" aria-label={t('boardEditor.tabsAriaLabel')}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`board-tab-${tab.id}`}
            aria-selected={expanded && tab.id === active?.id}
            aria-controls={`board-tabpanel-${tab.id}`}
            className={`${styles.tabBtn} ${expanded && tab.id === active?.id ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
        <button
          type="button"
          className={styles.collapseBtn}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? t('boardEditor.collapsePanel') : t('boardEditor.expandPanel')}
          title={expanded ? t('boardEditor.collapsePanel') : t('boardEditor.expandPanel')}
        >
          <span aria-hidden="true">{expanded ? '▾' : '▴'}</span>
        </button>
      </div>
      {expanded && (
        <div
          className={styles.tabContent}
          role="tabpanel"
          id={`board-tabpanel-${active?.id}`}
          aria-labelledby={`board-tab-${active?.id}`}
        >
          {active?.content}
        </div>
      )}
    </div>
  );
}
