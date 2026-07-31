/**
 * PlayerInfoPanel – Zeigt Positions-Hinweise für den ausgewählten Spieler
 * Erscheint rechts/unten neben dem Feld
 */
import { useTranslation } from 'react-i18next';
import { POSITION_HINTS } from '../../constants/positionHints.js';
import styles from './PlayerInfoPanel.module.css';

export default function PlayerInfoPanel({ player, onClose, onReset }) {
  const { i18n } = useTranslation();
  const lang     = i18n.language?.startsWith('en') ? 'en' : 'de';
  const hints    = POSITION_HINTS[lang] ?? POSITION_HINTS.de;
  const info     = hints[player?.role] ?? hints['M'];

  if (!player) return null;

  return (
    <aside
      className={styles.panel}
      role="complementary"
      aria-label={`Spieler-Info: ${info.name}`}
    >
      <header className={styles.header}>
        <div className={styles.badge}>{player.role}</div>
        <h3 className={styles.title}>{info.name}</h3>
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Info-Panel schließen"
        >
          ×
        </button>
      </header>

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
          title="Spieler zur Ausgangsposition zurücksetzen"
        >
          🔄 Position zurücksetzen
        </button>
      </div>
    </aside>
  );
}
