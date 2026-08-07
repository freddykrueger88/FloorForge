/**
 * ShareBoardModal – Board-Sharing verwalten (Issue #51 MVP)
 * Owner-only: Kollaboratoren per E-Mail hinzufügen, Berechtigung
 * ändern, entfernen. Struktur analog NewBoardModal.jsx.
 */
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useBoardCollaborators } from '../../hooks/useBoardCollaborators.js';
import Button from '../common/Button.jsx';
import styles from './ShareBoardModal.module.css';

export default function ShareBoardModal({ boardId, onClose }) {
  const { t } = useTranslation();
  const {
    collaborators, loading, error,
    fetchCollaborators, addCollaborator, updatePermission, removeCollaborator,
  } = useBoardCollaborators();

  const [email,      setEmail     ] = useState('');
  const [permission, setPermission] = useState('read');
  const [adding,     setAdding    ] = useState(false);
  const emailRef = useRef(null);
  const containerRef = useRef(null);

  useFocusTrap(containerRef, { initialFocusRef: emailRef, onEscape: onClose });

  useEffect(() => { fetchCollaborators(boardId).catch(() => {}); }, [boardId, fetchCollaborators]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setAdding(true);
    try {
      await addCollaborator(boardId, { email: trimmed, permission });
      setEmail('');
      setPermission('read');
    } catch { /* error via hook */ } finally {
      setAdding(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-board-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 id="share-board-title" className={styles.modalTitle}>{t('boardShare.title')}</h2>
          <Button variant="ghost" size="sm" iconOnly onClick={onClose} aria-label={t('boardShare.close')}><X size={18} aria-hidden="true" /></Button>
        </header>

        <form className={styles.form} onSubmit={handleAdd}>
          <input
            ref={emailRef}
            type="email"
            className={styles.emailInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('boardShare.emailPlaceholder')}
            aria-label={t('boardShare.emailAriaLabel')}
          />
          <select
            className={styles.permissionSelect}
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            aria-label={t('boardShare.permissionAriaLabel')}
          >
            <option value="read">{t('boardShare.permissionRead')}</option>
            <option value="write">{t('boardShare.permissionWrite')}</option>
          </select>
          <Button type="submit" variant="primary" size="md" disabled={adding || !email.trim()}>
            {adding ? t('boardShare.adding') : t('boardShare.add')}
          </Button>
        </form>
        <p className={styles.hint}>{t('boardShare.inviteHint')}</p>

        {error && <p className={styles.errorMsg} role="alert"><AlertTriangle size={16} aria-hidden="true" /> {error}</p>}

        {loading && collaborators.length === 0 ? (
          <p className={styles.hint}>{t('boardShare.loading')}</p>
        ) : collaborators.length === 0 ? (
          <p className={styles.hint}>{t('boardShare.noCollaborators')}</p>
        ) : (
          <ul className={styles.list} role="list">
            {collaborators.map((c) => (
              <li key={c._id} className={styles.row}>
                <span className={styles.rowEmail}>
                  {c.email}
                  {c.status === 'invited' && (
                    <span className={styles.pendingBadge}>{t('boardShare.pendingBadge')}</span>
                  )}
                </span>
                <select
                  className={styles.rowPermissionSelect}
                  value={c.permission}
                  onChange={(e) => updatePermission(boardId, c._id, e.target.value)}
                  aria-label={t('boardShare.rowPermissionAriaLabel', { email: c.email })}
                >
                  <option value="read">{t('boardShare.permissionRead')}</option>
                  <option value="write">{t('boardShare.permissionWrite')}</option>
                </select>
                <Button
                  variant="danger"
                  size="sm"
                  iconOnly
                  className={styles.removeBtn}
                  onClick={() => removeCollaborator(boardId, c._id)}
                  aria-label={t('boardShare.removeAriaLabel', { email: c.email })}
                  title={t('boardShare.removeTitle')}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
