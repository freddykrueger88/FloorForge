/**
 * BoardCard – Kachel für ein Spielfeld in der Übersicht
 * Zeigt Name, Typ, Datum – editierbar per Doppelklick
 */
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FIELD_TYPE_LABELS } from '../../constants/fieldConfig.js';
import { formatDate } from '../../utils/formatDate.js';
import styles from './BoardCard.module.css';

export default function BoardCard({ board, onClick, onRename, onDelete, playbooks, onChangePlaybook }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [name,    setName   ] = useState(board.name);
  const inputRef = useRef(null);
  const isOwner = (board.accessLevel ?? 'owner') === 'owner';

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commitRename = () => {
    setEditing(false);
    const trimmed = name.trim();
    if (!trimmed) { setName(board.name); return; }
    if (trimmed !== board.name) onRename(trimmed);
  };

  return (
    <article
      className={styles.card}
      aria-label={t('boardCard.ariaLabel', { name: board.name })}
    >
      {/* Klickbarer Bereich – öffnet das Spielfeld */}
      <button
        className={styles.openBtn}
        onClick={onClick}
        aria-label={t('boardCard.openAriaLabel', { name: board.name })}
      >
        <span className={styles.fieldIcon} aria-hidden="true">🏑</span>
        <span className={styles.fieldType}>{FIELD_TYPE_LABELS[board.fieldType] ?? board.fieldType}</span>
        <span className={styles.date}>{formatDate(board.updatedAt)}</span>
        {board.opponent && (
          <span className={styles.opponentBadge}>{t('boardCard.vsOpponent', { opponent: board.opponent })}</span>
        )}
        {board.category && (
          <span className={styles.opponentBadge}>{t(`exerciseCategory.${board.category}`)}</span>
        )}
        {!isOwner && (
          <span className={styles.accessBadge}>
            {board.accessLevel === 'write' ? `✏️ ${t('boardShare.writeBadge')}` : `👁 ${t('boardShare.readonlyBadge')}`}
          </span>
        )}
      </button>

      {/* Name – Doppelklick zum Umbenennen (nur Owner) */}
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
              if (e.key === 'Escape') { setName(board.name); setEditing(false); }
            }}
            maxLength={80}
            aria-label={t('boardCard.renameAriaLabel')}
          />
        ) : isOwner ? (
          <button
            className={styles.nameBtn}
            onDoubleClick={() => setEditing(true)}
            onClick={(e) => e.detail === 2 && setEditing(true)}
            title={t('boardCard.renameTitle')}
            aria-label={t('boardCard.renameNameAriaLabel', { name: board.name })}
          >
            {board.name}
          </button>
        ) : (
          <span className={styles.nameBtn}>{board.name}</span>
        )}

        {isOwner && (
          <button
            className={styles.deleteBtn}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label={t('boardCard.deleteAriaLabel')}
            title={t('boardCard.deleteTitle')}
          >
            🗑
          </button>
        )}
      </div>

      {/* Playbook-Zuordnung (Issue #52, nur Owner) */}
      {playbooks && isOwner && (
        <div className={styles.playbookRow}>
          <select
            className={styles.playbookSelect}
            value={board.playbookId ?? ''}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => { e.stopPropagation(); onChangePlaybook(e.target.value || null); }}
            aria-label={t('playbooks.assignLabel')}
          >
            <option value="">{t('playbooks.noPlaybook')}</option>
            {playbooks.map((pb) => (
              <option key={pb._id} value={pb._id}>{pb.name}</option>
            ))}
          </select>
        </div>
      )}
    </article>
  );
}
