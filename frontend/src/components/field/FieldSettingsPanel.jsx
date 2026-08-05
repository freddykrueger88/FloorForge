/**
 * FieldSettingsPanel – Namen, Positions-Hinweise, Spielfeld-Typ, Board
 * teilen gebündelt im "Einstellungen"-Tab des unteren Menüs. Farben und
 * Tastaturkürzel bleiben bewusst im Header (schnell erreichbar, ohne das
 * Menü aufklappen zu müssen).
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FieldNamesBar from './FieldNamesBar.jsx';
import styles from './FieldSettingsPanel.module.css';

export default function FieldSettingsPanel({
  showNames,
  onToggleShowNames,
  namePosition,
  onSetNamePosition,
  showHints,
  onToggleShowHints,
  fieldType,
  availableFields,
  onRequestFieldTypeChange,
  onOpenShare,
  showShareButton,
  opponent,
  onChangeOpponent,
}) {
  const { t } = useTranslation();
  const [opponentDraft, setOpponentDraft] = useState(opponent ?? '');

  useEffect(() => setOpponentDraft(opponent ?? ''), [opponent]);

  const commitOpponent = () => {
    const trimmed = opponentDraft.trim();
    if (trimmed !== (opponent ?? '')) onChangeOpponent?.(trimmed);
  };

  return (
    <section className={styles.panel} aria-label={t('boardEditor.tabs.settings')}>
      <FieldNamesBar
        showNames={showNames}
        onToggleShowNames={onToggleShowNames}
        namePosition={namePosition}
        onSetNamePosition={onSetNamePosition}
      />

      {onChangeOpponent && (
        <label className={styles.fieldTypeRow}>
          <span>{t('dialogs.newBoard.opponentLabel')}</span>
          <input
            type="text"
            className={styles.opponentInput}
            value={opponentDraft}
            onChange={(e) => setOpponentDraft(e.target.value)}
            onBlur={commitOpponent}
            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
            placeholder={t('dialogs.newBoard.opponentPlaceholder')}
            maxLength={80}
          />
        </label>
      )}

      <button
        type="button"
        className={`${styles.toggleBtn} ${showHints ? styles.active : ''}`}
        onClick={onToggleShowHints}
        aria-pressed={showHints}
        aria-label={t('field.toggleHints')}
        title={t('field.showHints')}
      >
        <span aria-hidden="true">💡</span>
        <span>{t('field.hintsLabel')}</span>
      </button>

      {availableFields && onRequestFieldTypeChange && (
        <label className={styles.fieldTypeRow}>
          <span>{t('settings.fieldType')}</span>
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
        </label>
      )}

      {showShareButton && (
        <button type="button" className={styles.shareBtn} onClick={onOpenShare}>
          <span aria-hidden="true">🤝</span>
          <span>{t('boardShare.openLabel')}</span>
        </button>
      )}
    </section>
  );
}
