/**
 * TrainingSessionCard – Kachel für eine Trainingseinheit in der Übersicht
 * (Issue #45). Analog BoardCard.jsx: Name editierbar per Doppelklick.
 */
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TrainingSessionCard.module.css';

export default function TrainingSessionCard({ session, teamName, onClick, onRename, onDelete }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [name,    setName   ] = useState(session.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commitRename = () => {
    setEditing(false);
    const trimmed = name.trim();
    if (!trimmed) { setName(session.name); return; }
    if (trimmed !== session.name) onRename(trimmed);
  };

  return (
    <article className={styles.card} aria-label={t('trainings.cardAriaLabel', { name: session.name })}>
      <button
        className={styles.openBtn}
        onClick={onClick}
        aria-label={t('trainings.openAriaLabel', { name: session.name })}
      >
        <span className={styles.icon} aria-hidden="true">📋</span>
        <span className={styles.stats}>
          {t('trainings.itemCount', { count: session.itemCount })}
          {session.itemCount > 0 && ` · ${t('trainings.totalMinutes', { count: session.totalMinutes })}`}
        </span>
        {teamName && <span className={styles.teamBadge}>{teamName}</span>}
      </button>

      <div className={styles.nameRow}>
        {editing ? (
          <input
            ref={inputRef}
            className={styles.nameInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter')  commitRename();
              if (e.key === 'Escape') { setName(session.name); setEditing(false); }
            }}
            maxLength={80}
            aria-label={t('trainings.renameAriaLabel')}
          />
        ) : (
          <button
            className={styles.nameBtn}
            onDoubleClick={() => setEditing(true)}
            onClick={(e) => e.detail === 2 && setEditing(true)}
            title={t('trainings.renameTitle')}
            aria-label={t('trainings.renameNameAriaLabel', { name: session.name })}
          >
            {session.name}
          </button>
        )}

        <button
          className={styles.deleteBtn}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label={t('trainings.deleteAriaLabel')}
          title={t('trainings.deleteTitle')}
        >
          🗑
        </button>
      </div>
    </article>
  );
}
