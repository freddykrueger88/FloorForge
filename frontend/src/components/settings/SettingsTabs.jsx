/**
 * SettingsTabs – Tab-Leiste für die Einstellungsseite (UI/UX-Audit,
 * Stufe 3): ersetzt die vorherige "alle Bereiche untereinander +
 * Anker-Sidebar zum Hinscrollen"-Seite durch echte Tabs – immer nur EIN
 * Bereich sichtbar statt einer langen Wand aus Formularen
 * (Progressive Disclosure). Bewusst eine eigene, einfachere Komponente
 * statt Wiederverwendung von board/BoardSidePanelTabs.jsx – die ist auf
 * die einklappbare Board-Editor-Situation zugeschnitten (Fokus soll auf
 * dem Feld bleiben), hier ist die Tab-Leiste dagegen die ganze Seite.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SettingsTabs.module.css';

export default function SettingsTabs({ tabs }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (tabs.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.tabBarEdge}>
        <div className={styles.tabBar} role="tablist" aria-label={t('settings.nav.categories')}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`settings-tab-${tab.id}`}
              aria-selected={tab.id === active?.id}
              aria-controls={`settings-tabpanel-${tab.id}`}
              className={`${styles.tabBtn} ${tab.id === active?.id ? styles.active : ''}`}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className={styles.tabContent}
        role="tabpanel"
        id={`settings-tabpanel-${active?.id}`}
        aria-labelledby={`settings-tab-${active?.id}`}
      >
        {active?.content}
      </div>
    </div>
  );
}
