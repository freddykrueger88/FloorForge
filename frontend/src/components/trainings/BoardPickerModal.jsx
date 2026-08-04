/**
 * BoardPickerModal – Board-Auswahl zum Hinzufügen als Übung zu einer
 * Trainingseinheit (Issue #45). Struktur analog NewBoardModal.jsx.
 */
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useBoardsApi } from '../../hooks/useBoardsApi.js';
import { FIELD_TYPE_LABELS } from '../../constants/fieldConfig.js';
import styles from './BoardPickerModal.module.css';

export default function BoardPickerModal({ onConfirm, onClose, adding }) {
  const { t } = useTranslation();
  const { fetchBoards } = useBoardsApi();
  const [boards,   setBoards  ] = useState(null);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  useFocusTrap(containerRef, { onEscape: onClose });

  useEffect(() => {
    fetchBoards().then(setBoards).catch(() => setBoards([]));
  }, [fetchBoards]);

  const handleConfirm = () => {
    if (selected) onConfirm(selected);
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="board-picker-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 id="board-picker-title" className={styles.modalTitle}>{t('trainings.pickerTitle')}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t('trainings.pickerClose')}>✕</button>
        </header>

        {boards === null ? (
          <p className={styles.hint}>{t('trainings.pickerLoading')}</p>
        ) : boards.length === 0 ? (
          <p className={styles.hint}>{t('trainings.pickerEmpty')}</p>
        ) : (
          <ul className={styles.list} role="list">
            {boards.map((board) => (
              <li key={board._id}>
                <button
                  className={`${styles.boardBtn} ${selected === board._id ? styles.boardBtnActive : ''}`}
                  onClick={() => setSelected(board._id)}
                  aria-pressed={selected === board._id}
                >
                  <span className={styles.boardName}>{board.name}</span>
                  <span className={styles.boardType}>{FIELD_TYPE_LABELS[board.fieldType] ?? board.fieldType}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            {t('trainings.pickerCancel')}
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={adding || !selected}
            aria-disabled={adding || !selected}
          >
            {adding ? t('trainings.pickerAdding') : t('trainings.pickerConfirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
