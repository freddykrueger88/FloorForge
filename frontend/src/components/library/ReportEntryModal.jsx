/**
 * ReportEntryModal – Bibliothekseintrag melden (EPIC 010 MVP)
 * Minimalistisch: optionaler Freitextgrund + Submit. Struktur analog
 * DeleteConfirmDialog.jsx.
 */
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import Button from '../common/Button.jsx';
import styles from './ReportEntryModal.module.css';

export default function ReportEntryModal({ entryName, onConfirm, onClose, loading, error }) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [done, setDone] = useState(false);
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onClose });

  const handleSubmit = async () => {
    await onConfirm(reason.trim());
    setDone(true);
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="report-title"
    >
      <div className={styles.dialog}>
        <div className={styles.icon}><Flag size={32} aria-hidden="true" /></div>
        <h2 id="report-title" className={styles.title}>{t('library.report')}</h2>
        <p className={styles.msg}>{entryName}</p>

        {!done && (
          <label className={styles.reasonLabel}>
            {t('library.reportReasonLabel')}
            <textarea
              className={styles.textarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              rows={3}
            />
          </label>
        )}

        {error && (
          <p className={styles.errorMsg} role="alert"><AlertTriangle size={16} aria-hidden="true" /> {error}</p>
        )}

        {done ? (
          <>
            <p className={styles.successMsg} role="status">{t('library.reportSuccess')}</p>
            <Button variant="secondary" size="md" onClick={onClose}>{t('boardShare.close')}</Button>
          </>
        ) : (
          <div className={styles.actions}>
            <Button variant="secondary" size="md" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
              {t('dialogs.deleteBoard.cancel')}
            </Button>
            <Button variant="danger" size="md" className={styles.confirmBtn} onClick={handleSubmit} disabled={loading}>
              {t('library.reportSubmit')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
