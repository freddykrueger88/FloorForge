/**
 * DeleteAccountDialog – 3-stufige Löschbestätigung für den eigenen Account
 * (Issue #22). Stufe 3 verlangt die exakte E-Mail-Adresse zur Bestätigung.
 */
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from '../boards/DeleteConfirmDialog.module.css';

export default function DeleteAccountDialog({ userEmail, onConfirm, onCancel, loading, error }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const containerRef = useRef(null);
  useFocusTrap(containerRef, { onEscape: onCancel });

  const matches = emailInput.trim().toLowerCase() === userEmail.toLowerCase();

  const handlePrimary = () => {
    if (step < 2) { setStep((s) => s + 1); return; }
    if (matches) onConfirm(emailInput.trim());
  };

  return (
    <div ref={containerRef} className={styles.backdrop} role="alertdialog" aria-modal="true" aria-labelledby="del-acc-title">
      <div className={`${styles.dialog} ${styles.danger}`}>
        <div className={styles.icon} aria-hidden="true"><AlertTriangle size={32} aria-hidden="true" /></div>

        {step === 0 && (
          <>
            <h2 id="del-acc-title" className={styles.title}>{t('dialogs.deleteAccount.step1Title')}</h2>
            <p className={styles.msg}>
              {t('dialogs.deleteAccount.step1Message')}
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className={styles.title}>{t('dialogs.deleteAccount.step2Title')}</h2>
            <p className={styles.msg}>
              {t('dialogs.deleteAccount.step2MessagePrefix')} <strong>{t('dialogs.deleteAccount.step2MessageBold')}</strong> {t('dialogs.deleteAccount.step2MessageSuffix')}
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.title}>{t('dialogs.deleteAccount.step3Title')}</h2>
            <p className={styles.msg}>
              {t('dialogs.deleteAccount.step3MessagePrefix')} <strong>{userEmail}</strong> {t('dialogs.deleteAccount.step3MessageSuffix')}
            </p>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={userEmail}
              aria-label={t('dialogs.deleteAccount.emailConfirmAriaLabel')}
              style={{
                width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                color: 'var(--color-text)', fontSize: 'var(--text-sm)',
              }}
            />
            {error && <p className={styles.msg} style={{ color: 'var(--color-error)' }}><AlertTriangle size={16} aria-hidden="true" /> {error}</p>}
          </>
        )}

        <div className={styles.steps} aria-label={t('dialogs.deleteAccount.stepIndicator', { step: step + 1, total: 3 })}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`${styles.dot} ${i <= step ? styles.dotActive : ''}`} aria-hidden="true" />
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>{t('dialogs.deleteAccount.cancel')}</button>
          <button
            className={`${styles.confirmBtn} ${styles.confirm_danger}`}
            onClick={handlePrimary}
            disabled={loading || (step === 2 && !matches)}
          >
            {loading ? t('dialogs.deleteAccount.deleting') : step === 0 ? t('dialogs.deleteAccount.next') : step === 1 ? t('dialogs.deleteAccount.proceedAnyway') : t('dialogs.deleteAccount.confirmFinal')}
          </button>
        </div>
      </div>
    </div>
  );
}
