/**
 * DeleteConfirmDialog – 3-stufige Löschbestätigung
 * Stufe 1: „Meinst du das wirklich?“
 * Stufe 2: „Sicher? Diese Aktion ist unwiderruflich.“
 * Stufe 3: „Wirklich endgültig löschen?“
 */
import { useState } from 'react';
import styles from './DeleteConfirmDialog.module.css';

const STEPS = [
  { title: 'Spielfeld löschen?',        msg: (name) => `Möchtest du „${name}“ wirklich löschen?`,             confirm: 'Ja, löschen',       variant: 'warn'   },
  { title: 'Wirklich sicher?',           msg: ()     => 'Diese Aktion ist unwiderruflich. Alle Daten gehen verloren.', confirm: 'Ja, bin ich sicher', variant: 'danger' },
  { title: 'Letzte Warnung!',            msg: (name) => `„${name}“ wird endgültig und unwiderruflich gelöscht.`,  confirm: 'Endgültig löschen', variant: 'danger' },
];

export default function DeleteConfirmDialog({ boardName, onConfirm, onCancel, loading }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const handleConfirm = () => {
    if (step < STEPS.length - 1) { setStep((s) => s + 1); }
    else { onConfirm(); }
  };

  return (
    <div
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

        <div className={styles.steps} aria-label={`Schritt ${step + 1} von ${STEPS.length}`}>
          {STEPS.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i <= step ? styles.dotActive : ''}`} aria-hidden="true" />
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
            Abbrechen
          </button>
          <button
            className={`${styles.confirmBtn} ${styles[`confirm_${current.variant}`]}`}
            onClick={handleConfirm}
            disabled={loading}
            aria-live="polite"
          >
            {loading && step === STEPS.length - 1 ? 'Lösche…' : current.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
