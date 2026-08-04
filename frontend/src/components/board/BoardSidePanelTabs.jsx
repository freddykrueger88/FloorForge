/**
 * BoardSidePanelTabs – Zeichnen/Lines/Formationen/Export/Notizen als
 * Tab-Leiste unter dem Spielfeld statt als lange Scroll-Liste seitlich
 * daneben (vorher .sidebar in BoardEditorPage – wirkte gedrängt und nahm
 * dem breiten Spielfeld Platz weg).
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BoardSidePanelTabs.module.css';

export default function BoardSidePanelTabs({ tabs }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (tabs.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.tabBar} role="tablist" aria-label={t('boardEditor.tabsAriaLabel')}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`board-tab-${tab.id}`}
            aria-selected={tab.id === active?.id}
            aria-controls={`board-tabpanel-${tab.id}`}
            className={`${styles.tabBtn} ${tab.id === active?.id ? styles.active : ''}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div
        className={styles.tabContent}
        role="tabpanel"
        id={`board-tabpanel-${active?.id}`}
        aria-labelledby={`board-tab-${active?.id}`}
      >
        {active?.content}
      </div>
    </div>
  );
}
