/**
 * DeleteAccountDialog – 3-stufige Löschbestätigung für den eigenen Account
 * (Issue #22). Stufe 3 verlangt die exakte E-Mail-Adresse zur Bestätigung.
 */
import { useState, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from '../boards/DeleteConfirmDialog.module.css';

export default function DeleteAccountDialog({ userEmail, onConfirm, onCancel, loading, error }) {
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
        <div className={styles.icon} aria-hidden="true">{step === 0 ? '⚠️' : step === 1 ? '🚨' : '🔴'}</div>

        {step === 0 && (
          <>
            <h2 id="del-acc-title" className={styles.title}>Account löschen?</h2>
            <p className={styles.msg}>
              Möchtest du deinen Account wirklich löschen? Alle deine Spielfelder,
              Taktiken und Einstellungen werden permanent gelöscht.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className={styles.title}>Wirklich sicher?</h2>
            <p className={styles.msg}>
              Diese Aktion kann <strong>NICHT</strong> rückgängig gemacht werden. Exportiere
              deine Taktiken vorher (GIF-Export im jeweiligen Spielfeld), wenn du sie
              behalten möchtest.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.title}>Letzte Bestätigung</h2>
            <p className={styles.msg}>
              Gib deine E-Mail-Adresse <strong>{userEmail}</strong> ein, um die
              unwiderrufliche Löschung zu bestätigen.
            </p>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={userEmail}
              aria-label="E-Mail-Adresse zur Bestätigung"
              style={{
                width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                color: 'var(--color-text)', fontSize: 'var(--text-sm)',
              }}
            />
            {error && <p className={styles.msg} style={{ color: 'var(--color-error)' }}>⚠️ {error}</p>}
          </>
        )}

        <div className={styles.steps} aria-label={`Schritt ${step + 1} von 3`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`${styles.dot} ${i <= step ? styles.dotActive : ''}`} aria-hidden="true" />
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>Abbrechen</button>
          <button
            className={`${styles.confirmBtn} ${styles.confirm_danger}`}
            onClick={handlePrimary}
            disabled={loading || (step === 2 && !matches)}
          >
            {loading ? 'Löscht…' : step === 0 ? 'Weiter' : step === 1 ? 'Trotzdem weiter' : 'Account unwiderruflich löschen'}
          </button>
        </div>
      </div>
    </div>
  );
}
