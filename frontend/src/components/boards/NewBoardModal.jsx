/**
 * NewBoardModal – Neues Spielfeld anlegen
 * Name + Spielfeld-Typ auswählen
 */
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './NewBoardModal.module.css';

export default function NewBoardModal({ onConfirm, onClose, loading, defaultFieldType = 'large' }) {
  const { t } = useTranslation();

  const FIELD_TYPES = [
    { value: 'large',  label: t('field.large'),  desc: t('dialogs.newBoard.fieldDescLarge') },
    { value: 'small',  label: t('field.small'),  desc: t('dialogs.newBoard.fieldDescSmall') },
    { value: 'street', label: t('field.street'), desc: t('dialogs.newBoard.fieldDescStreet') },
    { value: '3v3',    label: t('field.3v3'),    desc: t('dialogs.newBoard.fieldDesc3v3') },
  ];

  const [name,      setName     ] = useState('');
  const [fieldType, setFieldType] = useState(defaultFieldType);
  const nameRef = useRef(null);
  const containerRef = useRef(null);

  useFocusTrap(containerRef, { initialFocusRef: nameRef, onEscape: onClose });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { nameRef.current?.focus(); return; }
    onConfirm({ name: trimmed, fieldType });
  };

  return (
    <div
      ref={containerRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-board-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h2 id="new-board-title" className={styles.modalTitle}>{t('dialogs.newBoard.title')}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t('dialogs.newBoard.close')}>✕</button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <label className={styles.label} htmlFor="board-name">
            {t('dialogs.newBoard.nameLabel')}
          </label>
          <input
            ref={nameRef}
            id="board-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('dialogs.newBoard.namePlaceholder')}
            maxLength={80}
            required
            aria-required="true"
          />

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>{t('dialogs.newBoard.fieldTypeLegend')}</legend>
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
              {t('dialogs.newBoard.cancel')}
            </button>
            <button
              type="submit"
              className={styles.confirmBtn}
              disabled={loading || !name.trim()}
              aria-disabled={loading}
            >
              {loading ? t('dialogs.newBoard.creating') : t('dialogs.newBoard.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
