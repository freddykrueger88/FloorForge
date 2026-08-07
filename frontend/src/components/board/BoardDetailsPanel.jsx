/**
 * BoardDetailsPanel – Gegner + Übungsbibliothek-Metadaten (ROADMAP Phase 3)
 *
 * War bisher Teil von FieldSettingsPanel.jsx ("Einstellungen"), gehört
 * inhaltlich aber eher zu "worum geht's bei diesem Board" als zu Anzeige-/
 * Verhaltens-Einstellungen – lebt jetzt zusammen mit den Notizen im
 * "Info"-Tab (vormals "Notizen", siehe boardEditor.tabs.info).
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BoardDetailsPanel.module.css';

const CATEGORIES = ['', 'technik', 'taktik', 'kondition', 'spielverstaendnis', 'nachwuchs'];

export default function BoardDetailsPanel({
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

  if (!onChangeOpponent && !onChangeCategory) return null;

  return (
    <section className={styles.panel} aria-label={t('dialogs.newBoard.exerciseDetailsLegend')}>
      {onChangeOpponent && (
        <label className={styles.row}>
          <span className={styles.label}>{t('dialogs.newBoard.opponentLabel')}</span>
          <input
            type="text"
            className={styles.input}
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

          <label className={styles.row}>
            <span className={styles.label}>{t('dialogs.newBoard.categoryLabel')}</span>
            <select
              className={styles.input}
              value={category ?? ''}
              onChange={(e) => onChangeCategory(e.target.value)}
              aria-label={t('dialogs.newBoard.categoryLabel')}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{t(`exerciseCategory.${c || 'none'}`)}</option>
              ))}
            </select>
          </label>

          <label className={styles.row}>
            <span className={styles.label}>{t('dialogs.newBoard.ageGroupLabel')}</span>
            <input
              type="text"
              className={styles.input}
              value={ageGroupDraft}
              onChange={(e) => setAgeGroupDraft(e.target.value)}
              onBlur={commitAgeGroup}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
              placeholder={t('dialogs.newBoard.ageGroupPlaceholder')}
              maxLength={40}
            />
          </label>

          <label className={styles.row}>
            <span className={styles.label}>{t('dialogs.newBoard.goalLabel')}</span>
            <input
              type="text"
              className={styles.input}
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              onBlur={commitGoal}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
              placeholder={t('dialogs.newBoard.goalPlaceholder')}
              maxLength={160}
            />
          </label>

          <label className={styles.row}>
            <span className={styles.label}>{t('dialogs.newBoard.materialLabel')}</span>
            <input
              type="text"
              className={styles.input}
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
    </section>
  );
}
