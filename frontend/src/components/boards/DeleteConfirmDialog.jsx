/**
 * DeleteConfirmDialog – Einstufige Löschbestätigung für ein Spielfeld
 */
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import Button from '../common/Button.jsx';
import styles from './DeleteConfirmDialog.module.css';

export default function DeleteConfirmDialog({ boardName, onConfirm, onCancel, loading }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onCancel });

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      aria-describedby="delete-msg"
    >
      <div className={`${styles.dialog} ${styles.danger}`}>
        <div className={styles.icon}><AlertTriangle size={32} aria-hidden="true" /></div>
        <h2 id="delete-title" className={styles.title}>{t('dialogs.deleteBoard.title')}</h2>
        <p id="delete-msg" className={styles.msg}>{t('dialogs.deleteBoard.message', { name: boardName })}</p>

        <div className={styles.actions}>
          <Button variant="secondary" size="md" className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
            {t('dialogs.deleteBoard.cancel')}
          </Button>
          <Button
            variant="danger"
            size="md"
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={loading}
            aria-live="polite"
          >
            {loading ? t('dialogs.deleteBoard.deleting') : t('dialogs.deleteBoard.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
