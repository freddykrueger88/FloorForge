/**
 * NewBoardModal – Neues Spielfeld anlegen
 * Name + Spielfeld-Typ auswählen
 */
import { useState, useRef, useEffect } from 'react';
import styles from './NewBoardModal.module.css';

const FIELD_TYPES = [
  { value: 'large',         label: 'Großfeld',        desc: '20 × 40 m – Offizielles IFF Spielfeld' },
  { value: 'small',         label: 'Kleinfeld',       desc: '14 × 24 m' },
  { value: 'street',        label: 'Street Floorball', desc: 'Variabel, ohne Bande' },
  { value: 'three_v_three', label: '3 vs 3',          desc: 'Kleinfeld für schnelle Spiele' },
];

export default function NewBoardModal({ onConfirm, onClose, loading }) {
  const [name,      setName     ] = useState('');
  const [fieldType, setFieldType] = useState('large');
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  // Escape zum Schließen
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { nameRef.current?.focus(); return; }
    onConfirm({ name: trimmed, fieldType });
  };

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-board-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 id="new-board-title" className={styles.modalTitle}>Neues Spielfeld</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Schließen">✕</button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <label className={styles.label} htmlFor="board-name">
            Name des Spielfelds
          </label>
          <input
            ref={nameRef}
            id="board-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Spiel vs. Hamburg, Training 04.08."
            maxLength={80}
            required
            aria-required="true"
          />

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Spielfeld-Typ</legend>
            <div className={styles.typeGrid}>
              {FIELD_TYPES.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`${styles.typeCard} ${fieldType === value ? styles.typeActive : ''}`}
                >
                  <input
                    type="radio"
                    name="fieldType"
                    value={value}
                    checked={fieldType === value}
                    onChange={() => setFieldType(value)}
                    className={styles.radioHidden}
                  />
                  <span className={styles.typeLabel}>{label}</span>
                  <span className={styles.typeDesc}>{desc}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Abbrechen
            </button>
            <button
              type="submit"
              className={styles.confirmBtn}
              disabled={loading || !name.trim()}
              aria-disabled={loading}
            >
              {loading ? 'Erstellt…' : 'Spielfeld anlegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
