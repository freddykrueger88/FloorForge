/**
 * KnowledgePage – KI-Wissensassistent (EPIC 010, AI_SYSTEM.md §5.4)
 *
 * Anders als die drei anderen KI-Assistenten kein Formular-zu-Entwurf-
 * Modal, sondern eine eigene Seite: reine Frage-Antwort mit Quellen-
 * angaben aus den eigenen Daten dieser Instanz, nichts wird gespeichert
 * oder übernommen. Bleibt in der Navigation sichtbar, auch wenn kein
 * KI-Anbieter konfiguriert ist – die Seite erklärt dann transparent,
 * warum die Funktion inaktiv ist (Explainable AI, keine Dark Patterns),
 * statt einfach zu verschwinden.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Sparkles, Info } from 'lucide-react';
import { useAiApi } from '../hooks/useAiApi.js';
import useAuthStore from '../store/authStore.js';
import Button from '../components/common/Button.jsx';
import styles from './KnowledgePage.module.css';

const SOURCE_TYPE_KEYS = {
  board: 'ai.knowledgeSourceTypeBoard',
  training: 'ai.knowledgeSourceTypeTraining',
  library: 'ai.knowledgeSourceTypeLibrary',
};

const SOURCE_ROUTES = {
  board: (id) => `/board/${id}`,
  training: (id) => `/trainings/${id}`,
};

export default function KnowledgePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { loading, error, fetchStatus, generateKnowledgeAnswer } = useAiApi();

  const [aiStatus, setAiStatus] = useState(null);
  const [question, setQuestion] = useState('');
  const [answers,  setAnswers ] = useState([]); // { id, question, hasMatches, answerText, sources, model, disclaimer }

  useEffect(() => { fetchStatus().then(setAiStatus).catch(() => {}); }, [fetchStatus]);

  const handleAsk = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    try {
      const data = await generateKnowledgeAnswer({ question: trimmed });
      setAnswers((prev) => [{ id: `${Date.now()}`, question: trimmed, ...data }, ...prev]);
      setQuestion('');
    } catch { /* error via hook */ }
  }, [question, generateKnowledgeAnswer]);

  const handleSourceClick = (source) => {
    const buildRoute = SOURCE_ROUTES[source.type];
    if (buildRoute) navigate(buildRoute(source.id));
  };

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('nav.knowledge')}</h1>
          <p className={styles.subtitle}>{t('ai.knowledgeFormTitle')}</p>
        </div>
      </header>

      {aiStatus && !aiStatus.configured && (
        <div className={styles.inactiveCard} role="status">
          <Info size={32} aria-hidden="true" />
          <h2>{t('ai.knowledgeInactiveTitle')}</h2>
          <p>{t('ai.knowledgeInactiveDesc')}</p>
          {user?.role === 'admin' && (
            <Button variant="secondary" size="md" onClick={() => navigate('/settings')}>
              {t('ai.knowledgeInactiveAdminAction')}
            </Button>
          )}
        </div>
      )}

      {aiStatus?.configured && (
        <>
          <form className={styles.askForm} onSubmit={handleAsk}>
            <label className={styles.askLabel} htmlFor="knowledge-question">
              {t('ai.questionLabel')}
            </label>
            <div className={styles.askRow}>
              <input
                id="knowledge-question"
                className={styles.askInput}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t('ai.questionPlaceholder')}
                maxLength={300}
                required
              />
              <Button type="submit" variant="primary" size="md" disabled={loading} aria-live="polite">
                <Sparkles size={16} aria-hidden="true" /> {loading ? t('ai.asking') : t('ai.askButton')}
              </Button>
            </div>
          </form>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertTriangle size={16} aria-hidden="true" /> {error}
            </div>
          )}

          <ul className={styles.answerList} role="list">
            {answers.map((answer) => (
              <li key={answer.id} className={styles.answerCard}>
                <p className={styles.answerQuestion}>{answer.question}</p>

                {!answer.hasMatches ? (
                  <p className={styles.noMatches}>{t('ai.knowledgeNoMatches')}</p>
                ) : (
                  <>
                    <p className={styles.disclaimer}>
                      <Sparkles size={16} aria-hidden="true" /> {answer.disclaimer} {t('ai.modelLabel', { model: answer.model })}
                    </p>
                    <p className={styles.answerText}>{answer.answerText}</p>
                    {answer.sources.length > 0 && (
                      <div className={styles.sources}>
                        <span className={styles.sourcesLabel}>{t('ai.knowledgeSourcesLabel')}</span>
                        <ul className={styles.sourceChips} role="list">
                          {answer.sources.map((source) => {
                            const clickable = Boolean(SOURCE_ROUTES[source.type]);
                            return (
                              <li key={`${source.type}-${source.id}`}>
                                <button
                                  type="button"
                                  className={styles.sourceChip}
                                  onClick={clickable ? () => handleSourceClick(source) : undefined}
                                  disabled={!clickable}
                                >
                                  {t(SOURCE_TYPE_KEYS[source.type])}: {source.name}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
