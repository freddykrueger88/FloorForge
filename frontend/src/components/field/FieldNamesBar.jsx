/**
 * FieldNamesBar – Namen ein-/ausblenden + Positions-Auswahl
 * (Issue #29, ausgelagert aus FieldToolbar; eingebettet im
 * "Einstellungen"-Tab von BoardSidePanelTabs)
 */
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import styles from './FieldNamesBar.module.css';

export default function FieldNamesBar({
  showNames,
  onToggleShowNames,
  namePosition,
  onSetNamePosition,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.bar} role="toolbar" aria-label={t('field.namesToolbarLabel')}>
      <button
        type="button"
        className={`${styles.toggleBtn} ${showNames ? styles.active : ''}`}
        onClick={onToggleShowNames}
        aria-pressed={showNames}
        aria-label={t('field.toggleNames')}
        title={t('field.showNames')}
      >
        <span aria-hidden="true">{showNames ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}</span>
        <span>{t('field.namesLabel')}</span>
      </button>

      {showNames && (
        <div className={styles.positionGroup} role="radiogroup" aria-label={t('field.namePosition')}>
          <span className={styles.positionLabel}>{t('field.namePosition')}:</span>
          <button
            type="button"
            className={`${styles.posBtn} ${namePosition === 'oben' ? styles.active : ''}`}
            onClick={() => onSetNamePosition('oben')}
            role="radio"
            aria-checked={namePosition === 'oben'}
          >
            {t('field.positionTop')}
          </button>
          <button
            type="button"
            className={`${styles.posBtn} ${namePosition === 'unten' ? styles.active : ''}`}
            onClick={() => onSetNamePosition('unten')}
            role="radio"
            aria-checked={namePosition === 'unten'}
          >
            {t('field.positionBottom')}
          </button>
        </div>
      )}
    </div>
  );
}
