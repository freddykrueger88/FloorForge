/**
 * AiTacticAssistantModal – KI-Taktikassistent (EPIC 010, AI_SYSTEM.md
 * §5.2 MVP). Drei Zustände: Formular -> Lade-Zustand -> editierbares
 * Ergebnis. Erzeugt bewusst KEIN Board automatisch – der Trainer
 * prüft/passt den Text an und entscheidet explizit über "Übernehmen"
 * (AI_STRATEGY.md §19). Struktur 1:1 nach Vorbild
 * `components/trainings/AiTrainingPlanModal.jsx`.
 */
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useAiApi } from '../../hooks/useAiApi.js';
import useAnnounceStore from '../../store/announceStore.js';
import Button from '../common/Button.jsx';
import styles from './AiTacticAssistantModal.module.css';

const CATEGORIES = ['Forechecking', 'Powerplay', 'Boxplay', 'Allgemein'];

export default function AiTacticAssistantModal({ onClose, onCreate, creating }) {
  const { t } = useTranslation();
  const { loading, error, generateTacticSuggestion } = useAiApi();
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onClose });

  const [category, setCategory] = useState('Forechecking');
  const [question,  setQuestion ] = useState('');

  const [result,       setResult      ] = useState(null); // { suggestionText, model }
  const [suggestionText, setSuggestionText] = useState('');
  const [boardName,    setBoardName   ] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const data = await generateTacticSuggestion({ category, question: question.trim() });
      setResult(data);
      setSuggestionText(data.suggestionText);
      setBoardName(`Taktik: ${category} – ${question.trim()}`.slice(0, 80));
      useAnnounceStore.getState().announce(t('ai.resultDisclaimer'));
    } catch { /* error via hook */ }
  };

  const handleUseAsBoard = () => {
    onCreate({ name: boardName.trim() || `Taktik: ${category}`, category: 'taktik', notes: suggestionText });
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-tactic-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 id="ai-tactic-title" className={styles.modalTitle}>
            <Sparkles size={20} aria-hidden="true" /> {t('ai.tacticFormTitle')}
          </h2>
        </header>

        {!result ? (
          <form className={styles.form} onSubmit={handleGenerate}>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.tacticCategoryLabel')}</span>
              <select className={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.tacticQuestionLabel')}</span>
              <input
                className={styles.input}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t('ai.tacticQuestionPlaceholder')}
                maxLength={300}
                required
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
              <span className={styles.label}>{t('dialogs.newBoard.nameLabel')}</span>
              <input
                className={styles.input}
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder={t('ai.boardNamePlaceholder')}
                maxLength={80}
              />
            </label>
            <textarea
              className={styles.textarea}
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              rows={14}
            />
            <div className={styles.actions}>
              <Button type="button" variant="secondary" size="md" className={styles.cancelBtn} onClick={onClose} disabled={creating}>
                {t('ai.discard')}
              </Button>
              <Button type="button" variant="primary" size="md" className={styles.confirmBtn} onClick={handleUseAsBoard} disabled={creating}>
                {t('ai.useAsTacticBoard')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
