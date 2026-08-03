/**
 * DeleteConfirmDialog – 3-stufige Löschbestätigung
 * Stufe 1: „Meinst du das wirklich?“
 * Stufe 2: „Sicher? Diese Aktion ist unwiderruflich.“
 * Stufe 3: „Wirklich endgültig löschen?“
 */
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './DeleteConfirmDialog.module.css';

export default function DeleteConfirmDialog({ boardName, onConfirm, onCancel, loading }) {
  const { t } = useTranslation();
  const STEPS = [
    { title: t('dialogs.deleteBoard.step1Title'), msg: (name) => t('dialogs.deleteBoard.step1Message', { name }), confirm: t('dialogs.deleteBoard.step1Confirm'), variant: 'warn' },
    { title: t('dialogs.deleteBoard.step2Title'), msg: ()     => t('dialogs.deleteBoard.step2Message'),           confirm: t('dialogs.deleteBoard.step2Confirm'), variant: 'danger' },
    { title: t('dialogs.deleteBoard.step3Title'), msg: (name) => t('dialogs.deleteBoard.step3Message', { name }), confirm: t('dialogs.deleteBoard.step3Confirm'), variant: 'danger' },
  ];
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onCancel });

  const handleConfirm = () => {
    if (step < STEPS.length - 1) { setStep((s) => s + 1); }
    else { onConfirm(); }
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      aria-describedby="delete-msg"
    >
      <div className={`${styles.dialog} ${styles[current.variant]}`}>
        <div className={styles.icon} aria-hidden="true">
          {step === 0 ? '⚠️' : step === 1 ? '🚨' : '🔴'}
        </div>
        <h2 id="delete-title" className={styles.title}>{current.title}</h2>
        <p id="delete-msg"   className={styles.msg}>{current.msg(boardName)}</p>

        <div className={styles.steps} aria-label={t('dialogs.deleteBoard.stepIndicator', { step: step + 1, total: STEPS.length })}>
          {STEPS.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i <= step ? styles.dotActive : ''}`} aria-hidden="true" />
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
            {t('dialogs.deleteBoard.cancel')}
          </button>
          <button
            className={`${styles.confirmBtn} ${styles[`confirm_${current.variant}`]}`}
            onClick={handleConfirm}
            disabled={loading}
            aria-live="polite"
          >
            {loading && step === STEPS.length - 1 ? t('dialogs.deleteBoard.deleting') : current.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
