/**
 * BoardPickerModal – Board-Auswahl zum Hinzufügen als Übung zu einer
 * Trainingseinheit (Issue #45). Struktur analog NewBoardModal.jsx.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useBoardsApi } from '../../hooks/useBoardsApi.js';
import { FIELD_TYPE_LABELS } from '../../constants/fieldConfig.js';
import styles from './BoardPickerModal.module.css';

// ROADMAP-Backlog "Übungsbibliothek": Trainer sollen beim Zusammenstellen
// einer Trainingseinheit gezielt nach kategorisierten Übungen filtern
// können, statt die komplette (auch taktische) Board-Liste zu durchsuchen.
const CATEGORIES = ['technik', 'taktik', 'kondition', 'spielverstaendnis', 'nachwuchs'];

export default function BoardPickerModal({ onConfirm, onClose, adding }) {
  const { t } = useTranslation();
  const { fetchBoards } = useBoardsApi();
  const [boards,         setBoards        ] = useState(null);
  const [selected,       setSelected      ] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const containerRef = useRef(null);

  useFocusTrap(containerRef, { onEscape: onClose });

  useEffect(() => {
    fetchBoards().then(setBoards).catch(() => setBoards([]));
  }, [fetchBoards]);

  const filteredBoards = useMemo(() => {
    if (!boards) return boards;
    if (categoryFilter === 'all') return boards;
    return boards.filter((b) => b.category === categoryFilter);
  }, [boards, categoryFilter]);

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
          <>
            <div className={styles.filterRow}>
              <select
                className={styles.categorySelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label={t('boardsPage.categoryFilterAriaLabel')}
              >
                <option value="all">{t('boardsPage.categoryFilterAll')}</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{t(`exerciseCategory.${c}`)}</option>
                ))}
              </select>
            </div>

            {filteredBoards.length === 0 ? (
              <p className={styles.hint}>{t('boardsPage.noBoardsMatchFilter')}</p>
            ) : (
              <ul className={styles.list} role="list">
                {filteredBoards.map((board) => (
                  <li key={board._id}>
                    <button
                      className={`${styles.boardBtn} ${selected === board._id ? styles.boardBtnActive : ''}`}
                      onClick={() => setSelected(board._id)}
                      aria-pressed={selected === board._id}
                    >
                      <span className={styles.boardName}>{board.name}</span>
                      <span className={styles.boardMeta}>
                        {board.category && (
                          <span className={styles.categoryBadge}>{t(`exerciseCategory.${board.category}`)}</span>
                        )}
                        <span className={styles.boardType}>{FIELD_TYPE_LABELS[board.fieldType] ?? board.fieldType}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
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
