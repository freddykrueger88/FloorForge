/**
 * AiTrainingPlanModal – KI-Trainingsassistent (EPIC 010, AI_SYSTEM.md
 * §5.1 MVP). Drei Zustände: Formular -> Lade-Zustand -> editierbares
 * Ergebnis. Erzeugt bewusst KEINE Trainingseinheit automatisch – der
 * Trainer prüft/passt den Text an und entscheidet explizit über
 * "Übernehmen" (AI_STRATEGY.md §19).
 */
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useAiApi } from '../../hooks/useAiApi.js';
import useAnnounceStore from '../../store/announceStore.js';
import Button from '../common/Button.jsx';
import styles from './AiTrainingPlanModal.module.css';

const AGE_GROUPS = ['U9', 'U11', 'U13', 'U15', 'U17', 'U19', 'Erwachsene'];

export default function AiTrainingPlanModal({ onClose, onCreate, creating }) {
  const { t } = useTranslation();
  const { loading, error, generateTrainingPlan } = useAiApi();
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onClose });

  const [ageGroup,        setAgeGroup       ] = useState('U15');
  const [goal,             setGoal           ] = useState('');
  const [durationMinutes,  setDurationMinutes] = useState(90);
  const [playerCount,      setPlayerCount    ] = useState(14);
  const [focus,            setFocus          ] = useState('');

  const [result,     setResult    ] = useState(null); // { planText, model }
  const [planText,   setPlanText  ] = useState('');
  const [sessionName, setSessionName] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const data = await generateTrainingPlan({
        ageGroup, goal: goal.trim(), durationMinutes, playerCount, focus: focus.trim(),
      });
      setResult(data);
      setPlanText(data.planText);
      setSessionName(`${focus.trim() || goal.trim()} – ${ageGroup}`.slice(0, 80));
      useAnnounceStore.getState().announce(t('ai.resultDisclaimer'));
    } catch { /* error via hook */ }
  };

  const handleUseAsSession = () => {
    onCreate({ name: sessionName.trim() || `${ageGroup} Training`, notes: planText, goal: goal.trim() });
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-training-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 id="ai-training-title" className={styles.modalTitle}>
            <Sparkles size={20} aria-hidden="true" /> {t('ai.formTitle')}
          </h2>
        </header>

        {!result ? (
          <form className={styles.form} onSubmit={handleGenerate}>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.ageGroupLabel')}</span>
              <select className={styles.input} value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                {AGE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.goalLabel')}</span>
              <input
                className={styles.input}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={t('ai.goalPlaceholder')}
                maxLength={150}
                required
              />
            </label>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.focusLabel')}</span>
              <input
                className={styles.input}
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder={t('ai.focusPlaceholder')}
                maxLength={150}
                required
              />
            </label>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.durationLabel')}</span>
              <input
                type="number" min={15} max={180} className={styles.input}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 15)}
              />
            </label>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.playerCountLabel')}</span>
              <input
                type="number" min={1} max={40} className={styles.input}
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value, 10) || 1)}
              />
            </label>

            {error && (
              <p className={styles.errorMsg} role="alert"><AlertTriangle size={16} aria-hidden="true" /> {error}</p>
            )}

            <div className={styles.actions}>
              <Button type="button" variant="secondary" size="md" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                {t('ai.discard')}
              </Button>
              <Button type="submit" variant="primary" size="md" className={styles.confirmBtn} disabled={loading} aria-live="polite">
                {loading ? t('ai.generating') : t('ai.generate')}
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles.result}>
            <p className={styles.disclaimer}>
              <Sparkles size={16} aria-hidden="true" /> {t('ai.resultDisclaimer')} {t('ai.modelLabel', { model: result.model })}
            </p>
            <label className={styles.row}>
              <span className={styles.label}>{t('trainings.nameAriaLabel')}</span>
              <input
                className={styles.input}
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder={t('ai.sessionNamePlaceholder')}
                maxLength={80}
              />
            </label>
            <textarea
              className={styles.textarea}
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              rows={14}
            />
            <div className={styles.actions}>
              <Button type="button" variant="secondary" size="md" className={styles.cancelBtn} onClick={onClose} disabled={creating}>
                {t('ai.discard')}
              </Button>
              <Button type="button" variant="primary" size="md" className={styles.confirmBtn} onClick={handleUseAsSession} disabled={creating}>
                {t('ai.useAsSession')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
