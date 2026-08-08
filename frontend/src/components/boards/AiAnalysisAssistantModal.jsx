/**
 * AiAnalysisAssistantModal – KI-Analyseassistent (EPIC 010, AI_SYSTEM.md
 * §5.3 MVP). Drei Zustände: Formular -> Lade-Zustand -> editierbares
 * Ergebnis. Erzeugt bewusst KEIN Board automatisch – der Trainer
 * prüft/passt den Text an und entscheidet explizit über "Übernehmen"
 * (AI_STRATEGY.md §19). Sichtbarer Datenschutz-Hinweis direkt unter dem
 * Beobachtungsfeld (nicht nur Placeholder, da dieser beim Tippen
 * verschwindet) – Beobachtungen sind Freitext und können sonst leicht
 * Namen/Personendaten enthalten.
 */
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, AlertTriangle, Info } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useAiApi } from '../../hooks/useAiApi.js';
import useAnnounceStore from '../../store/announceStore.js';
import Button from '../common/Button.jsx';
import styles from './AiTacticAssistantModal.module.css';

export default function AiAnalysisAssistantModal({ onClose, onCreate, creating }) {
  const { t } = useTranslation();
  const { loading, error, generateAnalysis } = useAiApi();
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onClose });

  const [observations, setObservations] = useState('');
  const [focus,          setFocus        ] = useState('');

  const [result,        setResult       ] = useState(null); // { analysisText, model }
  const [analysisText,  setAnalysisText ] = useState('');
  const [boardName,     setBoardName    ] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const data = await generateAnalysis({ observations: observations.trim(), focus: focus.trim() });
      setResult(data);
      setAnalysisText(data.analysisText);
      const date = new Date().toLocaleDateString();
      setBoardName(`Analyse – ${date}`);
      useAnnounceStore.getState().announce(t('ai.resultDisclaimer'));
    } catch { /* error via hook */ }
  };

  const handleUseAsBoard = () => {
    onCreate({ name: boardName.trim() || 'Analyse', category: 'spielverstaendnis', notes: analysisText });
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-analysis-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 id="ai-analysis-title" className={styles.modalTitle}>
            <Sparkles size={20} aria-hidden="true" /> {t('ai.analysisFormTitle')}
          </h2>
        </header>

        {!result ? (
          <form className={styles.form} onSubmit={handleGenerate}>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.observationsLabel')}</span>
              <textarea
                className={styles.textarea}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder={t('ai.observationsPlaceholder')}
                maxLength={2000}
                rows={6}
                required
              />
              <p className={styles.disclaimer}>
                <Info size={16} aria-hidden="true" /> {t('ai.analysisPrivacyHint')}
              </p>
            </label>
            <label className={styles.row}>
              <span className={styles.label}>{t('ai.focusOptionalLabel')}</span>
              <input
                className={styles.input}
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                maxLength={150}
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
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              rows={14}
            />
            <div className={styles.actions}>
              <Button type="button" variant="secondary" size="md" className={styles.cancelBtn} onClick={onClose} disabled={creating}>
                {t('ai.discard')}
              </Button>
              <Button type="button" variant="primary" size="md" className={styles.confirmBtn} onClick={handleUseAsBoard} disabled={creating}>
                {t('ai.useAsAnalysisBoard')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
