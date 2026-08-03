/**
 * PlayerInfoPanel – Zeigt Positions-Hinweise für den ausgewählten Spieler
 * Erscheint rechts/unten neben dem Feld
 */
import { useTranslation } from 'react-i18next';
import { POSITION_HINTS } from '../../constants/positionHints.js';
import styles from './PlayerInfoPanel.module.css';

export default function PlayerInfoPanel({ player, onClose, onReset, onNameChange }) {
  const { t, i18n } = useTranslation();

  if (!player) return null;

  const lang  = i18n.language?.startsWith('en') ? 'en' : 'de';
  const hints = POSITION_HINTS[lang] ?? POSITION_HINTS.de;
  const info  = hints[player.role] ?? hints['M'];

  return (
    <aside
      className={styles.panel}
      role="complementary"
      aria-label={t('field.playerInfoLabel', { name: info.name })}
    >
      <header className={styles.header}>
        <div className={styles.badge}>{player.role}</div>
        <h3 className={styles.title}>{info.name}</h3>
        <button
          className={styles.close}
          onClick={onClose}
          aria-label={t('playerInfoPanel.closeLabel')}
        >
          ×
        </button>
      </header>

      {/* Spielername (Issue #29) */}
      <label className={styles.nameLabel} htmlFor="player-name-input">
        {t('field.playerName')}
        <input
          id="player-name-input"
          type="text"
          maxLength={20}
          className={styles.nameInput}
          value={player.name ?? ''}
          placeholder={t('field.namePlaceholder')}
          onChange={(e) => onNameChange?.(player.id, e.target.value)}
        />
      </label>

      <p className={styles.hint}>{info.hint}</p>

      <ul className={styles.tips} role="list">
        {info.tips.map((tip, i) => (
          <li key={i} className={styles.tip}>
            <span className={styles.tipIcon} aria-hidden="true">→</span>
            {tip}
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <button
          className={styles.resetBtn}
          onClick={() => onReset?.(player.id)}
          title={t('field.resetPositionTitle')}
        >
          🔄 {t('field.resetPosition')}
        </button>
      </div>
    </aside>
  );
}
