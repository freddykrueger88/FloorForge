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
import FieldMiniature from '../field/FieldMiniature.jsx';
import { FIELD_TYPE_LABELS } from '../../constants/fieldConfig.js';
import styles from './BoardPostcard.module.css';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function BoardPostcard({ board, onClick }) {
  const hasNotes = board.notes && board.notes.trim().length > 0;

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
      aria-label={`Board: ${board.name}`}
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
          {hasNotes ? board.notes : 'Keine Notizen'}
        </p>

        <div className={styles.meta}>
          <span className={styles.badge}>
            {FIELD_TYPE_LABELS[board.fieldType] ?? board.fieldType}
          </span>
          <span className={styles.date}>📅 {formatDate(board.updatedAt)}</span>
          <span className={styles.colorChips} aria-hidden="true">
            <span className={styles.chip} style={{ background: board.homeColor ?? '#1d4ed8' }} title="Heimfarbe" />
            <span className={styles.chip} style={{ background: board.awayColor ?? '#dc2626' }} title="Auswärtsfarbe" />
          </span>
        </div>
      </div>
    </article>
  );
}
