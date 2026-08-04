/**
 * StatsWidget – Kompakte Übersicht genutzter Feldtypen/Line-Typen
 * (Issue #50). Lädt selbstständig /api/user/stats, zeigt nichts, solange
 * noch keine Boards existieren (kein leerer Balken-Ballast für neue
 * Nutzer).
 */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../../utils/apiFetch.js';
import { FIELD_TYPE_LABELS } from '../../constants/fieldConfig.js';
import styles from './StatsWidget.module.css';

const LINE_TYPE_KEYS = { offense: 'lines.typeOffense', defense: 'lines.typeDefense', special: 'lines.typeSpecial' };

function Bar({ label, count, max }) {
  const pct = max > 0 ? Math.max(4, Math.round((count / max) * 100)) : 0;
  return (
    <li className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.barTrack}>
        <span className={styles.barFill} style={{ width: `${pct}%` }} />
      </span>
      <span className={styles.count}>{count}</span>
    </li>
  );
}

export default function StatsWidget() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch('/api/user/stats').then(setStats).catch(() => {});
  }, []);

  if (!stats || stats.totalBoards === 0) return null;

  const fieldEntries = Object.entries(stats.fieldTypeCounts).filter(([, c]) => c > 0);
  const lineEntries = Object.entries(stats.lineTypeCounts).filter(([, c]) => c > 0);
  const maxField = Math.max(...fieldEntries.map(([, c]) => c), 1);
  const maxLine = Math.max(...lineEntries.map(([, c]) => c), 1);

  return (
    <section className={styles.widget} aria-label={t('dashboardStats.title')}>
      <h2 className={styles.title}>{t('dashboardStats.title')}</h2>

      <div className={styles.groups}>
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>{t('dashboardStats.fieldTypesTitle', { count: stats.totalBoards })}</h3>
          <ul className={styles.list}>
            {fieldEntries.map(([type, count]) => (
              <Bar key={type} label={FIELD_TYPE_LABELS[type] ?? type} count={count} max={maxField} />
            ))}
          </ul>
        </div>

        {lineEntries.length > 0 && (
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>{t('dashboardStats.lineTypesTitle', { count: stats.totalLines })}</h3>
            <ul className={styles.list}>
              {lineEntries.map(([type, count]) => (
                <Bar key={type} label={t(LINE_TYPE_KEYS[type] ?? type)} count={count} max={maxLine} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
