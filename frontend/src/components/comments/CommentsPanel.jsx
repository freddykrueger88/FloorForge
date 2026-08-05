/**
 * CommentsPanel – Kommentare auf Boards und Trainingseinheiten (ROADMAP
 * Phase 2). Generisch über resourceKind ('boards' | 'trainings') +
 * resourceId, siehe useComments.js. Bearbeiten/Löschen nur für den
 * eigenen Kommentar – Moderation durch Ressourcen-Owner ist serverseitig
 * bereits möglich (siehe commentsController.deleteComment), aber
 * bewusst (noch) ohne eigene UI in diesem ersten Wurf.
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore.js';
import { useComments } from '../../hooks/useComments.js';
import { formatDate } from '../../utils/formatDate.js';
import styles from './CommentsPanel.module.css';

const MAX_LENGTH = 2000;

export default function CommentsPanel({ resourceKind, resourceId }) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { comments, loading, error, fetchComments, addComment, updateComment, deleteComment } = useComments(resourceKind, resourceId);

  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState('');

  useEffect(() => { fetchComments().catch(() => {}); }, [fetchComments]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    try {
      await addComment(trimmed);
      setDraft('');
    } catch { /* error via hook */ }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditDraft(comment.text);
  };

  const commitEdit = async (commentId) => {
    const trimmed = editDraft.trim();
    if (!trimmed) return;
    try {
      await updateComment(commentId, trimmed);
      setEditingId(null);
    } catch { /* error via hook */ }
  };

  return (
    <section className={styles.panel} aria-label={t('comments.ariaLabel')}>
      <h3 className={styles.heading}>{t('comments.title')}</h3>

      {error && <p className={styles.msgError}>⚠️ {error}</p>}

      {loading && comments.length === 0 ? (
        <p className={styles.hint}>{t('comments.loading')}</p>
      ) : comments.length === 0 ? (
        <p className={styles.hint}>{t('comments.empty')}</p>
      ) : (
        <ul className={styles.list} role="list">
          {comments.map((c) => (
            <li key={c._id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.author}>{c.email}</span>
                <span className={styles.timestamp}>{formatDate(c.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {editingId === c._id ? (
                <div className={styles.editRow}>
                  <textarea
                    className={styles.textarea}
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    maxLength={MAX_LENGTH}
                    rows={2}
                    aria-label={t('comments.editAriaLabel')}
                  />
                  <div className={styles.editActions}>
                    <button className={styles.smallBtn} onClick={() => commitEdit(c._id)}>{t('comments.saveBtn')}</button>
                    <button className={styles.smallBtn} onClick={() => setEditingId(null)}>{t('comments.cancelBtn')}</button>
                  </div>
                </div>
              ) : (
                <p className={styles.text}>{c.text}</p>
              )}

              {c.userId === user?.id && editingId !== c._id && (
                <div className={styles.itemActions}>
                  <button className={styles.smallBtn} onClick={() => startEdit(c)} aria-label={t('comments.editAriaLabel')}>
                    {t('comments.editBtn')}
                  </button>
                  <button className={styles.smallBtnDanger} onClick={() => deleteComment(c._id)} aria-label={t('comments.deleteAriaLabel')}>
                    {t('comments.deleteBtn')}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <form className={styles.addForm} onSubmit={handleAdd}>
        <textarea
          className={styles.textarea}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('comments.placeholder')}
          maxLength={MAX_LENGTH}
          rows={2}
          aria-label={t('comments.placeholder')}
        />
        <button type="submit" className={styles.submitBtn} disabled={!draft.trim()}>
          {t('comments.addBtn')}
        </button>
      </form>
    </section>
  );
}
