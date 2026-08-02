/**
 * NotesPanel – Editierbare Coach-Notizen (Issue #30)
 *
 * WICHTIG: Dieser Editor erscheint bewusst NUR innerhalb der Board/Taktik-
 * Ansicht – nicht in der Postkarten-Galerie. Dort sind Notizen nur lesbar
 * (siehe BoardPostcard.jsx), damit der Coach in der Übersicht nicht durch
 * versehentliches Editieren abgelenkt wird.
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './NotesPanel.module.css';

const MAX_LENGTH = 500;

export default function NotesPanel({ value = '', onChange }) {
  const [draft, setDraft] = useState(value);

  // Von außen aktualisierte Notizen übernehmen (z.B. nach dem Laden des Boards)
  useEffect(() => setDraft(value), [value]);

  const handleChange = useCallback((e) => {
    const next = e.target.value.slice(0, MAX_LENGTH);
    setDraft(next);
    onChange?.(next); // Wird über useAutoSave im übergeordneten State gesichert
  }, [onChange]);

  return (
    <section className={styles.panel} aria-label="Notizen zu diesem Spielfeld">
      <h3 className={styles.heading}>📝 Notizen</h3>
      <textarea
        className={styles.textarea}
        value={draft}
        onChange={handleChange}
        maxLength={MAX_LENGTH}
        placeholder="Notizen zu diesem Spielfeld…"
        rows={5}
        aria-label="Notizen zu diesem Spielfeld"
      />
      <span className={styles.counter} aria-live="polite">
        {draft.length} / {MAX_LENGTH}
      </span>
    </section>
  );
}
