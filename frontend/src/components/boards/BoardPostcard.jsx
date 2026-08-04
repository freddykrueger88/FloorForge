/**
 * BoardPostcard – Postkarten-Ansicht eines Boards in der Galerie
 * (Issue #30 – v0.3.x)
 *
 * Links: statische Spielfeld-Miniatur (hochkant, readonly)
 * Rechts: Board-Name, Notizen (reiner Lesetext), Metadaten
 *
 * WICHTIG: Notizen sind hier NUR LESBAR. Bearbeitung erfolgt ausschließlich
 * innerhalb der geöffneten Board-Ansicht (NotesPanel).
 */
import { useTranslation } from 'react-i18next';
import FieldMiniature from '../field/FieldMiniature.jsx';
import { FIELD_TYPE_LABELS } from '../../constants/fieldConfig.js';
import { formatDate } from '../../utils/formatDate.js';
import styles from './BoardPostcard.module.css';

export default function BoardPostcard({ board, onClick, playbooks, onChangePlaybook }) {
  const { t } = useTranslation();
  const hasNotes = board.notes && board.notes.trim().length > 0;
  const isOwner = (board.accessLevel ?? 'owner') === 'owner';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      className={styles.card}
      role="article"
      aria-label={t('boardPostcard.ariaLabel', { name: board.name })}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {/* Links: Spielfeld-Miniatur (readonly, hochkant) */}
      <div className={styles.thumbWrap}>
        <FieldMiniature
          fieldType={board.fieldType}
          theme={board.theme}
          width={140}
          height={200}
        />
      </div>

      {/* Rechts: Infos */}
      <div className={styles.info}>
        <h3 className={styles.name}>{board.name}</h3>

        <p className={hasNotes ? styles.notes : styles.notesEmpty}>
          {hasNotes ? board.notes : t('boardPostcard.noNotes')}
        </p>

        <div className={styles.meta}>
          <span className={styles.badge}>
            {FIELD_TYPE_LABELS[board.fieldType] ?? board.fieldType}
          </span>
          <span className={styles.date}>📅 {formatDate(board.updatedAt)}</span>
          {!isOwner && (
            <span className={styles.badge}>
              {board.accessLevel === 'write' ? `✏️ ${t('boardShare.writeBadge')}` : `👁 ${t('boardShare.readonlyBadge')}`}
            </span>
          )}
          <span className={styles.colorChips} aria-hidden="true">
            <span className={styles.chip} style={{ background: board.homeColor ?? '#1d4ed8' }} title={t('teams.home')} />
            <span className={styles.chip} style={{ background: board.awayColor ?? '#dc2626' }} title={t('teams.away')} />
          </span>
        </div>

        {/* Playbook-Zuordnung (Issue #52, nur Owner) */}
        {playbooks && isOwner && (
          <select
            className={styles.playbookSelect}
            value={board.playbookId ?? ''}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(e) => { e.stopPropagation(); onChangePlaybook(e.target.value || null); }}
            aria-label={t('playbooks.assignLabel')}
          >
            <option value="">{t('playbooks.noPlaybook')}</option>
            {playbooks.map((pb) => (
              <option key={pb._id} value={pb._id}>{pb.name}</option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}
