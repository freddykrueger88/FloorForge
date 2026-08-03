/**
 * FieldTypeChangeDialog – Warnung vor dem Wechsel des Spielfeld-Typs
 * Spielerpositionen und Zeichnungen werden dabei proportional skaliert.
 */
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './FieldTypeChangeDialog.module.css';

export default function FieldTypeChangeDialog({ targetLabel, onConfirm, onCancel, loading }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onCancel });

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="fieldtype-title"
      aria-describedby="fieldtype-msg"
    >
      <div className={styles.dialog}>
        <div className={styles.icon} aria-hidden="true">⚠️</div>
        <h2 id="fieldtype-title" className={styles.title}>{t('dialogs.fieldTypeChange.title')}</h2>
        <p id="fieldtype-msg" className={styles.msg}>
          {t('dialogs.fieldTypeChange.message', { targetLabel })}
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
            {t('dialogs.fieldTypeChange.cancel')}
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm} disabled={loading}>
            {loading ? t('dialogs.fieldTypeChange.adjusting') : t('dialogs.fieldTypeChange.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
