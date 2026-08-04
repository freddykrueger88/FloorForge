/**
 * FieldToolbar – Globale Feld-Einstellungen (Feldtyp, Positions-Hinweise)
 * (Issue #29 – v0.3.x; Namen ein-/ausblenden nach FieldNamesBar ausgelagert,
 * damit es nicht mehr im Header-Menü untergeht)
 */
import { useTranslation } from 'react-i18next';
import styles from './FieldToolbar.module.css';

export default function FieldToolbar({
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
        className={`${styles.toggleBtn} ${showHints ? styles.active : ''}`}
        onClick={onToggleShowHints}
        aria-pressed={showHints}
        aria-label={t('field.toggleHints')}
        title={t('field.showHints')}
      >
        <span aria-hidden="true">💡</span>
        <span>{t('field.hintsLabel')}</span>
      </button>
    </div>
  );
}
