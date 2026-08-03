/**
 * FieldTypeChangeDialog – Warnung vor dem Wechsel des Spielfeld-Typs
 * Spielerpositionen und Zeichnungen werden dabei proportional skaliert.
 */
import { useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './FieldTypeChangeDialog.module.css';

export default function FieldTypeChangeDialog({ targetLabel, onConfirm, onCancel, loading }) {
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
        <h2 id="fieldtype-title" className={styles.title}>Spielfeld-Typ ändern?</h2>
        <p id="fieldtype-msg" className={styles.msg}>
          Das Spielfeld wird auf „{targetLabel}“ umgestellt. Bestehende Spielerpositionen
          und Zeichnungen in allen Frames werden proportional an das neue Feld angepasst.
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
            Abbrechen
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm} disabled={loading}>
            {loading ? 'Wird angepasst…' : 'Ja, Feld wechseln'}
          </button>
        </div>
      </div>
    </div>
  );
}
