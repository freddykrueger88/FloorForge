/**
 * LibraryEntryCard – ein Eintrag der Community-Übungsbibliothek
 * (EPIC 010 MVP). Struktur analog BoardPostcard.jsx, aber readonly
 * (kein Umbenennen/Playbook-Zuordnen – das ist Board-spezifisch).
 */
import { useTranslation } from 'react-i18next';
import { Copy, Flag, Trash2 } from 'lucide-react';
import FieldMiniature from '../field/FieldMiniature.jsx';
import { FIELD_TYPE_LABELS } from '../../constants/fieldConfig.js';
import Button from '../common/Button.jsx';
import styles from './LibraryEntryCard.module.css';

export default function LibraryEntryCard({ entry, canManage, onClone, onReport, onRemove, cloning }) {
  const { t } = useTranslation();

  return (
    <article className={styles.card} role="article" aria-label={entry.name}>
      <div className={styles.thumbWrap}>
        <FieldMiniature
          fieldType={entry.fieldType}
          theme={entry.theme}
          width={140}
          height={200}
          players={entry.players}
          homeColor={entry.homeColor ?? '#1d4ed8'}
          awayColor={entry.awayColor ?? '#dc2626'}
          ballColor={entry.ballColor ?? '#f97316'}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{entry.name}</h3>

        <p className={styles.author}>
          {t('library.byAuthor', { name: entry.ownerDisplayName ?? t('library.authorFallback') })}
        </p>

        <div className={styles.meta}>
          <span className={styles.badge}>
            {FIELD_TYPE_LABELS[entry.fieldType] ?? entry.fieldType}
          </span>
          {entry.category && (
            <span className={styles.badge}>{t(`exerciseCategory.${entry.category}`)}</span>
          )}
          {entry.ageGroup && (
            <span className={styles.badge}>{entry.ageGroup}</span>
          )}
        </div>

        {entry.goal && <p className={styles.goal}>{entry.goal}</p>}

        <div className={styles.actions}>
          <Button variant="primary" size="sm" onClick={onClone} disabled={cloning}>
            <Copy size={16} aria-hidden="true" /> {t('library.clone')}
          </Button>
          <Button variant="secondary" size="sm" onClick={onReport} aria-label={t('library.report')} title={t('library.report')}>
            <Flag size={16} aria-hidden="true" />
          </Button>
          {canManage && (
            <Button variant="danger" size="sm" onClick={onRemove} aria-label={t('library.remove')} title={t('library.remove')}>
              <Trash2 size={16} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
