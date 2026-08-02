/**
 * FieldToolbar – Globale Feld-Einstellungen (aktuell: Namen ein-/ausblenden)
 * (Issue #29 – v0.3.x)
 */
import styles from './FieldToolbar.module.css';

export default function FieldToolbar({
  showNames,
  onToggleShowNames,
  namePosition,
  onSetNamePosition,
  fieldType,
  availableFields,
  onRequestFieldTypeChange,
}) {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Feld-Einstellungen">
      {availableFields && (
        <select
          className={styles.fieldTypeSelect}
          value={fieldType}
          onChange={(e) => onRequestFieldTypeChange(e.target.value)}
          aria-label="Spielfeld-Typ"
          title="Spielfeld-Typ ändern"
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
        aria-label="Spielernamen ein-/ausblenden"
        title="Namen anzeigen"
      >
        <span aria-hidden="true">{showNames ? '👁' : '🚫'}</span>
        <span>Namen</span>
      </button>

      {showNames && (
        <div className={styles.positionGroup} role="radiogroup" aria-label="Namensposition">
          <button
            className={`${styles.posBtn} ${namePosition === 'oben' ? styles.active : ''}`}
            onClick={() => onSetNamePosition('oben')}
            role="radio"
            aria-checked={namePosition === 'oben'}
          >
            oben
          </button>
          <button
            className={`${styles.posBtn} ${namePosition === 'unten' ? styles.active : ''}`}
            onClick={() => onSetNamePosition('unten')}
            role="radio"
            aria-checked={namePosition === 'unten'}
          >
            unten
          </button>
        </div>
      )}
    </div>
  );
}
