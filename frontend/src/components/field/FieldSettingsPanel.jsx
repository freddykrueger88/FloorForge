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
  category,
  onChangeCategory,
  ageGroup,
  onChangeAgeGroup,
  goal,
  onChangeGoal,
  material,
  onChangeMaterial,
}) {
  const { t } = useTranslation();
  const [opponentDraft, setOpponentDraft] = useState(opponent ?? '');
  const [ageGroupDraft, setAgeGroupDraft] = useState(ageGroup ?? '');
  const [goalDraft,     setGoalDraft    ] = useState(goal ?? '');
  const [materialDraft, setMaterialDraft] = useState(material ?? '');

  useEffect(() => setOpponentDraft(opponent ?? ''), [opponent]);
  useEffect(() => setAgeGroupDraft(ageGroup ?? ''), [ageGroup]);
  useEffect(() => setGoalDraft(goal ?? ''), [goal]);
  useEffect(() => setMaterialDraft(material ?? ''), [material]);

  const commitOpponent = () => {
    const trimmed = opponentDraft.trim();
    if (trimmed !== (opponent ?? '')) onChangeOpponent?.(trimmed);
  };

  const commitAgeGroup = () => {
    const trimmed = ageGroupDraft.trim();
    if (trimmed !== (ageGroup ?? '')) onChangeAgeGroup?.(trimmed);
  };

  const commitGoal = () => {
    const trimmed = goalDraft.trim();
    if (trimmed !== (goal ?? '')) onChangeGoal?.(trimmed);
  };

  const commitMaterial = () => {
    const trimmed = materialDraft.trim();
    if (trimmed !== (material ?? '')) onChangeMaterial?.(trimmed);
  };

  const CATEGORIES = ['', 'technik', 'taktik', 'kondition', 'spielverstaendnis', 'nachwuchs'];

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

      {onChangeCategory && (
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{t('dialogs.newBoard.exerciseDetailsLegend')}</legend>

          <label className={styles.fieldTypeRow}>
            <span>{t('dialogs.newBoard.categoryLabel')}</span>
            <select
              className={styles.fieldTypeSelect}
              value={category ?? ''}
              onChange={(e) => onChangeCategory(e.target.value)}
              aria-label={t('dialogs.newBoard.categoryLabel')}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{t(`exerciseCategory.${c || 'none'}`)}</option>
              ))}
            </select>
          </label>

          <label className={styles.fieldTypeRow}>
            <span>{t('dialogs.newBoard.ageGroupLabel')}</span>
            <input
              type="text"
              className={styles.opponentInput}
              value={ageGroupDraft}
              onChange={(e) => setAgeGroupDraft(e.target.value)}
              onBlur={commitAgeGroup}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
              placeholder={t('dialogs.newBoard.ageGroupPlaceholder')}
              maxLength={40}
            />
          </label>

          <label className={styles.fieldTypeRow}>
            <span>{t('dialogs.newBoard.goalLabel')}</span>
            <input
              type="text"
              className={styles.opponentInput}
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              onBlur={commitGoal}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
              placeholder={t('dialogs.newBoard.goalPlaceholder')}
              maxLength={160}
            />
          </label>

          <label className={styles.fieldTypeRow}>
            <span>{t('dialogs.newBoard.materialLabel')}</span>
            <input
              type="text"
              className={styles.opponentInput}
              value={materialDraft}
              onChange={(e) => setMaterialDraft(e.target.value)}
              onBlur={commitMaterial}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
              placeholder={t('dialogs.newBoard.materialPlaceholder')}
              maxLength={160}
            />
          </label>
        </fieldset>
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
