/**
 * FieldToolbar – Globale Feld-Einstellungen (aktuell: Namen ein-/ausblenden)
 * (Issue #29 – v0.3.x)
 */
import { useTranslation } from 'react-i18next';
import styles from './FieldToolbar.module.css';

export default function FieldToolbar({
  showNames,
  onToggleShowNames,
  namePosition,
  onSetNamePosition,
  fieldType,
  availableFields,
  onRequestFieldTypeChange,
  showHints,
  onToggleShowHints,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.toolbar} role="toolbar" aria-label={t('field.toolbarLabel')}>
      {availableFields && (
        <select
          className={styles.fieldTypeSelect}
          value={fieldType}
          onChange={(e) => onRequestFieldTypeChange(e.target.value)}
          aria-label={t('settings.fieldType')}
          title={t('field.changeFieldType')}
        >
          {availableFields.map((f) => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      )}

      <button
        className={`${styles.toggleBtn} ${showNames ? styles.active : ''}`}
        onClick={onToggleShowNames}
        aria-pressed={showNames}
        aria-label={t('field.toggleNames')}
        title={t('field.showNames')}
      >
        <span aria-hidden="true">{showNames ? '👁' : '🚫'}</span>
        <span>{t('field.namesLabel')}</span>
      </button>

      <button
        className={`${styles.toggleBtn} ${showHints ? styles.active : ''}`}
        onClick={onToggleShowHints}
        aria-pressed={showHints}
        aria-label={t('field.toggleHints')}
        title={t('field.showHints')}
      >
        <span aria-hidden="true">💡</span>
        <span>{t('field.hintsLabel')}</span>
      </button>

      {showNames && (
        <div className={styles.positionGroup} role="radiogroup" aria-label={t('field.namePosition')}>
          <button
            className={`${styles.posBtn} ${namePosition === 'oben' ? styles.active : ''}`}
            onClick={() => onSetNamePosition('oben')}
            role="radio"
            aria-checked={namePosition === 'oben'}
          >
            {t('field.positionTop')}
          </button>
          <button
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
